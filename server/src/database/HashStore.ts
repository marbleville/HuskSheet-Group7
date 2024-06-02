import { Ref, Term, ID, Payload } from "../../../types/types";
import DatabaseInstance from "../database/databaseInstance";
import DatabaseQueries from "../../../types/queries";
import { GetAllUpdates, GetSheetID } from "../database/db";

export default class HashStore {
	private static sheets: Array<Map<Ref, Term>>;

	constructor() {}

	public static async initHash(): Promise<void> {
		if (HashStore.sheets != null) {
			return;
		}

		HashStore.sheets = new Array<Map<Ref, Term>>();

		let allOwnerUpdates =
			await DatabaseInstance.getInstance().query<GetAllUpdates>(
				DatabaseQueries.getAllOwnerUpdates()
			);

		allOwnerUpdates.forEach((update) => {
			let sheetID = update.sheet;
			let payload = update.payload;

			let payloadArr = payload.split("\n");

			payloadArr.forEach((update) => {
				let [ref, value] = update.split(" ");

				let refObj = this.getRefFromString(ref);

				HashStore.sheets[sheetID].set(refObj, value);
			});
		});
	}

	public static async getSheetPayload(publisher: string, sheetName: string): Promise<Payload> {
		let sheetID = await getSheetID(publisher, sheetName);

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
		let sheetID = await getSheetID(publisher, sheetName);

		let sheetMap = this.sheets[sheetID];

		let updates = payload.split("\n");

		for (let update of updates) {
			let [ref, value] = update.split(" ");

			let refObj = this.getRefFromString(ref);

			sheetMap.set(refObj, value);
		}
	}

  private static async getSheetID(publisher: string, sheetName: string): Promise<number> {
		let sheetIDArr = await DatabaseInstance.getInstance().query<GetSheetID>(
			DatabaseQueries.getSheetID(sheetName, publisher)
		);

		return sheetIDArr[0].sheetid;
  }

	private static getRefFromString(ref: string): Ref {
		let refWiothout$ = ref.substring(1);

		let pattern1 = /[0-9]/g;
		let pattern2 = /[a-zA-Z]/g;
		let column = refWiothout$.match(pattern2);
		let row = refWiothout$.match(pattern1);

		let refObj: Ref = {
			column: column ? column.join("") : "",
			row: row ? parseInt(row.join("")) : -1,
		};

		return refObj;
	}
}
