import { IEvent } from './def/interface';
import { TEventInit } from './def/type';
import { EventPhase } from './def/enum';

export default class Event implements IEvent {
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

    constructor(type: string, eventInit?: TEventInit) {
        this.type = type;

        const options = eventInit || {};

        this.detail = options.detail;
        this.timeStamp = Date.now();

        this.bubbles = options.bubbles || false;
        this.cancelable = options.cancelable || false;

        this.eventPhase = EventPhase.NONE;
        this.cancelBubble = !this.bubbles;
        this.defaultPrevented = false;

        this.target = null;
        this.currentTarget = null;
    }

    preventDefault() {
        if (!this.cancelable) return;
        this.defaultPrevented = true;
    }

    stopPropagation() {
        this.cancelBubble = true;
    }
}
