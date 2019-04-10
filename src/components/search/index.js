import axios from "axios";

const expire = 20000,
  getCache = url => {
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
  setCache = (url, data) => localStorage.setItem(url, JSON.stringify({ data, expire: Date.now() }));

export default {
  genericAxios(url, expire = true) {
    if (expire && getCache(url)) {
      return new Promise(resolve => resolve(getCache(url).data));
    }
    return axios
      .get(url, {
        headers: {
          "Client-ID": "wkulgh1k6i4dcide9mq2ruhij1qc7q",
          Accept: "application/vnd.twitchtv.v5+json"
        }
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
