declare module 'redis-info' {
  interface RedisInfo {
    [key: string]: string | number;
  }

  function parse(info: string): RedisInfo;

  export = parse;
}
