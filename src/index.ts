import { cerror } from "./tools/Log";

import { UserScript } from "./UserScript";
import { start } from "repl";

(async () => {
    const kittenGame = await UserScript.waitForGame();

    const starterScript = UserScript.getDefaultInstance();

    starterScript.run();

})().catch(cerror);



