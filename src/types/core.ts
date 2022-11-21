export type Button = {
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
        val: number;
        name: string;
        researched: true;
        unlocked: true;
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