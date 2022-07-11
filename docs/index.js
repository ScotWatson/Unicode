/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const loadUnicodeModule = Promise.resolve(); // import("https://scotwatson.github.io/Unicode/Unicode.mjs");

loadUnicodeModule.then(function (module) {
  console.log(Object.getOwnPropertyNames(module));
}, console.error);

const loadWindow = new Promise(function (resolve, reject) {
  window.addEventListener("load", function (evt) {
    resolve(evt);
  });
});

Promise.all( [ loadWindow, loadUnicodeModule ] ).then(start, fail);

function start( [ loadEvt, unicodeModule ] ) {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.addEventListener("change", function (evt) {
    const file = fileInput.files[0];
    const stream = file.arrayBuffer().then(parse).then(getGeneralCategory).then(JSON.stringify).then(save, fail);
  });
  document.body.appendChild(fileInput);
}

function fail(error) {
  document.body.appendChild(document.createTextNode(error.message));
}

function parse(buffer) {
  let pos = 0;
  let byte;
  let columnStart = 0;
  let comment = false;
  let row = [];
  let rows = [];
  const utf8decoder = new TextDecoder("utf-8");
  const bufferView = new DataView(buffer);
  while (pos < bufferView.byteLength) {
    byte = bufferView.getUint8(pos);
    if (comment) {
      switch (byte) {
        case 0x0A:  // LF
        case 0x0D:  // CR
          // end of row
          comment = false;
          rows.push(row);
          row = [];
          break;
        default:
          break;
      }
    } else {
      switch (byte) {
        case 0x0A:  // LF
        case 0x0D:  // CR
          // end of row
          row.push(utf8decoder.decode(new Uint8Array(columnStart, pos)));
          columnStart = pos + 1;
          rows.push(row);
          row = [];
          break;
        case 0x23:  // "#"
          row.push(utf8decoder.decode(new Uint8Array(columnStart, pos)));
          columnStart = pos + 1;
          comment = true;
          break;
        case 0x3B:  // ";"
          // end of column
          row.push(utf8decoder.decode(new Uint8Array(columnStart, pos)));
          columnStart = pos + 1;
          break;
        default:
          break;
      }
    }
    ++pos;
  }
  return rows;
}

function getGeneralCategory(rows) {
  const ret = [];
  for (const row of rows) {
    if (row.length >= 3) {
      const index = parseInt(row[0], 16);
      ret[index] = row[2];
    }
  }
  console.log(ret);
  return ret;
}

function save(str) {
  console.log("saving");
  const blob = new Blob( [ "const generalCategory = ", str ] );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "category.js";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
