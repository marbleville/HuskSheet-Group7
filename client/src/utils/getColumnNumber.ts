/**
 * Helper to get the number of the column.
 * 
 * @param {string} letter - the letter to convert a number
 * @returns {number} - the number representation of a column
 *
 * @author rishavsarma5
 */
const getColumnNumber = (letter: string): number => {
    let columnNumber = 0;
    for (let i = 0; i < letter.length; i++) {
        columnNumber = columnNumber * 26 + (letter.charCodeAt(i) - 65 + 1);
    }
    return columnNumber;
};

export default getColumnNumber;