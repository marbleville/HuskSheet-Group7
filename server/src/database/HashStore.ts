import { Ref, Term, Payload, ID } from "../../../types/types";
import DatabaseInstance from "../database/databaseInstance";
import DatabaseQueries from "../../../types/queries";
import { GetAllUpdates, GetSheetID } from "../database/db";
const accessSheetMap = 0;
const accessUpdateID = 1;

/**
 * Singleton class that stores a cache of each of the sheets in the database.
 *
 * @author marbleville, huntebrodie
 */
export default class HashStore {
	private static sheets: Array<[Map<Ref, Term>, ID]>;

	/**
	 * Initializes the HashStore with the current state of the database.
	 * Ensures the HashStore is a singleton instance.
	 *
	 * @author marbleville, huntebrodie
	 */
	public static async initHash(): Promise<void> {
		// singleton
		if (HashStore.sheets != null) {
			return;
		}

		HashStore.sheets = new Array<[Map<Ref, Term>, ID]>();

		let allOwnerUpdates =
			await DatabaseInstance.getInstance().query<GetAllUpdates>(
				DatabaseQueries.getAllOwnerUpdates()
			);

		allOwnerUpdates.forEach((sheet) => {
			let sheetID = sheet.sheet;
			let payload: Payload = sheet.changes;

			// Array containing each update on the sheet
			let payloadArr = payload.split("\n");

			// controls for an update in the db that ends with \n
			if (payloadArr[payloadArr.length - 1] == "") {
				payloadArr.pop();
			}

			// Initialize the sheet hash is the sheet has no updates
			if (
				payloadArr.length == 0 ||
				HashStore.sheets[sheetID] == undefined
			) {
				HashStore.sheets[sheetID] = [new Map<Ref, Term>(), "0"];
			}

			payloadArr.forEach((updatePerSheet) => {
				let [refObj, value] = HashStore.getRefObjAndValue(
					updatePerSheet,
					sheetID
				);

				HashStore.sheets[sheetID][accessSheetMap].set(refObj, value);

				HashStore.sheets[sheetID][accessUpdateID] =
					sheet.updateid.toString();
			});
		});
	}

	/**
	 * @param publisher the publisher of the sheet ot get the payload for
	 * @param sheetName the name of the sheet to get the payload for
	 *
	 * @returns a newline delimited string represting the value of each cell
	 * 			in the sheet
	 *
	 * @author marbleville, huntebrodie
	 */
	public static async getSheetPayload(
		publisher: string,
		sheetName: string
	): Promise<[Payload, ID]> {
		let sheetID: number = await HashStore.getSheetID(publisher, sheetName);

		if (sheetID == -1) {
			throw new Error("Sheet not found");
		}

		// Initialize the sheet hash is the sheet has no updates
		if (HashStore.sheets[sheetID] == undefined) {
			HashStore.sheets[sheetID] = [new Map<Ref, Term>(), "0"];
		}

		let sheetMap = HashStore.sheets[sheetID][accessSheetMap];

		let payload = "";

		for (let [key, value] of sheetMap) {
			// Would be possible to add support for getting updates during
			// runtime with IDs here
			payload += "$" + key.column + key.row + " " + value + "\n";
		}

		return [payload, HashStore.sheets[sheetID][accessUpdateID]];
	}

	/**
	 * Updates the cache of the given sheet with the new changes in the payload.
	 *
	 * @param sheetName the name of the sheet to updatePerSheet
	 * @param publisher the publisher of the sheet to updatePerSheet
	 * @param payload the payload coantinig new changes to add to the cache
	 *
	 * @author marbleville, huntebrodie
	 */
	public static async updateSheetPayload(
		sheetName: string,
		publisher: string,
		payload: Payload,
		lastID: number
	): Promise<void> {
		let sheetID: number = await HashStore.getSheetID(publisher, sheetName);

		if (sheetID == -1) {
			throw new Error("Sheet not found");
		}

		// Initialize the sheet hash is the sheet has no updates
		if (HashStore.sheets[sheetID] == undefined) {
			HashStore.sheets[sheetID] = [new Map<Ref, Term>(), "0"];
		}

		let sheetMap = HashStore.sheets[sheetID][accessSheetMap];

		let updates = payload.split("\n");

		// controls for an update in the db that ends with \n
		if (updates[updates.length - 1] == "") {
			updates.pop();
		}

		for (let update of updates) {
			let [refObj, value] = HashStore.getRefObjAndValue(update, sheetID);

			sheetMap.set(refObj, value);

			HashStore.sheets[sheetID][accessUpdateID] = lastID.toString();
		}
	}

	private static getRefObjAndValue(
		update: string,
		sheetID: number
	): [Ref, Term] {
		let refEndIndex = update.indexOf(" ");
		let ref = update.substring(0, refEndIndex);
		let value = update.substring(refEndIndex + 1);

		let refObj = HashStore.getRefFromString(ref, sheetID);

		return [refObj, value];
	}

	/**
	 * Returns the ID of the sheet with the given name and publisher.
	 *
	 * @param publisher the publisher of the sheet to get the ID for
	 * @param sheetName the name of the sheet to get the ID for
	 *
	 * @returns the ID of the sheet with the given name and publisher
	 *
	 * @author marbleville, huntebrodie
	 */
	private static async getSheetID(
		publisher: string,
		sheetName: string
	): Promise<number> {
		// Returns an array of length 1 with the sheet ID
		let sheetIDArr = await DatabaseInstance.getInstance().query<GetSheetID>(
			DatabaseQueries.getSheetID(sheetName, publisher)
		);

		if (sheetIDArr.length == 0) {
			return -1;
		}

		return sheetIDArr[0].sheetid;
	}

	/**
	 * Returns a Ref object representing the reference in the given string.
	 *
	 * @param ref a string representing a reference to a cell in the form
	 * 			  $[col][row]
	 *
	 * @returns a Ref object representing the reference
	 *
	 * @author marbleville, huntebrodie
	 */
	private static getRefFromString(ref: string, sheetID: number): Ref {
		let refWiothout$ = ref.substring(1);

		let pattern1 = /[0-9]/g;
		let pattern2 = /[a-zA-Z]/g;
		let column = refWiothout$.match(pattern2);
		let row = refWiothout$.match(pattern1);

		let mapHasRef = false;
		let refInMap = null;

		// looks if the ref is already in the map
		HashStore.sheets[sheetID][accessSheetMap].forEach((value, key) => {
			if (
				column &&
				key.column == column.join("") &&
				row &&
				key.row == parseInt(row.join(""))
			) {
				mapHasRef = true;
				refInMap = key;
			}
		});

		if (mapHasRef && refInMap) {
			return refInMap;
		}

		let refObj: Ref = {
			column: column ? column.join("") : "",
			row: row ? parseInt(row.join("")) : -1,
		};

		return refObj;
	}
}
