<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <form action="/">
      <van-search
        v-model="searchText"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch(searchText)"
        @cancel="$router.back()"
        @focus="isResultShow = false"
      />
    </form>
    <!-- /搜索栏 -->

    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :search-text="searchText" />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    />
    <!-- /联想建议 -->

    <!-- 历史记录 -->
    <search-history
      v-else
      :search-histories="searchHistories"
      @search="onSearch"
      @update-histories="searchHistories = $event"
    />
    <!-- /历史记录 -->
  </div>
</template>

<script>
import SearchSuggestion from './components/search-suggestion.vue'
import SearchHistory from './components/search-history.vue'
import SearchResult from './components/search-result.vue'
import { getItem, setItem } from '@/utils/storage.js'

export default {
  name: 'SearchIndex',
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResult
  },
  props: {},
  data() {
    return {
      searchText: '',
      isResultShow: false,
      searchHistories: getItem('search-histories') || []
    }
  },
  computed: {},
  watch: {
    searchHistories() {
      // 本地存储
      setItem('search-histories', this.searchHistories)
    }
  },
  created() {},
  mounted() {},
  methods: {
    onSearch(searchText) {
      // 联想建议字符串赋值 让输入框变为搜索文本
      this.searchText = searchText
      // 删除历史记录重复项
      const idx = this.searchHistories.indexOf(searchText)
      if (idx !== -1) this.searchHistories.splice(idx, 1)
      // 记录历史搜索记录
      this.searchHistories.unshift(searchText)
      // 历史记录存储
      // setItem('search-histories', this.searchHistories)
      // 展示搜索结果
      this.isResultShow = true
    }
  }
}
</script>

<style scoped lang="less"></style>
