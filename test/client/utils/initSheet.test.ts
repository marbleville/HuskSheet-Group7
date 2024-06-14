import initializeSheet from "../../../client/src/utils/initializeSheet";
import { SheetDataMap } from "../../../client/src/types";

describe("getColumnNumber", () => {
	it("should return the column number", () => {
    expect(initializeSheet(1, 1)).toEqual({"$A1": ""} as SheetDataMap);
    expect(initializeSheet(7, 9)).toEqual({"$A1": "",
"$A2": "","$A3": "","$A4": "","$A5": "","$A6": "","$A7": "","$B1": "","$B2": "","$B3": "",
"$B4": "","$B5": "","$B6": "","$B7": "","$C1": "","$C2": "","$C3": "","$C4": "","$C5": "","$C6": "","$C7": "",
"$D1": "","$D2": "","$D3": "","$D4": "","$D5": "","$D6": "","$D7": "","$E1": "","$E2": "","$E3": "","$E4": "",
"$E5": "","$E6": "","$E7": "","$F1": "","$F2": "","$F3": "","$F4": "","$F5": "","$F6": "","$F7": "","$G1": "",
"$G2": "","$G3": "","$G4": "","$G5": "","$G6": "","$G7": "","$H1": "","$H2": "","$H3": "","$H4": "","$H5": "",
"$H6": "","$H7": "","$I1": "","$I2": "","$I3": "","$I4": "","$I5": "","$I6": "","$I7": ""} as SheetDataMap);
    expect(initializeSheet(2, 2)).toEqual({"$A1": "","$A2": "","$B1": "","$B2": "",} as SheetDataMap);
    expect(initializeSheet(5, 3)).toEqual({"$A1": "",
"$A2": "","$A3": "","$A4": "","$A5": "",
"$B1": "","$B2": "","$B3": "","$B4": "",
"$B5": "","$C1": "","$C2": "","$C3": "",
"$C4": "","$C5": ""} as SheetDataMap);
  });
});
