export default interface Response {
  code: '0' | '1', // '0': success, '1': failed
  info: object,
  msg: string,
}