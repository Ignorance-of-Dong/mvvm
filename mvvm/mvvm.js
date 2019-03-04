function MVVM(options) {
  // option 为实例化传入的参数
  this.$options = options || {}; // 如果传入则使用传入的否则{}

  var data = this._data = this.$options.data; // 获取到传入的data对象

  var me = this; // 重新定义this

  // 数据代理
  // 实现 vm.xxx -> vm._data.xxx
  Object.keys(data).forEach(function(key) { // 遍历的data属性的key值
      me._proxyData(key); // 将遍历的key值传入到 _proxyData 进行添加属性代理
  });

  this._initComputed(); // mvvm计算属性

  observe(data, this); // 调用数据监听器
  /**
   * options.el 传入当前的节点
   */
  this.$compile = new Compile(options.el || document.body, this) // compile主要做的事情是解析模板指令
}

MVVM.prototype = {
  /**
   * 
   * @param {child.someStr} key 
   * @param {回调函数} cb 
   * @param {*} options 
   */
  $watch: function(key, cb, options) {
      new Watcher(this, key, cb);
  },

  _proxyData: function(key, setter, getter) { // 添加属性代理
      var me = this; // 定义当前this
      setter = setter || // 
      Object.defineProperty(me, key, {
          configurable: false,
          enumerable: true,
          get: function proxyGetter() {
              return me._data[key]; // 代理成this._data模式
          },
          set: function proxySetter(newVal) {
              me._data[key] = newVal;
          }
      });
  },

  _initComputed: function() { // computed计算属性
      var me = this;
      var computed = this.$options.computed;
      if (typeof computed === 'object') {
          Object.keys(computed).forEach(function(key) {
              Object.defineProperty(me, key, {
                  get: typeof computed[key] === 'function' 
                          ? computed[key] 
                          : computed[key].get,
                  set: function() {}
              });
          });
      }
  }
};