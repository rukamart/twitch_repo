import axios from "axios";

const getCache = (url, expire) => {
    const localCache = localStorage[url] ? JSON.parse(localStorage[url]) : null;
    if (
      localCache &&
      localCache.expire &&
      Date.now() - localCache.expire <= expire
    ) {
      return localCache;
    }
    return null;
  },
  setCache = (url, data) =>
    localStorage.setItem(url, JSON.stringify({ data, expire: Date.now() }));

export default {
  genericAxios(url, expire, headers) {
    if (expire && getCache(url, expire)) {
      return new Promise(resolve => resolve(getCache(url, expire).data));
    }
    return axios
      .get(url, {
        headers
      })
      .then(response => {
        if (expire) {
          setCache(url, response.data);
        }
        return response.data;
      })
      .catch(e => e);
  }
};
