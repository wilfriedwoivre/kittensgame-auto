export type Button = {
    add: {
        add: {
            link: HTMLLinkElement
        }
    }
    remove: {
        offAll: {
            link: HTMLLinkElement
        }
    }
    controller: {
        buyItem: (model: Model, event: any, callback: any) => void;
    }
    model: Model
}

export type Model = {
    enabled: boolean;
    prices: Price[];
    name: string;
    visible: boolean;
    metadata: {
        on: number;
        val: number;
        name: string;
        researched: boolean;
        unlocked: boolean;
        noStackable: boolean;
        effects: {
            coalPerTickAutoprod: number;
            goldPerTickAutoprod: number;
            ironPerTickAutoprod: number;
            titaniumPerTickAutoprod: number;
        }
    }
    craft: {
        name: string;
        prices: Price[];
        unlocked: boolean;
    }
}

export type Price = {
    name: string;
    val: number;
}


export type Kitten = {
    name: string;
    surname: string;
    age: number;
    exp: number;
    job: string;
}

export type Job = {
    name: string;
    unlocked: boolean;
}