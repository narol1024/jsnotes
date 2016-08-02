## 前言
啊A同学是一名web开发者，自称精通javascript，css+div，photoshop等各项屌炸天技能，可谓自信心爆灯了。可是有一天啊B同学是搞Java的，他在写JS代码时，发现多个接口异步请求数据时，每个接口都依赖上一个接口的结果，写出来的代码是这样的：  
```javascript
$.ajax({
    url: '/a',
    success: function (data) {
		if(data.code === 1){
			$.ajax({
	            // 要在第一个请求成功后才可以执行下一步
	            url: '/b',
	            success: function (data) {
	                 if(data.code === 1){
						$.ajax({
				            // 要在第二个请求成功后才可以执行下一步
				            url: '/c',
				            success: function (data) {
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
在写到第n个ajax调用时，啊B同学强迫症犯了，于是到啊A同学那寻医问诊，问能否抢救一下？啊A同学若有所思，据他多年的经验，马上拍板建议把各个ajax请求切成n个函数片段，再逐个调用。表面上，啊A同学解决了嵌套回调的问题，并获得了同事的高度赞赏。  

。。。。  

过了几个小时，啊B同学问，能否在接口调用失败的情况下，提示一下用户呢？ 啊A同学机智地说：在每个回调里判断一下就可以了，也算是实现了。但是随着代码量的增加，代码越写越乱，编程的体验会变成得非常糟糕。   
这时候，傲气的啊C同学又过来安利了，试试JS的Promise吧，专治“回调金字塔”100年。   
好吧，我不装了！是的，啊A同学就是我。那什么是Promise呢？  

## 什么是Promise
承诺？ 誓言？  
好吧，知道你无法理解，咱们程序员都是单(gu)纯（du）可(zhong)爱（lao），怎么可能会理解怎么感性的词儿呢？那么按照音译-**[普罗米修斯](https://zh.wikipedia.org/wiki/%E6%99%AE%E7%BD%97%E7%B1%B3%E4%BF%AE%E6%96%AF)**，一个希腊神话的英雄,名字的意思是“先见之明”。

那么“先见之明”跟JS编程怎么扯上了？

举个例子，如果C任务的执行依赖B任务，而B任务的执行，又依赖A任务，。如果用回调视的代码实现的话，大概是这样的：  
```javascript
taskA(function(){
  taskB(function(){
	taskC(function(){
		...
	});
  });
});
```  
这就是著名的回调金字塔，如果异步的任务一，维护起来将是灾难性的。  
这时候神话的英雄普罗米修斯就来拯救大家了，普罗米修斯有先知的能力，因此，他可以规划好每个任务的发展：

图


因此如果普罗米修斯会写代码的话，代码的实现大概是这样的：   
```javascript
var taskA = function(){
};
var taskB = function(){
};
var taskC = function(){
};
var promise = Promise.resolve();
	promise
	.then(taskA)
	.then(taskB)
	.then(taskC)
	.catch(function(){
	  	console.info("the End");
	});
```  
是不是觉得更符合我们的直觉呢？其实这种编程思维就是所谓的Promise模式，之所以称为模式，是因为它不是javascript特有的东西，在各种语言平台都出现过:
- Java的java.util.concurrent.Futrue   
- Python的Twisted deferreds and PEP-3148 futures  
- F#的Async  
- .Net的Task  
- Javascript的Promise A+  

Promise模式是由最早由CommonJs社区提出并实现，一般用于异步操作，目的是为了消灭“回调金字塔”，提高编程体验，目前已经被ECMAScript 2015纳入标准，因此浏览器都逐渐支持了原生Promise，兼容性如图：  

图

而且大家不必担心浏览器兼容的问题，关于Promise的Polyfill类库太多了，并且Polyfiill类库提供的API要比标准的多得多，比较有名的有：   
- [es6-promise](https://github.com/jakearchibald/es6-promise)  
- [Q.js](https://github.com/kriskowal/q)  
- [bluebird](https://github.com/petkaantonov/bluebird)

大家在挑Polyfill类库时，应该首先考虑是否支持Promise A+规范。

## 细说Promise
看到这里，我想你稍微了解什么是Promise以及它能解决什么问题了。   
我们继续了解Promise吧，以下是基于ECMAScript 2015的Promise规范标准来阐述的。
### Promise的状态  
从Promise模式的角度看，完成一个任务，可分成3种状态。   

- **pending** - 未完成，准备状态  
- **resolve**   任务成功时调用
- **reject**  任务失败时调用

Promise的状态转化只发生一次（从pending变成resolve或变成reject），即状态会被凝固，不再改变。从这点看来，Promise似乎非常适合异步操作，比如javascript读取一个文件，要么读取成功(resolve)，要么读取失败(reject)。 

### Promise的API
在ECMAScript 2015的Promise标准中定义的API不是很多。  
目前分三种类型：

- **Constructor** 构造器
- **Instance Method** 实例方法
- **Static Method** 静态方法

#### **构造器**   
类似Date,我们可以用构造函数`Promise`来创建一个promise对象，比如：  
```javascript
var promise = new Promise(function(resolve,reject){
   //处理异步,结束后调用resolve或reject
});
```  
#### **实例方法**  
我们知道构造函数通过new生成的对象，一般含有实例方法，Promise也不例外。上面的`promise`对象有两个实例方法，分别是`then`，`catch`方法。  
then方法的使用:   
```javascript
promise.then(function onResolve(){
//成功时调用
},function onReject(){
//失败是调用
});
```  
`onResolve`和`onReject`两个都是可选的参数，成功时会调用onResolve，失败时调用reject进行错误的捕捉，但是一般情况下，我们都建议使用catch进行错误的捕捉(下文做解释)：   
```javascript
promise.then(function onResolve(){
	//成功时调用
}).catch(function onReject(error){
	//失败是调用
});
```  
#### **静态方法** 
Promise提高了全局对象`Promise`，拥有一些静态方法。包括`Promise.all()`、`Promise.race`、`Promise.resolve`、`Promise.reject`等，主要都是一些对Promise进行操作的辅助方法。  
### <del> 基本用法 </del>游戏环节
**pokemon GO**是最近火爆全球的一款手游，玩家可以对现实世界中出现的精灵进行探索捕捉、战斗以及交换，既然目前中国区还玩不了，今天我们就写一个简（nao）单（can）版的pokemon Go来玩玩吧。
#### 创建Promise
**游戏规则**：小智走进一片森林里，他尝试着搜寻下附近的精灵，并且有一定的机率捕捉到。  

我们知道，`Promise`是一个构造函数，因此我们可以使用new调用Promise的构造器来进行实例化。   
```javascript
var promise = new Promise(function(resolve, reject) {
	// 异步处理
    // 处理结束后、调用resolve 或 reject
});
```
我们看到构造函数的参数是一个函数，该函数的两个参数分别是resolve和reject，这两个参数是javascript内置提供的。resolve表示异步操作成功后调用，reject表示异步操作失败时调用。实例化之后，直接调用promise的实例化方法`then`，且这个方法返回的是一个新的`promise`实例。
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
}).catch(function onReject(){
	//失败时调用
});
```
值得注意的是，如果只想处理异步操作的情况，只需要采用`promise.then(undefined, onReject)`这种方式即可。好了，基本上，实现一个简单的promise大概就这样了。哎呀，糟了，忘记小智还要去捉精灵呢？马上送上游戏源代码：[github](https://github.com/linjinying/jsnotes/blob/master/source/promise/promise-1.html)和游戏入口
###Promise的链式调用
什么鬼，你说我这个游戏有弱智？？？   
好吧，改改改！  
**游戏规则**：小智走进一片森林里，他尝试着搜索附件的精灵，并且有一定的机率捕捉到他们。   
再玩这个游戏之前，我们先来学习一下Promise的链式调用(**Promise Chain**)吧。我们知道，“回调墙”从本质上来讲，任务是线性发生的，只不过`callback`的代码组织结构让人难以阅读和理解，人都习惯任务发生是一个线性结构。那么`Promise`的链式调用就是用来解决这个问题的。上文提到`promise`的实例方法`then`返回是一个新的promise对象，所以promise才得以链式调用。所以，`promise`的链式调用可以这样写：   
```javascript
var promise = new Promise(function(resolve,reject){
	resolve();
});
var taskA = function(){
	console.log("A done!");
};
var taskB = function(){
	console.log("B done!");
};
promise
.then(taskA)
.then(taskB)
.catch(function(error){
	console.log(error);
});
```
可以你已经注意到，`Promise`实例的参数中，是直接调用`resolve`的，其实这里我们只是用它来生成一个promise对象，但是`Promise`的静态方法`resolve`已经为我们提供了生成`promise`对象的快捷方式（Promise.reject同理），因此下面的代码来实现：   
```javascript
var promise = Promise.resolve();
```   
或者你还存在疑问，假设各个`task`之间需要传值呢？很简单，只要在每个`task`作为返回值即可。即：
```javascript
var promise = Promise.resolve(1);
var taskA = function(value){
	console.log(value);//1
	return value + 1;
};
var taskB = function(value){
	console.log(value);//2
    return value + 2;
};
promise
.then(taskA)
.then(taskB)
.catch(function(error){
	console.log(error);
});
```
值得注意的是，这里我们都是用`catch`来捕捉异常的。那到底用`.then`里同时指定处理对错误进行处理的函数相比，和使用 catch 又有什么异同呢？看下面的例子就明白了：
```javascript
function throwError() {
    // 抛出异常
    throw new Error("错误");
}
function taskA(onReject) {
    return Promise.resolve().then(throwError, onReject);
}
function taskB(onReject) {
    return Promise.resolve().then(throwError).catch(onReject);
}
taskA(function(){
    console.log("taskA Error");
});
taskB(function(){
    console.log("taskB Error");
});
```
运行的结果是，`taskA Error`并没有被执行到，而`taskB Error`则会被执行到，那是因为TaskA虽然在`.then`的第二个参数中指定了用来错误处理的函数，但实际上它却不能捕获第一个参数 onResolve 指定的函数（本例为 throwError ）里面出现的错误。也就是说，这时候即使 throwError 抛出了异常。与此相对的是，`taskB`在throwError 中出现异常的话，在会被方法链中的下一个方法，即`.catch`所捕获，进行相应的错误处理。