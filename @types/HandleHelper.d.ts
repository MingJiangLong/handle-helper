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
declare enum FnType {
    onHandleSuccess = "onHandleSuccess",
    onHandleError = "onHandleError",
    onHandleFinally = "onHandleFinally"
}
export declare class HandleHelper {
    private showLog;
    private helperFns;
    constructor(options?: Options);
    private log;
    closeLog(): void;
    openLog(): void;
    updateHandleErrorFn(handle: (error?: unknown) => void): void;
    getHandleFn(type: FnType, callbackOptions?: HandleOptions): ((message?: unknown) => void) | undefined;
    handle(fn: Fn, callbackOptions?: HandleOptions): void;
}
/**
 * 默认初始化
 */
export declare function updateHandleErrorFn(fn: (value: any) => void): void;
/**
 * 默认初始化的
 * @param fn
 * @param callbackOptions
 * @returns
 */
export declare function handle(fn: Fn, callbackOptions?: CallbackOptions): void;
export {};
