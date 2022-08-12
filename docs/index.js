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
    const parsingProps = bufferingProps.then(parseLines, fail);
    const readingProps = parsingProps.then(readProps, fail);
    arrReading.push(readingProps);

    const fileUnicodeData = rowUnicodeData.files[0];
    const bufferingUnicodeData = fileUnicodeData.arrayBuffer();
    const parsingUnicodeData = bufferingUnicodeData.then(parseSCSV, fail);
    const readingUnicodeData = parsingUnicodeData.then(readUnicodeData, fail);
    arrReading.push(readingUnicodeData);
    
    const fileUnihan = rowUnihan.files[0];
    const bufferingUnihan = fileUnihan.arrayBuffer();
    const parsingUnihan = bufferingUnihan.then(parseTSV, fail);
    const readingUnihan = parsingUnihan.then(readUnihan, fail);
    arrReading.push(readingUnihan);
        
    const saving = Promise.all(arrReading).then(function ( [ objArabicShaping, objBlocks, objIndex, objJamo, /* objNamesList, */  objPropList, objProps, objUnicodeData, objUnihan ] ) {
      let retArabicShaping = "";
      console.log("ArabicShaping");
      retArabicShaping += "const arrArabicShaping = " + JSON.stringify(objArabicShaping.arrArabicShaping) + ";\n"
        + "const baseCodePointArabicShaping = " + JSON.stringify(objArabicShaping.baseCodePoint) + ";\n";
      console.log("Blocks");
      let retBlocks = "const arrBlocks = " + JSON.stringify(objBlocks.arrBlocks) + ";\n";
      console.log("Index");
      let retIndex = "const arrIndex = " + JSON.stringify(objIndex.arrIndex) + ";\n";
      console.log("Jamo");
      let retJamo = "const arrJamo = " + JSON.stringify(objJamo.arrJamo) + ";\n";
      console.log("PropList");
      let retPropList = "";
      for (const propList of objPropList.propLists) {
        retPropList += "export function property_" + propList.name.replaceAll(" ", "_").replaceAll("-", "_") + "(cp) {\n"
          + "  const singleCodes = " + JSON.stringify(propList.singleCodes) + ";\n"
          + "  return singleCodes.includes(cp)\n";
        for (const condition of propList.rangeConditions) {
          retPropList += "    || " + "(cp >= 0x" + condition.startCode.toString(16).padStart(6, "0") + " && cp <= 0x" + condition.endCode.toString(16).padStart(6, "0") + ")\n";
        }
        retPropList += "}\n";
        delete propList.singleCodes;
        delete propList.rangeConditions;
      }
      retPropList += "export const propLists = " + JSON.stringify(objPropList.propLists) + ";\n";
      console.log("Props");
      let retProps = "";
      for (const prop of objProps.arrProps) {
        retProps += "export function property_" + prop.name.replaceAll(" ", "_").replaceAll("-", "_") + "(cp) {\n"
          + "  const singleCodes = ["
        for (const code of prop.singleCodes) {
          if (objUnicodeData.characterName[code.code] !== code.codeName) {
            console.warn("Name mismatch:", objUnicodeData.characterName[code.code], code.codeName);
          }
          retProps += "0x" + code.code.toString(16).padStart(6, "0") + ",";
        }
        retProps += "];\n"
        retProps += "  return singleCodes.includes(cp)\n";
        for (const condition of prop.rangeConditions) {
          if (objUnicodeData.characterName[condition.startCode] !== condition.startCodeName) {
            console.warn("Name mismatch:", objUnicodeData.characterName[condition.startCode], condition.startCodeName);
          }
          if (objUnicodeData.characterName[condition.endCode] !== condition.endCodeName) {
            console.warn("Name mismatch:", objUnicodeData.characterName[condition.endCode], condition.endCodeName);
          }
          retProps += "    || " + "(cp >= 0x" + condition.startCode.toString(16).padStart(6, "0") + " && cp <= 0x" + condition.endCode.toString(16).padStart(6, "0") + ")\n";
        }
        retProps += "}\n";
        delete prop.singleCodes;
        delete prop.rangeConditions;
      }
      console.log("UnicodeData");
      let retUnicodeDataNames = "export const characterName = " + JSON.stringify(objUnicodeData.characterName) + ";\n"
        + "export const oldUnicodeName = " + JSON.stringify(objUnicodeData.oldUnicodeName) + ";\n"
      let retUnicodeDataOther = "export const generalCategory = " + JSON.stringify(objUnicodeData.generalCategory) + ";\n"
        + "export const ccs = " + JSON.stringify(objUnicodeData.ccs) + ";\n"
        + "export const bidi = " + JSON.stringify(objUnicodeData.bidi) + ";\n"
        + "export const characterDecompositionMapping = " + JSON.stringify(objUnicodeData.characterDecompositionMapping) + ";\n"
        + "export const decimalDigitValue = " + JSON.stringify(objUnicodeData.decimalDigitValue) + ";\n"
        + "export const digitValue = " + JSON.stringify(objUnicodeData.digitValue) + ";\n"
        + "export const numericValue = " + JSON.stringify(objUnicodeData.numericValue) + ";\n"
        + "export const mirrored = " + JSON.stringify(objUnicodeData.mirrored) + ";\n"
        + "export const commentISO10646 = " + JSON.stringify(objUnicodeData.commentISO10646) + ";\n"
        + "export const uppercaseMapping = " + JSON.stringify(objUnicodeData.uppercaseMapping) + ";\n"
        + "export const lowercaseMapping = " + JSON.stringify(objUnicodeData.lowercaseMapping) + ";\n"
        + "export const titlecaseMapping = " + JSON.stringify(objUnicodeData.titlecaseMapping) + ";\n";
      console.log("Unihan");
      let retBigFive = "";
      if (objUnihan.mapUnihan.has("kBigFive")) {
        retBigFive = "export const kBigFive = " + JSON.stringify(objUnihan.mapUnihan.get("kBigFive")) + ";\n";
        objUnihan.mapUnihan.delete("kBigFive");
      }
      let retCCCII = "";
      if (objUnihan.mapUnihan.has("kCCCII")) {
        retCCCII = "export const kCCCII = " + JSON.stringify(objUnihan.mapUnihan.get("kCCCII")) + ";\n";
        objUnihan.mapUnihan.delete("kCCCII");
      }
      let retCNS1986 = "";
      if (objUnihan.mapUnihan.has("kCNS1986")) {
        retCNS1986 = "export const kCNS1986 = " + JSON.stringify(objUnihan.mapUnihan.get("kCNS1986")) + ";\n";
        objUnihan.mapUnihan.delete("kCNS1986");
      }
      let retCNS1992 = "";
      if (objUnihan.mapUnihan.has("kCNS1992")) {
        retCNS1992 = "export const kCNS1992 = " + JSON.stringify(objUnihan.mapUnihan.get("kCNS1992")) + ";\n";
        objUnihan.mapUnihan.delete("kCNS1992");
      }
      let retEACC = "";
      if (objUnihan.mapUnihan.has("kEACC")) {
        retEACC = "export const kEACC = " + JSON.stringify(objUnihan.mapUnihan.get("kEACC")) + ";\n";
        objUnihan.mapUnihan.delete("kEACC");
      }
      let retGB0 = "";
      if (objUnihan.mapUnihan.has("kGB0")) {
        retGB0 = "export const kGB0 = " + JSON.stringify(objUnihan.mapUnihan.get("kGB0")) + ";\n";
        objUnihan.mapUnihan.delete("kGB0");
      }
      let retGB1 = "";
      if (objUnihan.mapUnihan.has("kGB1")) {
        retGB1 = "export const kGB1 = " + JSON.stringify(objUnihan.mapUnihan.get("kGB1")) + ";\n";
        objUnihan.mapUnihan.delete("kGB1");
      }
      let retGB3 = "";
      if (objUnihan.mapUnihan.has("kGB3")) {
        retGB3 = "export const kGB3 = " + JSON.stringify(objUnihan.mapUnihan.get("kGB3")) + ";\n";
        objUnihan.mapUnihan.delete("kGB3");
      }
      let retGB5 = "";
      if (objUnihan.mapUnihan.has("kGB5")) {
        retGB5 = "export const kGB5 = " + JSON.stringify(objUnihan.mapUnihan.get("kGB5")) + ";\n";
        objUnihan.mapUnihan.delete("kGB5");
      }
      let retGB7 = "";
      if (objUnihan.mapUnihan.has("kGB7")) {
        retGB7 = "export const kGB7 = " + JSON.stringify(objUnihan.mapUnihan.get("kGB7")) + ";\n";
        objUnihan.mapUnihan.delete("kGB7");
      }
      let retGB8 = "";
      if (objUnihan.mapUnihan.has("kGB8")) {
        retGB8 = "export const kGB8 = " + JSON.stringify(objUnihan.mapUnihan.get("kGB8")) + ";\n";
        objUnihan.mapUnihan.delete("kGB8");
      }
      let retIBMJapan = "";
      if (objUnihan.mapUnihan.has("kIBMJapan")) {
        retIBMJapan = "export const kIBMJapan = " + JSON.stringify(objUnihan.mapUnihan.get("kIBMJapan")) + ";\n";
        objUnihan.mapUnihan.delete("kIBMJapan");
      }
      let retJis0 = "";
      if (objUnihan.mapUnihan.has("kJis0")) {
        retJis0 = "export const kJis0 = " + JSON.stringify(objUnihan.mapUnihan.get("kJis0")) + ";\n";
        objUnihan.mapUnihan.delete("kJis0");
      }
      let retJis1 = "";
      if (objUnihan.mapUnihan.has("kJis1")) {
        retJis1 = "export const kJis1 = " + JSON.stringify(objUnihan.mapUnihan.get("kJis1")) + ";\n";
        objUnihan.mapUnihan.delete("kJis1");
      }
      let retKSC0 = "";
      if (objUnihan.mapUnihan.has("kKSC0")) {
        retKSC0 = "export const kKSC0 = " + JSON.stringify(objUnihan.mapUnihan.get("kKSC0")) + ";\n";
        objUnihan.mapUnihan.delete("kKSC0");
      }
      let retKSC1 = "";
      if (objUnihan.mapUnihan.has("kKSC1")) {
        retKSC1 = "export const kKSC1 = " + JSON.stringify(objUnihan.mapUnihan.get("kKSC1")) + ";\n";
        objUnihan.mapUnihan.delete("kKSC1");
      }
      let retMainlandTelegraph = "";
      if (objUnihan.mapUnihan.has("kMainlandTelegraph")) {
        retMainlandTelegraph = "export const kMainlandTelegraph = " + JSON.stringify(objUnihan.mapUnihan.get("kMainlandTelegraph")) + ";\n";
        objUnihan.mapUnihan.delete("kMainlandTelegraph");
      }
      let retPseudoGB1 = "";
      if (objUnihan.mapUnihan.has("kPseudoGB1")) {
        retPseudoGB1 = "export const kPseudoGB1 = " + JSON.stringify(objUnihan.mapUnihan.get("kPseudoGB1")) + ";\n";
        objUnihan.mapUnihan.delete("kPseudoGB1");
      }
      let retTaiwanTelegraph = "";
      if (objUnihan.mapUnihan.has("kTaiwanTelegraph")) {
        retTaiwanTelegraph = "export const kTaiwanTelegraph = " + JSON.stringify(objUnihan.mapUnihan.get("kTaiwanTelegraph")) + ";\n";
        objUnihan.mapUnihan.delete("kTaiwanTelegraph");
      }
      let retXerox = "";
      if (objUnihan.mapUnihan.has("kXerox")) {
        retXerox = "export const kXerox = " + JSON.stringify(objUnihan.mapUnihan.get("kXerox")) + ";\n";
        objUnihan.mapUnihan.delete("kXerox");
      }

      createSaveLink([ retBigFive ], "Big5_Encoding");
      document.body.appendChild(document.createElement("br"));
      createSaveLink([ retCCCII ], "CCCII_Encoding");
      document.body.appendChild(document.createElement("br"));
      createSaveLink([ retCNS1986 ], "CNS_11643_1986_Encoding");
      document.body.appendChild(document.createElement("br"));
      createSaveLink([ retCNS1992 ], "CNS_11643_1992_Encoding");
      document.body.appendChild(document.createElement("br"));
      createSaveLink([ retEACC ], "EACC_Encoding");
      document.body.appendChild(document.createElement("br"));
      createSaveLink([ retGB0 ], "GB_2312_80_Encoding");
      document.body.appendChild(document.createElement("br"));
      createSaveLink([ retGB1 ], "GB_12345_90_Encoding");
      document.body.appendChild(document.createElement("br"));
      createSaveLink([ retGB3 ], "GB_7589_87_Encoding");
      document.body.appendChild(document.createElement("br"));
      createSaveLink([ retGB5 ], "GB_7590_87_Encoding");
      document.body.appendChild(document.createElement("br"));
      createSaveLink([ retGB7 ], "GB7_Encoding");
      document.body.appendChild(document.createElement("br"));
      createSaveLink([ retGB8 ], "GB_8565_89_Encoding");
      document.body.appendChild(document.createElement("br"));
      createSaveLink([ retIBMJapan ], "IBM_Japanese_Encoding");
      document.body.appendChild(document.createElement("br"));
      createSaveLink([ retJis0 ], "JIS_X_0208_1990_Encoding");
      document.body.appendChild(document.createElement("br"));
      createSaveLink([ retJis1 ], "JIS_X_0212_1990_Encoding");
      document.body.appendChild(document.createElement("br"));
      createSaveLink([ retKSC0 ], "KS_C_5601_1989_Encoding");
      document.body.appendChild(document.createElement("br"));
      createSaveLink([ retKSC1 ], "KS_C_5657_1991_Encoding");
      document.body.appendChild(document.createElement("br"));
      createSaveLink([ retMainlandTelegraph ], "PRC_Telegraph_Encoding");
      document.body.appendChild(document.createElement("br"));
      createSaveLink([ retPseudoGB1 ], "Pseudo_GB1_Encoding");
      document.body.appendChild(document.createElement("br"));
      createSaveLink([ retTaiwanTelegraph ], "Taiwan_Telegraph_Encoding");
      document.body.appendChild(document.createElement("br"));
      createSaveLink([ retXerox ], "Xerox_Encoding");
      document.body.appendChild(document.createElement("br"));

      let retUnihan = "";
      for (const [name, value] of objUnihan.mapUnihan) {
        retUnihan += "export const " + name + " = " + JSON.stringify(value) + ";\n"
      }
      createSaveLink([ retArabicShaping, retBlocks, retJamo, retPropList, retProps ], "Codes");
      document.body.appendChild(document.createElement("br"));
      createSaveLink([ retIndex ], "Index");
      document.body.appendChild(document.createElement("br"));
      createSaveLink([ retUnicodeDataNames ], "UnicodeDataNames");
      document.body.appendChild(document.createElement("br"));
      createSaveLink([ retUnicodeDataOther ], "UnicodeDataOther");
      document.body.appendChild(document.createElement("br"));
      createSaveLink([ retUnihan ], "Unihan");
      document.body.appendChild(document.createElement("br"));
      return [ retArabicShaping, retBlocks, retIndex, retJamo, retPropList, retProps, retUnicodeDataNames, retUnicodeDataOther, retUnihan ];
    });
    saving.then(save, fail);
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
  }
  return lines;
}

function readArabicShaping(rows) {
  const objRet = {};
  objRet.arrArabicShaping = [];
  for (const row of rows) {
    const objRow = {};
    const codePoint = parseInt(row[0], 16);
    if (row.length >= 4) {
      if (!objRet.baseCodePoint) {
        objRet.baseCodePoint = codePoint;
      }
      objRow.name = row[1];
      objRow.link = row[2];
      objRow.linkGroup = row[3];
    }
    objRet.arrArabicShaping[codePoint - objRet.baseCodePoint] = objRow;
  }
  return objRet;
}

function readBlocks(rows) {
  const objRet = {};
  objRet.arrBlocks = [];
  for (const row of rows) {
    const objRow = {};
    if (row.length >= 3) {
      objRow.startCode = parseInt(row[0], 16);
      objRow.endCode = parseInt(row[1], 16);
      objRow.blockName = row[2];
    }
    objRet.arrBlocks.push(objRow);
  }
  return objRet;
}

function readIndex(rows) {
  const objRet = {};
  objRet.arrIndex = [];
  for (const row of rows) {
    const objRow = {};
    if (row.length >= 2) {
      objRow.name = row[0];
      objRow.code = parseInt(row[1], 16);
    }
    objRet.arrIndex.push(objRow);
  }
  return objRet;
}

function readJamo(rows) {
  const objRet = {};
  objRet.arrJamo = [];
  const headerRow = rows.shift();
  if (headerRow[1].trim() !== "#Value; Short Name; Unicode Name") {
    throw new Error("Jamo: Bad Header");
  }
  for (const row of rows) {
    const objRow = {};
    if (row.length >= 3) {
      objRow.code = parseInt(row[0].substring(2), 16);
      objRow.shortName = row[1].trim();
      objRow.unicodeName = row[2].trim();
    }
    objRet.arrJamo.push(objRow);
  }
  return objRet;
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
  const objRet = {};
  let propList;
  objRet.propLists = [];
  for (const line of lines) {
    if (line.length !== 0) {
      if (line.startsWith("Property dump for: 0x")) {
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
        objRet.propLists.push(propList);
      } else {
        const codePoints = line.split("..");
        if (codePoints.length === 2) {
          const startCode = parseInt(codePoints[0], 16);
          const endCode = parseInt(codePoints[1], 16);
          propList.rangeConditions.push( { startCode, endCode } );
        } else {
          const code = parseInt(codePoints[0], 16);
          propList.singleCodes.push(code);
        }
      }
    }
  }
  return objRet;
}

function readProps(rows) {
  const objRet = {};
  objRet.arrProps = [];
  let prop;
  let objRow = {};
  let expectContinuation = false;
  for (const row of rows) {
    if (row === "") {
      continue;
    }
    if (row.startsWith("#")) {
      if (prop) {
        objRet.arrProps.push(prop);
      }
      prop = {};
      prop.name = row.substring(2).trim();
      prop.singleCodes = [];
      prop.rangeConditions = [];
    } else {
      const codes = row.substring(0, 11).trim();
      const codeName = row.substring(11);
      if (expectContinuation) {
        if (codes !== "") {
          throw new Error("props: Expected Continuation");
        }
        objRow.endCodeName = codeName;
        prop.rangeConditions.push(objRow);
        expectContinuation = false;
      } else {
        objRow = {};
        if (codes === "") {
          throw new Error("props: Unexpected Continuation");
        }
        const arrCodes = codes.split("..");
        switch (arrCodes.length) {
          case 1:
            objRow.code = parseInt(arrCodes[0], 16);
            objRow.codeName = codeName;
            prop.singleCodes.push(objRow);
            break;
          case 2:
            if (!codeName.endsWith("..")) {
              throw new Error("props: Expected ..");
            }
            objRow.startCode = parseInt(arrCodes[0], 16);
            objRow.endCode = parseInt(arrCodes[1], 16);
            objRow.startCodeName = codeName.substring(0, codeName.length - 2);
            expectContinuation = true;
            break;
          default:
            throw new Error("props: Unexpected Codes");
            break;
        }
      }
    }
  }
  objRet.arrProps.push(prop);
  return objRet;
}

function readUnicodeData(rows) {
  const objRet = {};
  objRet.characterName = [];
  objRet.generalCategory = [];
  objRet.ccs = [];
  objRet.bidi = [];
  objRet.characterDecompositionMapping = [];
  objRet.decimalDigitValue = [];
  objRet.digitValue = [];
  objRet.numericValue = [];
  objRet.mirrored = [];
  objRet.oldUnicodeName = [];
  objRet.commentISO10646 = [];
  objRet.uppercaseMapping = [];
  objRet.lowercaseMapping = [];
  objRet.titlecaseMapping = [];
  let codeValue;
  for (const row of rows) {
    if (row.length >= 15) {
      // [0]  Code value (normative)
      // Code value in 4-digit hexadecimal format.
      codeValue = parseInt(row[0], 16);
      // [1]  Character name (normative)
      // These names match exactly the names published in Chapter 14 of the Unicode Standard, Version 3.0.
      objRet.characterName[codeValue] = row[1];
      // [2]  General Category (normative / informative)
      // This is a useful breakdown into various "character types" which can be used as a default categorization in implementations. See below for a brief explanation.
      objRet.generalCategory[codeValue] = row[2];
      // [3]  Canonical Combining Classes (normative)
      // The classes used for the Canonical Ordering Algorithm in the Unicode Standard. These classes are also printed in Chapter 4 of the Unicode Standard.
      objRet.ccs[codeValue] = row[3];
      // [4]  Bidirectional Category (normative)
      // See the list below for an explanation of the abbreviations used in this field. These are the categories required by the Bidirectional Behavior Algorithm in the Unicode Standard. These categories are summarized in Chapter 3 of the Unicode Standard.
      objRet.bidi[codeValue] = row[4];
      // [5]  Character Decomposition Mapping (normative)
      // In the Unicode Standard, not all of the mappings are full (maximal) decompositions. Recursive application of look-up for decompositions will, in all cases, lead to a maximal decomposition. The decomposition mappings match exactly the decomposition mappings published with the character names in the Unicode Standard.
      objRet.characterDecompositionMapping[codeValue] = row[5];
      // [6]  Decimal digit value (normative)
      // This is a numeric field. If the character has the decimal digit property, as specified in Chapter 4 of the Unicode Standard, the value of that digit is represented with an integer value in this field
      objRet.decimalDigitValue[codeValue] = parseInt(row[6], 10);
      // [7]  Digit value (normative)
      // This is a numeric field. If the character represents a digit, not necessarily a decimal digit, the value is here. This covers digits which do not form decimal radix forms, such as the compatibility superscript digits
      objRet.digitValue[codeValue] = parseInt(row[7], 10);
      // [8]  Numeric value (normative)
      // This is a numeric field. If the character has the numeric property, as specified in Chapter 4 of the Unicode Standard, the value of that character is represented with an integer or rational number in this field. This includes fractions as, e.g., "1/5" for U+2155 VULGAR FRACTION ONE FIFTH Also included are numerical values for compatibility characters such as circled numbers.
      objRet.numericValue[codeValue] = parseInt(row[8], 10);
      // [9]  Mirrored (normative)
      // If the character has been identified as a "mirrored" character in bidirectional text, this field has the value "Y"; otherwise "N". The list of mirrored characters is also printed in Chapter 4 of the Unicode Standard.
      switch (row[9]) {
        case "Y":
          objRet.mirrored[codeValue] = true;
          break;
        case "N":
          objRet.mirrored[codeValue] = false;
          break;
        default:
          throw new Error("mirrored value invalid");
          break;
      };
      // [10] Unicode 1.0 Name (informative)
      // This is the old name as published in Unicode 1.0. This name is only provided when it is significantly different from the Unicode 3.0 name for the character.
      objRet.oldUnicodeName[codeValue] = row[10];
      // [11] 10646 comment field (informative)
      // This is the ISO 10646 comment field. It is in parantheses in the 10646 names list.
      objRet.commentISO10646[codeValue] = row[11];
      // [12] Uppercase Mapping (informative)
      // Upper case equivalent mapping. If a character is part of an alphabet with case distinctions, and has an upper case equivalent, then the upper case equivalent is in this field. See the explanation below on case distinctions. These mappings are always one-to-one, not one-to-many or many-to-one. This field is informative.
      objRet.uppercaseMapping[codeValue] = row[12];
      // [13] Lowercase Mapping (informative)
      // Lower case equivalent mapping. If a character is part of an alphabet with case distinctions, and has an lower case equivalent, then the lower case equivalent is in this field. See the explanation below on case distinctions. These mappings are always one-to-one, not one-to-many or many-to-one. This field is informative.
      objRet.lowercaseMapping[codeValue] = row[13];
      // [14] Titlecase Mapping (informative)
      // Title case equivalent mapping. If a character is part of an alphabet with case distinctions, and has an title case equivalent, then the title case equivalent is in this field. See the explanation below on case distinctions. These mappings are always one-to-one, not one-to-many or many-to-one. This field is informative.
      objRet.titlecaseMapping[codeValue] = row[14];
    }
  }
  return objRet;
}

function readUnihan(rows) {
  const objRet = {};
  objRet.mapUnihan = new Map();
  // Normative
  objRet.mapUnihan.set("kBigFive", []);
  objRet.mapUnihan.set("kCNS1986", []);
  objRet.mapUnihan.set("kGB0", []);
  objRet.mapUnihan.set("kGB1", []);
  objRet.mapUnihan.set("kGB3", []);
  objRet.mapUnihan.set("kGB5", []);
  objRet.mapUnihan.set("kGB7", []);
  objRet.mapUnihan.set("kGB8", []);
  objRet.mapUnihan.set("kJis0", []);
  objRet.mapUnihan.set("kJis1", []);
  objRet.mapUnihan.set("kKSC0", []);
  objRet.mapUnihan.set("kKSC1", []);
  objRet.mapUnihan.set("kPseudoGB1", []);
  // Proofed
  objRet.mapUnihan.set("kCCCII", []);
  objRet.mapUnihan.set("kCNS1992", []);
  objRet.mapUnihan.set("kDaeJaweon", []);
  objRet.mapUnihan.set("kHanYu", []);
  objRet.mapUnihan.set("kIBMJapan", []);
  objRet.mapUnihan.set("kKangXi", []);
  objRet.mapUnihan.set("kMorohashi", []);
  objRet.mapUnihan.set("kXerox", []);
  // Unproofed
  objRet.mapUnihan.set("kAlternateHanYu", []);
  objRet.mapUnihan.set("kAlternateKangXi", []);
  objRet.mapUnihan.set("kAlternateMorohashi", []);
  objRet.mapUnihan.set("kCantonese", []);
  objRet.mapUnihan.set("kDefinition", []);
  objRet.mapUnihan.set("kEACC", []);
  objRet.mapUnihan.set("kJapaneseKun", []);
  objRet.mapUnihan.set("kJapaneseOn", []);
  objRet.mapUnihan.set("kKorean", []);
  objRet.mapUnihan.set("kMainlandTelegraph", []);
  objRet.mapUnihan.set("kMandarin", []);
  objRet.mapUnihan.set("kMatthews", []);
  objRet.mapUnihan.set("kNelson", []);
  objRet.mapUnihan.set("kRSJapanese", []);
  objRet.mapUnihan.set("kRSKanWa", []);
  objRet.mapUnihan.set("kRSKangXi", []);
  objRet.mapUnihan.set("kRSKorean", []);
  objRet.mapUnihan.set("kRSUnicode", []);
  objRet.mapUnihan.set("kSemanticVariant", []);
  objRet.mapUnihan.set("kSimplifiedVariant", []);
  objRet.mapUnihan.set("kSpecializedSemanticVariant", []);
  objRet.mapUnihan.set("kTaiwanTelegraph", []);
  objRet.mapUnihan.set("kTang", []);
  objRet.mapUnihan.set("kTraditionalVariant", []);
  objRet.mapUnihan.set("kZVariant", []);

  let firstCode;
  for (const row of rows) {
    if (row.length < 3) {
      continue;
    }
    if (row[0].startsWith("#")) {
      continue;
    }
    const code = parseInt(row[0].substring(2), 16);
    if (!firstCode) {
      firstCode = code;
    }
    const category = row[1];
    const value = row[2];
    if (objRet.mapUnihan.has(category)) {
      objRet.mapUnihan.get(category)[code - firstCode] = value;
      if (category === "kGB3") {
        console.log(category, value);
      }
    } else {
      console.warn("Category Not Found: \"" + row[0] + "\" \"" + row[1] + "\" \"" + row[2] + "\"");
    }
  }
  return objRet;
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
          row.push(utf8decoder.decode(new Uint8Array(buffer, columnStart, pos - columnStart)));
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
          columnStart = pos;
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

function createSaveLink(arrStr, name) {
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
  a.download = name + ".mjs";
  a.innerHTML = "Click to Save: " + name + ".mjs";
  document.body.appendChild(a);
}
