import mysql from "mysql2";
import dbConfig from "./db.config";
import { Connection, QueryError, RowDataPacket, FieldPacket } from "mysql2";

/**
 * This class is a singleton class that creates a connection to the mysql
 * database
 *
 * @todo: Currently no good place to call connection.end() to close the
 * connection
 *
 * @author marbleville
 */
export default class DatabaseInstance {
	private static instance: DatabaseInstance;

	/**
	 * Creates a connection to the mysql database and sets the connection field
	 *
	 * @author marbleville
	 */
	public constructor() {}

	/**
	 * Returns the instance of the ConnectionInstance class
	 *
	 * @returns The instance of the ConnectionInstance class containing the
	 * 			connection to the mysql db
	 *
	 * @author marbleville
	 */
	public static getInstance() {
		if (DatabaseInstance.instance == null) {
			DatabaseInstance.instance = new DatabaseInstance();
		}

		return DatabaseInstance.instance;
	}

	private static getConnection(): Connection {
		const connection = mysql.createConnection({
			host: dbConfig.HOST,
			user: dbConfig.USER,
			password: dbConfig.PASSWORD,
			database: dbConfig.DB,
		});
		connection.connect();

		return connection;
	}

	/**
	 * Performs a query on the mysql database
	 *
	 * @param query The query to be executed on the mysql database
	 * @returns The rows returned from the query
	 *
	 * @throws Error if the query fails
	 *
	 * @author marbleville
	 */
	public async query<T extends RowDataPacket>(query: string): Promise<T[]> {
		let connection = DatabaseInstance.getConnection();

		let queryPromise = new Promise((resolve, reject) => {
			connection.query(
				query,
				(err: QueryError, rows: T[], fields: FieldPacket[]) => {
					if (err) reject(err);

					resolve(rows);
				}
			);
		});

		connection.end();

		return queryPromise as Promise<T[]>;
	}
}
