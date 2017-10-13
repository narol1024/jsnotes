## 简介
理解一个东西，可以先从理解字面上的意思吧。  
`callee`的意思是被调用者，`caller`的意思是调用者。在[JavaScript MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)上可以看到比较官方的解释。
* `callee`：指向正在执行的函数。
* `caller`：指向调用当前函数的函数。  

## 使用
##### 1.用法
那么callee和caller怎么使用的呢？如果有用JS写过递归函数的童鞋都知道，用arguments.callee实现递函数时会更方便的，那这样看来callee和caller应该都是arguments的属性了。那么就不难理解了，下面的例子：
```javascript
var readBook = function(){
    console.log(arguments.callee);//这里返回的是read函数
    console.log(arguments.caller);//这里返回的应该是go函数
};
var go = function(){
    readBook();
};
go();
```
然而运行一下这串代码就会发现，callee确实是返回正在执行的参数readBook，而caller返回的是undefined。  
再去看下[JavaScript MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)，出于安全性的考虑，原来arguments.caller这个属性早已被删除了，现在已经用Function.caller来替代这个属性了，那么正确的写法应该是readBook.caller或arguments.callee.caller。如果readBook自己直接调用的话，则会返回null值。譬如：
```javascript
var readBook = function(){
    console.log(arguments.caller);//返回null
};
readBook();
```
##### 2.注意
值得注意的是，在严谨模式下，使用arguments.callee和Function.caller时浏览器都会抛出错误，还有在严谨模式下，假如给caller属性赋值的话，同样也会抛出错误。  
##### 3.经典实例
在实现递归的时候，可以达到解耦的作用，我们可以不必理会函数名是什么。例如下面的阶乘函数：
```javascript
function factorial(number){
  if(number <= 1){
    return 1;
  }else{
    return number*arguments.callee(number-1);
  }
}
factorial(100);
```
## 兼容性
几乎所有浏览器都支持这两个属性，除了早期的opera浏览器。
## 参考资料
– JavaScript MDN [callee](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments/callee) [caller](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments/caller) [caller](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/caller)
