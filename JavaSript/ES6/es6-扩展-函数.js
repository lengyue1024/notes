----------------------------
函数的扩展					|
----------------------------
	1,函数参数的默认值
	2,rest 参数
	3,严格模式
	4,name 属性
	5,箭头函数
	6,双冒号运算符
	7,尾调用优化
	8,函数参数的尾逗号

----------------------------
函数参数的默认值			|
----------------------------
	# ES6 允许为函数的参数设置默认值,即直接写在参数定义的后面
		let work = function(id='F8575532'){
			console.log(id)
		}		
		work(null)				//null
		work(undefined)			//F8575532

		* 只要参数 === undefined 才会使用默认值
	
	# 参数变量是默认声明的,所以不能用let或const再次声明
		function foo(x = 5) {
		  let x = 1; // error
		  const x = 2; // error
		}
	
	# 使用参数默认值时,函数不能有同名参数
		// 不报错
		function foo(x, x, y) {
		  // ...
		}

		// 报错
		function foo(x, x, y = 1) {
		  // ...
		}
		// SyntaxError: Duplicate parameter name not allowed in this context
	
	# 参数默认值不是传值的,而是每次都重新计算默认值表达式的值,也就是说'参数默认值是惰性求值的'
		let x = 99;
		function foo(p = x + 1) {
			console.log(p);
		}
		foo() // 100
		x = 100;
		foo() // 101

		* 参数p的默认值是x + 1,这时,每次调用函数foo,都会重新计算x + 1,而不是默认p等于 100
	
	# 与解构赋值默认值结合使用
		function foo({x, y = 5}) {
		  console.log(x, y);
		}

		foo({})				// undefined 5
		foo({x: 1})			// 1 5
		foo({x: 1, y: 2})	// 1 2
		foo()				// TypeError: Cannot read property 'x' of undefined
	
		
		* 当形参具备默认的解构赋值对象时,甚至可以不用传递参数
			function foo({method,header} = {method:'GET',header:{'ContentType':'application/json'}}){
				console.log(method);
				console.log(header);
			}
			foo()					//GET	{ContentType: "application/json"}
			foo({method:'POST'})	//POST	undefined

	# 参数默认值的位置 
		* 通常情况下,定义了默认值的参数,应该是函数的尾参数m,因为这样比较容易看出来,到底省略了哪些参数
		* 如果非尾部的参数设置默认值,实际上这个参数是没法省略的
			function foo(v1,{name,age} = {name:'name',age:12},v2){
				console.log(v1);
				console.log(name);
				console.log(age);
				console.log(v2);
			}
			foo(1,3)			//1,undefined,undefined,undefined
			foo(1,undefined,3)	//1,name,12,3

			* 必须使用 undefined 来占位,从而触发默认值

	
	# 函数的 length 属性
		* 指定了默认值以后,函数的length属性,将返回没有指定默认值的参数个数
		* 也就是说,指定了默认值后,length属性将失真
	
	# 作用域
		var x = 1;
		function f(x, y = x) {
			console.log(y);
		}
		f(2) // 2
		
		* 参数y的默认值等于变量x调用函数f时,参数形成一个单独的作用域,在这个作用域里面,默认值变量x指向第一个参数x,而不是全局变量x,所以输出是2
		
		let x = 1;
		function f(y = x) {
		  let x = 2;
		  console.log(y);
		}
		f() // 1
		
		* 函数f调用时,参数y = x形成一个单独的作用域,这个作用域里面,变量x本身没有定义,所以指向外层的全局变量x
		* 函数调用时,函数体内部的局部变量x影响不到默认值变量x
		* 如果此时,全局变量x不存在,就会报错

		* '参数,是一个单独的作用域'
		
	# 应用
		* 利用参数默认值,可以指定某一个参数不得省略,如果省略就抛出一个错
			function throwIfMissing() {
			  throw new Error('Missing parameter');
			}

			function foo(mustBeProvided = throwIfMissing()) {
				return mustBeProvided;
			}

			foo()
			
			* foo函数，如果调用的时候没有参数,就会调用默认值throwIfMissing函数,从而抛出一个错误
		
		* 可以将参数默认值设为undefined,表明这个参数是可以省略的
			function foo(optional = undefined) { ··· }

----------------------------
rest参数					|
----------------------------
	# 变长参数,只能出现在参数列表的最后一位,它以数组的形式出现
		function add(...values) {
			let sum = 0;
			for (var val of values) {
			  sum += val;
			}
			return sum;
		}
		add(2, 5, 3) // 10
	
		* 某种程度上说,它可以替代arguments
			// arguments变量的写法
			function sortNumbers() {
				
			  return Array.prototype.slice.call(arguments).sort();
			}

			// rest参数的写法
			const sortNumbers = (...numbers) => numbers.sort();

			* arguments并不是一个数组,而是一个类似数组的对象,所以先使用 Array.prototype.slice() 把它转换为数组,再进行排序
			* 而 ...numbers 是一个真正的数据,不需要进行转换
		
		* 函数的length属性,不包括 rest 参数
	
----------------------------
严格模式					|
----------------------------
	# ES5 开始,函数内部可以设定为严格模式。
		function doSomething(a, b) {
			'use strict';
			// code
		}
	
	# ES6规定只要函数参数使用了默认值,解构赋值,或者扩展运算符,那么函数内部就不能显式设定为严格模式否则会报错
	
	# 这样规定的原因
		* 函数内部的严格模式,同时适用于函数体和函数参数
		* 函数执行的时候,先执行函数参数,然后再执行函数体
		* 这样就有一个不合理的地方,只有从函数体之中,才能知道参数是否应该以严格模式执行,但是参数却应该先于函数体执行
	
	# 两种方法可以规避这种限制
		* 第一种是设定全局性的严格模式,这是合法的
			'use strict';
			function doSomething(a, b = a) {
			  // code
			}
		
		* 第二种是把函数包在一个无参数的立即执行函数里面
			const doSomething = (function () {
				'use strict';
				return function(value = 42) {
					return value;
				};
			}());

----------------------------
name属性					|
----------------------------
	# name属性,返回该函数的函数名,
		* 浏览器早就支持这个属性了,但在ES6才被写入规范
	
	# 如果将一个匿名函数赋值给一个变量,ES5 的name属性,会返回空字符串.而 ES6 的name属性会返回实际的函数名
		let foo = function(){}
		console.log(foo.name);		//foo
	
	# 将一个具名函数赋值给一个变量,则 ES5 和 ES6 的name属性都返回这个具名函数原本的名字

		const bar = function baz() {};

		// ES5
		bar.name // "baz"

		// ES6
		bar.name // "baz"
	
	# Function构造函数返回的函数实例,name属性的值为anonymous

		(new Function).name // "anonymous"
	
	# bind返回的函数,name属性值会加上bound前缀

		function foo() {};

		foo.bind({}).name // "bound foo"
		(function(){}).bind({}).name // "bound "

----------------------------
箭头函数					|
----------------------------
	# ES6的箭头函数,有点像java中的 lambda 表达式
		let foo = x => x;
		let foo = function(x){return x}
		console.log(foo(1))
	
	# 如果有多个参数,使用()包含	
		let foo = (x,y) => x + y;
		console.log(foo(1,2))
	
	# 如果箭头函数的代码有几句,就要使用大括号将它们括起来,并且码块部分多于一条语使用return语句返回
		let foo = (x,y) => {
			let r = x + y;
			return r;
		};
		console.log(foo(1,2))
	
	# 如果箭头函数直接返回的数据是个对象,那么必须使用()进行包裹
		let foo = () => ({name:'Kevin'});
		console.log(foo())
	
	# 如果箭头函数只有一行语句,且不需要返回值,可以省略大括号

		let fn = () => void doesNotReturn();
		let foo = () => void console.log('没有返回值,仅仅用于执行一行代码');
	
	# 箭头函数与解构赋值
		const full = ({ first, last }) => first + ' ' + last;
	
		// 等同于
		function full(person) {
		  return person.first + ' ' + person.last;
		}
	
	# rest 参数与箭头函数结合

		const numbers = (...nums) => nums;

		numbers(1, 2, 3, 4, 5)
		// [1,2,3,4,5]

		const headAndTail = (head, ...tail) => [head, tail];

		headAndTail(1, 2, 3, 4, 5)
		// [1,[2,3,4,5]]
	
	# 箭头函数需要注意的问题
		1,函数体内的this对象,就是定义时所在的对象,而不是使用时所在的对象('箭头函数里面根本没有自己的this,而是引用外层的this')
			* 由于箭头函数没有自己的this,所以当然也就不能用call(),apply(),bind()这些方法去改变this的指向
			

		2,不可以当作构造函数,也就是说,不可以使用new命令,否则会抛出一个错误
		3,不可以使用arguments对象,该对象在函数体内不存在,如果要用,可以用 rest 参数代替
		4,不可以使用yield命令,因此箭头函数不能用作 Generator 函数
					
		
		* 第一点尤其值得注意,this 对象的指向是可变的,但是在箭头函数中它是固定的
			var id = 21;
	
			function foo() {
				window.setTimeout(() => {
					console.log('id:', this.id);
				}, 100);
			}
		
			* setTimeout的参数是一个箭头函数,这个箭头函数的定义生效是在foo函数生成时
			* 而它的真正执行要等到 100 毫秒后,如果是普通函数,执行时this应该指向全局对象window,这时应该输出21
			* 但是,箭头函数导致this总是指向函数定义生效时所在的对象(本例是{id: 42}),所以输出的是42
		
		* 箭头函数可以让setTimeout里面的this,绑定定义时所在的作用域,而不是指向运行时所在的作用域
			function Timer() {
				this.s1 = 0;
				this.s2 = 0;
				// 箭头函数,this指向定义时所在的作用,也就是 Timer
				setInterval(() => this.s1++, 1000);
				// 普通函数
				setInterval(function () {
					//指向运行时的作用域,setInterval 是windows的属性,它是由window调用,所以,这个this指向windows
					this.s2++;
				}, 1000);
			}

			var timer = new Timer();

			setTimeout(() => console.log('s1: ', timer.s1), 3100);
			setTimeout(() => console.log('s2: ', timer.s2), 3100);
			
			// s1: 3
			// s2: 0
			// id: 42
			
			* Timer函数内部设置了两个定时器,分别使用了箭头函数和普通函数
			* 前者的this绑定定义时所在的作用域(即Timer函数),后者的this指向运行时所在的作用域(即全局对象)
			* 所以,3100 毫秒之后,timer.s1被更新了 3 次，而timer.s2一次都没更新
		
		
		* 箭头函数可以让 this 指向固定化,这种特性很有利于封装回调函数
			var handler = {
				id: '123456',
				init: function() {
					//如果不使用箭头函数,那么箭头函数里面的this,在事件中指向发生事件的document对象
					document.addEventListener('click',event => this.doSomething(event.type), false);
				},
				
				doSomething: function(type) {
					console.log('Handling ' + type  + ' for ' + this.id);
				}
			};
			
			* init方法中,使用了箭头函数,这导致这个箭头函数里面的this,总是指向handler对象,否则,回调函数运行时,this.doSomething 这一行会报错,因为此时this指向document对象
			* this指向的固定化,不是因为箭头函数内部有绑定this的机制,实际原因是箭头函数根本没有自己的this,导致内部的this就是外层代码块的this,正是因为它没有this,所以也就不能用作构造函数
		
		* 箭头函数转换为ES5代码
			// ES6
			function foo() {
			  setTimeout(() => {
				console.log('id:', this.id);
			  }, 100);
			}

			// ES5
			function foo() {
			  var _this = this;
			
			  setTimeout(function () {
				console.log('id:', _this.id);		//箭头函数的this,就是上级作用域的this
			  }, 100);
			}
		
