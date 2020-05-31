import Vue from 'vue'
import {
    Carousel,
    CarouselItem,
    Pagination,
    Tabs,
    TabPane,
    Message,
    MessageBox,
    Notification,
    Container,
    Header,
    Aside,
    Main,
    Footer,
    Loading,
    Drawer,
    Card ,
    input,
    dialog,
    button,
    popover
} from 'element-ui'
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Pagination)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Loading)
Vue.use(Drawer)
Vue.use(Card)
Vue.use(input)
Vue.use(dialog)
Vue.use(button)
Vue.use(popover)

    


Vue.prototype.$message = Message
Vue.prototype.$notify = Notification
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.openLoading = function() {
    const loading = this.$loading({           // 声明一个loading对象
      // lock: true,                             // 是否锁屏
      text: '正在加载...',                     
      spinner: 'el-icon-loading',             // 引入的loading图标
      background: 'rgba(0, 0, 0, 0.7)',       
      target: '.sub-main',                   
      body: true,                              
      customClass: 'mask'                     
    })
    setTimeout(function () {                  // 设定定时器，超时5S后自动关闭遮罩层，避免请求失败时，遮罩层一直存在的问题
      loading.close();                        // 关闭遮罩层
    },5000)
    return loading;
  }