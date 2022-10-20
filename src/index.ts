import { Hello } from "./hello";
import { cerror } from "./tools/Log";

import { StarterScript } from "./StarterScript";
import { start } from "repl";

(async () => {
    const kittenGame = await StarterScript.waitForGame();

    const starterScript = StarterScript.getDefaultInstance();

    new Hello().hello("Kittens Manager");
    starterScript.run();

})().catch(cerror);



