import { Ref, Term, ID, Payload, Column } from "../../../types/types";
import DatabaseInstance from "../database/databaseInstance";
import DatabaseQueries from "../../../types/queries";

export default class HashStore {
	private static sheets: Array<Map<Ref, Term>>;

	constructor() {
		// Initialize the sheets array
	}

	public static getSheetPayload(sheetID: ID): Payload {
		let sheetMap = this.sheets[sheetID];

		let payload = "";

		for (let [key, value] of sheetMap) {
			payload += "$" + key.column + key.row + " " + value + "\n";
		}

		return payload;
	}

	public static async updateSheetPayload(
		sheetName: string,
		publisher: string,
		payload: Payload
	): Promise<void> {
		let sheetID = await DatabaseInstance.getInstance().query(
			DatabaseQueries.getSheetID(sheetName, publisher)
		)[0];

		let sheetMap = this.sheets[sheetID];

		let updates = payload.split("\n");

		for (let update of updates) {
			let [ref, value] = update.split(" ");

			let refWiothout$ = ref.substring(1);

			let pattern1 = /[0-9]/g;
			let pattern2 = /[a-zA-Z]/g;
			let column = refWiothout$.match(pattern2);
			let row = refWiothout$.match(pattern1);

			let refObj: Ref = {
				column: column ? column.join("") : "",
				row: row ? parseInt(row.join("")) : -1,
			};

			sheetMap.set(refObj, value);
		}
	}
}
