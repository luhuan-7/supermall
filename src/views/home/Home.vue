<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control class="tab-control"
                   :titles="['流行','新款','精选']"
                   @tabClick="tabClick"/>
      <good-list :goods="showGoods"/>
    </scroll>
    <!-- 监听组件根元素原生事件 .native -->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper.vue'
  import RecommendView from './childComps/RecommendView.vue'
  import FeatureView from './childComps/FeatureView.vue'

  import NavBar from 'components/common/navbar/NavBar.vue'
  import TabControl from 'components/content/tabControl/TabControl.vue'
  import GoodList from 'components/content/goods/GoodsList.vue'
  import Scroll from 'components/common/scroll/Scroll.vue'
  import BackTop from 'components/content/backTop/BackTop.vue'



  //在home.js中没有用default导出所以必须得加大括号
  import {getHomeMultidata,getHomeGoods} from "network/home";
//  import Swiper from 'components/common/swiper/Swiper'
//  import SwiperItm from 'components/common/swiper/SwiperItem'

  export default {
    name:"Home",
    components:{
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodList,
      Scroll,
      BackTop

    },
    //存储请求过来的数据
    data(){
      return{
        banners:[],
        recommends:[],
        goods:{
          'pop':{page:0,list:[]},
          'new':{page:0,list:[]},
          'sell':{page:0,list:[]},
        },
        //默认当前的类型
        currentType:'pop',
        isShowBackTop:false
      }
    },
    computed:{
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    //发送网络请求
    created(){
      //1.请求多个数据
     this.getHomeMultidata()

      //2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    methods:{
//   事件监听相关的方法
      tabClick(index){
//         console.log(index);
         switch (index){
           case 0:
             this.currentType = 'pop'
             break
           case 1:
             this.currentType = 'new'
             break
           case 2:
             this.currentType = 'sell'
             break
         }
       },
      backClick(){
//         三个参数，前两个是坐标x，y，第三个是毫秒数
        this.$refs.scroll.scrollTo(0,0)
      },
      contentScroll(position){
        //当高度大于1000时显示向上的图标
        this.isShowBackTop = (-position.y) > 1000
      },
      loadMore(){
        this.getHomeGoods(this.currentType)
        this.$refs.scroll.refresh
      },


    /**
     * 网络请求相关的方法
     */

    getHomeMultidata(){
        getHomeMultidata().then(res =>{
          //this在箭头函数中是往上找作用域
//        console.log(res);
//        this.result = res;
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type){
        const page = this.goods[type].page + 1
        getHomeGoods(type,page).then(res=>{
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          this.$refs.scroll.finishPullUp()
        })
      },

    }
  };
</script>

<style scoped>
  #home{
    height: 100vh;
    /*padding-top: 44px;*/
    position: relative;
  }

  /*设置首页导航颜色*/
  .home-nav{
    background-color: var(--color-tint);
    color: white;
    position: fixed;
    left:0;
    right: 0px;
    top: 0px;
    z-index:9;
  }
  .tab-control{
    position: sticky;
    top: 44px;
    z-index:9;
  }
  /*.content{*/
    /*!*height: 300px;*!*/
    /*overflow: hidden;*/
    /*position: absolute;*/
    /*top: 44px;*/
    /*bottom: 49px;*/
    /*left: 0;*/
    /*right: 0;*/
  /*}*/
  .content{
    height: calc(100% - 93px);
    overflow: hidden;
    margin-top: 44px;
  }
</style>
