interface Window {
  __ON_HANDLE_ERROR__?: Function
  __ON_HANDLE_SUCCESS__?: Function
  __ON_HANDLE_FINALLY__?: Function
}
type Fn = ((...value: any[]) => any) | ((...value: any[]) => Promise<any>)
type CallbackOptions = {
  tempDisableHandSuccess?: boolean
  tempDisableHandError?: boolean
  tempDisableHandFinally?: boolean
  onHandleSuccess?: Function
  onHandleError?: Function
  onHandleFinally?: Function
}
