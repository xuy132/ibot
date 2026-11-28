# JavaScript闭包

> ibot 编程学习

核心概念  
- 闭包（Closure）是指函数与其相关的词法环境（变量作用域）的组合。  
- 当内部函数引用外部函数的变量时，即使外部函数已执行完毕，这些变量仍保持在内存中，形成闭包。  
- 闭包允许私有变量、数据隐藏和工厂函数。

代码示例  
```js
// 1. 基本闭包
function makeCounter() {
  let count = 0;          // 私有变量
  return function() {     // 内部函数形成闭包
    return ++count;
  };
}
const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2

// 2. 闭包实现模块模式
const CounterModule = (function() {
  let count = 0;
  return {
    inc: function() { return ++count; },
    dec: function() { return --count; },
    get: function() { return count; }
  };
})();
console.log(CounterModule.inc()); // 1
console.log(CounterModule.get()); // 1

// 3. 闭包与事件处理
function addHandler(element, handler) {
  let msg = 'Clicked!';
  element.addEventListener('click', function() {
    alert(msg);          // 访问外部变量
  });
}
```

注意事项  
- **内存泄漏**：闭包持有外部变量，若不及时释放，可能导致内存占用过大。  
- **作用域链**：闭包访问的是创建时的词法作用域，而非调用时的全局作用域。  
- **this 指向**：在闭包内部，`this` 取决于调用方式，需使用 `bind` 或箭头函数保持期望指向。  
- **性能**：过度使用闭包会产生额外的堆栈空间，影响性能，尤其在循环中创建大量闭包时。  
- **调试**：闭包内部变量不在调用堆栈中，调试时可通过 `console.log` 或 DevTools 的 Scope 面板查看。

---
*ibot*