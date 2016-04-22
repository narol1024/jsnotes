##前言
周五，广州，阴。   
又瞎忙了一阵子了，总算忙完了公司的“代码”，自我感觉其实每天写业务代码，除了锻炼自己的业务逻辑思维，对提升技术本身并没有多少提高。很多情况下，为了赶项目，写下了连自己都没法原谅的代码。所以，只好利用休息时间来补补知识。
##简介
这次，我要讲的还是一对“孪生兄弟”：`call` 和 `apply`，作为一名初级javascript程序员，我们只能回答说“我好像在哪里看过”。对于他们俩的区别，傻傻分不清楚，更别说使用了。好了，从字面上来看，两个小兄弟似乎都有“调用”的意思。从[JavaScript MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)了解到。

* `call`：使用一个指定的this值和若干个指定的参数值的前提下调用某个函数或方法。
* `apply`：在指定的this 值和参数（数组或类数组对象）的情况下调用某个函数。   

MB，好像这概念很晦涩的样子。都是什么鬼啊？？  
换个通俗易懂的说法就是：

* `call`：调用一个对象的一个方法，以另一个对象替换当前的this，其中传参以不定数的参数传传入。
* `apply`：调用一个对象的一个方法，以另一个对象替换当前的this，其中传参以数组或类数组对象传入。   


感觉是不是又理解了一点了，没关系，再看看下面的例子，应该就差不多了。

```javascript
var color = "red";
var myColor = {color:"blue"};
var sayColor = function(){
	console.log(this.color);
};
sayColor();/*red*/
sayColor.call(myColor);/*blue*/
```
