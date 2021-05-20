<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isRefreshLoading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      success-duration="800"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in articles"
          :key="index"
          :article="article"
        ></article-item>
        <!-- <van-cell
          v-for="(article, index) in articles"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      articles: [], // 文章列表
      loading: false,
      finished: false,
      timestamp: null, // 数据时间戳
      isRefreshLoading: false, // 下拉刷新 loading
      refreshSuccessText: ''
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLoad() {
      // 1.请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id,
        timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
        with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
      })
      // console.log(data)
      // 2.把数据放到 articles 数组中 PS:是 push 进去的
      // 只把 data.data 中的 results 数组解构出来
      const { results } = data.data
      // 扩展数组追加到文章列表中
      this.articles.push(...results)
      // 3. loading 每次加载完必须设置加载状态结束，否则会停留在加载中，因为不满一屏或者下拉都会自动为 true
      this.loading = false
      // 4. finished 数据全部加载完成，不再触发加载
      // results 还有数据就可以继续添加数据 根据 pre_timestamp 添加下一页的数据
      if (results.length) {
        this.timestamp = data.data.pre_timestamp
      } else {
        this.finished = true
      }
    },
    async onRefresh() {
      // 1.请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id,
        timestamp: Date.now(), // 获取最新数据
        with_top: 1
      })
      // 2.把数据放到 articles 数组中 (往顶部追加)
      const { results } = data.data
      // 扩展数组追加到文章列表中
      this.articles.unshift(...results)
      // 3.isRefreshLoading 每次加载完必须设置加载状态结束，否则会停留在加载中
      this.isRefreshLoading = false
      this.refreshSuccessText = `更新了${results.length}条数据`
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  /* 使显示不被遮挡 */
  position: fixed;
  left: 0;
  right: 0;
  top: 90px;
  bottom: 50px;
  overflow-y: auto;
}
</style>
