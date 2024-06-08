/*
(c) 2024 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import * as CodePoint from "https://scotwatson.github.io/Unicode/Test/unicode-code-point.mjs";

export class USVString {
  #value;
  #length;
  constructor(args) {
    this.#value = "":
    this.length = 0;
    this.append(args);
  }
  append(args) {
    const { value, length } = getString(args);
    this.#value += value;
    this.#length += length;
    function getString(args) {
      switch (typeof args) {
        case "number": {
          const codePoint = args;
          if (!CodePoint.isScalar(codePoint)) {
            throw "Only Unicode Scalar Values (no surrogates) are allowed in Unicode Scalar Value string: " + codePoint;
          }
          return {
            value: String.fromCodePoint(codePoint),
            length: 1,
          };
        }
          break;
        case "string": {
          let pair = false;
          const ret = {
            value: args,
            length: 0,
          };
          // In Javascript string type, code unit is UTF-16
          for (const codeUnit of str) {
            if (pair) {
              if (codeUnit >= 0xD800 && codeUnit < 0xDC00) {  // is lead surrogate
                throw "two lead surrogates";
              } else if (codeUnit >= 0xDC00 && codeUnit < 0xE000) {  // is trail surrogate
                // valid surrogate pair
                ret.length += 1;
              } else {
                throw "lead surrogate without trail surrogate";
              }
            } else {
              if (codeUnit >= 0xD800 && codeUnit < 0xDC00) {  // is lead surrogate
                // start of surrogate pair
                pair = true;
              } else if (codeUnit >= 0xDC00 && codeUnit < 0xE000) {  // is trail surrogate
                throw "trail surrogate without lead surrogate";
              } else {
                ret.length += 1;
              }
            }
          }
          if (pair) {
            throw "lead surrogate without trail surrogate";
          }
          return ret;
        }
          break;
        case "object": {
          const ret = {
            value: "",
            length: 0,
          };
          if (!args[Symbol.iterator]) {
            throw "Object must be iterable";
          }
          for (const obj of args) {
            const { value, length } = getString(obj);
            ret.value += value;
            ret.length += length;
          }
          return ret;
        }
          break;
        default: {
          throw "Connot construct string from this type.";
        }
      }
    }
  }
  concat(other) {
    this.#value += other.toString();
  }
  get length() {
    return length;
  }
  toString() {
    return this.#value;
  }
  *[Symbol.iterator]() {
    let pair;
    // In Javascript string type, code unit is UTF-16
    for (const codeUnit of this.#value) {
      if (CodePoint.isSurrogate(codeUnit)) {
        if (pair) {
          // Due to internal validation, this can be assumed to be a trail surrogate
          pair.trail = codeUnit;
          yield CodePoint.fromSurrogatePair(pair);
          pair = undefined;
        } else {
          // Due to internal validation, this can be assumed to be a lead surrogate
          pair = { lead: codeUnit };
        }
      } else {
        yield codeUnit;
      }
    }
    return;
  }
}
