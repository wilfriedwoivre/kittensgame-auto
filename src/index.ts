import { cerror } from "./tools/Log";

import { UserScript } from "./UserScript";

(async () => {
    const kittenGame = await UserScript.waitForGame();

    const starterScript = UserScript.getDefaultInstance();

    // @ts-expect-error Manipulating global containers is naughty, be we want to expose the script host.
    window.kittensAutoManager = starterScript;

    starterScript.run();

})().catch(cerror);



