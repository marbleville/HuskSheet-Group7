import { Argument } from "../../../types/types";
import DatabaseInstance from "../database/databaseInstance";
import { GetSheetRow, GetUserRow } from "../database/db";


/* 
 * @returns An array of arguments containing all registered publishers
 *
 * @author marbleville, rishavsarma5
 */
async function getPublishers(): Promise<Array<Argument>> {
  let publishers: Array<Argument> = [];

	/**
	 * Get all publishers from the Users table
	 *
	 * For each, push the publisher name to an argument object and push that to
	 * the publishers array
	 */
  const get_publishers_query = 'SELECT username FROM publishers';
  const publishers_result = await DatabaseInstance.query<GetUserRow>(get_publishers_query);
  
  await Promise.all(publishers_result.map(async (publisher) => {
    const getSheetsQuery = `
      SELECT sheets.sheetid, sheets.sheetname
      FROM sheets
      INNER JOIN publishers ON sheets.owner = publishers.userid
      WHERE publishers.username = '${publisher.username}'
    `;
    const sheetResults = await DatabaseInstance.query<GetSheetRow>(getSheetsQuery);

    // for each sheet that a publisher owns, create an argument object with for that publisher
    sheetResults.forEach((sheet) => {
      const tempPublisher: Argument = {
        publisher: publisher.username,
        sheet: sheet.sheetname,
        id: sheet.sheetname,
        payload: "", // You may need to populate this depending on your requirements
      };

      publishers.push(tempPublisher);
    });
  }));

  return publishers;
}

export { getPublishers };