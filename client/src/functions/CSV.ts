/**
 * @description 
 *
 * @author hunterbrodie
 */
const toCSV = (data: SheetDataMap) => {
  let keys = new Map<string, string>;
  let boundW = 0;
  let boundH = 0;

  for (const key in data) {
    if (data[key] !== "") {
      const row: number = +key.match(/\d+/g)[0];
      let letr: string = key.match(/[a-zA-Z]+/g)[0].replace("$", "");
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

  const element = document.createElement("a");
  const file = new Blob([csv], {type: 'text/csv'});
  element.href = URL.createObjectURL(file);
  element.download = "data.csv";
  document.body.appendChild(element);
  element.click();
}


