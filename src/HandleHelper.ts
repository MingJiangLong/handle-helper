type Fn = (() => any) | (() => Promise<any>)

type CallbackOptions = {
  onHandleSuccess?: (message?: unknown) => void
  onHandleError?: (error?: unknown) => void
  onHandleFinally?: () => void
}

type HandleOptions = {
  onHandleSuccess?: ((message?: unknown) => void) | boolean
  onHandleError?: ((error?: unknown) => void) | boolean
  onHandleFinally?: (() => void) | boolean
}

type Options = {
  showLog: boolean
}
enum FnType {
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
function isBoolean(value: any): value is boolean {
  return value === true || value === false
}

export class HandleHelper {
  private showLog = false
  private helperFns: CallbackOptions = {}

  constructor(options?: Options) {
    if (isBoolean(options?.showLog)) {
      this.showLog = !!options?.showLog
    }
  }

  private log(...args: any[]) {
    if (!this.showLog) return
    console.warn("[HandleHelper]:", ...args)
  }

  closeLog() {
    this.showLog = false
    this.log("关闭日志输出")
  }

  openLog() {
    this.showLog = true
    this.log("打开日志输出")
  }

  updateHandleErrorFn(handle: (error?: unknown) => void) {
    this.helperFns = {
      ...this.helperFns,
      onHandleError: handle,
    }
    this.log("已更新捕获执行失败函数")
  }

  getHandleFn(type: FnType, callbackOptions?: HandleOptions) {
    const tempOptionsHandle = callbackOptions?.[type]

    // 禁用处理函数
    if (tempOptionsHandle === false) return

    // 临时处理函数
    if (isFunction(tempOptionsHandle)) return tempOptionsHandle
    
    return this.helperFns?.[type]
  }

  handle(fn: Fn, callbackOptions?: HandleOptions) {
    let isSyncFn = true
    const onHandleSuccess = this.getHandleFn(
      FnType.onHandleSuccess,
      callbackOptions
    )
    const onHandleError = this.getHandleFn(
      FnType.onHandleError,
      callbackOptions
    )
    const onHandleFinally = this.getHandleFn(
      FnType.onHandleFinally,
      callbackOptions
    )

    try {
      const result = fn()
      if (isPromise(result)) {
        isSyncFn = false
        result.then(
          (success: any) => {
            this.handle(() => success, {
              onHandleSuccess,
              onHandleError,
              onHandleFinally,
            })
          },
          (error: unknown) => {
            this.handle(
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
        this.log(`函数执行成功`, result)
        if (!isFunction(onHandleSuccess)) return
        onHandleSuccess(result)
      }
    } catch (error) {
      this.log(`函数执行异常`, error)
      if (!isFunction(onHandleError)) {
        throw error
      }
      onHandleError(error)
    } finally {
      if (!isSyncFn) return
      this.log(`函数执行结束`)
      if (!isFunction(onHandleFinally)) return
      onHandleFinally()
    }
  }
}

const handleHelper = new HandleHelper()


/**
 * 默认初始化
 */
export function updateHandleErrorFn(fn: (value: any) => void) {
  handleHelper.updateHandleErrorFn(fn)
}

/**
 * 默认初始化的
 * @param fn
 * @param callbackOptions
 * @returns
 */
export function handle(fn: Fn, callbackOptions?: CallbackOptions) {
  handleHelper.handle(fn, callbackOptions)
}
