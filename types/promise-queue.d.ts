/**
 * @hidden
 */
export declare class PromiseQueue {
    private concurrent;
    private queue;
    private running;
    constructor(concurrent?: number);
    private pump;
    add<T>(fn: () => Promise<T>): Promise<T>;
}
