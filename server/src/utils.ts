import { time, timeStamp } from "console";
import {
  RegisterArgument,
  Result,
  Argument,
  RegisterResult,
} from "../../types/types";
import DatabaseInstance from "./database/databaseInstance";
import { Request, Response } from "express";

/**
 *
 *
 * @author eduardo-ruiz-garay
 */
// async function runEndpointRegister(
//   req: Request,
//   res: Response,
//   func: (
//     registerArgument: RegisterArgument
//   ) => Promise<RegisterArgument>[] | Promise<RegisterArgument> | Promise<void>
// ): Promise<void> {
//   let result: RegisterResult;

//   if (!(await authenticate(req.headers.authorization))) {
//     result = assembleRegisterResultObj(
//       false,
//       `${func.name} Unauthorized`,
//       [],
//       0
//     );
//     res.send(JSON.stringify(result));
//     return;
//   }

//   try {
//     let registerArgument = req.body as RegisterArgument;
//     const value: RegisterArgument[] | RegisterArgument | void = await func(registerArgument);

//     const time: Date.now();
//     result = assembleRegisterResultObj(true, "null", value, time);
//     res.send(JSON.stringify(result));
//   } catch (error) {
//     const err: Error = error as Error;
//     console.error(error);
//     result = assembleRegisterResultObj(false, `${func.name} ` + err.message, [], time);
//     res.send(JSON.stringify(result));
//   }
// }

/**
 * Runs the given endpoint function with the given request and response objects
 *
 * @param req Request object from the client
 * @param res Response object to send to the client
 * @param func Function to run with the given request
 *
 * @author marbleville
 */
async function runEndpointFuntion(
  req: Request,
  res: Response,
  func: (
    argument: Argument
  ) => Promise<Argument[]> | Promise<Argument> | Promise<void>
): Promise<void> {
	let result: Result;

	if (!(await authenticate(req.headers.authorization))) {
		result = assembleResultObject(false, `${func.name} Unauthorized`, []);
		res.send(JSON.stringify(result));
		return;
	}

	try {
		let argument = req.body as Argument;
		let value: Argument[] | Argument | void = await func(argument);

		result = assembleResultObject(true, `${func.name} `, value);
		res.send(JSON.stringify(result));
	} catch (error) {
		const err: Error = error as Error;
		console.error(err);
		result = assembleResultObject(false, `${func.name} ` + err.message, []);
		res.send(JSON.stringify(result));
	}
}

/**
 * Authenticates the user based on the authorization header from the request
 *
 * @param authHeader The authorization header from the request
 *
 * @returns True if the user is authenticated, false otherwise
 *
 * @author marbleville, eduardo-ruiz-garay
 */
async function authenticate(authHeader: string | undefined): Promise<boolean> {
  if (authHeader === undefined) {
    return false;
  }

  /**
   * authHeader is the authorization header from the request with the form of
   * username:password encoded in base64
   *
   * Split the authHeader by the colon and decode to get the username
   * and password
   *
   * Search the Users table for the username and check the password
   *
   * If either fails, return false, otherwise return true
   */
  const base64 = authHeader.split(" ")[1];
  // Decodes to binary
  const decodedAuthHeader = Buffer.from(base64, "base64").toString("utf-8");
  const [username, password] = decodedAuthHeader
    .split(":")
    .map((str) => str.trimEnd());
  const database = DatabaseInstance.getInstance();

  let queryString = `SELECT * FROM publishers WHERE username = '${username}' 
	AND pass = '${password}';`;

  let result = null;
  try {
    result = await database.query(queryString);
  } catch (error) {
    console.error("An error happened  when authenticating the user", error);
  }
  return result?.length != 0 ? true : false;
}

/**
 * Assembles a result object to be returned to the client with the given
 * success, message, and value arguments
 *
 * @param success Boolean value indicating the success of the operation
 * @param message String message to be returned to the client
 * @param value Array of arguments to be returned to the client
 *
 * @returns Result object containing the success, message, and value
 *
 * @author marbleville
 */
function assembleResultObject(
  success: boolean,
  message: string,
  value: Argument[] | Argument | void
): Result {
  if (!(value instanceof Array) && value !== undefined) {
    value = [value];
  }

  return {
    success: success,
    message: message,
    value: value == undefined ? [] : value,
  };
}

function assembleRegisterResultObj(
  success: boolean,
  message: string,
  value: RegisterArgument[] | RegisterArgument | void,
  time: Number
): RegisterResult {
  if (!(value instanceof Array) && value !== undefined) {
    value = [value];
  }
  return {
    success: success,
    message: message,
    value: value == undefined ? [] : value,
    time: time,
  };
}

export {
  authenticate,
  assembleResultObject,
  runEndpointFuntion,
  assembleRegisterResultObj,
  // runEndpointRegister,
};
