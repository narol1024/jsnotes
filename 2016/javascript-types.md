## 目录

- [前言](#p-1)
- [数据类型](#p-2)
- [类型转换](#p-3) 
- [参考资料](#p-4)


## <div id="p-1">前言</div> 
最近在跟一个前辈交流时，他说如果学到的知识不能够很清晰的表达出来，只能说对它还不够深入，这跟“搞技术，就该追本溯源”不谋而合。切入今天的主题是，Javascript作为一门弱类型语言，在使用数据类型时看似很简洁方便，但是也给跟我们带来许多迷惑。比如`13>3`和`"13">"3"`一样吗？`{}+1`会输出啥？本文是阅读《javscript权威指南》后记录的一章读书笔记，希望大家能从中收获一二，如有表述错误，欢迎指正。

## <div id="p-2">数据类型</div> 
Javascript的数据类型可以分为两类：原始类型或原始值（**String**、**Number**、**Boolean**、**Undefined**、**Null**，以及ECMAScript 2015引入的**Symbol**）和对象类型（**Object**）。    
## <div id="p-3">类型转换</div>  
正因为Javascript是弱类型语言，所以在取值或赋值时会显得很宽容。但是在运算时，我们可能会遇到**类型转换**的情况，比如`1`在需要的时候，可以转换成`true`，字符串`1`可以转换成数字类型的`1`等等，这些表面看似毫无规律，其实这些转换规则还是是有套路规则的。 转换规则如下： 
![类型转换规则表](https://raw.githubusercontent.com/linjinying/jsnotes/master/pictrues/2016/9.png)  
（图1 类型转换规则表（来自javascript权威指南）） 
### 原始值转换
从规则表里看到，原始值转换原始值很简单，转换规则都是明确定义的，比如布尔值`true`转换成`Number`类型的话，就是`1`。而原始值转换成对象也非常简单，原始值通过调用`String()`、`Number()`或`Boolean()`函数，即把它们包装成对象即可。但是也有例外，比如`null`和`undefined`却不能转换成对象类型，否则会抛出异常。  
### 对象类型转换
但是对象类型转换原始值比较复杂。首先，这里可以分为两种情况：

- 对象类型转换布尔值
- 对象类型转换数字或字符串
#### 转换成布尔值  
这种情况只要记住一点就可以，所有的对象（包括函数和数组）都会转换成`true`，即便包装对象也是如此，比如`new Boolean(false)`也是转为布尔值`true`。   
#### 转换成数字或字符串  
第二种情况就稍微有些复杂了，这种情况是调用对象的转换方法来完成的，一个是**toString()**，另外一个是**valueOf()**，而难点就在于需要区分使用`toString`和`valueOf`的场景。
##### toString的使用
简单来说，对于非宿主对象而言，调用`toString()`方法，会得到一个有趣的字符串，如转换下面的对象：  
```javascript
var o = {x:1};
o.toString();// =>[object Object]
```
而有些对象继承的`toString`方法会被重写，比如数组，正则，函数，日期等，它们都会返回各自需要特定规则的字符串。例如下面的例子：  
```javascript
[1,2,3].toString();// => "1,2,3"
(function(){var a = 1;}).toString(); // =>"function(){var a = 1;}"
/\d+/g.toString(); // => "/\d+/g"
new Date().toString();// => Mon Sep 19 2016 09:17:03 GMT+0800 (中国标准时间)"
```
##### valueOf的使用
默认的`valueOf`方法返回的是对象本身，但日期就比较特殊，日期调用`valueOf()`后会返回：1970年1月1日以来的毫秒数。例如：   
```javascript
var o = new Date();
o.valueOf();//=>1474248424480
```
##### 转字符串过程
对象转换成字符串的过程可以下面的图来表示：
![转字符串过程](https://raw.githubusercontent.com/linjinying/jsnotes/master/pictrues/2016/10.png)  
在V8源代码里的实现函数是：  
```javascript
// ECMA-262, section 8.6.2.6, page 28.
function DefaultString(x) {
  if (!IS_SYMBOL_WRAPPER(x)) {
    if (IS_SYMBOL(x)) throw MakeTypeError(kSymbolToString);
    var toString = x.toString;
    if (IS_SPEC_FUNCTION(toString)) {
      var s = %_CallFunction(x, toString);
      if (IsPrimitive(s)) return s;
    }

    var valueOf = x.valueOf;
    if (IS_SPEC_FUNCTION(valueOf)) {
      var v = %_CallFunction(x, valueOf);
      if (IsPrimitive(v)) return v;
    }
  }
  throw MakeTypeError(kCannotConvertToPrimitive);
}
```
##### 转数字过程
对象转换成数字也做了同样的事情，只是它会首先尝试调用 `valueOf()`：
![转数字过程](https://raw.githubusercontent.com/linjinying/jsnotes/master/pictrues/2016/11.png)  
在V8源代码里的实现函数是：  
```javascript
// ECMA-262, section 8.6.2.6, page 28.
function DefaultNumber(x) {
  var valueOf = x.valueOf;
  if (IS_SPEC_FUNCTION(valueOf)) {
    var v = %_CallFunction(x, valueOf);
    if (IS_SYMBOL(v)) throw MakeTypeError(kSymbolToNumber);
    if (IS_SIMD_VALUE(x)) throw MakeTypeError(kSimdToNumber);
    if (IsPrimitive(v)) return v;
  }
  var toString = x.toString;
  if (IS_SPEC_FUNCTION(toString)) {
    var s = %_CallFunction(x, toString);
    if (IsPrimitive(s)) return s;
  }
  throw MakeTypeError(kCannotConvertToPrimitive);
}
``` 
所有，我们大概就可以知道为什么`[]`转换成数字会等于0了。它的转换过程是：
1)`[]`数组调用`valueOf()`返回对象本身而非原始值；   
2)继续调用`toString()`返回空字符串`""`；  
3)空字符串转换成数字`0`；
##### 转换优先级
对象类型在转换成原始值时具有一定的规则，在[V8的源代码](https://github.com/v8/v8/blob/4.7.59/src/runtime.js)里，可以找到**ToPrimitive**这个函数，一般会尝试先把对象转成数值类型，**除日期对象这个例外**，日期对象会先转换成字符串。toPrimitive函数如下:   

```javascript
// ECMA-262, section 9.1, page 30. Use null/undefined for no hint,
// (1) for number hint, and (2) for string hint.
function ToPrimitive(x, hint) {
  //hint的值可能为"NO_HINT"、"STRING_HINT"、"NUMBER_HINT";
  if (!IS_SPEC_OBJECT(x)) return x;
  //如果hint为空且是日期对象的话，则先调用String转换；
  if (hint == NO_HINT) hint = (IS_DATE(x)) ? STRING_HINT : NUMBER_HINT;
  return (hint == NUMBER_HINT) ? DefaultNumber(x) : DefaultString(x);
}
```
可以用以下例子做验证：   
```javascript
var d = new Date();
d.valueOf = function(){
	return 1;
};
d + 1; // => "1Tue Sep 20 2016 22:10:23 GMT+0800 (中国标准时间)"
var a = [];
a.valueOf = function(){
	return 1;
};
a+1; // => 2;
```
### 显式转换和隐式转换
类型的转换可分为两种：**显式转换**和**隐式转换**。  
#### 显式转换
在Javascript中，很多情况下，它会帮我们做自动转换，但是有时候我们也需要自行转换类型，Javascrip给我们提供了以下类型转换函数：

- **转换为数值类型**：`Number(mix)`、`parseInt(string,radix)`、`parseFloat(string)`
- **转换为字符串类型**：`toString(radix)`、`String(mix)`
- **转换为布尔类型**：`Boolean(mix)`
- **转换成对象类型**:`Object(mix)`

我们看到了熟悉常用的`Number`和`parseInt`函数，都是属于显示转换的。

#### 隐式转换
隐式转换是指，在某些操作符中，Javascript会自己做隐式的类型转换。以下是**操作符**对数据类型的隐性转换规则。
#### 操作符类型转换
这里主要是**一元操作符**、**位操作符**、**布尔操作符**、**乘性操作符**、**加性操作符**、**关系操作符**、**相等操作符**。这么多操作符，其实归纳起来讲就几种：  
1.一元操作符、位操作符，乘性操作符，加性操作符的减法操作可以归为一类，Javascript都倾向于把数据转换成数值类型再做运算。   
2.布尔操作符，譬如`!`，`&&`和`||`等，会把操作数转换`Boolean`类型再进一步处理。   
3.加法操作符的加法操作略微复杂。转换过程如下：  

- 如果两个操作数都是数值，则不转换，继续执行常规的加法运算。
- 只要有一个操作数是字符串，则会把另外一个操作数转换成字符串，再拼接起来。
- 否则，会把两个操作数转换成原始值(调用`toPrimitive()`)再回到第一步。

具体可以阅读V8的源代码ADD函数方法： 
```javascript
// ECMA-262, section 11.6.1, page 50.
function ADD(x) {
  // Fast case: Check for number operands and do the addition.
  if (IS_NUMBER(this) && IS_NUMBER(x)) return %NumberAdd(this, x);
  if (IS_STRING(this) && IS_STRING(x)) return %_StringAdd(this, x);
  // Default implementation.
  var a = %$toPrimitive(this, NO_HINT);
  var b = %$toPrimitive(x, NO_HINT);
  if (IS_STRING(a)) {
    return %_StringAdd(a, %$toString(b));
  } else if (IS_STRING(b)) {
    return %_StringAdd(%$nonStringToString(a), b);
  } else {
    return %NumberAdd(%$toNumber(a), %$toNumber(b));
  }
}
```

4.关系操作符的隐性类型转换规则如下：

- 只要有一个操作数是数值类型，则会把另外一个操作数转换成数值，再执行数值比较。
- 如果两个操作数都是字符串，再比较两个字符串对于的字符编码值。
- 如果有一个操作数是对象，则调用这个对象的`valueOf()`，如果没有`valueOf()`则会调用`toString()`，再按照前面的规则。
- 如果有一个操作数是布尔值，则先转换成数值类型，再比较。
- 只要有一个操作数是`undefined`或`NAN`，比较结果都会返回`false`。

具体可以查阅V8的关系符比较的[源代码](https://github.com/v8/v8/blob/4.6-lkgr/src/runtime.js#L105-L138)：
```javascript
// ECMA-262, section 11.8.5, page 53. The 'ncr' parameter is used as
// the result when either (or both) the operands are NaN.
function COMPARE(x, ncr) {
  var left;
  var right;
  // Fast cases for string, numbers and undefined compares.
  if (IS_STRING(this)) {
    if (IS_STRING(x)) return %_StringCompare(this, x);
    if (IS_UNDEFINED(x)) return ncr;
    left = this;
  } else if (IS_NUMBER(this)) {
    if (IS_NUMBER(x)) return %NumberCompare(this, x, ncr);
    if (IS_UNDEFINED(x)) return ncr;
    left = this;
  } else if (IS_UNDEFINED(this)) {
    if (!IS_UNDEFINED(x)) {
      %$toPrimitive(x, NUMBER_HINT);
    }
    return ncr;
  } else if (IS_UNDEFINED(x)) {
    %$toPrimitive(this, NUMBER_HINT);
    return ncr;
  } else {
    left = %$toPrimitive(this, NUMBER_HINT);
  }
  right = %$toPrimitive(x, NUMBER_HINT);
  if (IS_STRING(left) && IS_STRING(right)) {
    return %_StringCompare(left, right);
  } else {
    var left_number = %$toNumber(left);
    var right_number = %$toNumber(right);
    if (NUMBER_IS_NAN(left_number) || NUMBER_IS_NAN(right_number)) return ncr;
    return %NumberCompare(left_number, right_number, ncr);
  }
}
```
5.相等操作符的有两组操作符：相等和不相等，全等于不全等。因为全等不做隐性的类型转换，所有我们讨论的**相等**的隐性类型转换。转换规则如下：  

- 如果两个操作数都是字符串，则直接比较是否相等
- 如果两个操作数都是数值，也是直接比较
- 如果其中一个操作数是布尔值，则先转换成数值再做比较
- 如果其中一个操作数是字符串，另一个操作数是数值，在先把字符串转为数值
- 如果其中一个 是对象，另外一个不是，则先调用对象的`valueOf()`，没有此方法，则调用`toString()`，再按照前面的规则转换
- `null`和`undefined`不做转换
- 跟`if`语句不一样，相等操作符从来不将操作数转换成布尔值

具体可以查阅V8的关系符比较的[源代码](https://github.com/v8/v8/blob/4.6-lkgr/src/runtime.js#L45-L100)：
```javascript
// ECMA-262 Section 11.9.3.
function EQUALS(y) {
  if (IS_STRING(this) && IS_STRING(y)) return %StringEquals(this, y);
  var x = this;
  while (true) {
    if (IS_NUMBER(x)) {
      while (true) {
        if (IS_NUMBER(y)) return %NumberEquals(x, y);
        if (IS_NULL_OR_UNDEFINED(y)) return 1;  // not equal
        if (!IS_SPEC_OBJECT(y)) {
          if (IS_SYMBOL(y) || IS_SIMD_VALUE(y)) return 1;  // not equal
          // String or boolean.
          return %NumberEquals(x, %$toNumber(y));
        }
        y = %$toPrimitive(y, NO_HINT);
      }
    } else if (IS_STRING(x)) {
      while (true) {
        if (IS_STRING(y)) return %StringEquals(x, y);
        if (IS_NUMBER(y)) return %NumberEquals(%$toNumber(x), y);
        if (IS_BOOLEAN(y)) return %NumberEquals(%$toNumber(x), %$toNumber(y));
        if (IS_NULL_OR_UNDEFINED(y)) return 1;  // not equal
        if (IS_SYMBOL(y) || IS_SIMD_VALUE(y)) return 1;  // not equal
        y = %$toPrimitive(y, NO_HINT);
      }
    } else if (IS_SYMBOL(x)) {
      if (IS_SYMBOL(y)) return %_ObjectEquals(x, y) ? 0 : 1;
      return 1; // not equal
    } else if (IS_BOOLEAN(x)) {
      if (IS_BOOLEAN(y)) return %_ObjectEquals(x, y) ? 0 : 1;
      if (IS_NULL_OR_UNDEFINED(y)) return 1;
      if (IS_NUMBER(y)) return %NumberEquals(%$toNumber(x), y);
      if (IS_STRING(y)) return %NumberEquals(%$toNumber(x), %$toNumber(y));
      if (IS_SYMBOL(y) || IS_SIMD_VALUE(y)) return 1;  // not equal
      // y is object.
      x = %$toNumber(x);
      y = %$toPrimitive(y, NO_HINT);
    } else if (IS_NULL_OR_UNDEFINED(x)) {
      return IS_NULL_OR_UNDEFINED(y) ? 0 : 1;
    } else if (IS_SIMD_VALUE(x)) {
      if (!IS_SIMD_VALUE(y)) return 1;  // not equal
       return %SimdEquals(x, y);
    } else {
      // x is an object.
      if (IS_SPEC_OBJECT(y)) return %_ObjectEquals(x, y) ? 0 : 1;
      if (IS_NULL_OR_UNDEFINED(y)) return 1;  // not equal
      if (IS_BOOLEAN(y)) {
        y = %$toNumber(y);
      } else if (IS_SYMBOL(y) || IS_SIMD_VALUE(y)) {
        return 1;  // not equal
      }
      x = %$toPrimitive(x, NO_HINT);
    }
  }
}
```

## <div id="p-4">参考资料</div>
* [JavaScript MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures)  
* [JavaScript 类型与类型转换](http://cookfront.github.io/2015/11/09/javascript-types/)
* [V8源代码](https://github.com/v8/v8/blob/4.6-lkgr/src/runtime.js)   
* 《javascript高级程序设计》
* 《javascript权威指南》