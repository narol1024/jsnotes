##前言
好像有一个月没有写博客，最近沉迷了一款手游，工作之外的休息时间几乎被游戏占据了。夜深了，深感惭愧，遂静下心来写写东西，努力提升自己的专业能力。
其实，在写这篇文章之前，为了使自己的理解更加透彻，表达更加清晰，自己花了好多时间去收集资料，才动笔的。

##简介
这次要讲的是javascript的“事件”，主要从**事件**、**事件流**以及**事件处理程序**这几个点去阐述。
##概念
* `事件`：就是文档或浏览器窗口中发生的一些特定的交互瞬间，我们可以通过事件侦听器（或处理程序）来预定可能发生的事件，以便事件发生时执行相应的代码。
* `事件流`：用来描述从页面中接收事件的顺序，比如用户点击了某个DOM节点，那么这个事件在浏览器上是怎么样被接收到的，关于这个问题，下文会做详细的讲解。
* `事件处理程序`：通俗点来说，就是用来处理或响应事件的函数，而注册事件处理程序又有很多种方式。

##进入主题
####事件流  
作为一名初级前端开发程序员，我曾经也是对这个概念相当的模糊，不是因为概念本身很难明白，而是这个概念要追溯到上个世纪90年代，属于错综复杂的那种，当时浏览器开发商对浏览器事件流的理解没有达成一致，浏览器开发团队微软和Netscape（网景）对于事件流提出了几乎完全相反的概念。  

* IE：它认为事件流应该是事件冒泡。
* Netscape：它则认为事件流应该是事件捕获。

####事件冒泡   
由IE开发团队提出的事件冒泡，认为事件开始时由最具体的元素接收，然后，逐级向上传播到较为不具体的节点。 这个很好理解，，冒泡冒泡嘛，就像水中的鱼儿吐出的气泡（事件）一样。如图  
![小鱼冒泡](https://raw.githubusercontent.com/linjinying/jsnotes/master/pictrues/2016/1.png)  
也就是说，在浏览器的DOM结构中，假设用户点击了某个DOM节点，此时这个事件就会像鱼儿吐了气泡一样，一层又一层的向上冒，一直冒到了水平面（`window`或`document`对象）。 
#####注意：
对于冒泡流的事件流机制，存在如下的兼容问题：  

- `ie5.5 或以下` p -> div -> body -> document    


- `ie6+`  p -> div -> body -> html ->　document    


- `ie9+,firefox,chrome,safari` p -> div -> body -> html ->　document -> window

####事件捕获   
这个概念显得没有那么直白，甚至有些反正常的思维。最早由Netscape团队提出的事件捕获，它认为事件应该从不太具体的节点开始接收，而最具体的节点应该最后接收到事件，事件捕获流的用意在于在事件到达预定目标之前捕获它，如图

![事件捕获](https://raw.githubusercontent.com/linjinying/jsnotes/master/pictrues/2016/2.png)
  
其实在生活中，也有许多例子。例如公司的前台MM帮员工代收快递，一件快递在送到你手上之前，一般会经过前台MM的代签，还可能同事帮你跑腿，再到你手上，这个快递最终才会落在你手上。   
需要注意的是，因为`IE9`以下的浏览器不支持事件捕获，所以，建议使用事件冒泡。必要的时候，再使用事件捕获。
尽管“DOM2级事件”的规范是要求事件捕获是从`document`对象开始传播，但是大多数浏览器都是从window开始传播： window -> document -> html -> body -> div  

####DOM事件流 
DOM事件流是在“DOM2级事件”中规范出来的，它规定的事件流应该包括三个阶段：事件捕获阶段、处于目标阶段、事件冒泡阶段。首先发生的是事件捕获，它为截获事件提供了机会。然后是实际的目标收到事件。最后一个阶段是冒泡阶段，可以在这个阶段对事件做出响应。假设在页面上点击了一个div元素，这个事件会按照下面的顺序图进行传播。
![DOM事件流](https://raw.githubusercontent.com/linjinying/jsnotes/master/pictrues/2016/3.png)

IE9、Opera、Firefox、Chrome和Safari都支持DOM事件流。

其实javascript的事件流的内容大概就是这些了。然而你会问，这么多理论，到底有个卵用啊？？？当然是有用的，它可以让我们在恰当的时机阻止事件的触发，以及帮助理解`jQuery`的事件委托是怎样实现的（以后的文章会有专门的介绍）。这里我写了一个实例，帮助大家理解DOM事件流  
```html
<div id="div">
	<button id="button">button</button>
</div>
```
```javascript
var $button = document.getElementById("button");
var $div = document.getElementById("div");
$div.addEventListener("click",function(event){
    console.log("捕获阶段的div");
},true);
$button.addEventListener("click",function(event){
	console.log("捕获阶段的button");
},true);
$button.addEventListener("click",function(event){
	console.log("冒泡阶段的button");
},false);
$div.addEventListener("click",function(event){
    console.log("冒泡阶段的div");
},false);
```  

上面的例子，打印出来的是log顺序应该是：`捕获阶段的div` -> `捕获阶段的button` -> `冒泡阶段的button` -> `冒泡阶段的div`。   
假设我只想让事件传播到捕获阶段的`捕获阶段的div`就停止了，这时候只要在事件处理程序里面加上`event.stopPropagation()`就ok了。
```javascript
$div.addEventListener("click",function(event){
	console.log("这是捕获阶段的div");
	event.stopPropagation();
},true);
```

###事件处理程序
我们知道，事件就是用户或浏览器自行执行的某种动作，而响应某个事件的函数，就叫做**事件处理程序**（**事件侦听器**）。事件处理程序的名称以`on`开头，，所以click事件的事件处理程序就是onclick，load事件的事件处理程序就是onload了。而为事件指定处理程序的方式有好几种：

- HTML事件处理程序
- DOM0级事件处理程序
- DOM2级事件处理程序
- IE事件处理程序

#####1)HTML事件处理程序
这种事件处理方式非常简单，直接在HTML中定义，然后执行函数写在javascript脚本上,而且执行函数的作用域必须暴露在`window`上：  
```html
<button onclick="hello()"></button>
```
```javascript
function hello(){
   console.log("hello world");
}
```  
这种方式很明显的缺点是，用户如果在执行函数（`hello()`）没有加载完之前，就点击了按钮，页面就会抛出一个错误，当然这个可以通过try-catch来解决，另外，在《**javascript高级程序设计**》这本书中说到，这种方式会让HTML和javascript代码紧密耦合，维护性比较差，这个呢，我不敢苟同啊（毕竟angularJS 1.x都是这么做的，没感觉到难维护）。

#####2)DOM0级事件处理程序
这种方式至今仍然为所有现代浏览器所支持。原因是简单、且具有跨浏览器的优势。   
每个元素（包括window和document）都有自己的事件处理程序属性，这些属性通常全部小写。例如onclick。将这种属性的值设置为一个函数，就可以指定事件处理程序了，如：  
```html
<button id="button"></button>
```
```javascript
var $btn = document.getElementById("button");
$btn.onclick = function(){
	console.log("hello world");
};
``` 
在使用DOM0级事件处理程序时，执行函数被认为是元素的方法。因此，这时候执行函数里的作用域就是当前元素了，这也是为什么`this`引用会指向元素而不是`window`的原因了。以这种方式添加的事件处理程序会在事件流的**冒泡阶段**被处理。   
值得注意的是，用DOM0级事件处理程序时，会遇到一种情况，就是一个元素只能绑定一个同类型的事件，即一个元素不能同时绑定多个click事件,如果绑定多个的话，最后一个会覆盖前面所有的绑定（执行函数被认为是元素的方法，当然会覆盖了）。    
如果要注销元素的事件处理程序的话，很简单，只要将该元素的事件处理程序设置为`null`即可（同时也会注销用`HTML事件处理程序`方式注册的事件处理程序），比如:   
```javascript
$btn.onclick = null;
```  
#####3)DOM2级事件处理程序

“**DOM2级事件**”定义两个方法：`addEventListener`和`removeEventListener`。它们都接受3个参数：**事件名**、**事件处理程序的函数**、**一个布尔值**（`true`表示在捕获阶段调用事件处理程序函数、`false`表示在冒泡阶段调用事件处理程序，默认为`flase`）。为一个元素绑定事件处理程序，并在冒泡阶段调用，可以这么写：  
```javascript
var $btn = document.getElementById("btn");
btn.addEventListener("click",function(){
	console.log(this);
},false);
```  
那么，为这个元素注销绑定的事件处理程序，应该是：
```javascript
var $btn = document.getElementById("btn");
btn.removeEventListener("click",function(){
	console.log(this);
},false);
```  
Sorry，这样是注销不了的。实际上，DOM2事件处理程序的规范要求，`addEventListener`和`removeEventListener`传入的事件处理程序函数必须相同，上面的例子是因为函数的引用地址不同。因此，我们可以这样处理：
```javascript
var $btn = document.getElementById("btn");
var handlder = function(){
	console.log(this);
};
btn.addEventListener("click",handlder,false);
btn.removeEventListener("click",handlder,false);
``` 

另外，DOM2级事件处理程序，是允许一个元素同时注册同个类型的事件的，因此一个div绑定多个`click`，这种情况也是被允许的。我们知道`IE9+`,`FireFox`,`Safari`,`Chrome`,`Opera`都是兼容**DOM事件流**的，所以同样也兼容**DOM2级事件处理程序**。

#####4)IE事件处理程序
我们“可（zuo）爱（si）”的IE浏览器实现了与DOM2级处理程序类似的方法：`attachEvent`和`detachEvent`。不过这两个方法分别接受两个参数：`on`+事件名、事件处理程序函数。由于IE8及更早版本只支持事件冒泡，所以通过attachEvent添加的事件处理程序都会被添加到冒泡阶段。  
同样的，我们为一个元素注册或注销事件处理程序时，可以这么写：
```javascript
var $btn = document.getElementById("btn");
var handlder = function(){
	console.log(this);
};
$btn.attachEvent("onclick",handlder);
$btn.detachEvent("onclick",handlder);
```  

这里有几点要注意的：  

- 我们发现attachEvent的第一个参数并不是直接传事件名`click`，而是加了"on"。
- 用`console.log`打印出来`this`是指向`window`,而不是元素本身。卧槽，IE小盆友，你确定这个不是bug吗？
- 用attachEvent注册多个同类型的事件处理程序函数时，函数并不是按照他们定义时的顺序执行，而是相反的顺序执行。

##干货
扯了这么多，不知道你看晕了没有。没关系，这里留一个经典的干货，**跨浏览器的事件处理程序**：
```javascript
var EventUtil = {
	addEvent:function(element,type,handler){
		if(element.addEventListener){
			element.addEventListener(type,handler,false);
		}else if(element.attachEvent){
			element.attachEvent("on"+type,handler);
		}else{
			element["on"+type] = handler;
		}
	},
	removeEvent:function(element,type,handler){
		if(element.removeEventListener){
			element.removeEventListener(type,handler,false);
		}else if(element.detachEvent){
			element.detachEvent("on"+type,handler);
		}else{
			element["on"+type] = null;
		}
	}
};
```  

##参考资料  
- 《javascript高级程序设计》