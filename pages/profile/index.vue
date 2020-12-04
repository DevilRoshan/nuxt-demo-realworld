<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <nuxt-link
              class="btn btn-sm btn-outline-secondary action-btn"
              to="/settings"
              v-if="profile.username === user.username"
            >
              <i class="ion-gear-a"></i> Edit Profile Settings
            </nuxt-link>
            <button class="btn btn-sm btn-outline-secondary action-btn" v-else @click="followUserHandler(profile)">
              <i class="ion-plus-round"></i>
              &nbsp; {{profile.following ? 'Unfollow' : 'Follow'}} {{ profile.username }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'my_articles',
                  }"
                  exact
                  :to="{
                    name: 'profile',
                  }"
                  >My Articles</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'favorited_articles',
                  }"
                  exact
                  :to="{
                    name: 'profile',
                    query: {
                      tab: 'favorited_articles',
                    },
                  }"
                  >Favorited Articles</nuxt-link
                >
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
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
                <span class="date">{{
                  article.createdAt | date("MMM DD, YYYY")
                }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{
                  active: article.favorited,
                }"
                @click="onFavorite(article)"
                :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              class="preview-link"
              :to="{
                name: 'article',
                params: {
                  slug: article.slug,
                },
              }"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                :class="{
                  active: item === page,
                }"
                v-for="item in totalPage"
                :key="item"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'profile',
                    query: {
                      page: item,
                      tab: tab,
                    },
                  }"
                  >{{ item }}</nuxt-link
                >
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticles, addFavorite, deleteFavorite } from "@/api/article";
import { getProfiles, followUser, unfollowUser } from "@/api/user";
const PAGESIZE = 5;
const CONFIG = {
  my_articles: "author",
  favorited_articles: "favorited",
};
import { mapState } from "vuex";

export default {
  name: "Profile",
  middleware: "authenticated",
  async asyncData({ store, query, params }) {
    const tab = query.tab || "my_articles";
    const page = Number.parseInt(query.page || 1);
    const username = params.username;
    let [profileRes, articlesRes] = await Promise.all([
      getProfiles(username),
      getArticles({
        [CONFIG[tab]]: username,
        limit: PAGESIZE,
        offset: (page - 1) * PAGESIZE,
      }),
    ]);
    const { articles, articlesCount } = articlesRes.data;
    articles.forEach((article) => (article.favoriteDisabled = false));
    const { profile } = profileRes.data;
    profile.followDisabled = false

    return {
      articles,
      articlesCount,
      profile,
      limit: PAGESIZE,
      page,
      tab,
    };
  },
  watchQuery: ["page", "tab"],
  computed: {
    ...mapState(["user"]),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
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
        this.profile = data.profile
      } else {
        const {data} = await followUser(profile.username);
        this.profile = data.profile
      }
      profile.followDisabled = false;
    }
  },
};
</script>

<style>
</style>