import { SheetDataMap } from "../types";

/**
 * Iterate through the given SheetDataMap and build a payload based on the given refs to include. 
 * 
 * @param {Set<string>} refs - the refs to use in the payload
 * @param {SheetDataMap} refs - the sheet data to use in the payload
 * @returns {string} - payload
 * 
 * @author kris-amerman
 */
const buildPayload = (refs: Set<string>, updatedSheetData: SheetDataMap): string => {
    const payload: string[] = [];
    for (const [ref, valueAtCell] of Object.entries(updatedSheetData)) {
        if (refs.has(ref)) {
            payload.push(`${ref} ${valueAtCell}`);
        }
    }
    return payload.length ? payload.join("\n") + "\n" : "";
};

export default buildPayload;