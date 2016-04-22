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


是不是感觉又理解了一点了，没关系，再看看下面的例子，应该就差不多了。

```javascript
var food = "fish";
var Tom = {food:"beef"};
var eatFood = function(friend1,friend2){
	console.log('我跟'+friend1+"和"+friend2+"一起去吃"+this.food);
};

/*我跟Karry和Mage一起去吃fish*/
eatFood("Karry","Mage"); 

/*我跟His Monter和His Father一起去吃beef*/
eatFood.call(Tom,"Monter","Father"); 
eatFood.apply(Tom,["Monter","Father"]);
```

eatFood是一个函数对象，`call`和`apply`是函数的一个内置的方法。在非严格模式下，直接调用eatFood()的时候，函数里的this是指向window的，所以打印出来的`food`是 `fish` ；而通过`call`或`apply`让函数对象的this指针指向`Tom`，因此打印出来的是`beef`。  
还有从例子中，我们也可以看出，call是接收参数需要逐个列举出来，apply则是接收数组形式的参数。
