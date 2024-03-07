
# Handle-Helper

handle-helper是一个统一处理同步函数和异步函数异常的简易工具

## Getting Started

### Installation

```console
npm install handle-helper
```

### API

- HandleHelper Instance

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

  工具已经提供了一个HandleHelper的实例可以直接调用，也可以自己重新实例化一个HandleHelper

```js
import { updateHandleErrorFn, updateHandleSuccessFn，HandleHelper } from 'handle-helper';


/** 可以使用工具提供的实例的api,也可以重新实例化一个HandleHelper */
const handleHelper = new HandleHelper({showLog:false});

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

async function chainedPromise(){
  await promiseFnWithSuccessMessage()
  await promiseFnWhenError()
}

handle(fnWhenError) // 控制台会打印 error
handleHelper.handle(fnWhenError)

handle(fnWithMessageReturn) // 控制台答应 finished
handleHelper.handle(fnWithMessageReturn)

handle(chainedPromise) // 控制台答应 finished
handleHelper.handle(chainedPromise)
```
