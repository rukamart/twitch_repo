<template>
  <div>
    <scale-loader
      class="center"
      :loading="loading"
      color="#cc181e"
      size="20"
    ></scale-loader>
    <ul v-if="posts && posts.length">
      <table class="table table-striped">
        <tbody>
          <tr v-for="(post, key) in posts" :key="key">
            <td>{{ post.game }}</td>
            <td>{{ post.viewers }}</td>
            <td>{{ post.channel.name }}</td>
            <a :href="post.channel.url">
              <img
                border="0"
                :alt="post.games"
                :src="post.preview.small"
                width="100"
                height="100"
              />
            </a>
          </tr>
        </tbody>
      </table>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import ScaleLoader from "vue-spinner/src/ScaleLoader.vue";

export default {
  components: {
    ScaleLoader
  },
  data: () => ({
    loading: false,
    posts: [],
    errors: [],
    items: [],
    id: 0
  }),

  methods: {
    keyup: function(value, id) {
      this.id = id;
      axios.get(`https://api.twitch.tv/kraken/search/streams?query=${value}`, {
        headers: { "Client-ID": "wkulgh1k6i4dcide9mq2ruhij1qc7q" }
      });
      axios
        .get(`http://0.0.0.0:8888/v1/autocomplete?q=${value}`)
        .then(response => {
          this.items = response.data;
        })
        .catch(e => {
          this.errors.push(e);
        });
    }
  },

  mounted() {
    this.loading = true;
    axios
      .get("https://api.twitch.tv/kraken/streams", {
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
  }
};
</script>
