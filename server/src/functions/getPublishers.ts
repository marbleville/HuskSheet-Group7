import { Argument } from "../../../types/types";
import DatabaseInstance from "../database/databaseInstance";
import DatabaseQueries from "../../../types/queries";
import { GetUserRow } from "../database/db";

/**
 * @returns An array of arguments containing all registered publishers
 *
 * @author marbleville
 */
async function getPublishers(): Promise<Array<Argument>> {
	let publishers: Array<Argument> = [];

	const get_publishers_query: string = DatabaseQueries.getPublishers();
	const database: DatabaseInstance = DatabaseInstance.getInstance();

	const publishers_result: GetUserRow[] = await database.query<GetUserRow>(
		get_publishers_query
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
