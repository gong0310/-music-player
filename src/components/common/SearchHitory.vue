<template>
  <div class="searchHistory">
      <h3>搜索历史</h3>
      <span class="clearSearchList" @click="clearSearchList">清空列表</span>
    <div v-for="(item,index) in searchList" :key="item.name" @click="toSearch(item.name)">{{item.name}}
        <span class="el-icon-circle-close" @click="clearSearchItem(index)"></span>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    searchList() {
      return this.$store.state.searchHistoryList;
    }
  },
  methods:{
       // 直接搜索
    toSearch(name) {
        this.$router.push({
          path: "/searchResult",
          query: { inputVal:name }
        })
    },
    clearSearchList(){
        this.$store.commit('clearSearchList')
    },
    clearSearchItem(index){
        this.$store.commit('clearSearchItem',index)
    }
  }
};
</script>
<style lang="less" scoped>
.searchHistory {
  text-align: left;
  width: 197px;
  height: 26vh;
  background-color:#F9F9F9;
  div{
      margin-top: 10px;
      padding-left: 30px;
      box-sizing: border-box;
      border-bottom: 1px solid #ccc;
  }
  .clearSearchList{
      position: absolute;
      right: 10px;
  }
}
</style>