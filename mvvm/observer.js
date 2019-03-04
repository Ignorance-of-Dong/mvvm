/**
 * data 接收mvvm获取到的data
 * @param {*} data 
 */
function Observer(data) { // 数据监听器
  this.data = data; // 定义data
  this.walk(data);
}

Observer.prototype = {
  
  walk: function (data) {
    var me = this;
    Object.keys(data).forEach(function (key) { // 遍历的data属性的key值
      me.convert(key, data[key]); // 添加getter，setter拦截器
    });
  },

  convert: function (key, val) {
    this.defineReactive(this.data, key, val); // 添加getter，setter拦截器
  },

  defineReactive: function (data, key, val) { // 添加getter，setter拦截器
    var dep = new Dep(); // 添加拦截器后实例化Dep

    var childObj = observe(val); // 验证传入的属性值是否为一个对象

    Object.defineProperty(data, key, { // 添加拦截器getter，setter
      enumerable: true, // 可枚举
      configurable: false, // 不能再define
      get: function () {
        if (Dep.target) { //如果有target属性则
          console.log(Dep.target,'Dep.target')
          dep.depend();
        }
        return val; // 返回值
      },
      set: function (newVal) { 
        if (newVal === val) { // 如果新值等于旧值则返回
          return;
        }
        val = newVal; //否则重新赋值
        // 新的值是object的话，进行监听
        childObj = observe(newVal);
        // 通知订阅者
        dep.notify();
      }
    });
  }
};

/**
 * 
 * @param {defineReactive函数传入的值：是用来判断是否为一个对象} value 
 * @param {*mvvm实例} vm
 */
function observe(value, vm) {
  if (!value || typeof value !== 'object') {
    return;
  }

  return new Observer(value); //如果是则在执行实例化Observer
};


var uid = 0;

/**
 * 监听到数据如何通知订阅者？
 * 维护一个数组，用来收集订阅者，数据变动时触发一个notify（通知），通知后在调用update
 */
function Dep() {

  this.id = uid++; // 每次实例化将id+1

  this.subs = []; // 定义一个维护数组
}

Dep.prototype = {
  addSub: function (sub) { // 将订阅者放入到维护数组中
    this.subs.push(sub);
  },

  depend: function () {
    Dep.target.addDep(this); // 调用watcher原型上的addDep【将当前this传入到watcher】
  },

  removeSub: function (sub) {
    var index = this.subs.indexOf(sub);
    if (index != -1) {
      this.subs.splice(index, 1);
    }
  },

  notify: function () { // 通知订阅者
    this.subs.forEach(function (sub) { // 遍历的到的每一sub
      sub.update(); // 调用watcher原型上的update
    });
  }
};

Dep.target = null;