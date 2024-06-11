import { Argument } from "../../types/types";
import { getColumnNumber } from "./utils";

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
  private currRowSize: number = 0;
  private currColSize: number = 0;

  /**
   * Creates a new instance of SheetUpdateHandler.
   *
   * @author rishavsarma5
   */
  public constructor() {}

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

  public setSheetSize(row: number, col: number): void {
    this.currRowSize = row;
    this.currColSize = col;
  }

  public getUpdatedSheetSize(): {
    updatedSheetRow: number;
    updatedSheetCol: number;
  } {
    const updatedSheetRow = this.currRowSize;
    const updatedSheetCol = this.currColSize;
    return { updatedSheetRow, updatedSheetCol };
  }

  private getColAndRowFromRef(ref: string): { col: string; row: number } {
    // Define a regular expression to capture the column letter(s) and the row number
    const match = ref.match(/^\$?([A-Z]+)(\d+)$/);

    // Check if the reference matches the expected format
    if (match) {
      const col: string = match[1];
      const row: number = parseInt(match[2]);
      return { col, row };
    } else {
      throw new Error("Invalid reference format");
    }
  }


  /**
   * Gets an Argument type from a publisher of all updates for a sheet and parses the updates into a SheetUpdateMap HashMap,
   * that has ref, term references that will be individually updated.
   *
   * @returns returns SheetUpdateMap HashMap
   *
   * @author kris-amerman
   */
  public async applyUpdates(argument: Argument): Promise<SheetUpdateMap> {
    // parses updates list from the payload field by new-line delimiter
    const updates: string[] = argument.payload.split("\n");

    // Initializes an empty update map
    const sheetsMap: SheetUpdateMap = {};

    // Update each cell specified in the payload
    for (const update of updates) {
      if (update.trim()) {
        // Check if the update string is not empty or just whitespace
        const [ref, ...rest] = update.split(" ");
        const term = rest.join(" "); // Join the rest of the parts to handle cases with spaces in the term
        if (ref) {
          if (this.currRowSize === 0 || this.currColSize === 0) {
            throw new Error("Sheet Update Handler rows and columns not set!");
          }

          const { col, row } = this.getColAndRowFromRef(ref);
          const colNumber = getColumnNumber(col);

          if (colNumber > this.currColSize) {
            this.currColSize += colNumber - this.currColSize;
          } 
          if (row > this.currRowSize) {
            this.currRowSize += row - this.currRowSize;
          }
            
          sheetsMap[ref] = term;
        }
      }
    }

    return sheetsMap;
  }
}

export default SheetUpdateHandler;
