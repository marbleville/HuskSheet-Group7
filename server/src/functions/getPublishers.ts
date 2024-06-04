import { Argument } from "../../../types/types";
import DatabaseInstance from "../database/databaseInstance";
import DatabaseQueries from "../../../types/queries";
import { GetSheetRow, GetUserRow } from "../database/db";

/**
 * @returns An array of arguments containing all registered publishers
 *
 * @author marbleville, rishavsarma5
 */
async function getPublishers(test: boolean = false): Promise<Array<Argument>> {
	let publishers: Array<Argument> = [];

	/**
	 * Get all publishers from the Users table
	 *
	 * For each, push the publisher name to an argument object and push that to
	 * the publishers array
	 */
	const get_publishers_query = DatabaseQueries.getPublishers();
	const database = DatabaseInstance.getInstance();

	const publishers_result = await database.query<GetUserRow>(
		get_publishers_query,
    test
	);

	// Push publishers to the publishers array
	publishers_result.forEach((publisher) => {
		const tempPublisher: Argument = {
			publisher: publisher.username,
			sheet: "",
			id: "",
			payload: "",
		};

		publishers.push(tempPublisher);
	});

	return publishers;
}

export { getPublishers };
