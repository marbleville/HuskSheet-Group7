/**
 * Parse ref to get column and row.
 * 
 * @param {string} ref - the ref to parse
 * @returns {Object} - the column letter and row number
 *
 * @author rishavsarma5
 */
const getColAndRowFromRef = (ref: string): { col: string; row: number } => {
    const match = ref.match(/^\$?([A-Z]+)(\d+)$/);
    if (match) {
        const col: string = match[1];
        const row: number = parseInt(match[2]);
        return { col, row };
    } else {
        throw new Error("Invalid reference format");
    }
};

export default getColAndRowFromRef;