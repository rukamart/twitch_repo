<template src="../search/index.html"></template>

<script>
import js from "../search/index";
import Loading from "vue-loading-overlay";
import config from "../../../config/index";
import "vue-loading-overlay/dist/vue-loading.css";
let timeout = null;

export default {
  data: () => ({
    selected: "",
    loading: false,
    posts: [],
    errors: [],
    stream: false,
    streamData: {},
    interval: null
  }),
  components: {
    Loading
  },

  methods: {
    // Generic get func
    axiosFunc: function(
      url,
      viewers = false,
      loading = true,
      expire = config.expire
    ) {
      this.loading = loading;
      js.genericAxios(url, expire, config.headers)
        .then(response => {
          if (!viewers) {
            this.loading = false;
            this.posts = response.streams;
          } else {
            this.streamData.viewers = response.stream.viewers;
          }
        })
        .catch(e => {
          this.loading = false;
          this.errors.push(e);
        });
    },

    // When change number of itmes per page
    changeItem: function() {
      localStorage.selected = this.selected;
      if (localStorage.query) {
        this.axiosFunc(
          `${config.search_streams}?query=${localStorage.query}&limit=${
            this.selected
          }`
        );
      } else {
        this.axiosFunc(`${config.streams}?limit=${this.selected}`);
      }
    },

    // return to the main list
    backToList: function() {
      this.stream = false;
      if (localStorage.query) {
        this.axiosFunc(`${config.search_streams}?query=${localStorage.query}`);
      } else {
        this.axiosFunc(`${config.streams}?limit=${this.selected}`);
      }
    },

    // click the button to the stream
    getViewers: function(id) {
      this.axiosFunc(`${config.viewers}${id}`, true, false, 3000);
    },

    // click the button to the stream
    clickItem: function(post) {
      this.stream = `${config.channel}?channel=${post.channel.name}&muted=true`;
      this.streamData = {
        title: post.game,
        description: post.channel.status,
        viewers: post.viewers
      };
      this.interval = setInterval(
        function() {
          this.getViewers(post.channel._id);
        }.bind(this),
        config.viewers_timmer
      );
    },

    //Search engine
    keyup: function(name) {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        this.stream = false;
        localStorage.query = name;
        if (name.length > 0) {
          this.axiosFunc(
            `${config.search_streams}?query=${name}&limit=${this.selected}`
          );
        } else {
          this.changeItem();
        }
        // wait one second for the end of word
      }, config.keyup_wait);
    }
  },

  beforeDestroy: function() {
    clearInterval(this.interval);
  },

  //on init
  mounted() {
    this.selected = localStorage.selected ? localStorage.selected : 12;
    localStorage.query = "";
    this.changeItem();
  }
};
</script>

<style>
@import "../search/index.css";
</style>
