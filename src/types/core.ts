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
