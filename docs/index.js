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

const versions = [
  { folder: "1.1-Update/", parseFunction: show11Update},
  { folder: "2.0-Update/", parseFunction: show20Update},
  { folder: "2.1-Update/", parseFunction: show21Update},
  { folder: "2.1-Update2/", parseFunction: show21Update_2},
  { folder: "2.1-Update3/", parseFunction: show21Update_3},
  { folder: "2.1-Update4/", parseFunction: show21Update_4},
  { folder: "3.0-Update/", parseFunction: show30Update},
  { folder: "3.0-Update1/", parseFunction: show30Update_1},
  { folder: "3.1-Update/", parseFunction: show31Update},
  { folder: "3.1-Update1/", parseFunction: show31Update_1},
  { folder: "3.2-Update/", parseFunction: show32Update},
  { folder: "4.0-Update/", parseFunction: show40Update},
  { folder: "4.0-Update1/", parseFunction: show40Update_1},
  { folder: "4.1.0/", parseFunction: show410},
  { folder: "5.0.0/", parseFunction: show500},
  { folder: "5.1.0/", parseFunction: show510},
  { folder: "5.2.0/", parseFunction: show520},
  { folder: "6.0.0/", parseFunction: show600},
  { folder: "6.1.0/", parseFunction: show610},
  { folder: "6.2.0/", parseFunction: show620},
  { folder: "6.3.0/", parseFunction: show630},
  { folder: "7.0.0/", parseFunction: show700},
  { folder: "8.0.0/", parseFunction: show800},
  { folder: "9.0.0/", parseFunction: show900},
  { folder: "10.0.0/", parseFunction: show1000},
  { folder: "11.0.0/", parseFunction: show1100},
  { folder: "12.0.0/", parseFunction: show1200},
  { folder: "12.1.0/", parseFunction: show1210},
  { folder: "13.0.0/", parseFunction: show1300},
  { folder: "14.0.0/", parseFunction: show1400},
  { folder: "15.0.0/", parseFunction: show1500},
];

function addFileRow(tbl, lbl) {
  const fileRow = document.createElement("tr");
  tbl.appendChild(fileRow);
  const fileLabel = document.createElement("td");
  fileLabel.innerHTML = lbl;
  fileRow.appendChild(fileLabel);
  const fileSelect = document.createElement("td");
  fileRow.appendChild(fileSelect);
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileSelect.appendChild(fileInput);
  return fileInput;
}

function show11Update(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}
function show20Update(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const rowArabicShaping = addFileRow(fileTable, "ArabicShaping");
  const rowBlocks = addFileRow(fileTable, "Blocks");
  const rowIndex = addFileRow(fileTable, "Index");
  const rowJamo = addFileRow(fileTable, "Jamo");
  const rowNamesList = addFileRow(fileTable, "NamesList");
  const rowPropList = addFileRow(fileTable, "PropList");
  const rowProps = addFileRow(fileTable, "Props");
  const rowUnicodeData = addFileRow(fileTable, "UnicodeData");
  const rowUnihan = addFileRow(fileTable, "Unihan");
  const btnCreateModule = document.createElement("button");
  btnCreateModule.innerHTML = "Create Module";
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    let strModule = "";
    const arrReading = [];
    
    const fileArabicShaping = rowArabicShaping.files[0];
    const bufferingArabicShaping = fileArabicShaping.arrayBuffer();
    const parsingArabicShaping = bufferingArabicShaping.then(parseSCSV, fail);
    const readingArabicShaping = parsingArabicShaping.then(readArabicShaping, fail);
    arrReading.push(readingArabicShaping);
    
    const fileBlocks = rowBlocks.files[0];
    const bufferingBlocks = fileBlocks.arrayBuffer();
    const parsingBlocks = bufferingBlocks.then(parseSCSV, fail);
    const readingBlocks = parsingBlocks.then(readBlocks, fail);
    arrReading.push(readingBlocks);
    
    const fileIndex = rowIndex.files[0];
    const bufferingIndex = fileIndex.arrayBuffer();
    const parsingIndex = bufferingIndex.then(parseTSV, fail);
    const readingIndex = parsingIndex.then(readIndex, fail);
    arrReading.push(readingIndex);

    const fileJamo = rowJamo.files[0];
    const bufferingJamo = fileJamo.arrayBuffer();
    const parsingJamo = bufferingJamo.then(parseSCSV, fail);
    const readingJamo = parsingJamo.then(readJamo, fail);
    arrReading.push(readingJamo);
/*
    const fileNamesList = rowNamesList.files[0];
    const bufferingNamesList = fileNamesList.arrayBuffer();
    const parsingNamesList = bufferingNamesList.then(parseSCSV, fail);
    const readingNamesList = parsingNamesList.then(readNamesList, fail);
    arrReading.push(readingNamesList);
*/
    const filePropList = rowPropList.files[0];
    const bufferingPropList = filePropList.arrayBuffer();
    const parsingPropList = bufferingPropList.then(parseLines, fail);
    const readingPropList = parsingPropList.then(readPropList, fail);
    arrReading.push(readingPropList);

    const fileProps = rowProps.files[0];
    const bufferingProps = fileProps.arrayBuffer();
    const parsingProps = bufferingProps.then(parseSCSV, fail);
    const readingProps = parsingProps.then(readProps, fail);
    arrReading.push(readingProps);

    const fileUnicodeData = rowUnicodeData.files[0];
    const bufferingUnicodeData = fileUnicodeData.arrayBuffer();
    const parsingUnicodeData = bufferingUnicodeData.then(parseSCSV, fail);
    const readingUnicodeData = parsingUnicodeData.then(readUnicodeData, fail);
    arrReading.push(readingUnicodeData);
    
    const fileUnihan = rowUnihan.files[0];
    const bufferingUnihan = fileUnihan.arrayBuffer();
    const parsingUnihan = bufferingUnihan.then(parseSCSV, fail);
    const readingUnihan = parsingUnihan.then(readUnihan, fail);
    arrReading.push(readingUnihan);
        
    const saving = Promise.all(arrReading).then(save, fail);
  });
}

function parseLines(buffer) {
  let pos = 0;
  let byte;
  let lineStart = 0;
  let lines = [];
  const utf8decoder = new TextDecoder("utf-8");
  const bufferView = new DataView(buffer);
  while (pos < bufferView.byteLength) {
    byte = bufferView.getUint8(pos);
    switch (byte) {
      case 0x0A:  // LF
      case 0x0D:  // CR
        // end of row
        lines.push(utf8decoder.decode(new Uint8Array(buffer, lineStart, pos - lineStart)));
        lineStart = pos + 1;
        break;
      default:
        break;
    }
    ++pos;
    if (pos % 1000 === 0) {
      console.log(((pos / bufferView.byteLength) * 100) + "%");
    }
  }
  return lines;
}

function readArabicShaping(rows) {
  let baseCodePoint;
  const arrArabicShaping = [];
  for (const row of rows) {
    const objRow = {};
    const codePoint = parseInt(row[0], 16);
    if (row.length >= 4) {
      if (!baseCodePoint) {
        baseCodePoint = codePoint;
      }
      objRow.name = row[1];
      objRow.link = row[2];
      objRow.linkGroup = row[3];
    }
    arrArabicShaping[codePoint - baseCodePoint] = objRow;
  }
  return "const arrArabicShaping = " + JSON.stringify(arrArabicShaping) + ";\n"
    + "const baseCodePointArabicShaping = " + JSON.stringify(baseCodePoint) + ";\n";
}

function readBlocks(rows) {
  const arrBlocks = [];
  for (const row of rows) {
    const objRow = {};
    if (row.length >= 3) {
      objRow.startCode = parseInt(row[0], 16);
      objRow.endCode = parseInt(row[1], 16);
      objRow.blockName = row[2];
    }
    arrBlocks.push(objRow);
  }
  return "const arrBlocks = " + JSON.stringify(arrBlocks) + ";\n";
}

function readIndex(rows) {
  const objModule = {};
  objModule.arrIndex = [];
  for (const row of rows) {
    const objRow = {};
    if (row.length >= 2) {
      objRow.name = row[0];
      objRow.code = parseInt(row[1], 16);
    }
    objModule.arrIndex.push(objRow);
  }
  return "const arrIndex = " + JSON.stringify(objModule) + ";\n";
}

function readJamo(rows) {
  const arrJamo = [];
  for (const row of rows) {
    const objRow = {};
    if (row.length >= 3) {
      objRow.code = parseInt(row[0].substring(2), 16);
      objRow.shortName = row[1];
      objRow.unicodeName = row[2];
    }
    arrJamo.push(objRow);
  }
  return "const arrJamo = " + JSON.stringify(arrJamo) + ";\n";
}

function readNamesList(rows) {
  const arrNamesList = [];
  for (const row of rows) {
    const objRow = {};
    if (row.length >= 3) {
      objRow.startCode = parseInt(row[1], 16);
      objRow.endCode = parseInt(row[2], 16);
      objRow.blockName = row[3];
    }
    arrNamesList.push(objRow);
  }
  return "const arrNamesList = " + JSON.stringify(arrNamesList) + ";\n";
}

function readPropList(lines) {
  let strModule = "";
  let propList;
  let propLists = [];
  function createFunction() {
    strModule += "export function property_" + propList.name.replaceAll(" ", "_") + "(cp) {\n"
      + "  const singleCodes = " + JSON.stringify(propList.singleCodes) + ";\n"
      + "  return singleCodes.includes(cp)\n";
    for (const condition of propList.rangeConditions) {
      strModule += "    || " + condition;
    }
    strModule += "}\n";
    delete propList.singleCodes;
    delete propList.rangeConditions;
  }
  for (const line of lines) {
    if (line.startsWith("Property dump for: 0x")) {
      if (propList) {
        createFunction();
      }
      const propNumberName = line.substring(21).split(" (");
      if (propNumberName.length !== 2) {
        throw new Error("Invalid File Format");
      }
      if (!propNumberName[1].endsWith(")")) {
        throw new Error("Invalid File Format");
      }
      propList = {};
      propList.value = parseInt(propNumberName[0], 16);
      propList.name = propNumberName[1].substring(0, propNumberName[1].length - 1);
      propList.singleCodes = [];
      propList.rangeConditions = [];
      propLists.push(propList);
    } else {
      const codePoints = line.split("..");
      if (codePoints.length === 2) {
        startCode = parseInt(codePoints[0], 16);
        endCode = parseInt(codePoints[1], 16);
        propList.rangeConditions.push("(cp >= 0x" + startCode.toString(16).padStart(6, "0") + " && cp <= 0x" + endCode.toString(16).padStart(6, "0") + ")\n");
      } else {
        code = parseInt(codePoints[0], 16);
        propList.singleCodes.push(code);
      }
    }
  }
  if (propList) {
    createFunction();
  }
  strModule += "export const propLists = " + JSON.stringify(propLists) + ";\n";
  return strModule;
}

function readProps(rows) {
  const arrProps = [];
  for (const row of rows) {
    const objRow = {};
    if (row.length >= 3) {
      objRow.startCode = parseInt(row[1], 16);
      objRow.endCode = parseInt(row[2], 16);
      objRow.blockName = row[3];
    }
    arrProps.push(objRow);
  }
  return "const arrProps = " + JSON.stringify(arrProps) + ";\n";
}

function readUnicodeData(rows) {
  const characterName = [];
  const generalCategory = [];
  const ccs = [];
  const bidi = [];
  const characterDecompositionMapping = [];
  const decimalDigitValue = [];
  const digitValue = [];
  const numericValue = [];
  const mirrored = [];
  const oldUnicodeName = [];
  const commentISO10646 = [];
  const uppercaseMapping = [];
  const lowercaseMapping = [];
  const titlecaseMapping = [];
  let codeValue;
  for (const row of rows) {
    if (row.length >= 15) {
      // [0]  Code value (normative)
      // Code value in 4-digit hexadecimal format.
      codeValue = parseInt(row[0], 16);
      // [1]  Character name (normative)
      // These names match exactly the names published in Chapter 14 of the Unicode Standard, Version 3.0.
      characterName[codeValue] = row[1];
      // [2]  General Category (normative / informative)
      // This is a useful breakdown into various "character types" which can be used as a default categorization in implementations. See below for a brief explanation.
      generalCategory[codeValue] = row[2];
      // [3]  Canonical Combining Classes (normative)
      // The classes used for the Canonical Ordering Algorithm in the Unicode Standard. These classes are also printed in Chapter 4 of the Unicode Standard.
      ccs[codeValue] = row[3];
      // [4]  Bidirectional Category (normative)
      // See the list below for an explanation of the abbreviations used in this field. These are the categories required by the Bidirectional Behavior Algorithm in the Unicode Standard. These categories are summarized in Chapter 3 of the Unicode Standard.
      bidi[codeValue] = row[4];
      // [5]  Character Decomposition Mapping (normative)
      // In the Unicode Standard, not all of the mappings are full (maximal) decompositions. Recursive application of look-up for decompositions will, in all cases, lead to a maximal decomposition. The decomposition mappings match exactly the decomposition mappings published with the character names in the Unicode Standard.
      characterDecompositionMapping[codeValue] = row[5];
      // [6]  Decimal digit value (normative)
      // This is a numeric field. If the character has the decimal digit property, as specified in Chapter 4 of the Unicode Standard, the value of that digit is represented with an integer value in this field
      decimalDigitValue[codeValue] = parseInt(row[6], 10);
      // [7]  Digit value (normative)
      // This is a numeric field. If the character represents a digit, not necessarily a decimal digit, the value is here. This covers digits which do not form decimal radix forms, such as the compatibility superscript digits
      digitValue[codeValue] = parseInt(row[7], 10);
      // [8]  Numeric value (normative)
      // This is a numeric field. If the character has the numeric property, as specified in Chapter 4 of the Unicode Standard, the value of that character is represented with an integer or rational number in this field. This includes fractions as, e.g., "1/5" for U+2155 VULGAR FRACTION ONE FIFTH Also included are numerical values for compatibility characters such as circled numbers.
      numericValue[codeValue] = parseInt(row[8], 10);
      // [9]  Mirrored (normative)
      // If the character has been identified as a "mirrored" character in bidirectional text, this field has the value "Y"; otherwise "N". The list of mirrored characters is also printed in Chapter 4 of the Unicode Standard.
      switch (row[9]) {
        case "Y":
          mirrored[codeValue] = true;
          break;
        case "N":
          mirrored[codeValue] = false;
          break;
        default:
          throw new Error("mirrored value invalid");
          break;
      };
      // [10] Unicode 1.0 Name (informative)
      // This is the old name as published in Unicode 1.0. This name is only provided when it is significantly different from the Unicode 3.0 name for the character.
      oldUnicodeName[codeValue] = row[10];
      // [11] 10646 comment field (informative)
      // This is the ISO 10646 comment field. It is in parantheses in the 10646 names list.
      commentISO10646[codeValue] = row[11];
      // [12] Uppercase Mapping (informative)
      // Upper case equivalent mapping. If a character is part of an alphabet with case distinctions, and has an upper case equivalent, then the upper case equivalent is in this field. See the explanation below on case distinctions. These mappings are always one-to-one, not one-to-many or many-to-one. This field is informative.
      uppercaseMapping[codeValue] = row[12];
      // [13] Lowercase Mapping (informative)
      // Lower case equivalent mapping. If a character is part of an alphabet with case distinctions, and has an lower case equivalent, then the lower case equivalent is in this field. See the explanation below on case distinctions. These mappings are always one-to-one, not one-to-many or many-to-one. This field is informative.
      lowercaseMapping[codeValue] = row[13];
      // [14] Titlecase Mapping (informative)
      // Title case equivalent mapping. If a character is part of an alphabet with case distinctions, and has an title case equivalent, then the title case equivalent is in this field. See the explanation below on case distinctions. These mappings are always one-to-one, not one-to-many or many-to-one. This field is informative.
      titlecaseMapping[codeValue] = row[14];
    }
  }
  return "export const characterName = [" + JSON.stringify(characterName) + "];\n"
    + "export const generalCategory = [" + JSON.stringify(generalCategory) + "];\n"
    + "export const ccs = [" + JSON.stringify(ccs) + "];\n"
    + "export const bidi = [" + JSON.stringify(bidi) + "];\n"
    + "export const characterDecompositionMapping = [" + JSON.stringify(characterDecompositionMapping) + "];\n"
    + "export const decimalDigitValue = [" + JSON.stringify(decimalDigitValue) + "];\n"
    + "export const digitValue = [" + JSON.stringify(digitValue) + "];\n"
    + "export const numericValue = [" + JSON.stringify(numericValue) + "];\n"
    + "export const mirrored = [" + JSON.stringify(mirrored) + "];\n"
    + "export const oldUnicodeName = [" + JSON.stringify(oldUnicodeName) + "];\n"
    + "export const commentISO10646 = [" + JSON.stringify(commentISO10646) + "];\n"
    + "export const uppercaseMapping = [" + JSON.stringify(uppercaseMapping) + "];\n"
    + "export const lowercaseMapping = [" + JSON.stringify(lowercaseMapping) + "];\n"
    + "export const titlecaseMapping = [" + JSON.stringify(titlecaseMapping) + "];\n";
}

function readUnihan(rows) {
  const arrUnihan = [];
  for (const row of rows) {
    const objRow = {};
    if (row.length >= 3) {
      objRow.startCode = parseInt(row[1], 16);
      objRow.endCode = parseInt(row[2], 16);
      objRow.blockName = row[3];
    }
    arrUnihan.push(objRow);
  }
  return "const arrUnihan = " + JSON.stringify(arrUnihan) + ";\n";
}

function show21Update(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}

function show21Update_2(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}

function show21Update_3(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}

function show21Update_4(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}

function show30Update(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}

function show30Update_1(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}

function show31Update(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}

function show31Update_1(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}

function show32Update(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}

function show40Update(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}

function show40Update_1(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}

function show410(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}

function show500(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}

function show510(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}

function show520(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}

function show600(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}

function show610(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}

function show620(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}

function show630(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}

function show700(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}

function show800(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}

function show900(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}

function show1000(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}

function show1100(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}

function show1200(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}

function show1210(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}

function show1300(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}

function show1400(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}

function show1500(container) {
  const fileTable = document.createElement("table");
  container.appendChild(fileTable);
  const fileCJK = addFileRow(fileTable, "CJKXREF");
  const fileUnicodeData = addFileRow(fileTable, "unicodeData");
  const btnCreateModule = document.createElement("button");
  container.appendChild(btnCreateModule);
  btnCreateModule.addEventListener("click", function (evt) {
    
  });
}

function start( [ loadEvt, unicodeModule ] ) {
  const startPageTime = performance.now();
  console.log("Page load in", startPageTime - initPageTime, "ms");
  const divUnicodeChar = document.createElement("div");
  document.body.appendChild(divUnicodeChar);
  const divUnicodeCategory = document.createElement("div");
  document.body.appendChild(divUnicodeCategory);
  const inpUnicodeValue = document.createElement("input");
  inpUnicodeValue.type = "text";
  let thisChar;
  inpUnicodeValue.addEventListener("change", function (evt) {
    try {
      const value = parseInt(inpUnicodeValue.value, 16);
      console.log(value);
      thisChar = new unicodeModule.UnicodeCodePoint(value);
      divUnicodeChar.innerHTML = "";
      divUnicodeChar.appendChild(document.createTextNode(thisChar.toString()));
      divUnicodeCategory.innerHTML = "";
      divUnicodeCategory.appendChild(document.createTextNode(thisChar.category));
    } catch (e) {
      console.error(e);
    }
  });
  document.body.appendChild(inpUnicodeValue);
  const mapFunctions = new Map();
  const selectVersion = document.createElement("select");
  document.body.appendChild(selectVersion);
  const divVersion = document.createElement("div");
  document.body.appendChild(divVersion);
  for (const version of versions) {
    const option = document.createElement("option");
    option.innerHTML = version.folder;
    option.value = version.folder;
    selectVersion.appendChild(option);
    mapFunctions.set(version.folder, version.parseFunction);
  }
  selectVersion.addEventListener("change", function (evt) {
    divVersion.innerHTML = "";
    const versionFunction = mapFunctions.get(selectVersion.value);
    versionFunction(divVersion);
  });
}

function fail(error) {
  console.error(error);
  document.body.appendChild(document.createTextNode(error.message));
}

function parseSCSV(buffer) {
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

function parseTSV(buffer) {
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
    switch (byte) {
      case 0x0A:  // LF
      case 0x0D:  // CR
        // end of row
        row.push(utf8decoder.decode(new Uint8Array(buffer, columnStart, pos - columnStart)));
        columnStart = pos + 1;
        rows.push(row);
        row = [];
        break;
      case 0x09:  // "\t"
        // end of column
        row.push(utf8decoder.decode(new Uint8Array(buffer, columnStart, pos - columnStart)));
        columnStart = pos + 1;
        break;
      default:
        break;
    }
    ++pos;
    if (pos % 1000 === 0) {
      console.log(((pos / bufferView.byteLength) * 100) + "%");
    }
  }
  return rows;
}

function getGeneralCategory(rows) {
  const ret = {};
  ret.characterName = [];
  ret.generalCategory = [];
  ret.canonicalCombiningClass = [];
  ret.bidirectionalCategory = [];
  ret.characterDecomposition = [];
  ret.decimalDigitValue = [];
  ret.digitValue = [];
  ret.numericValue = [];
  ret.mirrored = [];
  ret.characterName1 = [];
  ret.comment10646 = [];
  ret.upperCaseEquivalent = [];
  ret.lowerCaseEquivalent = [];
  ret.titleCaseEquivalent = [];
  let rowsParsed = 0;
  const rowPromises = rows.map(function (row) {
    return new Promise(function (resolve, reject) {
      parseRow(row);
      ++rowsParsed;
      resolve();
    });
  });
  const percentInterval = setInterval(function () {
    console.log(((rowsParsed / rows.length) * 100) + "%");
    if (rowsParsed === rows.length) {
      clearInterval(percentInterval);
    }
  }, 200);
  return Promise.all(rowPromises).then(function () { return ret; });
  function parseRow(row) {
    if (row.length >= 15) {
      const index = parseInt(row[0], 16);
      ret.characterName[index] = row[1];
      ret.generalCategory[index] = row[2];
      ret.canonicalCombiningClass[index] = row[3];
      ret.bidirectionalCategory[index] = row[4];
      ret.characterDecomposition[index] = row[5];
      ret.decimalDigitValue[index] = row[6];
      ret.digitValue[index] = row[7];
      ret.numericValue[index] = row[8];
      ret.mirrored[index] = row[9];
      ret.characterName1[index] = row[10];
      ret.comment10646[index] = row[11];
      ret.upperCaseEquivalent[index] = row[12];
      ret.lowerCaseEquivalent[index] = row[13];
      ret.titleCaseEquivalent[index] = row[14];
    }
  }
}

function save(arrStr) {
  console.log("saving");
  let header = "/*\n"
    + "(c) 2022 Scot Watson  All Rights Reserved\n"
    + "THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n"
    + "*/\n"
    + "\n";
  const blob = new Blob( [ header, ...arrStr ] );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "characterData.mjs";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
