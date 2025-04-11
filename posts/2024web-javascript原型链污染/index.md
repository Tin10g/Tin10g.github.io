# JavaScript原型链污染


# JavaScript原型链污染

## 什么是原型链和js中的继承

先要掌握几个关键点：

* 每个构造函数都有一个`prototype`原型对象

* 每个实例对象都有一个`__proto__`属性，并指向它的构造函数的原型对象`prototype`
* 对象里面的`constructor`属性指向其构造函数本身
* 第一个原型对象的`__proto__`是null

知道上面这些就可以来说继承机制，即原型链继承

`a.__proto__`和`A.prototype`等价，指向`Object`

`a.__proto__.__proto__`和`A.prototype.__proto__`等价，指向`Object.prototype`

`a.__proto__.__proto__.__proto__`和`A.prototype.prototype.prototype`等价，指向`Object.prototype.__proto__`，即null

如果需要访问某个示例对象的原型对象可以从以下几个方法

```
objectname.[[prototype]]
objectname.prototype
objectname[&#34;__proto__&#34;]
objectname.__proto__
objectname.constructor.prototype
```

不同对象所生成的原型链例子：

```
var o = {a: 1};
// o对象直接继承于 Object.prototype
// 原型链: o ---&gt; Object.prototype ---&gt; null

var a = [&#34;yo&#34;, &#34;whadup&#34;, &#34;?&#34;];
// 数组都继承于 Array.prototype
// 原型链: a ---&gt; Array.prototype ---&gt; Object.prototype ---&gt; null

function f(){
  return 2;
}
// 函数都继承于 Function.prototype
// 原型链: f ---&gt; Function.prototype ---&gt; Object.prototype ---&gt; null
```

如果尝试访问属性

```
// 让我们从一个函数里创建一个对象o, 它自身拥有属性a和b的:
let f = function () {
   this.a = 1;
   this.b = 2;
}
/* 等价写法
function f() {
  this.a = 1;
  this.b = 2;
}
*/

// 访问
let o = new f(); // {a: 1, b: 2}

// 在 f 函数的原型对象上定义属性
f.prototype.b = 3;
f.prototype.c = 4;

// 不要在 f 函数的原型上直接定义 f.prototype = {b:3,c:4};, 这样会直接打破原型链

// o.[[Prototype]] 有属性 b 和 c
//  (其实就是 o.__proto__ 或者 o.constructor.prototype)
// o.[[Prototype]].[[Prototype]] 是 Object.prototype.
// 最后o.[[Prototype]].[[Prototype]].[[Prototype]]是null
// 这就是原型链的末尾，即 null，
// 根据定义，null 就是没有 [[Prototype]]。

// 综上，整个原型链如下:
// {a:1, b:2} ---&gt; {b:3, c:4} ---&gt; Object.prototype---&gt; null
```

```
console.log(o.a); // 输出 1
// a是o的自身属性吗？是的，该属性的值为 1

console.log(o.b); // 输出 2
// b是o的自身属性吗？是的，该属性的值为 2
// 原型上也有一个&#39;b&#39;属性，但是它不会被访问到。
// 这种情况被称为&#34;属性遮蔽 (property shadowing)&#34;

console.log(o.c); // 输出 4
// c是o的自身属性吗？不是，那看看它的原型上有没有
// c是o.[[Prototype]]的属性吗？是的，该属性的值为 4

console.log(o.d); // 输出 undefined
// d 是 o 的自身属性吗？不是，那看看它的原型上有没有
// d 是 o.[[Prototype]] 的属性吗？不是，那看看它的原型上有没有
// o.[[Prototype]].[[Prototype]] 为 null，停止搜索
// 找不到 d 属性，返回 undefined
```

## Javascript 原型链污染漏洞原理

```
object1 = {&#34;a&#34;:1, &#34;b&#34;:2};
object1.__proto__.foo = &#34;Hello World&#34;;
console.log(object1.foo);
object2 = {&#34;c&#34;:1, &#34;d&#34;:2};
console.log(object2.foo);
```

这里的输出是两个HelloWorld

原因是object1和object2的原型对象都是Object.prototype

object1修改这个原型对象的foo属性，则object2的原型对象也是同一个具备foo属性

并且由于object1和object2本身不具备foo属性，因此直接调用他们的foo属性会用他们原型链从下到上找。

这个就是造成原型链污染，通过修改object1的原型对象属性，影响了obejct2的原型对象属性

**控制并修改一个对象的原型，就可以影响到所有和这个对象同一个原型的对象**

## Merge类导致原型链污染

### Merge类操作

```
function merge(target, source) {
    for (let key in source) {
        if (key in source &amp;&amp; key in target) {
            merge(target[key], source[key])
        } else {
            target[key] = source[key]
        }
    }
}

let object1 = {}
let object2 = JSON.parse(&#39;{&#34;a&#34;: 1, &#34;__proto__&#34;: {&#34;b&#34;: 2}}&#39;)
merge(object1, object2)
console.log(object1.a, object1.b)

object3 = {}
console.log(object3.b)
```

输出

```                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
1 2
2
```

这里从object3.b输出2发现，原型对Object已经被污染。

从object1.a和object1.b可以看出来object1通过merge函数得到了object2的所有属性

#### 为什么Merge不安全？

因为这个函数对source对象中所有属性进行迭代，即覆盖了原本的所有属性

如果属性同时存在于第一个和第二个参数中，并且他们都是object，他们就会递归合并这个属性

如果我们能够控制source中的key值。让其值变成`__proto__`，且我们能够控制source中`__proto__`的属性值

那么在递归的过程中，target[key]在某个特定的时候会指向对象target的prototype中，相当于我们新添加了一个新的助兴到该对象的原型链中


---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024web-javascript%E5%8E%9F%E5%9E%8B%E9%93%BE%E6%B1%A1%E6%9F%93/  

