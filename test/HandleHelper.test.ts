import { HandleHelper } from "../src/HandleHelper"
const {} = require("")
const handleHelper = new HandleHelper()

let successHandleInvoke = false
let errorHandleInvoke = false
let finallyHandleInvoke = false
let [first, second] = [1, 2]
handleHelper.updateHandleSuccessFn(() => {
  successHandleInvoke = true
})
handleHelper.updateHandleErrorFn(() => {
  errorHandleInvoke = true
})
handleHelper.updateHandleFinallyFn(() => {
  second++
  finallyHandleInvoke = true
})

describe("Handle-Helper", () => {
  describe("同步函数测试", () => {
    describe("onHandleSuccess", () => {
      function syncFnWithNothing() {}
      test("成功调用onHandleSuccess", () => {
        successHandleInvoke = false
        handleHelper.handle(syncFnWithNothing)
        expect(successHandleInvoke).toEqual(true)
      })
      test("调用临时onHandleSuccess", () => {
        successHandleInvoke = false
        handleHelper.handle(syncFnWithNothing, { onHandleSuccess() {} })
        expect(successHandleInvoke).toEqual(false)
      })
      test("禁用onHandleSuccess", () => {
        successHandleInvoke = false
        handleHelper.handle(syncFnWithNothing, { onHandleSuccess: false })
        expect(successHandleInvoke).toEqual(false)
      })
    })

    describe("onHandleError", () => {
      function syncFnWithError() {
        throw new Error("error")
      }
      test("成功调用onHandleError", () => {
        errorHandleInvoke = false
        handleHelper.handle(syncFnWithError)
        expect(errorHandleInvoke).toEqual(true)
      })
      test("成功调用临时onHandleError", () => {
        errorHandleInvoke = false
        handleHelper.handle(syncFnWithError, { onHandleError() {} })
        expect(errorHandleInvoke).toEqual(false)
      })
      test("禁用onHandleError", () => {
        expect(() =>
          handleHelper.handle(syncFnWithError, { onHandleError: false })
        ).toThrow(Error)
      })
    })

    describe("onHandleFinally", () => {
      test("无异常函数,成功调用onHandleFinally", () => {
        first = 1
        second = 2
        function testFn() {
          first++
        }
        handleHelper.handle(testFn)
        expect(first).toBeLessThan(second)
      })
      test("无异常函数,成功调用临时onHandleFinally", () => {
        first = 1
        second = 2
        function testFn() {
          first++
        }
        handleHelper.handle(testFn, {
          onHandleFinally() {
            second++
          },
        })
        expect(first).toBeLessThan(second)
      })
      test("无异常函数,禁用onHandleFinally", () => {
        first = 1
        second = 2

        function testFn() {
          first++
        }
        handleHelper.handle(testFn, {
          onHandleFinally: false,
        })

        expect(first).toEqual(second)
      })
      test("有异常函数,成功调用onHandleFinally", () => {
        first = 1
        second = 2
        function testFn() {
          first++
          throw new Error()
        }
        handleHelper.handle(testFn, {
          onHandleError() {},
        })
        expect(first).toBeLessThan(second)
      })
      test("有异常函数,成功调用临时onHandleFinally", () => {
        first = 1
        second = 2
        function testFn() {
          first++
          throw new Error()
        }
        handleHelper.handle(testFn, {
          onHandleFinally() {
            second++
          },
          onHandleError() {},
        })
        expect(first).toBeLessThan(second)
      })
      test("有异常函数,禁用onHandleFinally", () => {
        first = 1
        second = 2
        function testFn() {
          first++
          throw new Error()
        }
        handleHelper.handle(testFn, {
          onHandleFinally: false,
          onHandleError() {},
        })
        expect(first).toEqual(second)
      })
    })
  })
  describe("Promise测试", () => {
    async function test() {
      await test1()
      await test2()
    }

    function test1() {
      return new Promise((s, e) => {
        setTimeout(() => {
          s(true)
        }, 3000)
      })
    }
    function test2() {
      return new Promise((s, e) => {
        setTimeout(() => {
          s(true)
        }, 3000)
      })
    }

    handleHelper.handle(test1, {
      onHandleSuccess() {},
    })
  })
})
