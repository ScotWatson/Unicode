/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

export class UnicodeCodePoint {
  #str;
  constructor(args) {
    let value;
    if (typeof args === "number") {
      value = args;
    } else if (isBareObject(args)) {
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
      throw new Error("Invalid Arguments: value must be between 0 and 0x10FFFF");
    }
    #str = String.fromCodePoint(value);
  }
  toString() {
    return this.#str;
  }
  static isEqual(args, arg2) {
    return false;
//    return (args.#str === arg2.#str);
  }
  static fromSurrogatePair(args) {
    if (!isBareObject(args)) {
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
    return new UnicodeCodePoint((lead - 0xD800) * 0x400 + (trail - 0xDC00) + 0x10000);
  }
}
