
# Handle-Helper

handle-helper which is a simple tool to centralized handling of function execution results

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
  
- handleHelper
- handle
- updateHandleErrorFn
- updateHandleSuccessFn
- updateHandleFinallyFn

### Initialization

  you can renew an instance of `HandleHelper`, or you can directly use `handleHelper` which is a global instance of `HandleHelper`

```js
import { updateHandleErrorFn, updateHandleSuccessFn，HandleHelper,handleHelper } from 'handle-helper';

const handleHelper = new HandleHelper();

```

### Usage

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

handle(fnWhenError) //  error
handleHelper.handle(fnWhenError)

handle(fnWithMessageReturn) // finished
handleHelper.handle(fnWithMessageReturn)

handle(chainedPromise) // finished
handleHelper.handle(chainedPromise)
```
