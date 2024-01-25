/** 可导出函数 */
export declare function updateHandleSuccessFn(fn: Function): void;
export declare function updateHandleErrorFn(fn: Function): void;
export declare function updateHandleFinallyFn(fn: Function): void;
export declare function handle(fn: Fn, callbackOptions?: CallbackOptions): any;
export declare class HandleHelper {
    static updateHandleSuccessFn(fn: Function): void;
    static updateHandleErrorFn(fn: Function): void;
    static updateHandleFinallyFn(fn: Function): void;
    static handle(fn: Fn, callbackOptions?: CallbackOptions): void;
    static showLog: boolean;
}
