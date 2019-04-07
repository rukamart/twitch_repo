<template>
  <div class="main">
    <!-- loading -->
    <loading :active.sync="loading" :is-full-page="true"></loading>
    <!-- Search -->
    <div class="range">
      <b-input-group>
        <b-input-group-prepend>
          <b-button v-if="stream" v-on:click="backToList()" >List</b-button>
        </b-input-group-prepend>
        <b-form-input v-on:keyup="keyup($event.target.value)"></b-form-input>
      </b-input-group>
    </div>
    <!-- Search Bar END -->
    <!-- Stream -->
    <div v-if="stream">
      <br>
      <br>
      <iframe
        :src="stream"
        height="720"
        width="1280"
        frameborder="0"
        scrolling="no"
        allowfullscreen="true"
      >
      </iframe>
    </div>
    <!-- Stream END -->
    <div v-else>
    <!-- Range per page -->
    <div class="range">
      <b-input-group
        v-on:change="changeItem()"
        :prepend="selected"
        append="50"
        class="mt-3"
      >
        <b-form-input
          v-model="selected"
          type="range"
          min="0"
          max="50"
        ></b-form-input>
      </b-input-group>
    </div>
    <!-- Range per page END -->
      <br>
      <br>
      <!-- List of Streams -->
      <div class="wrapper">
        <div class="menu" v-for="(post, key) in posts" :key="key">
          <b-card
            :title="post.game"
            :img-src="post.preview.medium"
            img-alt="Image"
            img-top
            tag="article"
            style="max-width: 20rem;"
            class="mb-2"
          >
            <b-card-text>{{ post.channel.status }}</b-card-text>
            <b-button
              v-on:click="clickItem(post.channel.name)"
              variant="primary"
              >Go to STREAM</b-button
            >
          </b-card>
        </div>
      </div>
      <!-- List of Streams END-->
    </div>
  </div>
</template>

<!-- <a v-on:click="clickItem(post.channel.name)" href="#">
  <img border="0" :alt="post.games" :src="post.preview.medium" />
</a> -->

<style>
.wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  grid-auto-rows: minmax(100px, auto);
}

.dropdown {
  position: absolute;
  right: 7%;
}

.menu {
  margin: auto;
}

.main {
  margin: 5%;
}

.range {
  margin: auto;
  width: 50%;
}
</style>

<script>
import axios from "axios";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
let timeout = null;

export default {
  data: () => ({
    selected: "",
    loading: false,
    posts: [],
    errors: [],
    stream: false
  }),
  components: {
    Loading
  },

  methods: {
    // Generic get func
    axiosFunc: function(url) {
      this.loading = true;
      axios
        .get(url, {
          headers: { "Client-ID": "wkulgh1k6i4dcide9mq2ruhij1qc7q" }
        })
        .then(response => {
          this.loading = false;
          this.posts = response.data.streams;
        })
        .catch(e => {
          this.loading = false;
          this.errors.push(e);
        });
    },

    // When change number of itmes per page
    changeItem: function() {
      localStorage.selected = this.selected;
      this.axiosFunc(
        `https://api.twitch.tv/kraken/streams?limit=${this.selected}`
      );
    },

    // return to the main list
    backToList: function() {
      this.stream = false;
      this.axiosFunc(
        `https://api.twitch.tv/kraken/streams?limit=${this.selected}`
      );
    },

    // click the button to the stream
    clickItem: function(name) {
      this.stream = `https://player.twitch.tv/?channel=${name}&muted=true`;
    },

    //Search engine
    keyup: function(name) {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        this.stream = false;
        if(name.length > 0){
          this.axiosFunc(
            `https://api.twitch.tv/kraken/search/streams?query=${name}`
          );
        } else {
          this.changeItem();
        }
      // wait one second for the end of word
      }, 1000);
    }
  },

  //on init
  mounted() {
    this.selected = localStorage.selected ? localStorage.selected : 12;
    this.changeItem();
  }
};
</script>
