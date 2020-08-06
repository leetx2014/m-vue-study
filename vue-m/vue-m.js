/**
 * 简单实现 vue 原理
 */

class Vue {
  constructor(options) {
    // 0. 保存 options
    this.$options = options;
    this.$data = options.data;
    this.$el = document.querySelector(options.el);
    const methods = options.methods || {};

    // 1. 将 data 做响应式处理
    observe(this.$data);

    // 2. 为 $data 做代理
    proxy(this, '$data');
    // 将 methods 的 key 赋值给 this
    Object.keys(methods).forEach(k => {
      this[k] = methods[k];
    });

    // 3. 编译模版
    new Compile(this.$el, this);
  }
}

// 根据传入数据类型需要做不同的处理，这里只根据给定类型做处理，其他暂不考虑
class Observer {
  constructor(value) {
    this.value = value;

    // 判断下 value 类型 做不同处理
    // object
    this.walk(value);
  }

  walk(obj) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key]);
    });
  }
}

// 遍历指定数据对象每个 key 拦截他们
function observe(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  // 每遇到一个对象，就创建一个 Observer 实例，去做拦截
  new Observer(obj);
}

// 数据响应式
function defineReactive(obj, key, value) {
  // 如果 value 也是对象，需要做递归处理
  observe(value);

  // 管家创建
  const dep = new Dep();

  Object.defineProperty(obj, key, {
    get() {
      // 依赖收集
      Dep.target && dep.addDep(Dep.target);
      return value;
    },
    set(newValue) {
      if (value !== newValue) {
        // 如果传入的 newValue 也是对象，也需要做响应式处理
        observe(newValue);
        value = newValue;

        // 通知更新
        dep.notify();
      }
    }
  });
}

// 代理函数，让用户可以直接访问 data 中的 key
function proxy(vm, key) {
  Object.keys(vm[key]).forEach(k => {
    Object.defineProperty(vm, k, {
      get() {
        return vm[key][k];
      },
      set(v) {
        vm[key][k] = v;
      }
    });
  });
}

// 模拟模版解析
class Compile {
  constructor(el, vm) {
    this.$el = el;
    this.$vm = vm;

    if (this.$el) {
      this.compile(this.$el);
    }
  }

  // 解析模版
  compile(el) {
    // el 是宿主元素
    // 遍历它，判断当前遍历元素类型
    el.childNodes.forEach(node => {
      if (node.nodeType === 1) {
        // 元素
        this.compileElement(node);
      } else if (this.isInter(node)) {
        // 文本
        this.compileText(node);
      }

      // 递归
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node);
      }
    });
  }

  // 编译元素: 分析指令、@事件
  compileElement(node) {
    const nodeAttrs = node.attributes;
    Array.from(nodeAttrs).forEach(attr => {
      // 给定指令形式：k-xxx="yyy"
      const attrName = attr.name;
      const exp = attr.value;
      if (this.isDirective(attrName)) {
        const dir = attrName.substring(2); // xxx
        // 指令实际操作方法
        this[dir] && this[dir](node, exp);
        node.removeAttribute(attrName);
      } else if (this.isEventDir(attrName)) {
        // 处理事件
        const dir = attrName.substring(1);
        this.eventHandler(node, exp, dir);
        // 删除属性
        node.removeAttribute(attrName);
      }
    });
  }

  // 事件处理器
  eventHandler(node, exp, eventType) {
    const eventFn = this.$vm[exp];
    if (eventFn) {
      // this 要指向 vue 实例
      node.addEventListener(eventType, eventFn.bind(this.$vm));
    }
  }

  // 编译文本
  compileText(node) {
    this.update(node, RegExp.$1, 'text');
  }

  // 提取 update， 初始化 & 更新函数创建
  // node节点 exp表达式 dir指令
  update(node, exp, dir) {
    const updater = this[`${dir}Updater`];
    // 初始化
    updater && updater(node, this.$vm[exp], exp, this.$vm);

    // 更新
    new Watcher(this.$vm, exp, function (val) {
      updater && updater(node, val);
    });
  }

  html(node, exp) {
    this.update(node, exp, 'html');
  }

  htmlUpdater(node, val) {
    node.innerHTML = val;
  }

  text(node, exp) {
    this.update(node, exp, 'text');
  }

  // k-text 对应操作函数
  textUpdater(node, val) {
    node.textContent = val;
  }

  model(node, exp) {
    this.update(node, exp, 'model');
  }

  modelUpdater(node, val, exp, vm) {
    node.value = val;
    // 添加 input 事件监听，用于 视图 -> 数据 的更新
    node.addEventListener('input', e => {
      vm[exp] = e.target.value;
    });
  }

  inputValue(node, exp, value) {}

  isEventDir(attr) {
    return attr.indexOf('@') === 0;
  }

  isDirective(attr) {
    return attr.indexOf('k-') === 0;
  }

  // 判断插值表达式
  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }
}

// Dep 管家角色，和某个 key 一一对应， 管理多个秘书，数据更新时通知秘书们做更新操作
class Dep {
  constructor() {
    this.deps = [];
  }

  addDep(watcher) {
    this.deps.push(watcher);
  }

  notify() {
    this.deps.forEach(watcher => watcher.update());
  }
}

// Watcher 小秘书角色
class Watcher {
  constructor(vm, key, updaterFn) {
    this.vm = vm;
    this.key = key;
    this.updaterFn = updaterFn;

    // 依赖收集触发
    Dep.target = this;
    // 触发 get
    this.vm[this.key];
    // 
    Dep.target = null;
  }

  update() {
    this.updaterFn.call(this.vm, this.vm[this.key]);
  }
}