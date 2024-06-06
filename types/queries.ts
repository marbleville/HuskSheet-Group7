/**
 * List of queries for the database to be used
 *
 * @author hunterbrodie
 */
export default class DatabaseQueries {
	/**
	 * Returns the two queries needed for the createSheet function
	 *
	 * @author hunterbrodie
	 */
	static createSheetNewName(sheetName: string, publisher: string): string {
		return `SELECT sheetname FROM sheets 
      WHERE sheetname LIKE '${sheetName}%'
      AND owner = 
			(SELECT userid FROM publishers WHERE username = '${publisher}');`;
	}

	static createSheet(newSheetName: string, publisher: string): string {
		return `INSERT INTO sheets (sheetname, owner, latest) 
      VALUES ('${newSheetName}', 
      (SELECT userid FROM publishers WHERE username 
      = '${publisher}'), NULL);`;
	}

	/**
	 * Returns the query needed for deleteSheet.
	 *
	 * @author hunterbrodie
	 */
	static deleteSheet(sheetName: string, publisher: string): string {
		return `DELETE sheets FROM sheets
      INNER JOIN publishers ON sheets.owner=publishers.userid
      WHERE publishers.username='${publisher}' 
      AND sheets.sheetname='${sheetName}';`;
	}

	/**
	 * Returns the query needed for getPublishers.
	 *
	 * @author hunterbrodie
	 */
	static getPublishers(): string {
		return "SELECT username FROM publishers";
	}

	/**
	 * Returns the query needed for getSheets
	 *
	 * @author hunterbrodie
	 */
	static getSheets(publisher: string): string {
		return `SELECT sheets.sheetid, sheets.sheetname FROM sheets 
      INNER JOIN publishers ON sheets.owner=publishers.userid 
      WHERE publishers.username='${publisher}';`;
	}

	/**
	 * Returns the query needed for getUpdatesForPublished.
	 *
	 * @author hunterbrodie
	 */
	static getUpdatesForPublished(
		publisher: string,
		sheetName: string,
		id: number
	): string {
		return DatabaseQueries.getUpdatesHelper(publisher, sheetName, id, "<>");
	}

	/**
	 * Returns the query needed for getUpdatesForSubscription.
	 *
	 * @author hunterbrodie
	 */
	static getUpdatesForSubscription(
		publisher: string,
		sheetName: string,
		id: number
	): string {
		return DatabaseQueries.getUpdatesHelper(publisher, sheetName, id, "=");
	}

	/**
	 * Helps the getUpdate functions.
	 *
	 * @author hunterbrodie
	 */
	static getUpdatesHelper(
		publisher: string,
		sheetName: string,
		id: number,
		operator: string
	): string {
		return `SELECT updates.* FROM updates
      INNER JOIN sheets ON updates.sheet=sheets.sheetid 
      INNER JOIN publishers ON sheets.owner=publishers.userid
      WHERE publishers.username='${publisher}' AND sheets.sheetname='${sheetName}'
      AND updates.owner${operator}sheets.owner AND updates.updateid>${id};`;
	}

	/**
	 * Returns the query for register.
	 *
	 * @author hunterbrodie
	 */
	static register(username: string, pass: string): string {
		return `INSERT INTO publishers (username, pass) 
			VALUES(${username}, ${pass})`;
	}
	/**
	 * Returns the query needed for updatePublished.
	 *
	 * @author hunterbrodie
	 */
	static updatePublished(
		sheetName: string,
		publisher: string,
		payload: string
	) {
		return DatabaseQueries.updateHelper(
			sheetName,
			publisher,
			payload,
			"TRUE"
		);
	}

	/**
	 * Returns the query needed for updateSubscription.
	 *
	 * @author hunterbrodie
	 */
	static updateSubscription(
		sheetName: string,
		publisher: string,
		payload: string,
		updatePublisher: string
	) {
		return DatabaseQueries.updateHelper(
			sheetName,
			publisher,
			payload,
			"NULL"
		);
	}

	/**
	 * Helper method for the update functions.
	 *
	 * @author hunterbrodie
	 */
	static updateHelper(
		sheetName: string,
		sheetPublisher: string,
		payload: string,
		accepted: string,
		updatePublisher: string = sheetPublisher
	) {
		return `INSERT INTO updates 
      (updatetime, sheet, owner, changes, accepted)
      SELECT '${Date.now()}', sheets.sheetid, (SELECT publishers.userid FROM publishers WHERE publishers.username='${updatePublisher}'), '${payload}', ${accepted}
      FROM sheets INNER JOIN publishers on sheets.owner=publishers.userid
      WHERE sheets.sheetname='${sheetName}' AND publishers.username='${sheetPublisher}';`;
	}

	static getSheetID(sheetName: string, publisher: string): string {
		return `SELECT sheets.sheetid FROM sheets 
		INNER JOIN publishers ON sheets.owner=publishers.userid
		WHERE sheets.sheetname="${sheetName}" AND publishers.username="${publisher}";`;
	}

	static getAllOwnerUpdates(): string {
		return `SELECT updates.sheet, updates.changes, updates.updateid FROM updates 
		INNER JOIN sheets ON updates.sheet=sheets.sheetid WHERE 
		sheets.owner=updates.owner;`;
	}

	static setUpTesting(): string {
		return `CALL resetdata();`;
	}
}
