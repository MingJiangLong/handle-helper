export type Fn = (() => any) | (() => Promise<any>);
export type HandleFn = (data?: unknown, existHandle?: () => void) => void;
export type HandleOptions = {
    onHandleSuccess?: HandleSuccessFn | false;
    onHandleError?: HandleErrorFn | false;
    onHandleFinally?: HandleFinallyFn | false;
};
type HandleSuccessFn = (message: unknown, existHandle?: (message: unknown) => void) => void;
type HandleErrorFn = (error: unknown, existHandle?: (error: unknown) => void) => void;
type HandleFinallyFn = (existHandle?: () => void) => void;
export declare enum FnType {
    onHandleSuccess = "onHandleSuccess",
    onHandleError = "onHandleError",
    onHandleFinally = "onHandleFinally"
}
export declare class HandleHelper {
    private helperFns;
    /** 更新handle函数 */
    private updateHandelFn;
    /** 更新拦截函数执行错误函数 */
    updateHandleErrorFn(handle: (error?: unknown) => void): void;
    /** 更新拦截函数执行成功函数 */
    updateHandleSuccessFn(handle: (message?: unknown) => void): void;
    /** 更新拦截函数执行结束函数 */
    updateHandleFinallyFn(handle: () => void): void;
    getGlobalHandle(type: FnType): any;
    /**
     * 获取捕获函数
     * 优先handle options，再取通过update函数更新的handle
     * @param type
     * @param callbackOptions
     * @returns
     */
    private getHandleFnInfo;
    private invokeSuccessOrErrorHandle;
    private invokeSuccessHandle;
    private invokeErrorHandle;
    private invokeFinallyHandle;
    handle(fn: Fn, callbackOptions?: HandleOptions): void;
}
export declare const handleHelper: HandleHelper;
/**
 * 默认初始化
 */
export declare function updateHandleErrorFn(fn: (value: any) => void): void;
/**
 * 默认初始化
 */
export declare function updateHandleSuccessFn(fn: (value: any) => void): void;
/**
 * 默认初始化
 */
export declare function updateHandleFinallyFn(fn: () => void): void;
/**
 * 默认初始化的
 * @param fn
 * @param callbackOptions
 * @returns
 */
export declare function handle(fn: Fn, callbackOptions?: HandleOptions): void;
export {};
