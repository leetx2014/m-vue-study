/**
 * 实现路由插件
 */

// 用于保存 Vue 实例
let _Vue;

class VueRouter {
  constructor(config) {
    this.$config = config;

    // 缓存 path 和 route 的映射关系
    this.routeMap = {};
    this.$config.routes.forEach(route => {
      this.routeMap[route.path] = route;
    });

    // 需要定义一个响应式的 current 属性
    const initial = window.location.hash.slice(1) || '/';
    _Vue.util.defineReactive(this, 'current', initial);

    // 监控 url 变化这里需要绑定 this，也可以将 onHashChange 改写为箭头函数
    window.addEventListener('hashchange', this.onHashChange.bind(this));
  }

  onHashChange() {
    // 只要#后面部分
    this.current = window.location.hash.slice(1);
  }
}

VueRouter.install = function(Vue) {
  // 引用 Vue 构造函数，在上面 VueRouter 中使用
  _Vue = Vue;

  // 1.挂载 $router
  Vue.mixin({
    beforeCreate() {
      // 此处 this 指的是组件实例, this.$options.router => VueRouter 实例
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router;
      }
    },
  });

  // 2. 定义两个全局组件 router-link, router-view
  Vue.component('router-link', {
    props: {
      to: {
        type: String,
        require: true
      }
    },
    render(h) {
      return h('a', {
        attrs: {
          href: `#${this.to}`
        }
      }, this.$slots.default);
    },
  });

  Vue.component('router-view', {
    render(h) {
      // 找到当前 url 对应的组件
      const { routeMap, current } = this.$router;
      const component = routeMap[current] ? routeMap[current].component : null;
      // 渲染传入组件
      return h(component);
    },
  });
};

export default VueRouter;