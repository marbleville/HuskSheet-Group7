import {getPublishers} from "../../../server/src/functions/getPublishers"

describe('getPublishers function', () => {
  it('should return an array of publishers with their sheets', async () => {

    jest.mock('../path/to/database/databaseInstance', () => ({
      query: jest.fn(() => [
        { username: 'publisher1' },
        { username: 'publisher2' },
      ]),
    }));

    // Mock the database
    jest.mock('../path/to/database/db', () => ({
      GetSheetRow: {},
    }));

    // Call the getPublishers function
    const publishers = await getPublishers();

    expect(Array.isArray(publishers)).toBe(true);

    publishers.forEach((publisher) => {
      expect(publisher).toHaveProperty('publisher');
      expect(publisher).toHaveProperty('sheet');
      expect(publisher).toHaveProperty('id');
      expect(publisher).toHaveProperty('payload');
    });
  });
});
