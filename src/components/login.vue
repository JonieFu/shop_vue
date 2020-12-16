<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avator_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 表单区域 -->
      <el-form :model="loginForm" class="login_form">
        <el-form-item icon>
          <!-- 用户名 -->
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user">
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item>
          <el-input
            type="password"
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <!-- 按钮区 -->
        <el-form-item class="btns">
          <el-button type="primary">登录</el-button>
          <el-button type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginForm: {
        username: 'zs',
        password: '123124',
      },
    }
  },
}
</script>
<style lang="scss" scoped>
.login_container {
  background: #2b4b6b;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    background: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avator_box {
      background: #fff;
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate((-50%, -50%));
      img {
        background: #eee;
        border-radius: 50%;
        width: 100%;
        height: 100%;
      }
    }
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>