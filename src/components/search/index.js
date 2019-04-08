import axios from "axios";

var method = {
  genericAxios(url) {
    return axios
      .get(url, {
        headers: {
          "Client-ID": "wkulgh1k6i4dcide9mq2ruhij1qc7q",
          Accept: "application/vnd.twitchtv.v5+json"
        }
      })
      .then(response => response.data)
      .catch(e => e);
  }
};

export default method;
