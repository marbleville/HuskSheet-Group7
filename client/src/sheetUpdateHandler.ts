import { Argument } from "../../types/types"

/**
 * Represents a HashMap that contains ref, term pairs to replicate an actual Sheet. 
 *
 * @author rishavsarma5
 */
interface SheetUpdateMap {
    [ref: string]: string;
}

/**
 * Handles implementation for SheetUpdateHandler which should retrieve update calls from server endpoints and 
 * create a Hashmap table of updates to send to the client.
 *
 * @author rishavsarma5
 */
class SheetUpdateHandler {
    private static instance: SheetUpdateHandler;

    /**
     * Creates a new instance of SheetUpdateHandler.
     *
     * @author rishavsarma5
     */
    public constructor() { }

    /**
     * Returns the instance of the SheetUpdateHandler class.
     *
     * @returns Creates or returns the single SheetUpdateHandler instance
     *
     * @author rishavsarma5
     */
    public static getInstance() {
        if (SheetUpdateHandler.instance == null) {
            SheetUpdateHandler.instance = new SheetUpdateHandler();
        }

        return SheetUpdateHandler.instance;
    }

    /**
     * Helper that initializes the HashMap table with keys set to refs and values set to ''.
     *
     * @returns Initialized sheet update HashMap
     *
     * @author rishavsarma5
     */
    private initializeSheetMap(sheetMap: SheetUpdateMap, size: number): SheetUpdateMap {
        // goes through each row and column and creates ref values
        // ex: $A1, $j52
        for (let row = 1; row <= size; row++) {
            for (let col = 0; col < size; col++) {
                const columnLetter = this.getColumnLetter(col);
                const key = `$${columnLetter}${row}`;
                sheetMap[key] = "";
            }
        }

        return sheetMap;
    }

    /**
     * Helper that retrieves correct letter for ref value based on given number.
     *
     * @returns returns letter for row ref value
     *
     * @author rishavsarma5
     */
    private getColumnLetter(col: number): string {
        let result = "";
        // finds the next letter to return as the column value
        while (col >= 0) {
            result = String.fromCharCode((col % 26) + 65) + result;
            col = Math.floor(col / 26) - 1;
        }
        return result;
    }

    /**
     * Gets an Argument type from a publisher of all updates for a sheet and parses the updates into a SheetUpdateMap HashMap,
     * that has ref, term references that will be individually updated. 
     *
     * @returns returns SheetUpdateMap HashMap
     *
     * @author kris-amerman, rishavsarma5
     */
    public async applyUpdates(argument: Argument): Promise<SheetUpdateMap> {
        // parses updates list from the payload field by new-line delimiter
        const updates: string[] = argument.payload.split('\n');

        // Initializes an empty update map
        const sheetsMap: SheetUpdateMap = {};

        // Update each cell specified in the payload
        for (const update of updates) {
            if (update.trim()) { // Check if the update string is not empty or just whitespace
                const [ref, ...rest] = update.split(" ");
                const term = rest.join(" "); // Join the rest of the parts to handle cases with spaces in the term
                if (ref) {
                    sheetsMap[ref] = term;
                }
            }
        }

        return sheetsMap;
    }




}

export default SheetUpdateHandler;