## 目录

- [前言](#p-1)
- [什么是Promise](#p-2)
- [细说Promise](#p-3)
- [游戏环节](#p-4)  
- [参考资料](#p-5)


## <div id="p-1">前言</div>
本文旨在让大家对 `Javascript Promise` 有初步的认识，未对Javascript Promise做深入的阐述，如有表述错误，欢迎大家指正。  
在实际的项目开发中，我想大家或多或少都会碰到下面这种情况，多个接口异步请求数据时，每个接口的调用都得依赖上一个接口的结果，用代码表示大概是这样的：
```javascript
$.ajax({
    url: '/a',
    success: function(data) {
        if (data.code === 1) {
            $.ajax({
                url: '/b',
                success: function(data) {
                    if (data.code === 1) {
                        $.ajax({
                            url: '/c',
                            success: function(data) {
                                // ......
                            }
                        });
                    }
                }
            });
        }
    }
});
```
看完上面的代码，强迫症是不是又犯，没错！这就是我们常说的 **回调金字塔** ，当异步操作越来越多时，可能还需要再向领导申请一台显示器。   
大家也许听过Javasript Promise可以解决回调金字塔的问题，可能是对兼容性的怀疑，又或者觉得是**ECMAScript 2015**标准里的东西，感觉好难入手的样子。其实Javasript Promise只是一种代码组织模式而已，而且已经有好多类库实现了Promise了，比如jQuery的   `Deferred`,angular的`$q`以及`Q.js`等。
## <div id="p-2">什么是Promise</div>
承诺？ 誓言？  
好吧，作为程序员的我们可能真的无法理解感性的词语。更好的理解是，**Promise**按照音译的话，这是一个希腊神话的英雄的名字 **[普罗米修斯](https://zh.wikipedia.org/wiki/%E6%99%AE%E7%BD%97%E7%B1%B3%E4%BF%AE%E6%96%AF)**，意思是“ **先见之明** ”。那么“先见之明”跟JS编程怎么就扯上了？举个例子：   
> C任务的执行依赖B任务，而B任务的执行，又依赖A任务，如果任意一个任务执行失败则退出。   

如果用回调的方式实现的话，大概是这样的：    
```javascript
taskA(function() {
    taskB(function() {
        taskC(function() {
            ...
        });
    });
});

```

这样写的话，如果任务一多，代码的可维护性会变得非常的差，阅读起来也费劲。   
我们知道，普罗米修斯具有先知的能力，因此他可以规划好每个任务的发展：  
![普罗米修斯眼中的任务](https://raw.githubusercontent.com/linjinying/jsnotes/master/pictrues/2016/6.png)  
因此如果普罗米修斯会写代码的话，代码的实现大概是这样的：   
```javascript
var taskA = function() {};
var taskB = function() {};
var taskC = function() {};
var promise = Promise.resolve();
promise
    .then(taskA)
    .then(taskB)
    .then(taskC)
    .catch(function() {
        console.info("the End");
    });

```

先不说是否理解上面的代码，但是这种代码组织模式是不是更符合我们的直觉呢？其实这种模式就是所谓的 **Promise模式**，之所以称为模式，是因为它不是Javascript特有的东西，在各种语言平台都出现过:
- Java的java.util.concurrent.Futrue   
- Python的Twisted deferreds and PEP-3148 futures  
- F#的Async  
- .Net的Task  
- Javascript的Promise A+  

**Javascript Promise模式** 是由最早由CommonJs社区提出并实现，一般是用于异步操作，目的是为了消灭“回调金字塔”，提高编程体验，而Promise存在多个标准，分别有 **Promise A/B/D/A+**，而目前Promise A+已经被ECMAScript 2015纳入标准，因此浏览器都逐渐支持了原生Promise，兼容性如图：  

![兼容性](https://raw.githubusercontent.com/linjinying/jsnotes/master/pictrues/2016/7.png)  

而且大家不必担心浏览器兼容的问题，Promise的Polyfill类库有很多，而且Polyfill类库提供的API要比标准的还要丰富，比较有名的有：   
- [es6-promise](https://github.com/jakearchibald/es6-promise)  
- [Q.js](https://github.com/kriskowal/q)  
- [bluebird](https://github.com/petkaantonov/bluebird)

由于第三方类库支持的Promise标准不一样，所以大家在挑Polyfill类库时，优先考虑是否支持`Promise A+规范`，比如jQuery的Deferred就不属于Promise A+规范了。

## <div id="p-3">细说Promise</div>
看到这里，你应该稍微了解什么是Promise以及它能解决什么问题了。   
以下是基于ECMAScript 2015的Promise规范标准（Promise A+）作较为详细的阐述。
### Promise的状态  
从Promise模式的角度看，完成一个任务，可分成3种状态。   

- **pending** - 未完成，准备状态  
- **resolve**   任务成功时调用
- **reject**  任务失败时调用

Promise的状态转化只发生一次（从`pending`变成`resolve`或变成`reject`），即状态会被凝固，不再改变。从这点看来，Promise似乎非常适合异步操作，比如浏览器加载一张图片，要么加载成功(`resolve`)，要么加载失败(`reject`)。 

### Promise的API
在ECMAScript 2015的Promise标准中定义的API不是很多。  
目前分三种类型：

- **Constructor** 构造器
- **Instance Method** 实例方法
- **Static Method** 静态方法

#### **构造器**   
类似Javascript的日期构造器 **Date** ,因此我们可以用构造函数 **Promise** 来创建一个promise对象，比如：  
```javascript
var promise = new Promise(function(resolve, reject) {
    //处理异步,结束后调用resolve或reject
});

```

#### **实例方法**  
我们知道构造函数通过new生成的对象，一般含有实例方法，Promise也不例外。上面的promise对象有两个实例方法，分别是`then`，`catch`方法。then方法的使用:   
```javascript
promise.then(function onResolve() {
    //成功时调用
}, function onReject() {
    //失败是调用
});

```

`onResolve`和`onReject`两个都是可选的参数，异步操作成功时会调用`onResolve`，失败时则调用`onReject`，但是一般情况下，我们都建议使用`catch`进行错误的捕捉(下文做解释)：   
```javascript
promise.then(function onResolve() {
    //成功时调用
}).catch(function onReject(error) {
    //失败是调用
});
```

#### **静态方法** 
`Promise`提供了全局对象`window.Promise`，这个对象拥有一些静态方法。其中包括`Promise.all()`、`Promise.race`、`Promise.resolve`、`Promise.reject`等，主要都是一些对Promise进行操作的辅助方法。  
## <div id="p-4"><del> 基本用法 </del>游戏环节</div>
 **pokemon GO** 是最近火爆全球的一款手游，玩家可以对现实世界中出现的精灵进行探索捕捉、战斗以及交换，既然目前中国区还玩不了，今天我们就写一个简（zhi）单（zhang）版的pokemon Go玩玩吧。
### 创建Promise
> **游戏规则**：小智走进一片森林里，他尝试着搜寻下附近的精灵。  

从上文我们知道，**Promise** 是一个构造函数，因此我们可以使用 **new** 来实例化对象。
```javascript
var promise = new Promise(function(resolve, reject) {
    // 异步处理
    // 处理结束后、调用resolve 或 reject
});
```

我们看到 **Promise** 在实例化的时是传入了一个函数，该函数的两个参数分别是`resolve`和`reject`，这两个参数是JS内置提供的。`resolve`表示异步操作成功后调用，`reject`表示异步操作失败时调用。实例化之后，直接调用promise的方法**then**，而then方法接收两个参数函数，第一个参数函数响应了异步操作成功，第二个则响应异步操作失败，而`then`最终返回的是一个新的promise实例。
```javascript
promise.then(function onResolve() {
    //成功时调用
}, function onReject() {
    //失败时调用
});
```

相当于   
```javascript
promise.then(function onResolve() {
    //成功时调用
}).catch(function onReject() {
    //失败时调用
});
```

值得注意的是，如果只想处理异步操作的情况，只需要采用`promise.then(undefined, onReject)`这种方式即可。好了，基本上，实现一个简单的promise大概就这样了。哎呀，糟了，忘记小智还要捉精灵。。。马上送上游戏：[游戏入口](http://codepen.io/linjinying/pen/grdxAm/)
###  Promise的链式调用
什么鬼，你说我这个游戏有弱智？？？   
好吧，改改改！

> **游戏规则**：小智走进一片森林里，他尝试着搜索附件的精灵，并且有一定的机率捕捉到他们。  
 
再玩这个游戏之前，先来学习一下Promise的**链式调用(Promise Chain)**吧。我们知道，“回调墙”从本质上来讲，任务是线性发生的，只不过`callback`的代码组织结构让人难以阅读和理解，人都习惯任务发生是一个线性结构。那么`Promise`的链式调用就是用来解决这个问题的。上文提到`promise`的实例方法`then`返回是一个新的promise对象，所以promise才得以链式调用。因此，`promise`的链式调用可以这样写：   
```javascript
var promise = new Promise(function(resolve, reject) {
    resolve();
});
var taskA = function() {
    console.log("A done!");
};
var taskB = function() {
    console.log("B done!");
};
promise
    .then(taskA)
    .then(taskB)
    .catch(function(error) {
        console.log(error);
    });
```

可以你已经注意到，实例化promise的时候，我们是直接调用`resolve`的，其实这里我们还可以借助 **Promise** 的静态方法`Promise.resolve`来生成promise对（`Promise.reject`同理），因此下面的代码来实现：   
```javascript
var promise = Promise.resolve();
```

或者你还存在疑问，假设各个`task`之间需要传值呢？很简单，只要在每个`task`作为返回值即可。即：
```javascript
var promise = Promise.resolve(1);
var taskA = function(value) {
    console.log(value); //1
    return value + 1;
};
var taskB = function(value) {
    console.log(value); //2
    return value + 2;
};
promise
    .then(taskA)
    .then(taskB)
    .catch(function(error) {
        console.log(error);
    });
```

值得注意的是，这里我们都是用`catch`来捕捉异常的。那到底用`.then`的第二个参数函数相比，跟使用`catch`又有什么区别呢？看下面的例子就明白了：
```javascript
function throwError() {
    throw new Error("错误");
}

function taskA(onReject) {
    return Promise.resolve().then(throwError, onReject);
}

function taskB(onReject) {
    return Promise.resolve().then(throwError).catch(onReject);
}
taskA(function() {
    console.log("taskA Error");
});
taskB(function() {
    console.log("taskB Error");
});
```

运行的结果是，`taskA Error`并没有被执行到，而`taskB Error`则会被执行到，那是因为TaskA虽然在`.then`的第二个参数中指定了用来错误处理的函数，但实际上它却不能捕获第一个参数`onResolve`指定的函数（本例为 `throwError`）里面出现的错误。也就是说，`throwError`抛出了异常是在方法链中的下一个方法，即`.catch`所捕获，然后进行相应的错误处理。    
学习了Promise的链式调后，我们来分析到一下游戏规则，大概是这样的：  
![游戏规则](https://raw.githubusercontent.com/linjinying/jsnotes/master/pictrues/2016/8.png)   
所以用Promise模式来实现的话，代码结构会变得非常清晰。   
送上游戏源代码：[游戏入口](http://codepen.io/linjinying/pen/qNrXqE)
### Promise.all  
> **游戏规则**：小智又走进一片森林里，这天他的运气比较好，同时出现了4只精灵，但他必须全部捉到才能通关，否则只要有一个捕捉不到，即算游戏失败。  
   
老规矩，在玩游戏之前，我们先来学习理论知识。 **Promise.all** 是Promise提供的一个静态方法，用于将多个Promise实例，包装成一个新的Promise实例。例如：   
```javascript  
var p1 = new Promise(function(resolve, reject) {
    var value = Math.random();
    if (value > 0.5) {
        resolve(value);
    } else {
        reject("p1:" + value);
    }
});
var p2 = new Promise(function(resolve, reject) {
    var value = Math.random();
    if (value > 0.5) {
        resolve(value);
    } else {
        reject("p2:" + value);
    }
});
var p3 = new Promise(function(resolve, reject) {
    var value = Math.random();
    if (value > 0.5) {
        resolve(value);
    } else {
        reject("p3:" + value);
    }
});
var promise = Promise.all([p1, p2, p3]);
promise.then(function onResolved(value) {
    console.info(value); //[0.5985190889530145, 0.6911524297857181, 0.8921527493860548]
}).catch(function onRejected(error) {
    console.info(error); //p3:0.46978503261829485
});
```

上面代码中，`Promise.all`方法接受一个数组作为参数，`p1、p2、p3`都是Promise对象的实例，如果不是，就会先调用`Promise.resolve`方法，将参数转为Promise实例，再进一步处理，`p1、p2、p3`并不是一个个的顺序执行的，而是同时开始、并行执行的。。   
promise的状态由`p1、p2、p3`决定，分成两种情况：   

- 只有`p1、p2、p3`的状态都变成`resolved`，promise的状态才会变成`resolved`，此时`p1、p2、p3`的返回值组成一个数组，传递给promise的回调函数。
- 只要`p1、p2、p3`之中有一个被`rejected`，promise的状态就变成`rejected`，此时第一个被`reject`的实例的返回值，会传递给promise的回调函数。  

看到这里，你是不是发现，`Promise.all`就是我们想要的东西了吧。   
送上游戏源代码：[游戏入口](http://codepen.io/linjinying/pen/PzdKWj)   
### Promise.race
> 游戏规则：小智又走进一片森林里，同时出现了4只精灵，这时候他同时扔出口袋里的4个精灵球，当只要有一只精灵球出现捕捉成功或者捕捉失败时，就立马结束游戏。 
  
**Promise.race**也是Promise提供的静态方法，同样是将多个Promise实例，包装成一个新的Promise实例。例如：  
```javascript  
var p1 = new Promise(function(resolve, reject) {
    var value = Math.random();
    if (value > 0.5) {
        resolve("p1成功");
    } else {
        reject("p1失败");
    }
});
var p2 = new Promise(function(resolve, reject) {
    var value = Math.random();
    if (value > 0.5) {
        resolve("p2成功");
    } else {
        reject("p2失败");
    }
});
var p3 = new Promise(function(resolve, reject) {
    var value = Math.random();
    if (value > 0.5) {
        resolve("p3成功");
    } else {
        reject("p3失败");
    }
});
var promise = Promise.race([p1, p2, p3]);
promise.then(function onResolved(value) {
    console.info(value); //p1成功
}).catch(function onRejected(error) {
    console.info(error); //p1失败
});
```

跟`Promise.all`不一样，`Promise.race`只要有一个promise对象进入 `resolved`或者`rejected`状态的话，就会继续进行后面的处理，换句话说，假设`p1`的状态改变了，`p2`和`p3`还是会继续运行。   
送上最后一个游戏的源代码：[游戏入口](http://codepen.io/linjinying/pen/GqXrKx)   

## <div id="p-5">参考资料</div>
* [JavaScript MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  
* [ECMAScript 6 入门之Promise](http://es6.ruanyifeng.com/#docs/promise)  
* [JavaScript Promise迷你书](http://liubin.org/promises-book/#introduction) 