import {Publisher, Argument } from "../types/types";

/**
 * Creates a publisher with the client name 
 * 
 * @param argument The argument object containing the publisher and the sheet name
 * 
 * @author eduardo-ruiz-garay
 */
function register(argument: Argument) : void {
    /**
     * Added the publisher name as new user. Have to confirm it works with
     */
    let publisher: Publisher = argument.publisher;

}
export {register};