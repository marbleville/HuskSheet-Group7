import { Argument, Publisher, Sheet, Payload } from "../../../types/types";
import { updatePublished } from "./updatePublished";

/**
 * Updates the Updates table with the given publisher, sheet, and payload for
 * a sheet not owned by the client
 *
 * @param argument Argument object containing the publisher, sheet, and payload
 *                 for the update
 *
 * @author marbleville
 */
async function updateSubscription(argument: Argument): Promise<void> {
	// Call the updatePublished function with the argument object becasue the
	// logic is the same and checks can be made on the client side more easily

	// This function should stoe the updates but not updates the lates accepted version of the sheet
	await updatePublished(argument);
}

export { updateSubscription };
