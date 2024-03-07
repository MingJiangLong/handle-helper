type Fn = (() => any) | (() => Promise<any>);
type CallbackOptions = {
    onHandleSuccess?: (message?: unknown) => void;
    onHandleError?: (error?: unknown) => void;
    onHandleFinally?: () => void;
};
type HandleOptions = {
    onHandleSuccess?: ((message?: unknown) => void) | boolean;
    onHandleError?: ((error?: unknown) => void) | boolean;
    onHandleFinally?: (() => void) | boolean;
};
type Options = {
    showLog: boolean;
};
export declare class HandleHelper {
    private showLog;
    private helperFns;
    constructor(options?: Options);
    private log;
    closeLog(): void;
    openLog(): void;
    updateHandleSuccessFn(handle: (value?: unknown) => void): void;
    updateHandleErrorFn(handle: (error?: unknown) => void): void;
    updateHandleFinallyFn(handle: () => void): void;
    private getHandleFn;
    handle(fn: Fn, callbackOptions?: HandleOptions): Promise<void> | undefined;
}
/**
 * 默认初始化
 * @param fn
 */
export declare function updateHandleSuccessFn(fn: (value: any) => void): void;
/**
 * 默认初始化
 */
export declare function updateHandleErrorFn(fn: (value: any) => void): void;
/**
 * 默认初始化
 * @param fn
 */
export declare function updateHandleFinallyFn(fn: () => void): void;
/**
 * 默认初始化的
 * @param fn
 * @param callbackOptions
 * @returns
 */
export declare function handle(fn: () => Fn, callbackOptions?: CallbackOptions): void;
export {};
