<template>
  <div class="my-container">
    <van-cell-group v-if="user" class="my-info">
      <van-cell center :border="false" class="base-info">
        <template #icon>
          <van-image
            class="avatar"
            fit="cover"
            round
            :src="currentUser.photo"
          />
        </template>
        <template #title>
          <span class="username">{{currentUser.name}}</span>
        </template>
        <template #right-icon>
          <van-button class="update-btn" size="small" round
            >编辑资料</van-button
          >
        </template>
      </van-cell>
      <van-grid :border="false" class="data-info">
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{currentUser.art_count}}</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{currentUser.follow_count}}</div>
            <div class="text">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{currentUser.fans_count}}</div>
            <div class="text">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{currentUser.like_count}}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>
    <!-- 未登录 -->
    <div v-else class="not-login">
      <div @click="$router.push('/login')">
        <img src="./手机.png" class="mobile" />
      </div>
      <div class="text">登录 / 注册</div>
    </div>
    <van-grid :column-num="2" :border="false" class="nav-grid mb-4">
      <van-grid-item
        class="nav-grid-item"
        icon-prefix="news"
        icon="shoucang"
        text="收藏"
      />
      <van-grid-item
        class="nav-grid-item"
        icon-prefix="news"
        icon="lishi"
        text="历史"
      />
    </van-grid>
    <van-cell title="消息通知" is-link to="" />
    <van-cell class="mb-4" title="小智同学" is-link to="" />
    <van-cell
      v-if="user"
      class="logout-cell"
      title="退出登录"
      @click="onLogout"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getCurrentUser } from '@/api/user'

export default {
  name: 'MyIndex',
  components: {},
  props: {},
  data() {
    return {
      currentUser: {}
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created() {},
  mounted() {
    this.loadCurrentUser()
  },
  methods: {
    async loadCurrentUser() {
      const { data } = await getCurrentUser()
      // console.log(data)
      this.currentUser = data.data
    },
    onLogout() {
      this.$dialog
        .confirm({
          title: '退出提示',
          message: '确认退出登录吗'
        })
        .then(() => {
          // on close
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel
        })
    }
  }
}
</script>

<style scoped lang="less">
.my-container {
  .my-info {
    background: url('./banner.png') no-repeat;
    background-size: cover;
    .base-info {
      box-sizing: border-box;
      height: 115px;
      padding-top: 38px;
      padding-bottom: 11px;
      background: unset;
      .avatar {
        box-sizing: border-box;
        width: 66px;
        height: 66px;
        border: 1px solid #fff;
        margin-right: 11px;
      }
      .username {
        font-size: 15px;
        color: #fff;
      }
      .update-btn {
        height: 18px;
        line-height: 18px;
        font-size: 10px;
        color: #666;
      }
    }
    .data-info {
      .data-info-item {
        height: 65px;
        color: #fff;
        .text-wrap {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .count {
            font-size: 18px;
          }
          .text {
            font-size: 11px;
          }
        }
      }
    }
    /deep/ .van-grid-item__content {
      // data-info-item 里的内容背景
      background: unset;
    }
  }
  /deep/ .nav-grid {
    .nav-grid-item {
      height: 70px;
    }
    .news {
      font-size: 22px;
    }
    .news-shoucang {
      color: #eb5253;
    }
    .news-lishi {
      color: #ff9d1d;
    }
    .van-grid-item__text {
      font-size: 14px;
      color: #333;
    }
  }
  .logout-cell {
    text-align: center;
    color: #d86262;
  }
  .mb-4 {
    margin-bottom: 4px;
  }
  .not-login {
    height: 180px;
    background: url('./banner.png') no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .mobile {
      width: 66px;
      height: 66px;
    }
    .text {
      color: #fff;
      font-size: 14px;
    }
  }
}
</style>
