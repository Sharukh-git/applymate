declare module 'redis-info' {
  
  export type RedisInfo = {
    [key: string]: string | number;
  };

  
  const parse: (info: string) => RedisInfo;
  export default parse;
}
