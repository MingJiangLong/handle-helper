"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleHelper = exports.handle = exports.updateHandleFinallyFn = exports.updateHandleErrorFn = exports.updateHandleSuccessFn = void 0;
const ON_ERROR_FN = "__ON_HANDLE_ERROR__";
const ON_SUCCESS_FN = "__ON_HANDLE_SUCCESS__";
const ON_FINALLY_FN = "__ON_HANDLE_FINALLY__";
var FN_TYPE;
(function (FN_TYPE) {
    FN_TYPE[FN_TYPE["SUCCESS"] = ON_ERROR_FN] = "SUCCESS";
    FN_TYPE[FN_TYPE["ERROR"] = ON_SUCCESS_FN] = "ERROR";
    FN_TYPE[FN_TYPE["FINALLY"] = ON_FINALLY_FN] = "FINALLY";
})(FN_TYPE || (FN_TYPE = {}));
const HandleFns = {
    [ON_ERROR_FN]: undefined,
    [ON_SUCCESS_FN]: undefined,
    [ON_FINALLY_FN]: undefined,
};
/**
 * 更新捕获函数
 * @param fn
 * @param type
 * @returns
 */
function updateHandleFns(fn, type) {
    if (!isFunction(fn))
        return;
    HandleFns[type] = fn;
    window[type] = fn;
}
/**
 * 获取捕获函数
 * 优先使用传入的默认函数
 * 其次使用缓存
 * 最后使用window里面保存的
 * @param type
 * @param defaultFn
 * @returns
 */
function getHandleFn(type, defaultFn) {
    if (isFunction(defaultFn))
        return defaultFn;
    const fnInClass = HandleFns[type];
    if (isFunction(fnInClass))
        return fnInClass;
    const fnInWindow = window[type];
    if (isFunction(fnInWindow))
        return fnInWindow;
}
function isPromise(value) {
    return (value === null || value === void 0 ? void 0 : value.then) && typeof value.then === "function";
}
function isFunction(value) {
    return typeof value === "function";
}
function getOnErrorFn(callbackOptions) {
    if (callbackOptions === null || callbackOptions === void 0 ? void 0 : callbackOptions.tempDisableHandError)
        return;
    return getHandleFn(FN_TYPE.ERROR, callbackOptions === null || callbackOptions === void 0 ? void 0 : callbackOptions.onHandleError);
}
function getOnSuccessFn(callbackOptions) {
    if (callbackOptions === null || callbackOptions === void 0 ? void 0 : callbackOptions.tempDisableHandSuccess)
        return;
    return getHandleFn(FN_TYPE.SUCCESS, callbackOptions === null || callbackOptions === void 0 ? void 0 : callbackOptions.onHandleSuccess);
}
function getOnFinallyFn(callbackOptions) {
    if (callbackOptions === null || callbackOptions === void 0 ? void 0 : callbackOptions.tempDisableHandFinally)
        return;
    return getHandleFn(FN_TYPE.FINALLY, callbackOptions === null || callbackOptions === void 0 ? void 0 : callbackOptions.onHandleFinally);
}
function warn(...args) {
    if (!!!HandleHelper.showLog)
        return;
    console.warn("[HandleHelper]:", ...args);
}
/** 可导出函数 */
function updateHandleSuccessFn(fn) {
    updateHandleFns(fn, FN_TYPE.SUCCESS);
}
exports.updateHandleSuccessFn = updateHandleSuccessFn;
function updateHandleErrorFn(fn) {
    updateHandleFns(fn, FN_TYPE.ERROR);
}
exports.updateHandleErrorFn = updateHandleErrorFn;
function updateHandleFinallyFn(fn) {
    updateHandleFns(fn, FN_TYPE.FINALLY);
}
exports.updateHandleFinallyFn = updateHandleFinallyFn;
function handle(fn, callbackOptions) {
    let isSyncFn = true;
    const onHandleSuccess = getOnSuccessFn(callbackOptions);
    const onHandleError = getOnErrorFn(callbackOptions);
    const onHandleFinally = getOnFinallyFn(callbackOptions);
    try {
        const result = fn();
        if (isPromise(result)) {
            isSyncFn = false;
            return result.then((success) => {
                handle(() => success, {
                    onHandleSuccess,
                    onHandleError,
                    onHandleFinally,
                });
            }, (error) => {
                handle(() => {
                    throw error;
                }, {
                    onHandleSuccess,
                    onHandleError,
                    onHandleFinally,
                });
            });
        }
        else {
            if (!isFunction(onHandleSuccess))
                return;
            warn("handled success", result);
            onHandleSuccess(result);
        }
    }
    catch (error) {
        if (!isFunction(onHandleError)) {
            throw error;
        }
        warn("handled error", error);
        onHandleError(error);
    }
    finally {
        if (!isFunction(onHandleFinally) || !isSyncFn)
            return;
        warn("handled finally");
        return onHandleFinally();
    }
}
exports.handle = handle;
class HandleHelper {
    static updateHandleSuccessFn(fn) {
        updateHandleSuccessFn(fn);
    }
    static updateHandleErrorFn(fn) {
        updateHandleErrorFn(fn);
    }
    static updateHandleFinallyFn(fn) {
        updateHandleFinallyFn(fn);
    }
    static handle(fn, callbackOptions) {
        handle(fn, callbackOptions);
    }
}
exports.HandleHelper = HandleHelper;
HandleHelper.showLog = true;
