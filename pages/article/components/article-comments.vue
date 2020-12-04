<template>
  <div>
    <form class="card comment-form">
      <div class="card-block">
        <textarea
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
          v-model="comment_body"
        ></textarea>
      </div>
      <div class="card-footer">
        <img :src="user.image" class="comment-author-img" />
        <i class="btn btn-sm btn-primary" @click="addCommentsHandler()">Post Comment</i>
      </div>
    </form>
    <div class="card" v-for="comment in comments" :key="comment.id">
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link
          class="comment-author"
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username,
            },
          }"
        >
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link
          class="comment-author"
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username,
            },
          }"
        >
          {{ comment.author.username }}
        </nuxt-link>
        <span class="date-posted">{{
          comment.createdAt | date("MMM DD, YYYY")
        }}</span>
        <span class="mod-options" v-show="comment.author.username === user.username">
          <i class="ion-trash-a" @click="deleteCommentHandler(comment)"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments, addComments, deleteComments } from "@/api/article";
import { mapState } from 'vuex'

export default {
  name: "ArticleComments",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(['user'])
  },
  data() {
    return {
      comments: [], // 文章列表
      comment_body: ''
    };
  },
  async mounted() {
    this.initComments()
  },
  methods: {
    async initComments () {
      const { data } = await getComments(this.article.slug);
      this.comments = data.comments;
    },
    async addCommentsHandler () {
      await addComments(this.article.slug, {
        comment: {
          body: this.comment_body
        }
      });
      this.comment_body = '';
      this.initComments()
    },
    async deleteCommentHandler(comment) {
      await deleteComments(this.article.slug, comment.id);
      this.initComments()
    }
  }
};
</script>

<style>
</style>
