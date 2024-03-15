"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = exports.updateHandleFinallyFn = exports.updateHandleSuccessFn = exports.updateHandleErrorFn = exports.handleHelper = exports.HandleHelper = exports.FnType = void 0;
var FnType;
(function (FnType) {
    FnType["onHandleSuccess"] = "onHandleSuccess";
    FnType["onHandleError"] = "onHandleError";
    FnType["onHandleFinally"] = "onHandleFinally";
})(FnType = exports.FnType || (exports.FnType = {}));
function isPromise(value) {
    return (value === null || value === void 0 ? void 0 : value.then) && typeof value.then === "function";
}
function isFunction(value) {
    return typeof value === "function";
}
const TEMP_HANDLE = "temp_handle";
const GLOBAL_HANDLE = "global_handle";
const DISABLE_HANDLE = "disable_handle";
class HandleHelper {
    constructor() {
        this.helperFns = {};
    }
    /** 更新handle函数 */
    updateHandelFn(type, handle) {
        this.helperFns = Object.assign(Object.assign({}, this.helperFns), { [type]: handle });
    }
    /** 更新拦截函数执行错误函数 */
    updateHandleErrorFn(handle) {
        this.updateHandelFn(FnType.onHandleError, handle);
    }
    /** 更新拦截函数执行成功函数 */
    updateHandleSuccessFn(handle) {
        this.updateHandelFn(FnType.onHandleSuccess, handle);
    }
    /** 更新拦截函数执行结束函数 */
    updateHandleFinallyFn(handle) {
        this.updateHandelFn(FnType.onHandleFinally, handle);
    }
    getGlobalHandle(type) {
        return this.helperFns[type];
    }
    /**
     * 获取捕获函数
     * 优先handle options，再取通过update函数更新的handle
     * @param type
     * @param callbackOptions
     * @returns
     */
    getHandleFnInfo(type, callbackOptions) {
        var _a;
        const tempOptionsHandle = callbackOptions === null || callbackOptions === void 0 ? void 0 : callbackOptions[type];
        if (tempOptionsHandle === false) {
            return {
                type: DISABLE_HANDLE,
                callback: undefined,
            };
        }
        if (isFunction(tempOptionsHandle)) {
            return {
                type: TEMP_HANDLE,
                callback: tempOptionsHandle,
            };
        }
        let existHandle = (_a = this.helperFns) === null || _a === void 0 ? void 0 : _a[type];
        if (isFunction(existHandle)) {
            return {
                type: GLOBAL_HANDLE,
                callback: existHandle,
            };
        }
    }
    invokeSuccessOrErrorHandle(type, callbackOptions, result) {
        const handleInfo = this.getHandleFnInfo(type, callbackOptions);
        let callback = handleInfo === null || handleInfo === void 0 ? void 0 : handleInfo.callback;
        let callbackType = handleInfo === null || handleInfo === void 0 ? void 0 : handleInfo.type;
        if (callbackType === TEMP_HANDLE && isFunction(callback))
            return callback(result, this.getGlobalHandle(type));
        if (callbackType === GLOBAL_HANDLE && isFunction(callback))
            return callback(result);
        if (type == FnType.onHandleError)
            throw result;
    }
    invokeSuccessHandle(callbackOptions, result) {
        this.invokeSuccessOrErrorHandle(FnType.onHandleSuccess, callbackOptions, result);
    }
    invokeErrorHandle(callbackOptions, error) {
        this.invokeSuccessOrErrorHandle(FnType.onHandleError, callbackOptions, error);
    }
    invokeFinallyHandle(callbackOptions) {
        const handleInfo = this.getHandleFnInfo(FnType.onHandleFinally, callbackOptions);
        let callback = handleInfo === null || handleInfo === void 0 ? void 0 : handleInfo.callback;
        let callbackType = handleInfo === null || handleInfo === void 0 ? void 0 : handleInfo.type;
        if (callbackType === TEMP_HANDLE && isFunction(callback))
            return callback(this.getGlobalHandle(FnType.onHandleFinally));
        if (callbackType === GLOBAL_HANDLE && isFunction(callback))
            return callback();
    }
    handle(fn, callbackOptions) {
        let isSyncFn = true;
        try {
            const result = fn();
            if (isPromise(result)) {
                isSyncFn = false;
                result.then((success) => {
                    this.handle(() => success, callbackOptions);
                }, (error) => {
                    this.handle(() => {
                        throw error;
                    }, callbackOptions);
                });
            }
            else {
                this.invokeSuccessHandle(callbackOptions, result);
            }
        }
        catch (error) {
            this.invokeErrorHandle(callbackOptions, error);
        }
        finally {
            if (!isSyncFn)
                return;
            this.invokeFinallyHandle(callbackOptions);
        }
    }
}
exports.HandleHelper = HandleHelper;
exports.handleHelper = new HandleHelper();
/**
 * 默认初始化
 */
function updateHandleErrorFn(fn) {
    exports.handleHelper.updateHandleErrorFn(fn);
}
exports.updateHandleErrorFn = updateHandleErrorFn;
/**
 * 默认初始化
 */
function updateHandleSuccessFn(fn) {
    exports.handleHelper.updateHandleErrorFn(fn);
}
exports.updateHandleSuccessFn = updateHandleSuccessFn;
/**
 * 默认初始化
 */
function updateHandleFinallyFn(fn) {
    exports.handleHelper.updateHandleFinallyFn(fn);
}
exports.updateHandleFinallyFn = updateHandleFinallyFn;
/**
 * 默认初始化的
 * @param fn
 * @param callbackOptions
 * @returns
 */
function handle(fn, callbackOptions) {
    exports.handleHelper.handle(fn, callbackOptions);
}
exports.handle = handle;
