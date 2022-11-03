export type GamePage = {
    toggleScheme: (value: string) => void;
    console: {
        maxMessages: number;
    }
    msg: (msg: string, type: string, tag: string, noBullet: boolean) => { span: HTMLElement };
};