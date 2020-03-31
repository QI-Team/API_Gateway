export default interface RedisConfig {
  host: string,
  port: number,
  path?: string,
  url?: string,
  user?: string,
  password?: string,
  socket_keepalive?: boolean,
  others?: object[]
}