interface Window {
  __ON_HANDLE_ERROR__?: Function
  __ON_HANDLE_SUCCESS__?: Function
  __ON_HANDLE_FINALLY__?: Function
  [k: string]: any
}
