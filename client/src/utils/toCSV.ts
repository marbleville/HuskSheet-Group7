import { SheetDataMap } from "../types";

/**
 * Takes a hashmap of sheet data and converts it to CSV
 * 
 * @param {SheetDataMap} data - the sheet data
 *
 * @author hunterbrodie
 */
const toCSV = (data: SheetDataMap) => {
  let keys = new Map<string, string>;
  let boundW = 0;
  let boundH = 0;

  for (const key in data) {
    if (data[key] !== "") {
      const rowMatch = key.match(/\d+/g);
      const letrMatch = key.match(/[a-zA-Z]+/g);

      if (key.includes("$") && rowMatch && letrMatch && rowMatch.length === 1 && letrMatch.length === 1) {
        const row: number = +rowMatch[0];
        let letr: string = letrMatch[0];
        let column = 0;

        for (let i = 0; i < letr.length; i++) {
          let num = letr[letr.length - 1 - i].charCodeAt(0) - 64;
          column += num * (26 ** i);
        }

        if (row > boundH) {
          boundH = row;
        }
        if (column > boundW) {
          boundW = column;
        }
        keys.set(column + "," + row, data[key]);
      }
    }
  }

  let csv = "";
  for (let i = 1; i <= boundH; i++) {
    for (let j = 1; j <= boundW; j++) {
      const coord = j + "," + i;
      if (keys.has(coord)) {
        csv += keys.get(coord);
      }
      csv += ",";
    }
    csv += "\n";
  }

  return csv;
}

export default toCSV;
