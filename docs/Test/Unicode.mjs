/*
(c) 2024 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import * as Types from "https://scotwatson.github.io/Debug/Test/Types.mjs";
import * as ErrorLog from "https://scotwatson.github.io/Debug/Test/ErrorLog.mjs";
import * as Category_1_1_5 from "https://scotwatson.github.io/Unicode/Test/category-1.1.5.mjs";

// A Unicode code point is a value in the Unicode codespace (integers from 0 to 0x10FFFF)
// Not all code points are assigned to encoded characters.
// Code Point Types: Graphic, Format, Control, Private-Use, Surrogate, Noncharacter, Reserved

export class USVString {
  #value;
  #length;
  constructor(args) {
    this.#value = "":
    this.length = 0;
    append(args);
  }
  append(args) {
    const { value, length } = getString(args);
    this.#value += value;
    this.#length += length;
    function getString(args) {
      switch (typeof args) {
        case "number": {
          const codePoint = args;
          if (value < 0 || value > 0x10FFFF) {
            throw "Invalid Arguments: value must be between 0 and 0x10FFFF, inclusive";
          }
          if (CodePoint.isSurrogate(codePoint)) {
            throw "Surrogate code point is not allowed in Unicode Scalar Value string: " + codePoint;
          }
          return {
            value: String.fromCodePoint(codePoint),
            length: 1,
          };
        }
          break;
        case "string": {
          let pair = false;
          let length = 0;
          // In Javascript string type, code unit is UTF-16
          for (const codeUnit of str) {
            if (pair) {
              if (codeUnit >= 0xD800 && codeUnit < 0xDC00) {  // is lead surrogate
                throw "two lead surrogates";
              } else if (codeUnit >= 0xDC00 && codeUnit < 0xE000) {  // is trail surrogate
                // valid surrogate pair
                length += 1;
              } else {
                throw "lead surrogate without trail surrogate";
              }
            } else {
              if (codeUnit >= 0xD800 && codeUnit < 0xDC00) {  // is lead surrogate
                // start of surrogate pair
                pair = true;
              } else if (codeUnit >= 0xDC00 && codeUnit < 0xE000) {  // is trail surrogate
                return "trail surrogate without lead surrogate";
              } else {
                length += 1;
              }
            }
          }
          if (pair) {
            throw "lead surrogate without trail surrogate";
          }
          return {
            value: args,
            length,
          };
        }
          break;
        case "object": {
          let totalValue = "";
          let totalLength = 0;
          if (!args[Symbol.iterator]) {
            throw "Object must be iterable";
          }
          for (const obj of args) {
            ({ value, length } = getString(obj));
          }
          return {
            value: totalValue,
            length: totalLength,
          };
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
      if (pair) {
        // Due to internal validation, this can be assumed to be a trail surrogate
        pair.trail = codeUnit;
        yield CodePoint.fromSurrogatePair(pair);
        pair = undefined;
      } else {
        if (CodePoint.isSurrogate(codeUnit)) {
          // Due to internal validation, this can be assumed to be a lead surrogate
          pair = { lead: codeUnit };
        } else {
          yield codeUnit;
        }
      }
    }
    return;
  }
}

export class CodePoint {
  #value;
  constructor(args) {
    try {
      this.#value = (function () {
        if (Types.isInteger(args)) {
          if (value < 0 || value > 0x10FFFF) {
            throw "Invalid Arguments: value must be between 0 and 0x10FFFF, inclusive";
          }
          return args;
        } else if (Types.isSimpleObject(args)) {
          if (!(Object.hasOwn(args, "value"))) {
            throw "Invalid Arguments";
          }
          if (Types.isInteger(args.value)) {
            throw "Invalid Arguments: value must be a number";
          }
          if (args.value < 0 || args.value > 0x10FFFF) {
            throw "Invalid Arguments: value must be between 0 and 0x10FFFF, inclusive";
          }
          return args.value;
        } else {
          throw "Invalid Arguments";
        }
      })();
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "CodePoint constructor",
        error: e,
      });
    }
  }
  valueOf() {
    try {
      return this.#value;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "CodePoint.valueOf",
        error: e,
      });
    }
  }
  toString() {
    try {
      return String.fromCodePoint(this.#value);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "CodePoint.toString",
        error: e,
      });
    }
  }
  static getCategory(codePoint) {
    try {
      return Category_1_1_5.generalCategory_1_1_5[codePoint];
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get CodePoint.category",
        error: e,
      });
    }
  }
  static isSurrogate(codePoint) {
    return ((codePoint > 0xD7FF) && (codePoint < 0xE000));
  }
  static isScalar() {
    return !(isSurrogate(codePoint));
  }
  static fromSurrogatePair(args) {
    try {
      if (!(Types.isSimpleObject(args))) {
        throw "Invalid Arguments";
      }
      if (!(Object.hasOwn(args, "lead"))) {
        throw "Argument \"lead\" must be provided.";
      }
      if (!(Types.isInteger(args.lead))) {
        throw "Argument \"lead\" must be an integer.";
      }
      if (args.lead >= 0xD800 && args.lead < 0xDC00) {
        throw "Argument \"lead\" must be between 0xD800 and 0xDC00.";
      }
      if (!(Object.hasOwn(args, "trail"))) {
        throw "Argument \"trail\" must be provided.";
      }
      if (!(Types.isInteger(args.trail))) {
        throw "Argument \"trail\" must be an integer.";
      }
      if (args.trail >= 0xDC00 && args.trail < 0xE000) {
        throw "Argument \"trail\" must be between 0xDC00 and 0xE000.";
      }
      return (args.lead - 0xD800) * 0x400 + (args.trail - 0xDC00) + 0x10000;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "static CodePoint.fromSurrogatePair",
        error: e,
      });
    }
  }
}
