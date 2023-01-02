/*
(c) 2023 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import * as Streams from "https://scotwatson.github.io/Streams/Test/Streams.mjs";

export const utf8Decode = new Streams.Transform();
utf8Decode.init = function () {
  try {
    const state = {};
    state.value = 0;
    state.contBytes = 0;
    state.inputView = null;
    state.inputIndex = 0;
    return state;
  } catch (e) {
    ErrorLog.rethrow({
      functionName: "utf8Decode.init",
      error: e,
    });
  }
}
utf8Decode.execute = function (args) {
  const { inputView, state } = (function () {
    let ret = {};
    if ("input" in args) {
      ret.inputView = args.input;
    } else {
      ret.inputView = null;
    }
    if (!("state" in args)) {
      throw "Argument \"state\" must be provided.";
    }
    ret.state = args.state;
    return ret;
  })();
  try {
    if (inputView !== null) {
      // inputView is a Memory.View
      if (state.inputView === null) {
        state.inputView = inputView;
        state.inputIndex = 0;
      } else {
        const oldDataView = state.inputView.createSlice({
          byteOffset: state.inputIndex,
        });
        const newInputBlock = new Memory.Block({
          byteLength: oldDataView.byteLength + inputView.byteLength,
        });
        state.inputView = new Memory.View(newInputBlock);
        const oldDataDest = state.inputView.createSlice({
          byteOffset: 0,
          byteLength: oldDataView.byteLength,
        });
        const newDataDest = state.inputView.createSlice({
          byteOffset: oldDataView.byteLength,
        });
        oldDataDest.set(oldDataView);
        newDataDest.set(inputView);
        state.inputIndex = 0;
      }
    }
    if (state.inputView === null) {
      return null;
    }
    const inputArray = new Memory.DataArray({
      memoryView: state.inputView,
      ElementClass: Memory.Uint8,
    });
    while (state.inputIndex < inputArray.length) {
      const byteValue = inputArray.at(state.inputIndex).valueOf();
      ++state.inputIndex;
      if (state.contBytes === 0) {
        if (byteValue < 0x80) {
          state.value = 0;
          return new Unicode.CodePoint(byteValue);
        } else if ((byteValue & 0xE0) === 0xC0) {
          state.value = (byteValue & 0x1F);
          state.contBytes = 1;
        } else if ((byteValue & 0xF0) === 0xE0) {
          state.value = (byteValue & 0x0F);
          state.contBytes = 2;
        } else if ((byteValue & 0xF8) === 0xF0) {
          state.value = (byteValue & 0x07);
          state.contBytes = 3;
        } else {
          // Invalid byte, return Replacement Character
          return new Unicode.CodePoint(0xFFFD);
        }
      } else {
        if ((byteValue & 0xC0) !== 0x80) {
          // Invalid byte, return Replacement Character
          state.contBytes = 0;
          return new Unicode.CodePoint(0xFFFD);
        }
        state.value <<= 6;
        state.value |= (byteValue & 0x3F);
        --state.contBytes;
        if (state.contBytes === 0) {
          if (state.value > 0x10FFFF) {
            return new Unicode.CodePoint(0xFFFD);
          } else {
            return new Unicode.CodePoint(state.value);
          }
        }
      }
    }
    state.inputIndex = 0;
    state.inputView = null;
    return null;
  } catch (e) {
    ErrorLog.rethrow({
      functionName: "utf8Decode.execute",
      error: e,
    });
  }
}
utf8Decode.flush = function (args) {
  try {
    const { state } = (function () {
      let ret = {};
      if (!("state" in args)) {
        throw "Argument \"state\" must be provided.";
      }
      ret.state = args.state;
      return ret;
    })();
    if (state.contBytes !== 0) {
      state.contBytes = 0;
      return new Unicode.CodePoint(0xFFFD);
    } else {
      return null;
    }
  } catch (e) {
    ErrorLog.rethrow({
      functionName: "utf8Decode.flush",
      error: e,
    });
  }
};
export const utf8Encode = new Streams.TransformToByte();
utf8Encode.init = function () {
  try {
    const state = {};
    state.holdBytes = [];
    return state;
  } catch (e) {
    ErrorLog.rethrow({
      functionName: "utf8Encode.init",
      error: e,
    });
  }
};
utf8Encode.execute = function (args) {
  try {
    const { inputItem, outputView, state } = (function () {
      let ret = {};
      if ("input" in args) {
        ret.inputItem = args.input;
      } else {
        ret.inputItem = null;
      }
      if (!("output" in args)) {
        throw "Argument \"output\" must be provided.";
      }
      ret.outputView = args.output;
      if (!("state" in args)) {
        throw "Argument \"state\" must be provided.";
      }
      ret.state = args.state;
      return ret;
    })();
    const outputArray = new Memory.DataArray({
      memoryView: outputView,
      ElementClass: Memory.Uint8,
    });
    let bytesWritten = 0;
    function writeByte(value) {
      if (bytesWritten < outputArray.length) {
        outputArray.at(bytesWritten).set(value);
        ++bytesWritten;
      } else {
        state.holdBytes.push(value);
      }
    }
    while ((state.holdBytes.length !== 0) && (bytesWritten <= outputArray.length)) {
      outputArray.at(bytesWritten).set(state.holdBytes.shift());
      ++bytesWritten;
    }
    if (inputItem !== null) {
      // inputItem is a Unicode.CodePoint
      const codePoint = inputItem.valueOf();
      if ((codePoint & 0xFFFF80) === 0) {
        // Use 1 byte to encode 7 bits
        writeByte(codePoint);
      } else if ((codePoint & 0xFFF800) === 0) {
        // Use 2 bytes to encode 11 bits
        writeByte((codePoint >> 6) | 0xC0);
        writeByte((codePoint & 0x3F) | 0x80);
      } else if ((codePoint & 0xFF0000) === 0) {
        // Use 3 bytes to encode 16 bits
        writeByte((codePoint >> 12) | 0xE0);
        writeByte(((codePoint >> 6) & 0x3F) | 0x80);
        writeByte((codePoint & 0x3F) | 0x80);
      } else {
        // Use 4 bytes to encode 21 bits
        writeByte((codePoint >> 18) | 0xF0);
        writeByte(((codePoint >> 12) & 0x3F) | 0x80);
        writeByte(((codePoint >> 6) & 0x3F) | 0x80);
        writeByte((codePoint & 0x3F) | 0x80);
      }
    }
    return bytesWritten;
  } catch (e) {
    ErrorLog.rethrow({
      functionName: "utf8Encode.execute",
      error: e,
    });
  }
}
utf8Encode.flush = function (args) {
  try {
    const { outputView, state } = (function () {
      let ret = {};
      if (!("output" in args)) {
        throw "Argument \"output\" must be provided.";
      }
      ret.outputView = args.output;
      if (!("state" in args)) {
        throw "Argument \"state\" must be provided.";
      }
      ret.state = args.state;
      return ret;
    })();
    const outputArray = new Memory.DataArray({
      memoryView: outputView,
      ElementClass: Memory.Uint8,
    });
    let bytesWritten = 0;
    function writeByte(value) {
      if (bytesWritten < outputArray.length) {
        outputArray.at(bytesWritten).set(value);
        ++bytesWritten;
      } else {
        state.holdBytes.push(value);
      }
    }
    while ((state.holdBytes.length !== 0) && (bytesWritten <= outputArray.length)) {
      outputArray.at(bytesWritten).set(state.holdBytes.shift());
      ++bytesWritten;
    }
    return bytesWritten;
  } catch (e) {
    ErrorLog.rethrow({
      functionName: "utf8Encode.flush",
      error: e,
    });
  }
};
