import { TConfig, TEventCenter, TListener } from './def/type';
import { IEvent } from './def/interface';
import { EventPhase } from './def/enum';

export default class EventEmitter {
    private readonly eventCenter: TEventCenter;

    constructor() {
        this.eventCenter = {};
    }

    on(event: string, listener: TListener, option: TConfig) {
        if (!this.eventCenter[event]) {
            this.eventCenter[event] = {
                listeners: [],
                options: [],
            };
        }

        const { listeners, options } = this.eventCenter[event];
        const index = listeners.indexOf(listener);
        if (index !== -1) {
            listeners.splice(index, 1);
            options.splice(index, 1);
        }
        listeners.push(listener);
        options.push(option);
    }

    off(event: string, listener: TListener) {
        if (!this.eventCenter[event]) return;

        const { listeners, options } = this.eventCenter[event];
        if (listeners && options) {
            const index = listeners.indexOf(listener);
            if (index !== -1) {
                listeners.splice(index, 1);
                options.splice(index, 1);
            }
        }
    }

    emit(event: string, e: IEvent) {
        if (!this.eventCenter[event]) return;

        const { listeners, options } = this.eventCenter[event];
        if (listeners) {
            const oneIndex:Array<number> = [];
            for (let i:number = 0; i < listeners.length; i++) {
                const { once, currentTarget, useCapture, isDefault } = options[i];
                if (
                    (isDefault && !e.defaultPrevented) ||
                    (!isDefault && (
                        (e.eventPhase === EventPhase.AT_TARGET) ||
                        (e.eventPhase === EventPhase.CAPTURING_PHASE && useCapture) ||
                        (e.eventPhase === EventPhase.BUBBLING_PHASE && !useCapture)
                    ))
                ) {
                    if (once) oneIndex.push(i);
                    Object.defineProperty(e, 'currentTarget', {
                        configurable: true,
                        enumerable: true,
                        value: currentTarget,
                    });
                    listeners[i](e);
                }
            }

            while (oneIndex.length) {
                // @ts-ignore: oneIndex.length makes sure that index isn't undefined
                const index:number = oneIndex.pop();
                listeners.splice(index, 1);
                options.splice(index, 1);
            }
        }
    }
}
