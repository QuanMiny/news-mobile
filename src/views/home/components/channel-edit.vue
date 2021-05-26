<template>
  <div class="channel-edit">
    <van-cell center :border="false">
      <div slot="title" class="channel-title">我的频道</div>
      <van-button
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
      >
        {{ isEdit ? '完成' : '编辑' }}
      </van-button>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        :class="{ active: index === active }"
        :icon="isEdit && index !== 0 ? 'clear' : ''"
        v-for="(channel, index) in userChannels"
        :key="index"
        :text="channel.name"
        @click="onUserChannelClick(channel, index)"
      />
    </van-grid>
    <van-cell center :border="false">
      <div slot="title" class="channel-title">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        @click="onAdd(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    userChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      allChannels: [], // 所有频道列表
      isEdit: false
    }
  },
  computed: {
    ...mapState(['user']),
    // 推荐频道 = 所有频道 - 用户频道
    recommendChannels() {
      // filter 根据 true 和 false 来过滤数组元素
      return this.allChannels.filter(channel => {
        // find 满足条件返回 true
        return !this.userChannels.find(userChannel => {
          return userChannel.id === channel.id
        })
      })
    }
  },
  watch: {},
  created() {
    this.loadAllChannel()
  },
  mounted() {},
  methods: {
    async loadAllChannel() {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    async onAdd(channel) {
      this.userChannels.push(channel)
      // 数据持久化
      if (this.user) {
        await addUserChannel({
          channels: [{ id: channel.id, seq: this.userChannels.length }]
        })
      } else {
        // 没有登录，数据存储到本地
        setItem('user-channels', this.userChannels)
      }
    },
    onUserChannelClick(channel, index) {
      if (this.isEdit && index !== 0) {
        // 编辑状态，删除频道
        this.deleteChannel(channel, index)
      } else {
        // 非编辑状态，跳转频道
        this.switchChannel(index)
      }
    },
    async deleteChannel(channel, index) {
      // 如果删除的是激活频道之前的频道
      if (index <= this.active) {
        this.$emit('update-active', this.active - 1)
      }
      this.userChannels.splice(index, 1)
      // PS 数据持久化
      if (this.user) {
        await deleteUserChannel(channel.id)
      } else {
        // 没有登录，数据存储到本地
        setItem('user-channels', this.userChannels)
      }
    },
    switchChannel(index) {
      // 跳转
      this.$emit('update-active', index)
      // 关闭弹窗 子传父
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding-top: 54px;
  .channel-title {
    font-size: 16px;
    color: #333;
  }
  .van-button__content {
    padding: 0 8px;
  }
  .grid-item {
    width: 80px;
    height: 43px;
    /deep/ .van-grid-item__content {
      background: #f4f5f6;
      position: relative;
      .van-grid-item__text {
        font-size: 14px;
        color: #222;
        margin-top: 0;
      }
      .van-grid-item__icon {
        position: absolute;
        right: -8px;
        top: -8px;
        font-size: 20px;
        color: #ccc;
      }
    }
  }
  .active {
    /deep/ .van-grid-item__text {
      color: red !important;
    }
  }
}
</style>
