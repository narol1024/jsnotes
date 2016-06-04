##前言
好像有一个月没有写博客，最近沉迷了一款手游，工作之外的时间几乎被游戏占据了。夜深了，深感惭愧，遂静下心来写写东西，努力提升自己的专业能力。
其实，在写这篇文章前，为了使自己的理解更加透彻，表达更加清晰，自己花了好多时间去收集资料，才下笔的。

##简介
这次要讲的是javascript的“事件”，主要从**事件**、**事件流**以及**事件处理程序**这几个点去阐述。
##概念
* `事件`：就是文档或浏览器器窗口中发生的一些特定的交互瞬间，我可以通过事件监听器（或处理程序）来预定可以发生的事件，以便事件发生时执行相应的代码。
* `事件流`：用来描述从页面中接收事件的顺序，比如用户点击了某个DOM节点，那么这个事件在浏览器器上是怎么样被接收到的，这里主要存在两种观点。
* `事件处理程序`：通俗点来说，用来处理或响应事件的函数，而注册方式有很多种。

##进入主题
###事件流  
作为一名初级前端开发程序员，我曾经对这个概念相当的模糊，不是因为本身的概念很难明白，而是这个概念要追溯到上个世纪90年代的，当时对事件流的理解没有达成一致，浏览器开发团队微软和Netscape（网景）对于事件流提出了几乎完全相反的事件流。  

* IE：它认为事件流是事件冒泡流。
* Netscape：它则认为事件流是事件捕获流。

####事件冒泡流   
由IE开发团队提出，它认为事件开始时由最具体的元素接收，然后，逐级向上传播到较为不具体的节点。 这个很比较理解，因为生活中有很多直观的例子，比如水中的鱼儿吐出的气泡（事件）。如图  
![小鱼冒泡](https://raw.githubusercontent.com/linjinying/jsnotes/master/pictrues/2016/1.png)  
也就是说，在浏览器的DOM结构中，假设用户点击了某个节点，此时这个事件就像鱼儿吐了一个气泡一样，一层又一层的向上冒泡，一直冒泡到了水平面（window对象）。 
#####注意：
对于冒泡流的事件流机制，存在如下的兼容问题：  

- `ie5.5或以下` p -> div -> body -> document    


- `ie6+`  p -> div -> body -> html ->　document    


- `ie9+,firefox,chrome,safari` p -> div -> body -> html ->　document -> window

####事件捕获流   
这个概念显得没有那么直白，甚至有些反正常的思维。最早由Netscape团队提出的捕获流，它认为事件应该从不太具体的节点开始接收，而最具体的节点应该最后接收到事件，事件捕获的用意在在于在事件到达预定目标之前捕获它，如图

![事件捕获](https://raw.githubusercontent.com/linjinying/jsnotes/master/pictrues/2016/2.png)
  
其实在生活中，也有许多例子。例如公司的前台MM帮员工代收快递，一件快递在到你手上之前，一般会经过前台MM，还可能同事帮你跑腿，再到你手上，这个快递最后才会落在你手上。   
因为IE9以下的浏览器不支持事件捕获流，所以，建议使用事件冒泡流。必要的时候，再使用事件捕获。
尽管“DOM2级事件”的规范是要求事件捕获是从document对象开始传播，但是大多数浏览器都是从window开始传播： window -> document -> html -> body -> div  

####DOM事件流 
DOM事件流是在“DOM2级事件”中规范出来的，它规定的事件流应该包括三个阶段：事件捕获阶段、处于目标阶段、事件冒泡阶段。首先发生的是事件捕获、为截获事件提供了机会。然后是实际的目标收到事件。最后一个阶段是冒泡阶段，可以在这个阶段对事件做出响应。假设在页面上点击了一个div元素，这个事件会按照下面的顺序图进行传播。
![DOM事件流](https://raw.githubusercontent.com/linjinying/jsnotes/master/pictrues/2016/3.png)

IE9、Opera、Firefox、Chrome和Safari都支持DOM事件流。

你点个赞。其实javascript的事件流的内容大概就是这些了。然而你会问，这么多理论，到底有个卵用啊？？？肯定有卵用啦，不然人家也不会出规范啦。这里我写了一个实例，帮助大家理解DOM事件流  
```html
<div id="div">
	<button id="button">button</button>
</div>
```
```javascript
var $button = document.getElementById("button");
var $div = document.getElementById("div");
$div.addEventListener("click",function(event){
    console.info("这是捕获阶段的div");
},true);
$button.addEventListener("click",function(event){
	console.info("这是捕获阶段的button");
},true);
$button.addEventListener("click",function(event){
	console.info("这是冒泡阶段的button");
},false);
$div.addEventListener("click",function(event){
    console.info("这是冒泡阶段的div");
},false);
```