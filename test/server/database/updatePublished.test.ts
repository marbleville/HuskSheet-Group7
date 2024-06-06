import { updatePublished } from "../../../server/src/functions/updatePublished";
import { getUpdatesForSubscription } from "../../../server/src/functions/getUpdatesForSubscription";
import { Argument } from "../../../types/types";
import { assembleTestArgumentObject, setupDB } from "../../utils";

describe("updatePublished", () => {
	it("checks to see if updatePublished inserts in DB", async () => {
    await setupDB();
    
    const data: string = "$A1 helloworld";
    await updatePublished(assembleTestArgumentObject("rishav", "test1", "", data));

    //const updates = (await getUpdatesForSubscription(assembleTestArgumentObject("rishav", "test1", "0", ""))).payload.split('\n');
    //expect(updates[updates.length - 2]).toEqual("$A1 hellworld");
    const updates = await getUpdatesForSubscription(assembleTestArgumentObject("rishav", "test1", "1", ""));
    expect(updates.payload.split('\n').includes(data)).toEqual(true);
  });

	it("checks to see if updatePublished inserts in HashStore", async () => {
    await setupDB();

    const data: string = "$A1 helloworld";
    await updatePublished(assembleTestArgumentObject("rishav", "test1", "", data));

    const updates = await getUpdatesForSubscription(assembleTestArgumentObject("rishav", "test1", "0", ""));
    expect(updates.payload.split('\n').includes(data)).toEqual(true);
  });
});
