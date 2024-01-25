const ON_ERROR_FN = "__ON_HANDLE_ERROR__"
const ON_SUCCESS_FN = "__ON_HANDLE_SUCCESS__"
const ON_FINALLY_FN = "__ON_HANDLE_FINALLY__"

enum FN_TYPE {
  SUCCESS = ON_ERROR_FN,
  ERROR = ON_SUCCESS_FN,
  FINALLY = ON_FINALLY_FN,
}

const HandleFns: Record<FN_TYPE, Function | undefined> = {
  [ON_ERROR_FN]: undefined,
  [ON_SUCCESS_FN]: undefined,
  [ON_FINALLY_FN]: undefined,
}

/**
 * 更新捕获函数
 * @param fn
 * @param type
 * @returns
 */
function updateHandleFns(fn: Function, type: FN_TYPE) {
  if (!isFunction(fn)) return
  HandleFns[type] = fn
  window[type] = fn
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
function getHandleFn(type: FN_TYPE, defaultFn?: Function) {
  if (isFunction(defaultFn)) return defaultFn
  const fnInClass = HandleFns[type]
  if (isFunction(fnInClass)) return fnInClass
  const fnInWindow = window[type]
  if (isFunction(fnInWindow)) return fnInWindow
}

function isPromise(value: any): value is Promise<any> {
  return value?.then && typeof value.then === "function"
}

function isFunction(value: any): value is Function {
  return typeof value === "function"
}

function getOnErrorFn(callbackOptions?: CallbackOptions) {
  if (callbackOptions?.tempDisableHandError) return
  return getHandleFn(FN_TYPE.ERROR, callbackOptions?.onHandleError)
}

function getOnSuccessFn(callbackOptions?: CallbackOptions) {
  if (callbackOptions?.tempDisableHandSuccess) return
  return getHandleFn(FN_TYPE.SUCCESS, callbackOptions?.onHandleSuccess)
}

function getOnFinallyFn(callbackOptions?: CallbackOptions) {
  if (callbackOptions?.tempDisableHandFinally) return
  return getHandleFn(FN_TYPE.FINALLY, callbackOptions?.onHandleFinally)
}

function warn(...args: any) {
  if (!!!HandleHelper.showLog) return
  console.warn("[HandleHelper]:", ...args)
}

/** 可导出函数 */
export function updateHandleSuccessFn(fn: Function) {
  updateHandleFns(fn, FN_TYPE.SUCCESS)
}
export function updateHandleErrorFn(fn: Function) {
  updateHandleFns(fn, FN_TYPE.ERROR)
}
export function updateHandleFinallyFn(fn: Function) {
  updateHandleFns(fn, FN_TYPE.FINALLY)
}
export function handle(fn: Fn, callbackOptions?: CallbackOptions) {
  let isSyncFn = true
  const onHandleSuccess = getOnSuccessFn(callbackOptions)
  const onHandleError = getOnErrorFn(callbackOptions)
  const onHandleFinally = getOnFinallyFn(callbackOptions)
  try {
    const result = fn()
    if (isPromise(result)) {
      isSyncFn = false
      return result.then(
        (success: any) => {
          handle(() => success, {
            onHandleSuccess,
            onHandleError,
            onHandleFinally,
          })
        },
        (error: unknown) => {
          handle(
            () => {
              throw error
            },
            {
              onHandleSuccess,
              onHandleError,
              onHandleFinally,
            }
          )
        }
      )
    } else {
      if (!isFunction(onHandleSuccess)) return
      warn("handled success", result)
      onHandleSuccess(result)
    }
  } catch (error) {
    if (!isFunction(onHandleError)) {
      throw error
    }
    warn("handled error", error)
    onHandleError(error)
  } finally {
    if (!isFunction(onHandleFinally) || !isSyncFn) return
    warn("handled finally")
    return onHandleFinally()
  }
}

export class HandleHelper {
  static updateHandleSuccessFn(fn: Function) {
    updateHandleSuccessFn(fn)
  }
  static updateHandleErrorFn(fn: Function) {
    updateHandleErrorFn(fn)
  }
  static updateHandleFinallyFn(fn: Function) {
    updateHandleFinallyFn(fn)
  }
  static handle(fn: Fn, callbackOptions?: CallbackOptions) {
    handle(fn, callbackOptions)
  }
  static showLog = true
}
