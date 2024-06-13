/**
 * Helper to get the letter of the column.
 * Starts from 'A ... Z, then 'AA ... AZ', etc.
 *
 * @param {number} col - number representation of column
 * 
 * @author rishavsarma5
 */
const getHeaderLetter = (col: number): string => {
    let currentCol = col;
    let letters = "";
    while (currentCol >= 0) {
        const remainder = currentCol % 26;
        letters = String.fromCharCode(65 + remainder) + letters;
        currentCol = Math.floor(currentCol / 26) - 1;
    }

    return letters;
};

export default getHeaderLetter;