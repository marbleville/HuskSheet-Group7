import { updatePublished } from "../../../server/src/functions/updatePublished";
import { getUpdatesForPublished } from "../../../server/src/functions/getUpdatesForPublished";
import { Argument } from "../../../types/types";
import { assembleTestArgumentObject, setupDB } from "../../utils"

describe("updatePublished", () => {
	it("checks to see if updatePublished inserts", async () => {
    //await updatePublished(assembleTestArgumentObject("rishav", "test1", "", "$A1 helloworld"));

    //const updates = (await getUpdatesForPublished(assembleTestArgumentObject("rishav", "test1", "0", ""))).payload.split('\n');
    //expect(updates[updates.length]).toEqual("$A1 hellworld");
    await setupDB();
  });
});
