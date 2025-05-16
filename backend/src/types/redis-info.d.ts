declare module 'redis-info' {
  // Fallback to "any" type for now to unblock build
  const redisInfo: any;
  export = redisInfo;
}
