<template>
  <div class="user">
    <!-- 登录前 -->
    <div @click="onOpenModal" class="login-trigger" v-if="!isLogin">
      <i class="user-icon iconfont icon-yonghu" />
      <p class="user-name">未登录</p>
    </div>
    <!-- 登录后 -->
    <div @click="onLogout" class="logined-user" v-else>
      <img :src="user.avatarUrl" class="avatar" />
      <p class="user-name">{{ user.nickname }}</p>
    </div>
    <!-- 登录框 -->
    <el-dialog :modal="false" :visible.sync="visible" width="30vw">
      <p slot="title">登录</p>
      <div class="login-body">
        <el-input class="input" placeholder="请输入您的网易云uid" v-model="uid" />
        <div class="login-help">
          <p class="help">
            1、请
            <a href="http://music.163.com" target="_blank">点我(http://music.163.com)</a>打开网易云音乐官网
          </p>
          <p class="help">2、点击页面右上角的“登录”</p>
          <p class="help">3、点击您的头像，进入我的主页</p>
          <p class="help">4、复制浏览器地址栏 /user/home?id= 后面的数字（网易云 UID）</p>
        </div>
      </div>
      <span class="dialog-footer" slot="footer">
        <el-button @click="onLogin" class="login-btn" type="primary">登 录</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Userdetail, User, getPlaylistDetail } from "@/api/api";
export default {
  data() {
    return {
      visible: false,
      uid: "",
      isLogin: false,
      user: {}
    };
  },
  methods: {
    onOpenModal() {
      this.visible = true;
    },
    onCloseModal() {
      this.visible = false;
    },
    onLogin() {
      Userdetail(this.uid).then(res => {
        this.user = {
          avatarUrl: res.data.profile.avatarUrl,
          nickname: res.data.profile.nickname
        };
        this.isLogin = true;
        this.onCloseModal();
      });
      //获取用户歌单的id
      User(this.uid).then(res => {
        res.data.playlist.forEach(item => {
          this.getPlaylist(item.id);
        });
      }).catch(()=>{
        this.$message.error('登录失败')
      })
    },
    // 获取歌单歌曲,并自动加入到播放列表
    getPlaylist(id) {
      getPlaylistDetail(id).then(res => {
        res.data.playlist.trackIds.forEach(item => {
          this.$store.dispatch("getMusUrl", item.id);
        });
      });
    },
    onLogout() {
      this.$confirm("是否退出登录", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          (this.isLogin = false),
            this.$message({
              type: "success",
              message: "退出成功!"
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    }
  }
};
</script>

<style lang="less" scoped>
.user {
  padding: 37px;
  padding-bottom: 0;
  margin-bottom: 12px;

  .login-trigger {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .user-icon {
    font-size: 24px;
  }

  .user-name {
    margin-left: 8px;
  }

  .logout {
    transform: translateY(1px);
    margin-left: 8px;
    color: var(--font-color-shallow-grey);
  }
  .login-body {
    .input {
      margin-bottom: 16px;
    }

    .login-help {
      text-align: left;
      .help {
        margin-bottom: 4px;
      }
    }
  }

  .login-btn {
    width: 100%;
    padding: 8px 0;
  }

  .logined-user {
    display: flex;
    align-items: center;
    cursor: pointer;
    .avatar {
      width: 30px;
      height: 30px;
    }
  }
}
</style>
