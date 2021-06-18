<template>
  <div class="article-container">
    <van-nav-bar
      class="app-nav-bar"
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />
    <h1 class="title">{{ article.title }}</h1>
    <van-cell center class="user-info">
      <div slot="title" class="name">{{ article.aut_name }}</div>
      <van-image
        slot="icon"
        class="avatar"
        round
        fit="cover"
        :src="article.aut_photo"
      />
      <div slot="label" class="pubdate">
        {{ article.pubdate | relativeTime }}
      </div>
      <van-button
        :type="article.is_followed ? 'default' : 'info'"
        :icon="article.is_followed ? 'default' : 'plus'"
        size="small"
        round
        class="follow-btn"
        :loading="isFollowLoading"
        @click="onFollow"
        >{{ article.is_followed ? '已关注' : '关注' }}</van-button
      >
    </van-cell>
    <div
      class="markdown-body"
      v-html="article.content"
      ref="article-content"
    ></div>
  </div>
</template>

<script>
import './github-markdown.css'
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'
import { addFollow, deleteFollow } from '@/api/user'

export default {
  name: 'ArticleIndex',
  components: {},
  props: {
    // 获取动态路由参数
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  data() {
    return {
      article: {}, // 文章数据对象
      isFollowLoading: false // 关注用户的loading状态
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticle()
  },
  mounted() {},
  methods: {
    async loadArticle() {
      const { data } = await getArticleById(this.articleId)
      this.article = data.data
      // 数据改变影响视图更新（DOM数据）不是利己的
      // 所以如果在修改数据之后马上被该数据影响的视图,需要把代码放到 $nextTick 中
      // this.$nextTick 为Vue提供的方法
      this.$nextTick(() => {
        this.handlePerviewImage()
      })
    },
    // 图片展示
    handlePerviewImage() {
      // 获取文章内容容器
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      const imgPaths = []
      imgs.forEach((img, index) => {
        imgPaths.push(img.src)
        img.onclick = function() {
          ImagePreview({
            images: imgPaths, // 预览图片列表
            startPosition: index // 起始位置
          })
        }
      })
    },
    async onFollow() {
      this.isFollowLoading = true
      if (this.article.is_followed) {
        // 已关注 取关
        await deleteFollow(this.article.aut_id)
      } else {
        // 没关注 关注
        await addFollow(this.article.aut_id)
      }
      this.article.is_followed = !this.article.is_followed
      this.isFollowLoading = false
    }
  }
}
</script>

<style scoped lang="less">
.title {
  font-size: 20px;
  color: #3a3a3a;
  padding: 14px;
  background-color: #fff;
  margin: 0;
}
.user-info {
  .avatar {
    width: 35px;
    height: 35px;
    margin-right: 8px;
  }
  .name {
    font-size: 12px;
    color: #333;
  }
  .pubdate {
    font-size: 11px;
    color: #b4b4b4;
  }
  .follow-btn {
    width: 85px;
    height: 29px;
  }
}
.markdown-body {
  padding: 14px;
  background-color: #fff;
}
</style>
