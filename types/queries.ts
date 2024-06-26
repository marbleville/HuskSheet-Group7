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
	static getSheetsWithName(sheetName: string, publisher: string): string {
		return `SELECT sheetname FROM sheets 
      WHERE sheetname LIKE '${sheetName}%'
      AND owner = 
			(SELECT userid FROM publishers WHERE username = '${publisher}');`;
	}

	/**
	 * Returns the query needed to get a user
	 *
	 * @param username The username of the publisher
	 * @returns The query needed to get a user
	 *
	 * @author hunterbrodie
	 */
	static getUser(username: string) {
		return `SELECT * FROM publishers WHERE username='${username}';`;
	}

	/**
	 * Returns the query needed to register a user as a publisher.
	 *
	 * @param username the username of the publisher
	 * @returns the query needed to register a user as a publisher
	 *
	 * @author hunterbrodie
	 */
	static register(username: string): string {
		return `UPDATE publishers SET isPublisher = 1 WHERE username = '${username}';`;
	}

	/**
	 * Returns the query needed to authenticate a user.
	 *
	 * @param username the username of the client
	 * @param password the password of the client
	 * @returns the query needed to authenticate a user
	 *
	 * @author hunterbrodie
	 */
	static authenticate(username: string, password: string): string {
		return `SELECT * FROM publishers WHERE username = '${username}' AND pass = '${password}';`;
	}

	/**
	 * Returns the query needed for createSheet.
	 *
	 * @param newSheetName The name of the new sheet
	 * @param publisher The publisher of the new sheet
	 * @returns The query needed to create the new sheet
	 *
	 * @author hunterbrodie
	 */
	static createSheet(newSheetName: string, publisher: string): string {
		return `INSERT INTO sheets (sheetname, owner, latest) 
      VALUES ('${newSheetName}', 
      (SELECT userid FROM publishers WHERE username 
      = '${publisher}'), NULL);`;
	}

	/**
	 * Returns the query needed for deleteSheet.
	 *
	 * @param sheetName The name of the sheet to delete
	 * @param publisher The name of the publisher who owns the sheet
	 * @returns the query needed to delete a sheet
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
	 * @returns the query needed to fetch all publishers
	 *
	 * @author hunterbrodie
	 */
	static getPublishers(): string {
		return "SELECT username FROM publishers WHERE isPublisher<>0";
	}

	/**
	 * Returns the query needed for getSheets
	 *
	 * @param owner of all the sheets to return
	 * @param getPrivateSheetTag is the tag to use to get private sheets
	 * @returns the query needed to fetch all sheets owned by a given publisher
	 *
	 * @author hunterbrodie
	 */
	static getSheets(
		publisher: string,
		getPrivateSheetTag: string = "NOT"
	): string {
		return `SELECT sheets.sheetid, sheets.sheetname FROM sheets 
      INNER JOIN publishers ON sheets.owner=publishers.userid 
      WHERE publishers.username='${publisher}' AND sheets.sheetName ${getPrivateSheetTag} LIKE "%-private";`;
	}

	/**
	 * Returns the query needed for getUpdatesForPublished.
	 *
	 * @param publisher who owns the sheet
	 * @param sheetName of the sheet to get requested updates for
	 * @param id number of the earliest of the requested updates to fetch
	 * @returns the query needed to grab the requested updates
	 *
	 * @author hunterbrodie
	 */
	static getUpdatesForPublished(
		publisher: string,
		sheetName: string,
		id: number
	): string {
		return DatabaseQueries.getUpdatesHelper(publisher, sheetName, id, "FALSE");
	}

	/**
	 * Returns the query needed for getUpdatesForSubscription.
	 *
	 * @param publisher who owns the sheet
	 * @param sheetName of the sheet to get updates for
	 * @param id number of the earliest of the updates to fetch
	 * @returns the query needed to grab the needed updates
	 *
	 * @author hunterbrodie
	 */
	static getUpdatesForSubscription(
		publisher: string,
		sheetName: string,
		id: number
	): string {
		return DatabaseQueries.getUpdatesHelper(publisher, sheetName, id, "TRUE");
	}

	/**
	 * Helps the getUpdate functions.
	 *
	 * @param publisher who owns the sheet
	 * @param sheetName of the sheet
	 * @param id of the earliest update to grab
	 * @param which operator to use for selecting the update
	 * @returns the helper query for the getUpdates function
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
      AND updates.accepted=${operator} AND updates.updateid>${id};`;
	}

	/**
	 * Returns the query for register.
	 *
	 * @param username to add
	 * @param pass word to add
	 * @returns the query needed to add a publisher
	 *
	 * @author hunterbrodie
	 */
	static addNewPublisher(username: string, pass: string): string {
		return `INSERT INTO publishers (username, pass) 
			VALUES('${username}', '${pass}')`;
	}
	/**
	 * Returns the query needed for updatePublished.
	 *
	 * @param sheetName to update
	 * @param publisher who owns the sheet
	 * @param payload to insert
	 * @returns the query needed to insert a publisher update
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
	 * @param sheetName to update
	 * @param publisher who owns the sheet
	 * @param payload to insert
	 * @param updatePublisher who is submitting the update
	 * @returns the query needed to insert a publisher update
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
			"FALSE",
			updatePublisher
		);
	}

	/**
	 * Helper method for the update functions.
	 *
	 * @param sheetName of sheet
	 * @param sheetPublisher is the owner of the sheet
	 * @param payload is the payload to push to the sheet
	 * @param accepted is whether the update will be propagated
	 * @param updatePublisher is the owner of the update
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
      SELECT '${Date.now()}', sheets.sheetid, 
	  (SELECT publishers.userid FROM publishers 
	  WHERE publishers.username='${updatePublisher}'), '${payload}', ${accepted}
      FROM sheets INNER JOIN publishers ON sheets.owner=publishers.userid
      WHERE sheets.sheetname='${sheetName}' AND publishers.username='${sheetPublisher}';`;
	}

	/**
	 * Method to grab the sheetID from the given sheetName and publisher
	 *
	 * @param sheetName is the name of the sheet
	 * @param publisher is the owner of the sheet
	 * @returns the necessary query to grab the sheetID
	 *
	 * @author hunterbrodie
	 */
	static getSheetID(sheetName: string, publisher: string): string {
		return `SELECT sheets.sheetid FROM sheets 
		INNER JOIN publishers ON sheets.owner=publishers.userid
		WHERE sheets.sheetname="${sheetName}" AND publishers.username="${publisher}";`;
	}

	/**
	 * Method to grab the sheetID from the given sheetName and publisher
	 *
	 * @param sheetName is the name of the sheet
	 * @param publisher is the owner of the sheet
	 * @returns the necessary query to grab the sheetID
	 *
	 * @author hunterbrodie
	 */
	static getAllOwnerUpdates(): string {
		return `SELECT updates.sheet, updates.changes, updates.updateid FROM updates 
		INNER JOIN sheets ON updates.sheet=sheets.sheetid WHERE 
		sheets.owner=updates.owner;`;
	}

	/**
	 * Method to reset the testing database
	 *
	 * @returns the necessary query to reset the testing database
	 *
	 * @author hunterbrodie
	 */
	static setUpTesting(): string {
		return `CALL resetdata();`;
	}
}
