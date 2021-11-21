import { threadContext } from 'thread-context';

const debugLevel = require('debug-level'); // eslint-disable-line @typescript-eslint/no-var-requires

export * from 'thread-context';

export type DebuggerAction = (message: string, ...args: unknown[]) => void;
export type DebuggerErrorAction = (...args: unknown[]) => void;

export type Debug = {
    info: DebuggerAction;
    warn: DebuggerAction;
    debug: DebuggerAction;
    error: DebuggerErrorAction;
}

export type ExtendedDebug = Debug & {
    namespace: string;
    children: {[x: string]: ExtendedDebug};
};

function createDebugger(namespace: string): ExtendedDebug {
    const proxy = new Proxy<ExtendedDebug>(
        debugLevel(namespace),
        {
            get: (target: ExtendedDebug, key: PropertyKey): unknown => {

                let name: string = key.toString();
                if (name in target)
                    return (target as unknown as Record<string, unknown>)[name];

                if (name === 'thread')
                    name = `$${threadContext.threadId}`;
                name = namespace + ':' + name;

                if (!target.children)
                    target.children = {};
                if (!target.children[name]) {
                    target.children[name] = createDebugger(name);
                    target.children[name].namespace = name;
                }
                return target.children[name];
            },
        },
    );
    return proxy;
}

let debug;

export {
    debug,
}

export default function <T extends ExtendedDebug>(packageName: string): void {
    debug = createDebugger(packageName) as T;
}
