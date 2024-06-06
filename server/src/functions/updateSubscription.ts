import { Argument } from "../../../types/types";
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
	// The logic for updating a subscription is the same as updating a published
	await updatePublished(argument);
}

export { updateSubscription };
