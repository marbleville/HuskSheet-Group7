import { RowDataPacket } from "mysql2";

/**
 * Should i add here a register
 */

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
	isPublisher: boolean;
}

/**
 * Extends the RowDataPacket from the mysql2 library to have the correct typing for the getUpdates query.
 *
 * @author marbleville
 */
interface GetUpdateRow extends RowDataPacket {
	updateid: number;
	changes: string;
}

/**
 * Extends the RowDataPacket from the mysql2 library to have the correct typing for the getUpdates queries.
 *
 * @author marbleville
 */
interface GetAllUpdates extends RowDataPacket {
	payload: string;
	sheet: number;
	updateid: number;
}

/**
 * Extends the RowDataPacket from the mysql2 library to have the correct typing for the getSheedID query.
 *
 * @author marbleville
 */
interface GetSheetID extends RowDataPacket {
	sheetid: number;
}

export { GetSheetRow, GetUserRow, GetUpdateRow, GetAllUpdates, GetSheetID };
