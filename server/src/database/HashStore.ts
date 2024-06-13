import { Ref, Term, Payload, ID } from "../../../types/types";
import DatabaseInstance from "../database/databaseInstance";
import DatabaseQueries from "../../../types/queries";
import { GetAllUpdates, GetSheetID } from "../database/db";
import { Hash } from "crypto";

/**
 * Singleton class that stores a cache of each sheet. This is used when
 * retrieving the current state of a sheet to improve performance.
 *
 * @author marbleville
 */
export default class HashStore {
	/**
	 * An array of map objects representing the current state of each sheet in
	 * the database. The ref key is the cell where [Term, ID] is a tuple of the
	 * value of the cell and the ID of the update that set that value.
	 */
	private static sheets: Array<Map<Ref, [Term, number]>>;

	/**
	 * Initializes the HashStore with the current state of the database.
	 * Ensures the HashStore is a singleton instance.
	 *
	 * @author marbleville
	 */
	public static async initHash(): Promise<void> {
		// singleton
		if (HashStore.sheets != null) {
			return;
		}

		HashStore.sheets = new Array<Map<Ref, [Term, number]>>();

		// every update in the db that has been accepted by the owner of the sheet
		let allOwnerUpdates: GetAllUpdates[] =
			await DatabaseInstance.getInstance().query<GetAllUpdates>(
				DatabaseQueries.getAllOwnerUpdates()
			);

		allOwnerUpdates.forEach((update) => {
			let sheetID: number = update.sheet;
			let payload: Payload = update.changes;

			// Array containing each update on the sheet
			let payloadArr: Array<string> = payload.split("\n");

			// controls for an update in the db that ends with \n
			if (
				payloadArr.length > 0 &&
				payloadArr[payloadArr.length - 1] == ""
			) {
				payloadArr.pop();
			}

			// Initialize the sheet hash is the sheet has no updates
			if (
				payloadArr.length == 0 ||
				HashStore.sheets[sheetID] == undefined
			) {
				HashStore.sheets[sheetID] = new Map<Ref, [Term, number]>();
			}

			payloadArr.forEach((cellChange) => {
				let [refObj, value] = HashStore.getRefObjAndValue(
					cellChange,
					sheetID
				);

				HashStore.sheets[sheetID].set(refObj, [value, update.updateid]);
			});
		});
	}

	/**
	 * Returns the current accepted state of the sheet occuring after the given
	 * id with the given name and publisher in a newline delimited string.
	 *
	 * @param publisher the publisher of the sheet to get the payload for
	 * @param sheetName the name of the sheet to get the payload for
	 *
	 * @returns a newline delimited string represting the value of each cell
	 * 			in the sheet
	 *
	 * @author marbleville
	 */
	public static async getSheetPayload(
		publisher: string,
		sheetName: string,
		updateID: number = 0
	): Promise<[Payload, ID]> {
		let sheetID: number = await HashStore.getSheetID(publisher, sheetName);

		if (sheetID == -1) {
			throw new Error("Sheet not found");
		}

		// Initialize the sheet hash is the sheet has no updates
		if (HashStore.sheets[sheetID] == undefined) {
			HashStore.sheets[sheetID] = new Map<Ref, [Term, number]>();
		}

		let sheetMap: Map<Ref, [Term, number]> = HashStore.sheets[sheetID];

		let payload: string = "";
		let maxID: number = 0;

		for (let [key, [value, id]] of sheetMap) {
			if (id > updateID) {
				payload += "$" + key.column + key.row + " " + value + "\n";
				maxID = id > maxID ? id : maxID;
			}
		}

		return [payload, maxID.toString()];
	}

	/**
	 * Updates the cache of the given sheet with the new changes in the payload.
	 *
	 * @param sheetName the name of the sheet to updatePerSheet
	 * @param publisher the publisher of the sheet to updatePerSheet
	 * @param payload the payload coantinig new changes to add to the cache
	 * @param payloadID the ID of this payload in the db
	 *
	 * @author marbleville
	 */
	public static async updateSheetPayload(
		sheetName: string,
		publisher: string,
		payload: Payload,
		payloadID: number
	): Promise<void> {
		let sheetID: number = await HashStore.getSheetID(publisher, sheetName);

		if (sheetID == -1) {
			throw new Error("Sheet not found");
		}

		// Initialize the sheet hash is the sheet has no updates
		if (HashStore.sheets[sheetID] == undefined) {
			HashStore.sheets[sheetID] = new Map<Ref, [Term, number]>();
		}

		let sheetMap: Map<Ref, [Term, number]> = HashStore.sheets[sheetID];

		let updates: Array<string> = payload.split("\n");

		// controls for an update in the db that ends with \n
		if (updates[updates.length - 1] == "") {
			updates.pop();
		}

		for (let update of updates) {
			let [refObj, value] = HashStore.getRefObjAndValue(update, sheetID);

			sheetMap.set(refObj, [value, payloadID]);
		}
	}

	/**
	 * Returns a tuple containing the ref object and the value of the update.
	 *
	 * @param update the update to get the ref and value from
	 * @param sheetID the ID of the sheet the update is for
	 *
	 * @returns a tuple containing the ref object and the value of the update
	 */
	private static getRefObjAndValue(
		update: string,
		sheetID: number
	): [Ref, Term] {
		let refEndIndex: number = update.indexOf(" ");
		let ref: string = update.substring(0, refEndIndex);
		let value: string = update
			.substring(refEndIndex + 1)
			.replace("''", "'");

		let refObj: Ref = HashStore.getRefFromString(ref, sheetID);

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
	 * @author marbleville
	 */
	private static async getSheetID(
		publisher: string,
		sheetName: string
	): Promise<number> {
		// Returns an array of length 1 with the sheet ID
		let sheetIDArr: GetSheetID[] =
			await DatabaseInstance.getInstance().query<GetSheetID>(
				DatabaseQueries.getSheetID(sheetName, publisher)
			);

		if (sheetIDArr.length == 0) {
			return -1;
		}

		return sheetIDArr[0].sheetid;
	}

	/**
	 * Returns a Ref object representing the reference in the given string. If
	 * the ref exists in the map, it will return the ref from the map.
	 *
	 * @param ref a string representing a reference to a cell in the form
	 * 			  $[col][row]
	 *
	 * @returns a Ref object representing the reference
	 *
	 * @author marbleville
	 */
	private static getRefFromString(ref: string, sheetID: number): Ref {
		let refWiothout$ = ref.substring(1);

		let pattern1: RegExp = /[0-9]/g;
		let pattern2: RegExp = /[a-zA-Z]/g;
		let column: RegExpMatchArray | null = refWiothout$.match(pattern2);
		let row: RegExpMatchArray | null = refWiothout$.match(pattern1);

		let mapHasRef: boolean = false;
		let refInMap: Ref | null = null;

		// looks if the ref is already in the map
		HashStore.sheets[sheetID].forEach(([value, id], key) => {
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
