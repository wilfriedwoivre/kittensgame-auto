export class Hello {
    private static world = 'world'
    constructor() {}
    public hello(who: string = Hello.world) {
        console.log(`Hello ${who}`);
    }
}
