/**
 * http://usejsdoc.org/
 */
var m = {};
var e = m.f = {};//e(exports),m.f(module.exports)


m.f.a = 5;
e.b = 6;

m.f = {c:9};
e.d = 10;
console.log(e == m.f);
//虽然e = m.f,但是console的时候，e使用了export，m.f使用module.export
//m.f = {c:9};m.f(module.export)引用的对象被改了
console.log(m.f);
console.log(e);
console.log(m);

//总结：node对于这种现象用export解释，很难理解。
//如果用java的指针可能还要容易些,当m.f = {c:9};出现的时候，{c:9}对象改变了m.f的指针，使得e，m.f变成了两个不同的对象。
