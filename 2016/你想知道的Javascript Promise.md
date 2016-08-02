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
do('taskA',function(){
  do('taskB',function(){
	do('taskC',function(){
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
### Promise
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
`onResolve`和`onReject`两个都是可选的参数，成功时会调用onResolve，失败时调用reject进行错误的捕捉，但是一般情况下，我们都会用catch进行错误的捕捉(下文会阐述原因)。  
catch方法的使用：   
```javascript
promise.then(function onResolve(){
//成功时调用
}).catch(function onReject(error){
//失败是调用
});
```  
#### **静态方法** 
Promise提高了全局对象`Promise`，拥有一些静态方法。包括`Promise.all()`、`Promise.race`、`Promise.resolve`、`Promise.reject`等，主要都是一些对Promise进行操作的辅助方法。  
### 基本用法
#### 创建Promise
**pokemon GO**是最近火爆全球的手游，