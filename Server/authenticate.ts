/**
 *
 * @param {String} username - The username of the user
 * @param {String} password - The password of the user
 *
 * @returns {Boolean} - True if the user is authenticated, false otherwise
 *
 * @author: marbleville
 */
function authenticate(authHeader: string | undefined): boolean {
	if (!authHeader) {
		return false;
	}

	return true;
}

export { authenticate };
