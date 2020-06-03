import { useEffect } from 'react';
import LRU from 'lru-cache';
import { NextPageContext } from 'next';
import { NextRouter } from 'next/router';

const isServer = typeof window === 'undefined';
const DEFAULT_CACHE_KEY = 'CACHE';

type InitClientCacheParams = {
  lruConfig?: Record<string, any>;
  genCacheKeyStrate?: (context: NextPageContext) => string;
}

/**
 * 方法说明 这是一个初始化缓存的方法，不使用Class类是为了兼容自定义Hook
 * @param {参数类型} lruConfig 自定义LRU 配置
 * @param {参数类型} genCacheKeyStrate 自定义获取LRU的key值方法,不传则使用默认key值
 */
function initClientCache(params?: InitClientCacheParams) {
  const { lruConfig = {}, genCacheKeyStrate } = params || {};

  // 默认10分钟缓存
  const { maxAge = 1000 * 60 *10, ...restConfig } = lruConfig;
  const lruCache = new LRU({ maxAge, ...restConfig });

  // 根据传入的方法获取缓存字段的key或者根据默认字段获取
  const getCacheKey = (context?: NextPageContext) => {
    return genCacheKeyStrate && context ? genCacheKeyStrate(context) : DEFAULT_CACHE_KEY;
  }

  // 包装组件的getInitial方法,统一判断在客户端设置缓存
  const cache = (fn: any) => {
    // 服务端不能保留缓存 会在多个用户之间共享
    if (isServer) {
      return fn;
    }

    return async (...args: any[]) => {
      const key = getCacheKey(...args);
      const cached = lruCache.get(key);
      // 如果已经有缓存数据，则直接返回
      if (cached) {
        return cached;
      }
      // 获取getInitialProps返回的数据set到缓存中
      const result = await fn(...args);
      lruCache.set(key, result);
      return result;
    }
  }

  // 根据key存储缓存数据
  const setCache = (key: string, cachedData: any) => {
    lruCache.set(key, cachedData);
  }

  // 页面刷新后，客户端先直接访问页面而不是调用getInitialProps，这时候需要手动设置缓存数据
  const useCache = (key: string, cachedData: any) => { 
    useEffect(() => {
      if (!isServer) {
        setCache(key, cachedData);
      }
    }, [])
  }

  return {
    cache,
    useCache,
    setCache,
  }

}

// 获取Detial相关页面的缓存数据的key值
const genDetailCacheKey = (ctxOrRouter: NextPageContext|NextRouter) => {
  const { query, pathname } = ctxOrRouter
  const { owner, name } = query
  return `${pathname}-${owner}-${name}`
}

// 获取query参数中的属性键值来组成缓存的key值
const genCacheKeyByQuery = (query: Record<string, string|number>) => {
  return Object.keys(query).reduce((prev, cur) => {
    prev += query[cur]
    return prev
  }, '');
}

export {
  initClientCache,
  genDetailCacheKey,
  genCacheKeyByQuery
};
