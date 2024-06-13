import toCSV from "../../../client/src/utils/toCSV";
import { SheetDataMap } from "../../../client/src/types";

describe("createSheet", () => {
	it("checks to see if it formats CSV correctly for correct data", () => {
    let data: SheetDataMap = {};

    expect(toCSV(data)).toEqual("");

    data["$A1"] = "=SUM(1, 2)";
    expect(toCSV(data)).toEqual("=SUM(1, 2),\n");
    data["$A1"] = "=3";
    expect(toCSV(data)).toEqual("=3,\n");
    data["$AA5"] = "helloworld";
    expect(toCSV(data)).toEqual(`=3,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,helloworld,\n`);
    data["$B2"] = "test1";
    data["$D4"] = "test2";
    expect(toCSV(data)).toEqual(`=3,,,,,,,,,,,,,,,,,,,,,,,,,,,
,test1,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,test2,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,helloworld,\n`);
	});

	it("checks to see if it handles incorrectly formatted data", () => {
    let data: SheetDataMap = {};

    data["$A1"] = "=SUM(1, 2)";
    data["$A1"] = "=3";
    data["$AA5"] = "helloworld";
    data["$B2"] = "test1";
    data["$D4"] = "test2";
    expect(toCSV(data)).toEqual(`=3,,,,,,,,,,,,,,,,,,,,,,,,,,,
,test1,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,test2,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,helloworld,\n`);

    data["$AZ"] = " abc";
    expect(toCSV(data)).toEqual(`=3,,,,,,,,,,,,,,,,,,,,,,,,,,,
,test1,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,test2,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,helloworld,\n`);

    data["$AZ12321a"] = " abc";
    expect(toCSV(data)).toEqual(`=3,,,,,,,,,,,,,,,,,,,,,,,,,,,
,test1,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,test2,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,helloworld,\n`);

    data["B5"] = " abc";
    expect(toCSV(data)).toEqual(`=3,,,,,,,,,,,,,,,,,,,,,,,,,,,
,test1,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,test2,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,helloworld,\n`);

    data["$52"] = " abc";
    expect(toCSV(data)).toEqual(`=3,,,,,,,,,,,,,,,,,,,,,,,,,,,
,test1,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,test2,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,helloworld,\n`);
	});
});
