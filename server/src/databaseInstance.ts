import mysql from "mysql2";
import dbConfig from "./config/db.config";
import { Connection, QueryError, RowDataPacket, FieldPacket } from "mysql2";
import { connect } from "http2";

/**
 * This class is a singleton class that creates a connection to the mysql
 * database
 *
 * @todo: Currently no good place to call connection.end() to close the
 * connection
 *
 * @author marbleville
 */
class DatabaseInstance {
	private static instance: DatabaseInstance;
	private static connection: Connection;

	/**
	 * Creates a connection to the mysql database and sets the connection field
	 *
	 * @author marbleville
	 */
	private constructor() {
		const connection = mysql.createConnection({
			host: dbConfig.HOST,
			user: dbConfig.USER,
			password: dbConfig.PASSWORD,
			database: dbConfig.DB,
		});
		connection.connect();

		DatabaseInstance.connection = connection;
	}

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
	public query(query: string): RowDataPacket[] {
		if (DatabaseInstance.instance == null) {
			DatabaseInstance.instance = new DatabaseInstance();
		}

		DatabaseInstance.connection.query(
			query,
			(err: QueryError, rows: RowDataPacket, fields: FieldPacket[]) => {
				if (err) throw err;

				return rows;
			}
		);

		throw new Error("Query failed");
	}
}
