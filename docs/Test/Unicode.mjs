/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import * as Types from "https://scotwatson.github.io/Debug/Test/Types.mjs";
import * as ErrorLog from "https://scotwatson.github.io/Debug/Test/ErrorLog.mjs";
import * as Category_1_1_5 from "https://scotwatson.github.io/Unicode/Test/category-1.1.5.mjs";

// Code points are assigned/designated to (abstract) characters, or given a normative function.
// Normalization maintains the sequence of abstract characters, but may change the sequence of code points.
// More than one code point sequence may be assigned/designated to the same (abstract) characters.

export class CodePoint {
  #str;
  constructor(args) {
    try {
      let value;
      if (Types.isInteger(args)) {
        value = args;
      } else if (Types.isSimpleObject(args)) {
        if (!(Object.hasOwn(args, "value"))) {
          throw "Invalid Arguments";
        }
        if (Types.isInteger(args.value)) {
          throw "Invalid Arguments: value must be a number";
        }
        value = args.value;
      } else {
        throw "Invalid Arguments";
      }
      if (!(Types.isInteger(value))) {
        throw "Invalid Arguments: value must be an integer";
      }
      if (value < 0 || value > 0x10FFFF) {
        throw "Invalid Arguments: value must be between 0 and 0x10FFFF, inclusive";
      }
      this.#str = String.fromCodePoint(value);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "CodePoint constructor",
        error: e,
      });
    }
  }
  valueOf() {
    try {
      return this.#str.codePointAt(0);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "CodePoint.valueOf",
        error: e,
      });
    }
  }
  toString() {
    try {
      return this.#str;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "CodePoint.toString",
        error: e,
      });
    }
  }
  get category() {
    try {
      return Category_1_1_5.generalCategory_1_1_5[this.#str.codePointAt(0)];
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get CodePoint.category",
        error: e,
      });
    }
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
        throw "Argument \"lead\" must be between 0xDC00 and 0xE000.";
      }
      return new CodePoint((args.lead - 0xD800) * 0x400 + (args.trail - 0xDC00) + 0x10000);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "static CodePoint.fromSurrogatePair",
        error: e,
      });
    }
  }
}
