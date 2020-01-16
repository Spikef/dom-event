import { EventPhase } from './def/enum';
import { IEvent } from './def/interface';
import { TConfig, TListener, TOption } from './def/type';

import EventEmitter from './event-emitter';

export default class EventTarget {
    private readonly parent: EventTarget | null;
    private readonly children: EventTarget[];

    private target: any;
    private events: EventEmitter;
    private defaults: EventEmitter;

    constructor(parent?: EventTarget) {
        this.parent = parent || null;
        this.children = [];

        if (parent) {
            parent.children.push(this);
        }

        this.target = this;
        this.events = new EventEmitter();
        this.defaults = new EventEmitter();
    }

    bindTarget(target: any) {
        this.target = target;

        Object.defineProperty(this.target, '__event_binding__', {
            configurable: false,
            enumerable: false,
            value: this,
        });
    }

    bindDefault(type: string, listener: TListener) {
        const target: any = this.target || this;
        const listenerConfig: TConfig = { currentTarget: target, isDefault: true, };
        this.defaults.on(type, listener, listenerConfig);
    }

    addEventListener(type: string, listener: TListener, options?: TOption | boolean) {
        const target: any = this.target || this;
        const listenerConfig: TConfig = { currentTarget: target };
        if (options === undefined) {
            listenerConfig.once = false;
            listenerConfig.useCapture = false;
        } else if (typeof options === 'boolean') {
            listenerConfig.once = false;
            listenerConfig.useCapture = options;
        } else if (options) {
            listenerConfig.once = options.once;
            listenerConfig.useCapture = options.useCapture;
        }

        this.events.on(type, listener, listenerConfig);
    }

    removeEventListener(type: string, listener: TListener) {
        this.events.off(type, listener);
    }

    dispatchEvent(event: IEvent): boolean {
        function updateEventPhase(phase: EventPhase) {
            Object.defineProperty(event, 'eventPhase', {
                configurable: true,
                enumerable: true,
                value: phase,
            });
        }

        const target: any = this.target || this;
        Object.defineProperty(event, 'target', {
            configurable: false,
            enumerable: true,
            value: target,
        });

        let path: Array<EventTarget> = [];
        let node: EventTarget | null = this;
        while (node) {
            path.push(node);
            node = node.parent;
        }

        // capture
        updateEventPhase(EventPhase.CAPTURING_PHASE);
        for (let i = path.length - 1; i > 0; i--) {
            path[i].events.emit(event.type, event);
        }

        // target
        updateEventPhase(EventPhase.AT_TARGET);
        this.events.emit(event.type, event);
        this.defaults.emit(event.type, event);

        // bubble
        updateEventPhase(EventPhase.BUBBLING_PHASE);
        for (let i = 1; i < path.length; i++) {
            if (event.cancelBubble) break;
            path[i].events.emit(event.type, event);
            path[i].defaults.emit(event.type, event);
        }

        Object.defineProperty(event, 'currentTarget', {
            configurable: true,
            enumerable: true,
            value: null,
        });

        return true;
    }

    destroy() {
        this.children.forEach(child => child.destroy());
        if (this.parent) {
            const index = this.parent.children.indexOf(this);
            !!~index && this.parent.children.splice(index, 1);
        }
    }
}
