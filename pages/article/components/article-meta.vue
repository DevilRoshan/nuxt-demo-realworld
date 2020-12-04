<template>
  <div class="article-meta">
    <nuxt-link
      :to="{
        name: 'profile',
        params: {
          username: article.author.username,
        },
      }"
    >
      <img :src="article.author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link
        class="author"
        :to="{
          name: 'profile',
          params: {
            username: article.author.username,
          },
        }"
      >
        {{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt | date("MMM DD, YYYY") }}</span>
    </div>
    <button
      class="btn btn-sm btn-outline-secondary"
      :class="{
        active: article.author.following,
      }"
      @click="followUserHandler(article.author)"
    >
      <i class="ion-plus-round"></i>
      &nbsp; {{article.author.following ? 'Unfollow' : 'Follow'}} {{ article.author.username }}
    </button>
    &nbsp;&nbsp;
    <button
      class="btn btn-sm btn-outline-primary"
      :class="{
        active: article.favorited,
      }"
      @click="onFavorite(article)"
    >
      <i class="ion-heart"></i>
      &nbsp; {{article.favorited ? 'Unfavorite' : 'Favorite'}} Post <span class="counter">(29)</span>
    </button>
  </div>
</template>

<script>
import { addFavorite, deleteFavorite } from "@/api/article";
import { followUser, unfollowUser } from "@/api/user";
export default {
  name: "ArticleMeta",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async onFavorite(article) {
      article.favoriteDisabled = true;
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug);
        article.favorited = false;
        article.favoritesCount += -1;
      } else {
        // 添加点赞
        await addFavorite(article.slug);
        article.favorited = true;
        article.favoritesCount += 1;
      }
      article.favoriteDisabled = false;
    },
    async followUserHandler(profile) {
      profile.followDisabled = true;
      if (profile.following) {
        const {data} = await unfollowUser(profile.username);
      } else {
        const {data} = await followUser(profile.username);
      }
      profile.following = !profile.following
      profile.followDisabled = false;
    }
  },
};
</script>

<style>
</style>
