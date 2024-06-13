import { SheetDataMap } from "../types";

/**
   * Generate a payload string representing the incoming updates that 
   * have never been dealt with by the owner.
   * 
   * @param {SheetDataMap} existingUpdates - updates from getUpdatesForSubscription
   * @param {SheetDataMap} incomingUpdates - updates from getUpdatesForPublished
   * @returns {SheetDataMap} - incoming updates that the owner has never reviewed
   *
   * @author kris-amerman
   */
const getUnreconciledUpdates = (
    existingUpdates: SheetDataMap,
    incomingUpdates: SheetDataMap
): SheetDataMap => {
    const unreconciledUpdates: SheetDataMap = {};

    for (const cell in incomingUpdates) {
        if (!(cell in existingUpdates) || existingUpdates[cell] !== incomingUpdates[cell]) {
            unreconciledUpdates[cell] = incomingUpdates[cell];
        }
    }

    return unreconciledUpdates;
}

export default getUnreconciledUpdates;