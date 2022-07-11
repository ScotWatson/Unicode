/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const initPageTime = performance.now();

const loadUnicodeModule = import("https://scotwatson.github.io/Unicode/Unicode.mjs");

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
  const startPageTime = performance.now();
  console.log("Page load in", startPageTime - initPageTime, "ms");
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.addEventListener("change", function (evt) {
    console.log("start");
    const file = fileInput.files[0];
    const buffering = file.arrayBuffer();
    buffering.catch(fail);
    const parsing = buffering.then(parse);
    parsing.catch(fail);
    const categorizing = parsing.then(getGeneralCategory);
    categorizing.catch(fail);
    const stringifying = categorizing.then(JSON.stringify);
    stringifying.catch(fail);
    const saving = stringifying.then(save, fail);
  });
  document.body.appendChild(fileInput);
  const divUnicodeChar = document.createElement("div");
  document.body.appendChild(divUnicodeChar);
  const divUnicodeCategory = document.createElement("div");
  document.body.appendChild(divUnicodeCategory);
  const inpUnicodeValue = document.createElement("input");
  inpUnicodeValue.type = "text";
  let thisChar;
  inpUnicodeValue.addEventListener("change", function (evt) {
    const value = parseInt(inpUnicodeValue.value, 16);
    thisChar = new UnicodeCodePoint(value);
    divUnicodeChar.innerHTML = "";
    divUnicodeChar.appendChild(document.createTextNode(thisChar.toString()));
    divUnicodeCategory.innerHTML = "";
    divUnicodeCategory.appendChild(document.createTextNode(thisChar.category));
  });
  document.body.appendChild(inpUnicodeValue);
}

function fail(error) {
  document.body.appendChild(document.createTextNode(error.message));
}

function parse(buffer) {
  console.log("parse");
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
          row.push(utf8decoder.decode(new Uint8Array(buffer, columnStart, pos - columnStart)));
          columnStart = pos + 1;
          rows.push(row);
          row = [];
          break;
        case 0x23:  // "#"
          row.push(utf8decoder.decode(new Uint8Array(buffer, columnStart, pos - columnStart)));
          columnStart = pos + 1;
          comment = true;
          break;
        case 0x3B:  // ";"
          // end of column
          row.push(utf8decoder.decode(new Uint8Array(buffer, columnStart, pos - columnStart)));
          columnStart = pos + 1;
          break;
        default:
          break;
      }
    }
    ++pos;
    if (pos % 1000 === 0) {
      console.log(((pos / bufferView.byteLength) * 100) + "%");
    }
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
  let header = "/*\n"
    + "(c) 2022 Scot Watson  All Rights Reserved\n"
    + "THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n"
    + "*/\n"
    + "\n"
    + "export const generalCategory_1_1_5 = ";
  const blob = new Blob( [ header, str ] );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "category-1.1.5.mjs";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
