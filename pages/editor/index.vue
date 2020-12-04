<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <ul class="error-messages">
            <template v-for="(messages, field) in errors">
              <li v-for="(message, index) in messages" :key="index">
                {{ field }} {{ message }}
              </li>
            </template>
          </ul>
          <form>
            <fieldset class="form-group">
              <input
                v-model="article.title"
                type="text"
                class="form-control form-control-lg"
                placeholder="Article Title"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                v-model="article.description"
                type="text"
                class="form-control"
                placeholder="What's this article about?"
              />
            </fieldset>
            <fieldset class="form-group">
              <textarea
                v-model="article.body"
                class="form-control"
                rows="8"
                placeholder="Write your article (in markdown)"
              ></textarea>
            </fieldset>
            <fieldset class="form-group">
              <input
                type="text"
                class="form-control"
                placeholder="Enter tags"
                @keyup.13="onEnter"
              />
              <div class="tag-list">
                <span
                  class="tag-default tag-pill"
                  v-for="(tag, index) in article.tagList"
                  :key="index"
                >
                  <i class="ion-close-round" @click="removeTag(index)"></i
                  >{{ tag }}
                </span>
              </div>
            </fieldset>
            <button
              class="btn btn-lg pull-xs-right btn-primary"
              type="button"
              @click.prevent="onSubmit"
            >
              Publish Article
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createArticle } from "@/api/article";

export default {
  name: "Editor",
  middleware: "authenticated",
  data() {
    return {
      article: {
        title: "",
        description: "",
        body: "",
        tagList: [],
      },
      errors: {},
    };
  },
  methods: {
    onEnter(e) {
      this.article.tagList.push(e.target.value);
      e.target.value = "";
    },
    async onSubmit() {
      try {
        const { data } = await createArticle({
          article: this.article,
        });
        this.$router.push({
          name: 'article',
          params: {
            slug: data.article.slug
          }
        });
      } catch (err) {
        this.errors = err.response.data.errors;
      }
    },
    removeTag(index) {
      this.article.tagList.splice(index, 1);
    },
  },
};
</script>

<style>
</style>