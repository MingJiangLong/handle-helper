
# Handle-Helper

handle-helper是一个统一处理同步函数和异步函数异常的简易工具

## Getting Started

### Installation

```console
npm install handle-helper
```

### API

- HandleHelper

  - handle
  - updateHandleErrorFn
  - updateHandleSuccessFn
  - updateHandleFinallyFn
  - showLog
  
- handle
- updateHandleErrorFn
- updateHandleSuccessFn
- updateHandleFinallyFn

### Initialization

  首先需要初始化统一拦截函数,最好是项目入口。

```js
import { updateHandleErrorFn, updateHandleSuccessFn } from 'handle-helper';

/** 初始化拦截异常错误的函数 */
updateHandleErrorFn((error: any) => {
  if (error?.message) {
    console.log(error.message)
  }
});

/** 初始化成功执行函数 */
updateHandleSuccessFn(message => {
  if (typeof message == 'string') {
    console.log(message)
  }
});

```

### Usage

当拦截异步函数异常时，异步函数需要满足PromiseA+规范

```javascript
import { handle } from 'handle-helper';

function fnWhenError(){
  throw new Error("error")
}

function fnWithMessageReturn(){
  return 'finished'
}

// Promise

function promiseFnWhenError(){
  return new Promise((s,e)=>{
    return e(new Error("error"))
  })
}

function promiseFnWithSuccessMessage(){
    return new Promise((s,e)=>{
    return s("hello world")
  })
}

async function asyncAwaitFn(){
  await promiseFnWithSuccessMessage()
  throw new Error("asyncAwaitFn error")
}

handle(fnWhenError) // 控制台会打印 error

handle(fnWithMessageReturn) // 控制台答应 finished

```
