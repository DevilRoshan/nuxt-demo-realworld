<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.image"
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.username"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="user.bio"
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.email"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.password"
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                />
              </fieldset>
              <button
                class="btn btn-lg btn-primary pull-xs-right"
                @click.prevent="onSubmit"
              >
                Update Settings
              </button>
            </fieldset>
          </form>
          <button class="btn btn-outline-danger" @click="logout">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { updateUser } from "@/api/user";
const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  name: "Settings",
  middleware: "authenticated",
  async asyncData ({ store }) {
    const { user } = store.state;
    return {
      user
    }
  },
  data() {
    return {
      errors: {},
    };
  },
  methods: {
    logout() {
      Cookie.remove("user");
      this.$store.commit("setUser", null);
      this.$router.push("/");
    },
    async onSubmit() {
      try {
        const { data } = await updateUser({
          user: this.user,
        });
        this.$store.commit('setUser', data.user)
        Cookie.set('user', data.user)
        this.$router.push("/");
      } catch (err) {
        this.errors = err.response.data.errors;
      }
    },
  },
};
</script>

<style>
</style>