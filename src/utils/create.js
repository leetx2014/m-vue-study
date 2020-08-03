import Vue from 'vue';

/** 暗号: 老杨喊你来搬砖
 ** 作业: 使用 Vue.extend() 方式实现 create 方法
 * 构建函数, 返回组件实例（类似于 react 的 高阶组件）
 * @param {Object} Component 组件配置对象
 * @param {Object} props 传递给它的属性
 */
function create(Component, props) {
  // 1、构建 Component 的实例
  // 方法一: 通过配置 Vue 实例的方法构建组件实例
  /*
  const vm = new Vue({
    // h 是 createElement
    render: h => h(Component, { props })
  }).$mount();
  // 注意，这里不设置挂载目标，依然可以转换 vnode 为真实节点 $el
  */

  // 方法二: 使用 Vue.extend() 创建构建器
  /*
  const Profile = Vue.extend();
  // 生成 Profile 实例，并进行挂载
  const vm = new Profile({
    render: h => h(Component, { props })
  }).$mount();
  */

  // 方法三: 通过基础 Vue 构造器，直接创建子类
  const Profile = Vue.extend({
    render: h => h(Component, { props })
  })
  const vm = new Profile().$mount();

  // 2、挂载到 body 上
  document.body.appendChild(vm.$el);

  // 3、获取组件实例
  const comp = vm.$children[0];
  // 销毁函数
  comp.remove = () => {
    document.body.removeChild(vm.$el);
    vm.$destroy();
  };

  // 4、返回组件实例
  return comp;
}

export default create;