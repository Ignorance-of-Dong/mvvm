let crop = {}; //自定义一个对象
crop.list = {}; //存放缓存毁掉函数
crop.on = function(key, fn) { // 订阅
  // console.log(this.list) // crop.list
    if (!this.list[key]) { // 如果检测不到list里面有key值
      // console.log(!this.list[key])
        this.list[key] = []; // this.list = {readers: []}
    }
    this.list[key].push(fn); // 将【回调】添加到list数组
    // console.log(this.list[key], 'this.list["readers"]');
}

crop.emit = function() { // 发布
    // console.log(arguments);
    let key = [].shift.call(arguments); // 返回删除的值【arguments【0】】
    // console.log(key,'key');
    let fns = this.list[key]; // 获取到list 【也就是订阅者的回调函数】
    // console.log(fns, 111111111111);
    if (!fns || !fns.length) { // 如果没有获取到就return
        // console.log(2);
        return
    }
    fns.forEach(fn => {
        // console.log(fn,'fn'); //拿到订阅者的回调
        console.log(arguments)
        // fn.apply(this, arguments) // 
        fn(...arguments)
    })
}

crop.on('readers', function(...addr) {
  console.log(addr)
    console.log('我订阅的《读者》更新了的话请寄到' + addr)
})


crop.emit('readers', '山西省阳泉市刘中保')
// crop.emit('readers', '山西省阳泉市张政') //我订阅的《读者》更新了的话请寄到浙江省杭州市XXX
// crop.emit('youth', '山西省阳泉市XXX') //我订阅的《青年文摘》更新了的话请寄到山西省阳泉市XXX



/**
 * 简单的订阅发布者模式
 */

// 定义一个对象，并定义一个存放毁到函数的数组，
// 首先需要订阅者，订阅者接受两个参数，

/**
 * 参数1 （key值）
 * 参数2 （回调函数）
 */

// 订阅者函数收到这两个参数，将key值存放数组中，并将这个回调push到该key中存放起来

// 发布者函数

/**
 * 参数1 （key值）
 * 参数2 （需要传递的值）
 */

// 首先将传递的参数进行一个截取，将第一个key值取出来，通过key值提取到存放的回调函数，因为存放的这个回调函数是个数组
// 所以需要遍历
