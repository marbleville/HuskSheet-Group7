import { RowDataPacket } from "mysql2"


/**
 * Extends the RowDataPacket from the mysql2 library to have the correct typing for the getSheets query.
 *
 * @author hunterbrodie
 */
interface GetSheetRow extends RowDataPacket {
  sheetid: number;
  sheetname: string;
  latest?: string;
}

/**
 * Extends the RowDataPacket from the mysql2 library to have the correct typing for any query that gets a list of users.
 *
 * @author hunterbrodie
 */
interface GetUserRow extends RowDataPacket {
  username: string;
}
