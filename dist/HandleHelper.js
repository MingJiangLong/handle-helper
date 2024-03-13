"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = exports.updateHandleFinallyFn = exports.updateHandleErrorFn = exports.updateHandleSuccessFn = exports.HandleHelper = void 0;
var FnType;
(function (FnType) {
    FnType["onHandleSuccess"] = "onHandleSuccess";
    FnType["onHandleError"] = "onHandleError";
    FnType["onHandleFinally"] = "onHandleFinally";
})(FnType || (FnType = {}));
function isPromise(value) {
    return (value === null || value === void 0 ? void 0 : value.then) && typeof value.then === "function";
}
function isFunction(value) {
    return typeof value === "function";
}
function isBoolean(value) {
    return value === true || value === false;
}
class HandleHelper {
    constructor(options) {
        this.showLog = false;
        this.helperFns = {};
        if (isBoolean(options === null || options === void 0 ? void 0 : options.showLog)) {
            this.showLog = !!(options === null || options === void 0 ? void 0 : options.showLog);
        }
    }
    log(...args) {
        if (!this.showLog)
            return;
        console.warn("[HandleHelper]:", ...args);
    }
    closeLog() {
        this.showLog = false;
        this.log("关闭日志输出");
    }
    openLog() {
        this.showLog = true;
        this.log("打开日志输出");
    }
    updateHandleSuccessFn(handle) {
        this.helperFns = Object.assign(Object.assign({}, this.helperFns), { onHandleSuccess: handle });
        this.log("已更新捕获成功执行函数");
    }
    updateHandleErrorFn(handle) {
        this.helperFns = Object.assign(Object.assign({}, this.helperFns), { onHandleError: handle });
        this.log("已更新捕获执行失败函数");
    }
    updateHandleFinallyFn(handle) {
        this.helperFns = Object.assign(Object.assign({}, this.helperFns), { onHandleFinally: handle });
        this.log("已更新捕获函数执行完成函数");
    }
    getHandleFn(type, callbackOptions) {
        var _a;
        const tempOptionsHandle = callbackOptions === null || callbackOptions === void 0 ? void 0 : callbackOptions[type];
        // 禁用处理函数
        if (tempOptionsHandle === false)
            return;
        // 临时处理函数
        if (isFunction(tempOptionsHandle))
            return tempOptionsHandle;
        return (_a = this.helperFns) === null || _a === void 0 ? void 0 : _a[type];
    }
    handle(fn, callbackOptions) {
        let isSyncFn = true;
        const onHandleSuccess = this.getHandleFn(FnType.onHandleSuccess, callbackOptions);
        const onHandleError = this.getHandleFn(FnType.onHandleError, callbackOptions);
        const onHandleFinally = this.getHandleFn(FnType.onHandleFinally, callbackOptions);
        try {
            const result = fn();
            if (isPromise(result)) {
                isSyncFn = false;
                result.then((success) => {
                    this.handle(() => success, {
                        onHandleSuccess,
                        onHandleError,
                        onHandleFinally,
                    });
                }, (error) => {
                    this.handle(() => {
                        throw error;
                    }, {
                        onHandleSuccess,
                        onHandleError,
                        onHandleFinally,
                    });
                });
            }
            else {
                this.log(`函数执行成功`, result);
                if (!isFunction(onHandleSuccess))
                    return;
                onHandleSuccess(result);
            }
        }
        catch (error) {
            this.log(`函数执行异常`, error);
            if (!isFunction(onHandleError)) {
                throw error;
            }
            onHandleError(error);
        }
        finally {
            if (!isSyncFn)
                return;
            this.log(`函数执行结束`);
            if (!isFunction(onHandleFinally))
                return;
            onHandleFinally();
        }
    }
}
exports.HandleHelper = HandleHelper;
const handleHelper = new HandleHelper();
/**
 * 默认初始化
 * @param fn
 */
function updateHandleSuccessFn(fn) {
    handleHelper.updateHandleSuccessFn(fn);
}
exports.updateHandleSuccessFn = updateHandleSuccessFn;
/**
 * 默认初始化
 */
function updateHandleErrorFn(fn) {
    handleHelper.updateHandleErrorFn(fn);
}
exports.updateHandleErrorFn = updateHandleErrorFn;
/**
 * 默认初始化
 * @param fn
 */
function updateHandleFinallyFn(fn) {
    handleHelper.updateHandleFinallyFn(fn);
}
exports.updateHandleFinallyFn = updateHandleFinallyFn;
/**
 * 默认初始化的
 * @param fn
 * @param callbackOptions
 * @returns
 */
function handle(fn, callbackOptions) {
    handleHelper.handle(fn, callbackOptions);
}
exports.handle = handle;
