/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import * as ErrorHandling from "https://scotwatson.github.io/ErrorHandling/ErrorHandling.mjs";
import * as Category_1_1_5 from "https://scotwatson.github.io/Unicode/category-1.1.5.mjs";

// Code points are assigned/designated to (abstract) characters, or given a normative function.
// Normalization maintains the sequence of abstract characters, but may change the sequence of code points.
// More than one code point sequence may be assigned/designated to the same (abstract) characters.

export class CodePoint {
  #str;
  constructor(args) {
    let value;
    if (typeof args === "number") {
      value = args;
    } else if (ErrorHandling.isBareObject(args)) {
      if (!(args.hasOwnProperty("value"))) {
        throw new Error("Invalid Arguments");
      }
      if (typeof args.value !== "number") {
        throw new Error("Invalid Arguments: value must be a number");
      }
      value = args.value;
    } else {
      throw new Error("Invalid Arguments");
    }
    if (!(Number.isInteger(value))) {
      throw new Error("Invalid Arguments: value must be an integer");
    }
    if (value < 0 || value > 0x10FFFF) {
      throw new Error("Invalid Arguments: value must be between 0 and 0x10FFFF, inclusive");
    }
    this.#str = String.fromCodePoint(value);
  }
  valueOf() {
    this.#str.codePointAt(0);
  }
  toString() {
    return this.#str;
  }
  get category() {
    return Category_1_1_5.generalCategory_1_1_5[this.#str.codePointAt(0)];
  }
  static fromSurrogatePair(args) {
    if (!ErrorHandling.isBareObject(args)) {
      throw new Error("Invalid Arguments");
    }
    if (!(args.hasOwnProperty("lead"))) {
      throw new Error("Invalid Arguments");
    }
    if (typeof args.lead !== "number") {
      throw new Error("Invalid Arguments: lead must be a number");
    }
    if (args.lead >= 0xD800 && args.lead < 0xDC00) {
      throw new Error("Invalid Arguments: lead must be between 0xD800 and 0xDC00");
    }
    if (!(args.hasOwnProperty("trail"))) {
      throw new Error("Invalid Arguments");
    }
    if (typeof args.trail !== "number") {
      throw new Error("Invalid Arguments: trail must be a number");
    }
    if (args.trail >= 0xDC00 && args.trail < 0xE000) {
      throw new Error("Invalid Arguments: trail must be between 0xDC00 and 0xE000");
    }
    return new CodePoint((lead - 0xD800) * 0x400 + (trail - 0xDC00) + 0x10000);
  }
}
