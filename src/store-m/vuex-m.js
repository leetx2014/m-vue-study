/* 模仿实现 vuex 插件 */

let _Vue;

class Store {
  constructor(config) {
    this._mutations = config.mutations;
    this._actions = config.actions;
    this._getters = config.getters || {};

    // 创建响应式的 state
    this._vm = new _Vue({
      data() {
        // 不希望被代理，就加上 $
        return { $$state: config.state };
      }
    });

    // getters
    this.getters = {};
    forEach(this._getters, (getterName, value) => {
      Object.defineProperty(this.getters, getterName, {
        get: () => value(this.state)
      });
    });

    // 修改 this 指向
    this.commit = this.commit.bind(this);
    this.dispatch = this.dispatch.bind(this);
  }

  get state() {
    return this._vm._data.$$state;
  }

  set state(v) {
    console.error('please use replaceState to reset state');
  }

  // 修改 state
  commit(type, payload) {
    const entry = this._mutations[type];
    if (!entry) {
      console.error('unknown mutaion');
      return;
    }

    // 传入 state 作为参数
    entry(this.state, payload);
  }

  dispatch(type, payload) {
    // 获取 type 对应的 action
    const entry = this._actions[type];
    if (!entry) {
      console.error('unknown action');
      return;
    }

    // 传入当前 Store 实例做上下文
    return entry(this, payload);
  }
}

function install(Vue) {
  _Vue = Vue;

  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    },
  });
}

// 定义一个 forEach 遍历当前对象属性然后执行一个回调函数
function forEach(obj, cb) {
  Object.keys(obj).forEach(key => cb(key, obj[key]));
}

// 导出对象就是 Vuex
export default { Store, install };