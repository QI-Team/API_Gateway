export default interface Response {
  code: '0' | '1',
  info: object,
  msg: string,
}