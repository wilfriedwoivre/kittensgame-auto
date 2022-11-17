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
        name: string;
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