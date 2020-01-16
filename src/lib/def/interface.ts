import { EventPhase } from './enum';

export interface IEvent {
    readonly type: string;
    readonly bubbles: boolean;
    readonly cancelable: boolean;
    readonly eventPhase: EventPhase;
    readonly currentTarget: any;
    readonly target: any;
    readonly timeStamp: number;
    readonly detail: any;

    cancelBubble: boolean;
    defaultPrevented: boolean;

    preventDefault: () => void;
    stopPropagation: () => void;
}
