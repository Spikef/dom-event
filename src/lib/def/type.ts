import { IEvent } from './interface';

export type TEventInit = {
    readonly bubbles?: boolean;
    readonly cancelable?: boolean;
    readonly detail?: any;
};

export type TEventCenter = {
    [index: string]: {
        listeners: Array<TListener>,
        options: Array<TConfig>,
    },
};

export type TListener = (e: IEvent) => any;

export type TOption = {
    once?: boolean,
    useCapture?: boolean,
    isDefault?: boolean,
};

export type TConfig = TOption & {
    currentTarget: any,
};
