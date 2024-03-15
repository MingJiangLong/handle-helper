export type Fn = (() => any) | (() => Promise<any>)

export type HandleFn = (data?: unknown, existHandle?: () => void) => void

export type HandleOptions = {
  onHandleSuccess?: HandleSuccessFn | false
  onHandleError?: HandleErrorFn | false
  onHandleFinally?: HandleFinallyFn | false
}

type HandleSuccessFn = (
  message: unknown,
  existHandle?: (message: unknown) => void
) => void

type HandleErrorFn = (
  error: unknown,
  existHandle?: (error: unknown) => void
) => void

type HandleFinallyFn = (existHandle?: () => void) => void
export enum FnType {
  onHandleSuccess = "onHandleSuccess",
  onHandleError = "onHandleError",
  onHandleFinally = "onHandleFinally",
}

function isPromise(value: any): value is Promise<any> {
  return value?.then && typeof value.then === "function"
}

function isFunction(value: any): value is Function {
  return typeof value === "function"
}

const TEMP_HANDLE = "temp_handle"
const GLOBAL_HANDLE = "global_handle"
const DISABLE_HANDLE = "disable_handle"
export class HandleHelper {
  private helperFns: HandleOptions = {}

  /** 更新handle函数 */
  private updateHandelFn(type: FnType, handle: (data?: unknown) => void) {
    this.helperFns = {
      ...this.helperFns,
      [type]: handle,
    }
  }

  /** 更新拦截函数执行错误函数 */
  updateHandleErrorFn(handle: (error?: unknown) => void) {
    this.updateHandelFn(FnType.onHandleError, handle)
  }

  /** 更新拦截函数执行成功函数 */
  updateHandleSuccessFn(handle: (message?: unknown) => void) {
    this.updateHandelFn(FnType.onHandleSuccess, handle)
  }

  /** 更新拦截函数执行结束函数 */
  updateHandleFinallyFn(handle: () => void) {
    this.updateHandelFn(FnType.onHandleFinally, handle)
  }

  getGlobalHandle(type: FnType): any {
    return this.helperFns[type]
  }

  /**
   * 获取捕获函数
   * 优先handle options，再取通过update函数更新的handle
   * @param type
   * @param callbackOptions
   * @returns
   */
  private getHandleFnInfo(type: FnType, callbackOptions?: HandleOptions) {
    const tempOptionsHandle = callbackOptions?.[type]
    if (tempOptionsHandle === false) {
      return {
        type: DISABLE_HANDLE,
        callback: undefined,
      }
    }

    if (isFunction(tempOptionsHandle)) {
      return {
        type: TEMP_HANDLE,
        callback: tempOptionsHandle,
      }
    }

    let existHandle = this.helperFns?.[type]

    if (isFunction(existHandle)) {
      return {
        type: GLOBAL_HANDLE,
        callback: existHandle,
      }
    }
  }

  private invokeSuccessOrErrorHandle(
    type: FnType,
    callbackOptions?: HandleOptions,
    result?: any
  ) {
    const handleInfo = this.getHandleFnInfo(type, callbackOptions)
    let callback = handleInfo?.callback
    let callbackType = handleInfo?.type

    if (callbackType === TEMP_HANDLE && isFunction(callback))
      return callback(result, this.getGlobalHandle(type))

    if (callbackType === GLOBAL_HANDLE && isFunction(callback))
      return callback(result)

    if (type == FnType.onHandleError) throw result
  }
  private invokeSuccessHandle(callbackOptions?: HandleOptions, result?: any) {
    this.invokeSuccessOrErrorHandle(
      FnType.onHandleSuccess,
      callbackOptions,
      result
    )
  }
  private invokeErrorHandle(callbackOptions?: HandleOptions, error?: any) {
    this.invokeSuccessOrErrorHandle(
      FnType.onHandleError,
      callbackOptions,
      error
    )
  }
  private invokeFinallyHandle(callbackOptions?: HandleOptions) {
    const handleInfo = this.getHandleFnInfo(
      FnType.onHandleFinally,
      callbackOptions
    )
    let callback = handleInfo?.callback as HandleFinallyFn
    let callbackType = handleInfo?.type

    if (callbackType === TEMP_HANDLE && isFunction(callback))
      return callback(this.getGlobalHandle(FnType.onHandleFinally))

    if (callbackType === GLOBAL_HANDLE && isFunction(callback))
      return callback()
  }

  handle(fn: Fn, callbackOptions?: HandleOptions) {
    let isSyncFn = true

    try {
      const result = fn()
      if (isPromise(result)) {
        isSyncFn = false
        result.then(
          (success: any) => {
            this.handle(() => success, callbackOptions)
          },
          (error: unknown) => {
            this.handle(() => {
              throw error
            }, callbackOptions)
          }
        )
      } else {
        this.invokeSuccessHandle(callbackOptions, result)
      }
    } catch (error) {
      this.invokeErrorHandle(callbackOptions, error)
    } finally {
      if (!isSyncFn) return
      this.invokeFinallyHandle(callbackOptions)
    }
  }
}

export const handleHelper = new HandleHelper()

/**
 * 默认初始化
 */
export function updateHandleErrorFn(fn: (value: any) => void) {
  handleHelper.updateHandleErrorFn(fn)
}

/**
 * 默认初始化
 */
export function updateHandleSuccessFn(fn: (value: any) => void) {
  handleHelper.updateHandleErrorFn(fn)
}

/**
 * 默认初始化
 */
export function updateHandleFinallyFn(fn: () => void) {
  handleHelper.updateHandleFinallyFn(fn)
}

/**
 * 默认初始化的
 * @param fn
 * @param callbackOptions
 * @returns
 */
export function handle(fn: Fn, callbackOptions?: HandleOptions) {
  handleHelper.handle(fn, callbackOptions)
}
