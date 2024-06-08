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

export function getCategory(codePoint) {
  try {
    return Category_1_1_5.generalCategory_1_1_5[codePoint];
  } catch (e) {
    ErrorLog.rethrow({
      functionName: "get CodePoint.category",
      error: e,
    });
  }
}
export function isSurrogate(codePoint) {
  return ((codePoint > 0xD7FF) && (codePoint < 0xE000));
}
export function isScalar(codePoint) {
  return (((codePoint > 0x0000) && (codePoint < 0x110000)) && !(isSurrogate(codePoint)));
}
export function fromSurrogatePair(args) {
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
