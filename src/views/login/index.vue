<template>
  <div class="login-container">
    <van-nav-bar
      class="app-nav-bar"
      title="注册/登录"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 使用 van-form 添加校验规则 -->
    <van-form
      :show-error="false"
      :show-error-message="false"
      validate-first
      ref="login-form"
      @submit="onLogin"
      @failed="onFailed"
    >
      <van-field
        v-model="user.mobile"
        label="手机号"
        clearable
        center
        icon-prefix="news"
        left-icon="shouji"
        placeholder="请输入手机号"
        name="mobile"
        :rules="formRules.mobile"
      />
      <van-field
        v-model="user.code"
        clearable
        center
        label="验证码"
        icon-prefix="news"
        left-icon="yanzhengma"
        placeholder="请输入短信验证码"
        name="code"
        :rules="formRules.code"
      >
        <template #button>
          <van-count-down
            v-if="isCountDownShow"
            :time="1000 * 60"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            class="send-btn"
            size="small"
            round
            @click.prevent="onSendSms"
            :loading="isSendSmsLoading"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" type="info" block>登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
// import { Toast } from 'vant'

export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: '', // 手机号
        code: '' // 验证码
      },
      formRules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '手机格式错误' }
        ],
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      isCountDownShow: false, // 判断计时显示
      isSendSmsLoading: false // 发送信息禁用按钮
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 1.找到数据接口
    // 2.封装请求方法
    // 3.请求调用登录
    async onLogin() {
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      })
      try {
        // 数据解构
        const { data } = await login(this.user)
        // 4.处理响应结果
        this.$toast.success('登录成功')
        // 将后端返回的用户登录状态（token等数据）放到 Vuex 容器中
        this.$store.commit('setUser', data.data)
      } catch (err) {
        // console.log(err)
        // console.log('failed')
        this.$toast.fail('登录失败，手机号或验证码错误')
      }
    },
    // 表单验证失败调用
    onFailed(err) {
      // console.log(err)
      this.$toast({
        message: err.errors[0].message,
        position: top // 不遮挡用户手机键盘输入
      })
    },
    // 发送验证码
    async onSendSms() {
      try {
        // 此时只校验手机号码
        await this.$refs['login-form'].validate('mobile')
        // 验证通过，请求发送验证码
        this.isSendSmsLoading = true // 展示按钮的 loading 状态，防止网络慢用户多次点击触发发送行为
        // 请求发送验证码
        await sendSms(this.user.mobile)
        // 请求发送验证码 -> 隐藏发送按钮，显示倒计时
        this.isCountDownShow = true
        // 倒计时结束 -> 隐藏倒计时，显示发送按钮
        // 监听 countDown 组件的 finish 事件进行事件处理
      } catch (err) {
        // try 里面有任何的错误就在 catch 里面捕获到
        // 不同错误不同提示
        let message = ''
        if (err && err.response && err.response.status === 429) {
          // 多次发送产生的错误
          message = '发送太频繁了，请稍后重试'
        } else if (err.name === 'mobile') {
          // 表单验证格式错误
          message = err.message
        } else {
          // 未知错误
          message = '发送失败，请稍后重试'
        }
        // 错误提示
        this.$toast({
          message,
          position: top
        })
      }
      // 无论发送验证码成功还是失败，最后都要关闭发送按钮的 loading 状态
      this.isSendSmsLoading = false
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .send-btn {
    width: 80px;
    height: 23px;
    background-color: #ededed;
    .van-button__text {
      font-size: 11px;
      color: #666;
    }
  }

  .login-btn-wrap {
    padding: 26px 16px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
      .van-button__text {
        font-size: 16px;
      }
    }
  }
}
</style>
