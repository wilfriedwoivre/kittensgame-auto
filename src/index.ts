import { Hello } from "./hello";
import { cerror } from "./tools/Log";

import { StarterScript } from "./StarterScript";

(async () => {
    const kittenGame = await StarterScript.waitForGame();

    const hello = new Hello();

    hello.hello();
    hello.hello("kittens");
})().catch(cerror);



