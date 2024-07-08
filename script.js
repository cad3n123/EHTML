// Global Constants
const [$main, $help, $textBoxes, $textEditor, $console] = [ 'main', 'help', 'text-boxes', 'text-editor', 'console' ].map(id => document.getElementById(id));
const [$form] = ['form'].map(selector => $main.querySelector(selector));
const loopMax = 1000;

// Global Variables

// Custom Types/Constructor Functions
/**
 * @typedef {number} TokenType
 */
const TokenType = {
	ELEMENT: 0,
	LITERAL: 1,
};
/**
 * @typedef {number} TokenSubType
 */
const TokenSubType = {
	NONE: 0,
	START: 1,
	END: 2,
};
/**
 * @typedef {Object} Token
 * @property {string} value
 * @property {TokenType} type
 * @property {TokenSubType} subType
 */
/**
 *
 * @param {string} value
 * @param {TokenType} type
 * @param {TokenSubType} subType
 * @returns {Token}
 */
function newToken(value, type, subType = TokenSubType.NONE) {
	return {
		value: value,
		type: type,
		subType: subType,
	};
}
/**
 * @typedef {number} NodeType
 */
const NodeType = {
	NULL: 0,
	TOKEN: 1,
	LITERAL: 2,
	IDENTIFIER: 3,
	FUNCTION_CALL: 4,
	STRING: 5,
	NUMBER: 6,
	BOOLEAN: 7,
	FUNCTION: 8,
	LIST: 9,
	TYPE: 10,
};
const NodeTypeString = [
	'Null',
	'Token',
	'Literal',
	'Identifier',
	'Function Call',
	'String',
	'Number',
	'Boolean',
	'Function',
	'List',
	'Type',
];
/**
 * @typedef {Object} MyFunction
 * @property {Array.<MyNode>} statementNodes
 * @property {Scope} scope
 */
/**
 * @typedef {Token|MyFunction|string|number|boolean|Array.<MyNode>|NodeType} NodeValue1
 */
/**
 * @typedef {Array.<MyNode>|null} NodeValue2
 */
/**
 * @typedef {Object} MyNode
 * @property {NodeType} type
 * @property {NodeValue1} value1
 * @property {NodeValue2} value2
 */
/**
 *
 * @param {NodeType} nodeType
 * @param {NodeValue1} value1
 * @param {NodeValue2} value2
 * @returns {MyNode}
 */
function newNode(nodeType, value1, value2) {
	return {
		type: nodeType,
		value1: value1,
		value2: value2,
	};
}
/**
 *
 * @returns {HTMLParagraphElement}
 */
function newCarrot() {
	const p = document.createElement('p');
	p.class = 'carrot';
	p.innerHTML = '>';
	return p;
}
function newConsoleLine() {
	const $div = document.createElement('div');
	$div.classList.add('line');
	return $div;
}

// Functions
function main() {
	const [$info, $infoSideBar] = ['info', 'info-side-bar'].map(id => document.getElementById(id));
	[$form, $help].forEach(($mainElement, index, mainElements) => {
		const $button = $mainElement.querySelector('nav').querySelector('.right').querySelector('li');
		const $otherMainElement = mainElements[mainElements.length - 1 - index];
		$button.addEventListener('click', () => {
			$otherMainElement.classList.remove('hidden');
			$mainElement.classList.add('hidden');
		});
	});
	let sideNavElements = [];
	/**
	 *
	 * @param {string} tag
	 * @returns {string}
	 */
	function tagString(tag) {
		return `&lt${tag}&gt`;
	}
	/**
	 *
	 * @param {string} tag
	 * @returns {HTMLElement}
	 */
	function $(tag) {
		return document.createElement(tag);
	}
	function bold(string) {
		return `<span><b>${string}</b></span>`;
	}
	/**
	 *
	 * @param {string} string
	 * @returns {HMTLParagraphElement}
	 */
	function $newP(string) {
		const $p = $('p');
		$p.innerHTML = string;
		return $p;
	}
	/** @typedef {HTMLPreElement} CodeBlock */
	/**
	 *
	 * @param {string} string
	 * @returns {CodeBlock}
	 */
	function $newPre(string) {
		const $pre = $('pre');
		$pre.innerHTML = string;
		return $pre;
	}
	/** @typedef {Array.<HTMLParagraphElement|CodeBlock>} Group */
	/**
	 *
	 * @param {string} title
	 * @param {Array.<Group>} groups
	 * @returns {Array.<HTMLElement>}
	 */
	function newInfoValue(title, groups) {
		const $navElement = $('p');
		$navElement.innerHTML = title;
		$navElement.classList.add('no-select');
		sideNavElements.push($navElement);
		$infoSideBar.appendChild($navElement);
		$navElement.addEventListener('click', () => {
			sideNavElements.forEach(sideNavElement => sideNavElement.classList.remove('selected'));

			$navElement.classList.add('selected');
			while ($info.firstChild) {
				$info.removeChild($info.lastChild);
			}

			$info.scrollTop = 0;
			/** @type {Array.<HTMLElement} */
			const $title = $('h1');
			$title.innerHTML = title;
			$info.appendChild($title);
			$info.appendChild($('br'));
			groups.forEach((group, index) => {
				group.forEach($item => $info.appendChild($item));
				if (index < groups.length - 1) {
					$info.appendChild($('br'));
				}
			});
		});
	}
	newInfoValue('EHTML', [
		[
			$newP(`Welcome to ${bold('EHTML')} (or Esoteric HTML)!`),
			$newP(`Although it might seem like a programming language, HTML is ${bold('not')} a programming language. It is a markup language, meaning rather than running programs, it is used for styling.`),
			$newP(`${bold('EHTML')} has the same format as HTML but it ${bold('is')} a programming language.`),
		],
		[
			$newP(`${bold('EHTML')} programs are comprised of functions and variables.`),
			$newP(`The following pages will introduce you to the built in functions that you can use to make your own ${bold('EHTML')} programs.`),
		],
	]);
	newInfoValue('Types', [
		[
			$newP(`There are 5 different types in ${bold('EHTML')}: Strings, Numbers, Booleans, Functions, and Lists.`),
		],
		[
			$newP(`A ${bold('string')} is a sequence of characters. To make one, surround whatever message you would like to encode string in quotes.`),
			$newPre(`"Like this!"`),
		],
		[
			$newP(`A ${bold('number')} is pretty self-explanatory. It can be a number with or without a decimal point, and can be negative. To make one, surround a number with opening and closing ${bold(tagString('number'))} tags.`),
			$newP(`This is a number:`),
			$newPre(`${tagString('number')}12${tagString('/number')}`),
			$newP(`And so is this:`),
			$newPre(`${tagString('number')}-0.5${tagString('/number')}`),
		],
		[
			$newP(`A ${bold('boolean')} is a value that can either hold true or false. There are two built variables, ${bold(tagString('true'))} and ${bold(tagString('false'))}, but later we'll see how to compare values to dynamically get a boolean`),
			$newPre(`${tagString('true')}`),
			$newPre(`${tagString('false')}`),
		],
		[
			$newP(`A ${bold('function')} is a set of functions that can be called multiple times and optionally returns up to one value. When a function is created, the creator decides how many parameters it will take in. Later we'll see how to create our own functions.`),
			$newP(`Calling a function is pretty simple. You've already seen how to call the ${bold('number')} function. This is how you call the ${bold('print')} function.`),$newPre(`${tagString('print')}"Hello, World!${tagString('/print')}`),
		],
		[
			$newP(`A ${bold('list')} is a group of values- similar to a ${bold('string')} but able to take in any type of value.`),
			$newP(`In order to create a list, call the ${bold(tagString('list'))} function and pass in as many values as you would like. You can add a value to the end of a list by passing in it and a new value to the ${bold(tagString('push'))} function. The ${bold(tagString('push'))} function removes the last value of the list and returns it.`),
			$newPre(`${tagString('list')}
    ${tagString('number')}1${tagString('/number')}
    "This is the second value"
    ${tagString('true')}
    "This is the fourth value"
${tagString('/list')}`),
		],
		[
			$newP(`Formatting (indentations and new lines) do not effect the code other than its readability.`),
		],
		[
			$newP(`A lot of functions work exclusively or uniquely on ${bold('lists')} and ${bold('strings')} because of their similarities.`),
			$newP(`Each value in a ${bold('list')} or ${bold('string')} has an index. The first item's index is 0, the second is item's index is 1, and so on.`),
			$newP(`The ${bold(tagString('length'))} function returns the length of a string or list.`),
			$newP(`The ${bold(tagString('value-at'))} function takes in a ${bold('list')} or ${bold('string')} and an index, and returns the item at that index.`),
			$newP(`The ${bold(tagString('set-at'))} function takes in a ${bold('list')} or ${bold('string')}, and index, and a new value, and sets the value at that index to the new value.`),
			$newP(`The ${bold(tagString('slice'))} function takes in a beginning index and an optional end index. The function returns a new ${bold('list')} or ${bold('string')} containing the values from the beginning index to the end index. If the end index is excluded, it will just get all the values from the beginning index to the end.`),
		],
	]);
	newInfoValue('Variables', [
		[
			$newP(`In order to declare a variable, you can use the ${bold(tagString('set'))} function. ${bold('Set')} takes in two parameters. The first is a tag that will represent the variable. The second is the value that the variable will hold.`),
		],
		[
			$newP(`For example, you can create a variable ${bold(tagString('x'))} and assign it the value of ${bold('Hello, World!')}, making sure to surround the message in quotes.`),
			$newPre(`${tagString('set')}
    ${tagString('x')}
    "Hello, World!"
${tagString('/set')}`),
		],
	]);
	newInfoValue('Arithmetic', [
		[
			$newP(`${bold('Arithmetic')} functions are used mainly on ${bold('numbers')} to do math but also occasionally used on ${bold('lists')} and ${bold('strings')}.`),
			$newP(`The ${bold(tagString('add'))}, ${bold(tagString('subtract'))}, ${bold(tagString('multiply'))}, ${bold(tagString('divide'))}, and ${bold(tagString('remainder'))} functions act exactly how you would expect them to work.`),
			$newP(`10 + 5:`),
			$newPre(`${tagString('add')}
    ${tagString('number')}10${tagString('/number')}
    ${tagString('number')}5${tagString('/number')}
${tagString('/add')}`),
			$newP(`10 - 5:`),
			$newPre(`${tagString('subtract')}
    ${tagString('number')}10${tagString('/number')}
    ${tagString('number')}5${tagString('/number')}
${tagString('/subtract')}`),
			$newP(`10 * 5:`),
			$newPre(`${tagString('multiply')}
    ${tagString('number')}10${tagString('/number')}
    ${tagString('number')}5${tagString('/number')}
${tagString('/multiply')}`),
			$newP(`10 / 5:`),
			$newPre(`${tagString('divide')}
    ${tagString('number')}10${tagString('/number')}
    ${tagString('number')}5${tagString('/number')}
${tagString('/divide')}`),
			$newP(`10 % 5:`),
			$newPre(`${tagString('remainder')}
    ${tagString('number')}10${tagString('/number')}
    ${tagString('number')}5${tagString('/number')}
${tagString('/remainder')}`),
		],
		[
			$newP(`Each arithmetic function, except for ${bold('remainder')}, has a counterpart that takes in a variable and a second value, and automatically sets the variable to the new value. The names for the functions are ${bold(tagString('add-to'))}, ${bold(tagString('subtract-to'))}, ${bold(tagString('multiply-to'))}, and ${bold(tagString('divide-to'))}.`),
			$newP(`For example, lets say we have a variable ${bold(tagString('x'))} with the value of 10. If we wanted to add 5 to it, without these functions, it would look like this:`),
			$newPre(`${tagString('set')}
    ${tagString('x')}
    ${tagString('number')}10${tagString('/number')}
${tagString('/set')}

${tagString('set')}
    ${tagString('x')}
    ${tagString('add')}
        ${tagString('x')}
        ${tagString('number')}5${tagString('/number')}
    ${tagString('/add')}
${tagString('/set')}`),
			$newP(`Alternatively, using ${bold('add-to')}, it would look like this:`),
			$newPre(`${tagString('set')}
    ${tagString('x')}
    ${tagString('number')}10${tagString('/number')}
${tagString('/set')}

${tagString('add-to')}
    ${tagString('x')}
    ${tagString('number')}5${tagString('/number')}
${tagString('/add-to')}`),
			$newP(`Although they don't add functionality, they substantially improve readability and reduce programming time.`),
		],
		[
			$newP(`${bold(tagString('add'))} and ${bold(tagString('add-to'))} can also be used to combine strings and arrays. Say you have a variable ${bold('first-name')} and a variable ${bold('last-name')} and want to print their first and last name. By chaining ${bold('add')}s, this can be done like:`),
			$newPre(`${tagString('set')}
    ${tagString('full-name')}
    ${tagString('add')}
        ${tagString('first-name')}
        ${tagString('add')}
            " "
            ${tagString('/last-name')}
        ${tagString('/add')}
    ${tagString('/add')}
${tagString('/set')}`),
			$newP(`If we wanted to write their name with excitement, we could add an exclamation point to the end of ${bold('full-name')}'s value with ${bold('add-to')}.`),
			$newPre(`${tagString('add-to')}
    ${tagString('full-name')}
    "!"
${tagString('/add-to')}`),
		],
	]);
	newInfoValue('Comparison', [
		[
			$newP(`${bold('Comparison')} functions can be used to compare two values and return a ${bold('boolean')} value.`),
		],
		[
			$newP(`${bold(tagString('less'))} and ${bold(tagString('greater'))} are used to compare two ${bold('numbers')}. The respectively represent the math <b><span>&lt</span></b> and <b><span>&gt</span></b> symbols.`),
			$newP(`This would return false:`),
			$newPre(`${tagString('less')}
    ${tagString('number')}10${tagString('/number')}
    ${tagString('number')}5${tagString('/number')}
${tagString('/less')}`),
			$newP(`And this would return true:`),
			$newPre(`${tagString('greater')}
    ${tagString('number')}10${tagString('/number')}
    ${tagString('number')}5${tagString('/number')}
${tagString('/greater')}`),
		],
		[
			$newP(`${bold(tagString('equal'))} and ${bold(tagString('not-equal'))} test for equivalance of ${bold('numbers')}, ${bold('booleans')}, and ${bold('strings')}.`),
			$newP(`Here are a few examples that return true:`),
			$newPre(`${tagString('set')}
    ${tagString('x')}
    ${tagString('number')}5${tagString('/number')}
${tagString('/set')}

${tagString('equal')}
    ${tagString('x')}
    ${tagString('number')}5${tagString('/number')}
${tagString('/equal')}`),
			$newPre(`${tagString('set')}
    ${tagString('name')}
    "John"
${tagString('/set')}

${tagString('equal')}
    ${tagString('name')}
    "John"
${tagString('/equal')}`),
			$newPre(`${tagString('set')}
    ${tagString('name')}
    "John"
${tagString('/set')}

${tagString('not-equal')}
    ${tagString('name')}
    "john"
${tagString('/not-equal')}`),
			$newPre(`${tagString('equal')}
    ${tagString('false')}
    ${tagString('false')}
${tagString('/equal')}`),
		],
		[
			$newP(`${bold(tagString('and'))}, ${bold(tagString('or'))}, and ${bold(tagString('not'))} are functions that only take in booleans.`),
			$newP(`${bold('And')} takes in two boolean values and returns ${bold('true')} if both values are ${bold('true')}.`),
			$newP(`${bold('And')} takes in two boolean values and returns ${bold('true')} if one or both values are ${bold('true')}.`),
			$newP(`${bold('Not')} takes in one boolean value and inverts it. If ${bold('true')} is passed in, it returns ${bold('false')}. If ${bold('false')} is passed in, it returns ${bold('true')}.`),
		],
	]);
	newInfoValue('Custom Functions', [
		[
			$newP(`In order to declare a function, you can use the ${bold(tagString('set'))} function. ${bold('Set')} takes in two parameters. The first is a tag that will represent the variable. The second is the value that the variable will hold.`),
			$newP(`For a ${bold('function')}, the second parameter will be the ${bold(tagString('function'))} function. You can only write statements in the ${bold('function')} function.`),
		],
		[
			$newP(`For example, a function that prints ${bold('Hello, World!')} when called would look like this:`),
			$newPre(`${tagString('set')}
    ${tagString('my-function')}
    ${tagString('function')}
        ${tagString('print')}"Hello, World!"${tagString('/print')}
    ${tagString('/function')}
${tagString('/set')}`),
			$newP(`Calling ${bold('my-function')} is the same as calling any other function. All you have to do is write the beginning  and end tag, and since it takes in no parameters (we'll discuss how to do that soon), you don't need to put any values in between the tags.`),
			$newPre(`${tagString('my-function')}${tagString('/my-function')}`),
		],
		[
			$newP(`The ${bold(tagString('return'))} function can only be used inside the ${bold('function')} function. It takes the value that you want to return from the function and also stops the rest of the statements in the function from being called.`),
			$newP(`The ${bold(tagString('params'))} function also can ony be used inside the ${bold('function')} function. This lets you decide how many parameters your function will accept, and automatically assigns their values to the variable names that you choose.`),
			$newP(`Say you want to make a function called ${bold('three-sum')} that takes three numbers, adds them all together, prints the total, and finally returns that value. You could do that like this:`),
			$newPre(`${tagString('set')}
    ${tagString('three-sum')}
    ${tagString('function')}
        ${tagString('params')}
            ${tagString('value-1')}
            ${tagString('value-2')}
            ${tagString('value-3')}
        ${tagString('/params')}

        ${tagString('set')}
            ${tagString('total')}
            ${tagString('add')}
                ${tagString('value-1')}
                ${tagString('add')}
                    ${tagString('value-2')}
                    ${tagString('value-3')}
                ${tagString('/add')}
            ${tagString('/add')}
        ${tagString('/set')}

        ${tagString('print')}
            ${tagString('add')}
                "The total is: "
                ${tagString('total')}
            ${tagString('/add')}
        ${tagString('/print')}

        ${tagString('return')}${tagString('total')}${tagString('/return')}
    ${tagString('/function')}
${tagString('/set')}`),
		],
	]);
	newInfoValue('User input', [
		[
			$newP(`If you want to make an interactive program, you can use the ${bold(tagString('input'))} function. ${bold('Input')} will pause the program and wait until the user is done entering info. Once the user hits enter, ${bold('input')} will return the value entered and the program will resume.`),
			$newP(`This program prompts the user for their name and stores it in the variable "${bold('name')}". It then greets them with their name.`),
			$newPre(`${tagString('print')}"What is your name?"${tagString(
				'/print'
			)}

${tagString('set')}
    ${tagString('name')}
    ${tagString('input')}${tagString('/input')}
${tagString('/set')}

${tagString('print')}
    ${tagString('add')}
        ${tagString('add')}
            "Hi, "
            ${tagString('name')}
        ${tagString('/add')}
        "!"
    ${tagString('/add')}
${tagString('/print')}`),
		],
	]);
	newInfoValue('If Statements', [
		[
			$newP(`Now that you can receive user input, the next thing you'll probably want to incorporate in your programs is branching. The ${bold(tagString('if'))} function takes in a ${bold('boolean')} and a ${bold('function')}. The ${bold('function')} will only run if the ${bold('boolean')} is ${bold('true')}.`),
			$newP(`Similarly, the ${bold(tagString('if-else'))} function takes in a ${bold('boolean')} and two ${bold('functions')}. The first ${bold('function')} will run if the ${bold('boolean')} is ${bold('true')}. If the ${bold('boolean')} is ${bold('false')}, the second ${bold('function')} will run.`),
			$newP(`The first example will ask the user for their age and tell them ${bold('if')} they are not old enough to drink alcohol (at least in the US).`),
			$newPre(`${tagString('print')}"How old are you?"${tagString('/print')}

${tagString('set')}
	${tagString('age')}
	${tagString('input')}${tagString('/input')}
${tagString('/set')}

${tagString('if')}
	${tagString('less')}
		${tagString('age')}
		${tagString('number')}21${tagString('/number')}
	${tagString('/less')}

	${tagString('function')}
		${tagString('print')}"You are not old enough to drink alcohol"${tagString('/print')}
	${tagString('/function')}
${tagString('/if')}`),
			$newP(`The next example uses the ${bold('if-else')} function to additionally tell them that they are old enough to drink alcohol if they are at least 21.`),
			$newPre(`${tagString('print')}"How old are you?"${tagString('/print')}

${tagString('set')}
	${tagString('age')}
	${tagString('input')}${tagString('/input')}
${tagString('/set')}

${tagString('if-else')}
	${tagString('less')}
		${tagString('age')}
		${tagString('number')}21${tagString('/number')}
	${tagString('/less')}

	${tagString('function')}
		${tagString('print')}"You are not old enough to drink alcohol"${tagString('/print')}
	${tagString('/function')}

	${tagString('function')}
		${tagString('print')}"You are old enough to drink alcohol"${tagString('/print')}
	${tagString('/function')}
${tagString('/if-else')}`),
		],
		[
			$newP(`Note. You can instead pass in variables that hold a function when the ${bold('function')} function is called.`)
		]
	]);
	newInfoValue('Loops', [
		[
			$newP(`In ${bold('EHTML')}, there are two types of loops: ${bold(tagString('while'))} loops and ${bold(tagString('for-each'))} loops.`)
		],
		[
			$newP(`${bold('While')} loops take in two ${bold('functions')}. The first ${bold('function')} is called each time before each iteration, and should return a ${bold('boolean')}. If the ${bold('boolean')} is ${bold('true')} the second ${bold('function')} will run and the process will repeat. Otherwise if the ${bold('boolean')} is ${bold('false')}, the cycle will break and the second ${bold('function')} will not run.`),
			$newP(`Here is an example with a number guessing game:`),
			$newPre(`${tagString('set')}
	${tagString('answer')}
	${tagString('number')}2${tagString('/number')}
${tagString('/set')}

${tagString('print')}"Enter a number between 1 and 10"${tagString('/print')}
${tagString('set')}
	${tagString('guess')}
	${tagString('number')}${tagString('input')}${tagString('/input')}${tagString('/number')}
${tagString('/set')}

${tagString('while')}
	${tagString('function')}
		${tagString('return')}
			${tagString('not-equal')}
				${tagString('guess')}
				${tagString('answer')}
			${tagString('/not-equal')}
		${tagString('/return')}
	${tagString('/function')}

	${tagString('function')}
		${tagString('print')}"You guessed it wrong. Guess again"${tagString('/print')}

		${tagString('set')}
			${tagString('guess')}
			${tagString('number')}${tagString('input')}${tagString('/input')}${tagString('/number')}
		${tagString('/set')}
	${tagString('/function')}
${tagString('/while')}

${tagString('print')}"You guessed it right"${tagString('/print')}`)
		],
		[
			$newP(`${bold('For-each')}`)
		]
	]);

	if (sideNavElements[0]) {
		sideNavElements[0].click();
	}
}
function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

// Event Listeners
window.addEventListener('load', main);
$textEditor.addEventListener('keydown', event => {
	if (event.key == 'Tab') {
		console.log('Tab clicked');

		let selectedText = '';
		if (window.getSelection) {	
			selectedText = window.getSelection().toString();
		} else if (document.selection && document.selection.type != 'Control') {
			selectedText = document.selection.createRange().text;
		}
		event.preventDefault();
		
		if (selectedText !== '') {
			function reverseString(string) {
				return string.split('').reverse().join('');
			}
			let caretStart = $textEditor.selectionStart;
			let start = $textEditor.value.substring(0, caretStart);
			let reversedStart = reverseString(start);
			let startLastLineFeedIndex = -1;
			for (let i = 0; i < reversedStart.length; i++) {
				if (reversedStart[i] === '\n') {
					startLastLineFeedIndex = i;
					break;
				}
			}
			let end = $textEditor.value.substring($textEditor.selectionEnd);
			let endLastLineFeedIndex = -1;
			for (let i = 0; i < end.length; i++) {
				if (end[i] === '\n') {
					endLastLineFeedIndex = i;
					break;
				}
			}

			let newStart = '';
			let newMiddle = '';
			let newEnd = '';

			if (startLastLineFeedIndex != -1) {
				newStart = reverseString(reversedStart.substring(startLastLineFeedIndex));
				newMiddle = reverseString(reversedStart.substring(0, startLastLineFeedIndex));
			} else {
				newMiddle = start;
			}
			newMiddle += selectedText;
			if (endLastLineFeedIndex != -1) {
				newMiddle += end.substring(0, endLastLineFeedIndex);
				newEnd = end.substring(endLastLineFeedIndex);
			} else {
				newMiddle += end;
			}
			let newMiddleSplit = newMiddle.split('\n');
			tabsAdded = newMiddleSplit.length;
			newMiddle = '\t' + newMiddleSplit.join('\n\t');
			
			$textEditor.value = newStart + newMiddle + newEnd;
			$textEditor.selectionStart = $textEditor.selectionEnd = caretStart + selectedText.length + tabsAdded;
		} else {
			let start = $textEditor.selectionStart;
			let end = $textEditor.selectionEnd;

			// set textarea value to: text before caret + tab + text after caret
			$textEditor.value = $textEditor.value.substring(0, start) + '\t' + $textEditor.value.substring(end);

			// put caret at right position again
			$textEditor.selectionStart = $textEditor.selectionEnd = start + 1;
		}
	}
});
$form.addEventListener('submit', event => {
	event.preventDefault();

	let errorOccured = false;
	/**
	 *
	 * @param {string} string
	 */
	function customError(string) {
		addToConsole(`ERROR. ${string}`);
		errorOccured = true;
	}
	/**
	 * @param {string} text
	 */
	function addToConsole(text) {
		if (!errorOccured) {
			const $line = newConsoleLine();
			const $text = document.createElement('p');
			$text.innerHTML = text;
			$line.appendChild(newCarrot());
			$line.appendChild($text);
			$console.appendChild($line);
			$console.scrollTop = $console.scrollHeight;
		}
	}
	/**
	 *
	 * @returns {Promise<string>}
	 */
	async function getConsoleInput() {
		if (errorOccured) {
			return '';
		}
		const $line = newConsoleLine();
		$line.classList.add('input');
		const $textarea = document.createElement('textarea');
		$line.appendChild(newCarrot());
		$line.appendChild($textarea);
		$console.appendChild($line);
		$console.scrollTop = $console.scrollHeight;

		const promise = new Promise(resolve => {
			$textarea.addEventListener('keydown', event => {
				if (event.key == 'Enter') {
					const text = $textarea.value;
					const $text = document.createElement('p');
					$text.innerHTML = text;
					$line.appendChild($text);
					$textarea.remove();
					$line.classList.remove('input');
					$console.scrollTop = $console.scrollHeight;
					resolve(text);
				}
			});
		});

		return promise;
	}

	const code = $textEditor.value;
	const tokens = (() => {
		let i = 0;

		function isRoom(offset = 0) {
			return i + offset < code.length;
		}
		function peek(offset = 0) {
			return code.charAt(i + offset);
		}
		/**
		 * @param {string} value
		 * @param {number} offset
		 * @returns {boolean}
		 */
		function peekIs(value, offset = 0) {
			return peek(offset) === value;
		}
		/**
		 * @param {string} value
		 * @param {number} offset
		 * @returns {boolean}
		 */
		function peekIsRoom(value, offset = 0) {
			return isRoom(offset) && peek(offset) === value;
		}
		/**
		 * @param {string} value
		 * @param {number} offset
		 * @returns {boolean}
		 */
		function peekIsNotRoom(value, offset = 0) {
			return isRoom(offset) && peek(offset) !== value;
		}
		function consume(offset = 0) {
			i++;
			return code.charAt(i + offset - 1);
		}
		let tokens = /** @type {Array.<Token>} */ ([]);
		while (isRoom()) {
			let word = '';
			if (/\s/g.test(peek())) {
				consume();
			} else if (peekIs('<')) {
				consume();
				const subType =
					peek() === '/'
						? (() => {
								consume();
								return TokenSubType.END;
						  })()
						: TokenSubType.START;
				while (peekIsNotRoom('>')) {
					word += consume();
				}
				if (peekIs('>')) {
					consume();
					tokens.push(newToken(word, TokenType.ELEMENT, subType));
				} else {
					customError(`Expected '>' at the end of the element.`);
					break;
				}
			} else if (peekIs('"')) {
				consume();
				while (peekIsNotRoom('"')) {
					word += consume();
				}
				if (peekIs('"')) {
					consume();
					tokens.push(newToken(word, TokenType.LITERAL));
				} else {
					customError(`Expected '"' at the end of the string.`);
					break;
				}
			} else {
				while (peekIsNotRoom('<')) {
					word += consume();
				}
				if (peekIs('<')) {
					tokens.push(newToken(word, TokenType.LITERAL));
				} else {
					customError(`Expected an end tag after a literal.`);
				}
			}
		}
		return tokens;
	})();
	const globalNodes = (() => {
		let i = 0;

		function isRoom(offset = 0) {
			return i + offset < tokens.length;
		}
		function peek(offset = 0) {
			return tokens[i + offset];
		}
		/**
		 * @param {TokenType} type
		 * @param {number} offset
		 * @returns {boolean}
		 */
		function peekIsType(type, offset = 0) {
			return peek(offset).type == type;
		}
		/**
		 * @param {TokenSubType} subType
		 * @param {number} offset
		 * @returns {boolean}
		 */
		function peekIsSubType(subType, offset = 0) {
			return peek(offset).subType == subType;
		}
		/**
		 * @param {string} value
		 * @param {number} offset
		 * @returns {boolean}
		 */
		function peekIsValue(value, offset = 0) {
			return peek(offset).value === value;
		}
		/**
		 * @param {TokenType} type
		 * @param {number} offset
		 * @returns {boolean}
		 */
		function peekIsTypeRoom(type, offset = 0) {
			return isRoom(offset) && peekIsType(type, offset);
		}
		/**
		 * @param {string} value
		 * @param {number} offset
		 * @returns {boolean}
		 */
		function peekIsValueRoom(value, offset = 0) {
			return isRoom(offset) && peekIsValue(value, offset);
		}
		/**
		 * @param {TokenType} type
		 * @param {number} offset
		 * @returns {boolean}
		 */
		function peekIsNotTypeRoom(type, offset = 0) {
			return isRoom(offset) && !peekIsType(type, offset);
		}
		/**
		 * @param {string} value
		 * @param {number} offset
		 * @returns {boolean}
		 */
		function peekIsNotValueRoom(value, offset = 0) {
			return isRoom(offset) && !peekIsValue(value, offset);
		}
		function consume(offset = 0) {
			i++;
			return peek(offset - 1);
		}
		let nodeStack = /** @type {Array.<MyNode>} */ ([]);
		while (isRoom()) {
			if (peekIsType(TokenType.ELEMENT)) {
				if (peekIsSubType(TokenSubType.START)) {
					nodeStack.push(newNode(NodeType.TOKEN, consume()));
				} else {
					let functionCallIndex = (() => {
						for (let index = nodeStack.length - 1; index >= 0; index--) {
							const element = nodeStack[index];
							if (element.type == NodeType.TOKEN && element.value1.value === peek().value) {
								return index;
							}
						}
						return -1;
					})();
					if (functionCallIndex == -1) {
						customError(`Unexpected end tag '/${peek().value}' with no matching start tag.`);
						break;
					}
					let parameters = /** @type {Array.<MyNode>} */ ([]);
					const originalLength = nodeStack.length - 1;
					for (functionCallIndex; functionCallIndex < originalLength; functionCallIndex++) {
						const nextElement = nodeStack.pop();
						if (nextElement.type == NodeType.TOKEN) {
							const nextElementToken = /** @type {Token} */ (nextElement.value1);
							parameters.push(
								nextElementToken.type == TokenType.ELEMENT
									? newNode(NodeType.IDENTIFIER, nextElementToken.value)
									: newNode(NodeType.LITERAL, nextElementToken.value)
							);
						} else {
							parameters.push(nextElement);
						}
					}
					parameters.reverse();
					nodeStack.push(newNode(NodeType.FUNCTION_CALL, nodeStack.pop().value1.value, parameters));
					consume();
				}
			} else {
				nodeStack.push(newNode(NodeType.LITERAL, consume().value));
			}
		}
		return nodeStack;
	})();

	console.log('Tokens:');
	tokens.forEach(token => console.log(token));
	console.log('\nRoot Node:');
	globalNodes.forEach(token => console.log(token));

	// Run
	(async () => {
		$console.innerHTML = '';
		/**
		 * @typedef {Object} Variable
		 * @property {string} identifier
		 * @property {MyNode} value
		 */
		/**
		 *
		 * @param {string} identifier
		 * @param {MyNode} value
		 * @returns {Variable}
		 */
		function newVariable(identifier, value) {
			return {
				identifier: identifier,
				value: value,
			};
		}
		/**
		 * @typedef {Object} Scope
		 * @property {Array.<Variable>} variables
		 * @property {Scope|null} parentScope
		 */
		/**
		 *
		 * @param {Scope} [parentScope=null]
		 * @param {Array.<Variable} [variables=EmptyArray]
		 * @returns {Scope}
		 */
		function newScope(parentScope, variables) {
			if (!variables) {
				variables = [];
			}
			if (!parentScope) {
				parentScope = null;
			}
			return {
				variables: variables,
				parentScope: parentScope,
			};
		}
		let globalScope = newScope();
		/**
		 *
		 * @param {string} identifier
		 * @param {Array.<MyNode>} statementNodes
		 * @param {Scope} scope
		 * @returns {MyFunction}
		 */
		function newFunction(statementNodes, scope) {
			return {
				statementNodes: statementNodes,
				scope: scope,
			};
		}
		/**
		 *
		 * @param {MyFunction} thisFunction
		 * @param {Array.<MyNode>} [params=[]]
		 * @param {boolean} [isGlobal=false]
		 * @returns {Promise.<MyNode|null>}
		 */
		async function runFunction(thisFunction, params, isGlobal) {
			if (!isGlobal) {
				isGlobal = false;
			}
			if (!params) {
				params = [];
			}
			const statementNodes = thisFunction.statementNodes;
			let scope = thisFunction.scope;
			/**
			 *
			 * @param {MyNode} functionNode
			 * @returns {MyFunction}
			 */
			function builtInFunctionFunction(functionNode) {
				return newFunction(functionNode.value2, newScope(scope));
			}
			const builtInVariables = (() => {
				return [newVariable('true', newNode(NodeType.BOOLEAN, true)), newVariable('false', newNode(NodeType.BOOLEAN, false))];
			})();
			/**
			 * @callback BuiltInFunctionRun
			 * @param {Array.<MyNode>} parameters
			 * @returns {Promise.<MyNode|null>}
			 */
			/**
			 * @typedef {Object} BuiltInFunction
			 * @property {string} identifier
			 * @property {BuiltInFunctionRun} run
			 */
			/** @type {Array.<BuiltInFunction>} */
			const builtInFunctions = (() => {
				/**
				 *
				 * @param {MyNode} parameter
				 * @returns {MyNode}
				 */
				function builtInToString(parameter) {
					let newValue = '';
					switch (parameter.type) {
						case NodeType.STRING:
							return parameter;
						case NodeType.LITERAL:
							newValue = parameter.value1;
							break;
						case NodeType.NUMBER:
						case NodeType.BOOLEAN:
							const value = parameter.value1;
							newValue = value.toString();
							break;
						case NodeType.TYPE:
							newValue = NodeTypeString[parameter.value1];
							break;
						default:
							customError(`Cannot convert ${NodeTypeString[parameter.type]} to string.`);
							return;
					}
					return newNode(NodeType.STRING, newValue);
				}
				/**
				 *
				 * @param {MyNode} parameter
				 * @returns {MyNode}
				 */
				function builtInToNumber(parameter) {
					if (parameter.type == NodeType.NUMBER) {
						return parameter;
					}
					let newValue;
					if (
						parameter.type == NodeType.LITERAL ||
						parameter.type == NodeType.STRING ||
						parameter.type == NodeType.BOOLEAN
					) {
						/** @type {string|boolean} */
						const value = parameter.value1;
						newValue = Number(value);
					} else {
						customError(`Cannot convert ${NodeTypeString[parameter.type]} to number.`);
						return;
					}

					return newNode(NodeType.NUMBER, newValue);
				}
				/**
				 *
				 * @param {MyNode} parameter
				 * @returns {MyNode}
				 */
				function builtInToBoolean(parameter) {
					if (parameter.type == NodeType.BOOLEAN) {
						return parameter;
					}
					let newValue;
					if (parameter.type == NodeType.NUMBER) {
						/** @type {number} */
						const value = parameter.value1;
						newValue = Boolean(value);
					} else if (parameter.type == NodeType.STRING || parameter.type == NodeType.LITERAL) {
						newValue = parameter.value1 === 'true';
					} else {
						customError(`Cannot convert ${NodeTypeString[parameter.type]} to boolean.`);
						return;
					}

					return newNode(NodeType.BOOLEAN, newValue);
				}

				return /** @type {Array.<BuiltInFunction>} */ ([
					{
						identifier: 'set',
						run: async parameters => {
							console.log('Running set!');
							if (parameters.length != 2) {
								customError(`'set' expects 2 parameters but received ${parameters.length}.`);
								return;
							}
							if (parameters[0].type != NodeType.IDENTIFIER) {
								customError(`'set' expects an identifier as the first parameter.`);
								return;
							}
							const identifier = parameters[0].value1;
							const value = parameters[1];
							if (value.type == NodeType.FUNCTION_CALL) {
								if (value.value1 === 'function') {
									setVariable(identifier, newNode(NodeType.FUNCTION, builtInFunctionFunction(value)));
									return;
								}
								const returnValue = await callFunction(value, scope);
								if (returnValue != null) {
									setVariable(identifier, { ...returnValue });
									return;
								}
								customError(`Cannot set identifier '${identifier}' to nothing.`);
								return;
							}
							if (value.type == NodeType.IDENTIFIER) {
								const otherVariable = getVariable(value);
								setVariable(identifier, otherVariable.value);
								return;
							}
							if (
								value.type == NodeType.LITERAL ||
								value.type == NodeType.STRING ||
								value.type == NodeType.NUMBER ||
								value.type == NodeType.BOOLEAN ||
								value.type == NodeType.FUNCTION
							) {
								setVariable(identifier, { ...value });
								return;
							}
							customError(
								`Error assigning value to '${identifier}'.`
							);
						},
					},
					{
						identifier: 'set-at',
						run: async parameters => {
							if (parameters.length != 3) {
								customError(`'set-at' expects 3 parameters but received ${parameters.length}.`);
								return;
							}
							if (parameters[0].type != NodeType.IDENTIFIER) {
								customError(`'set-at' expects an identifier as the first parameter.`);
								return;
							}
							const variableName = parameters[0].value1;
							const variable = getVariable(variableName, scope);
							if (!variable) {
								customError(`Unknown variable '${variableName}'.`);
								return;
							}
							const listLike = variable.value;
							const [index, value] = await getParameterValues(
								parameters.slice(1),
								scope
							);
							if (index.type != NodeType.NUMBER) {
								customError(`A number is expected as the second value of 'set-at', but ${NodeTypeString[index.type]} was given.`);
								return;
							}
							switch (listLike.type) {
								case NodeType.LIST:
								case NodeType.STRING:
								case NodeType.LITERAL:
									listLike.value1[index.value1] = value;
									break;
								default:
									customError(`Cannot use 'set-at' on ${NodeTypeString[listLike.type]}.`);
									break;
							}
						},
					},
					{
						identifier: 'print',
						run: async parameters => {
							console.log('Running print!');
							if (parameters.length != 1) {
								customError(`'print' expects 1 parameter but received ${parameters.length}.`);
								return;
							}
							const parameter = builtInToString(
								await getParameterValue(parameters[0], scope)
							);
							if (parameter.type == NodeType.STRING) {
								addToConsole(parameter.value1);
								return;
							}
							customError(`'print' expects a string but was given a ${NodeTypeString[parameter.type]}.`
							);
						},
					},
					{
						identifier: 'input',
						run: async parameters => {
							if (parameters.length != 0) {
								customError(`'input' expects 0 parameters but received ${parameters.length}.`);
								return;
							}
							const input = await getConsoleInput();
							return newNode(NodeType.STRING, input);
						},
					},
					{
						identifier: 'params',
						run: async parameters => {
							if (params.length != parameters.length) {
								customError(`Expected ${parameters.length} parameters but was given ${params.length}.`);
								return;
							}
							const promise = new Promise(resolve => {
								parameters.forEach(async (parameter, i) => {
									setVariable(parameter.value1, await getParameterValue(params[i]));
									if (i == parameters.length - 1) {
										const grade = getVariable('grade', scope);
										resolve();
									}
								});
							});

							return promise;
						},
					},
					{
						identifier: 'string',
						run: async parameters => {
							if (parameters.length != 1) {
								customError(`'string' expects 1 parameter but was given ${parameters.length}.`);
							}
							return builtInToString(
								await getParameterValue(parameters[0], scope)
							);
						},
					},
					{
						identifier: 'number',
						run: async parameters => {
							if (parameters.length != 1) {
								customError(`'number' expects 1 parameter but was given ${parameters.length}.`);
							}
							return builtInToNumber(
								await getParameterValue(parameters[0], scope)
							);
						},
					},
					{
						identifier: 'boolean',
						run: async parameters => {
							if (parameters.length != 1) {
								customError(`'boolean' expects 1 parameter but was given ${parameters.length}.`);
							}
							return builtInToBoolean(
								await getParameterValue(parameters[0], scope)
							);
						},
					},
					{
						identifier: 'equal',
						run: async parameters => {
							if (parameters.length != 2) {
								customError(`'equal' expects 2 parameter but received ${parameters.length}.`);
								return;
							}
							const parameterValues = await getParameterValues(
								parameters,
								scope
							);
							const parameter1 = parameterValues[0];
							let parameter2;
							switch (parameter1.type) {
								case NodeType.STRING:
								case NodeType.LITERAL:
									parameter2 = builtInToString(
										parameterValues[1]
									);
									break;
								case NodeType.NUMBER:
									parameter2 = builtInToNumber(
										parameterValues[1]
									);
									break;
								case NodeType.BOOLEAN:
									parameter2 = builtInToBoolean(
										parameterValues[1]
									);
									break;
								case NodeType.TYPE:
									parameter2 = parameterValues[1];
									if (parameter2.type != NodeType.TYPE) {
										customError(`Cannot compare type to ${NodeTypeString[parameter2.type]}.`
										);
										return;
									}
									break;
								default:
									customError(`Cannot compare ${NodeTypeString[parameter1.type]}.`);
									return;
							}
						},
					},
					{
						identifier: 'not-equal',
						run: async parameters => {
							if (parameters.length != 2) {
								customError(`'not-equal' expects 2 parameter but received ${parameters.length}.`);
								return;
							}
							const parameterValues = await getParameterValues(parameters, scope);
							const parameter1 = parameterValues[0];
							let parameter2;
							switch (parameter1.type) {
								case NodeType.STRING:
								case NodeType.LITERAL:
									parameter2 = builtInToString(parameterValues[1]);
									break;
								case NodeType.NUMBER:
									parameter2 = builtInToNumber(parameterValues[1]);
									break;
								case NodeType.BOOLEAN:
									parameter2 = builtInToBoolean(parameterValues[1]);
									break;
								default:
									customError(`Cannot compare ${NodeTypeString[parameter1.type]}.`);
									return;
							}
							return newNode(
								NodeType.BOOLEAN,
								parameter1.value1 !== parameter2.value1
							);
						},
					},
					{
						identifier: 'greater',
						run: async parameters => {
							if (parameters.length != 2) {
								customError(`'greater' expects 2 parameter but received ${parameters.length}.`);
								return;
							}
							const parameterValues = await getParameterValues(parameters,scope);
							const parameter1 = parameterValues[0];
							let parameter2;
							if (parameter1.type == NodeType.STRING || parameter1.type == NodeType.LITERAL) {
								parameter2 = builtInToString(parameterValues[1]);
							} else if (parameter1.type == NodeType.NUMBER) {
								parameter2 = builtInToNumber(parameterValues[1]);
							} else if (parameter1.type == NodeType.BOOLEAN) {
								parameter2 = builtInToBoolean(parameterValues[1]);
							} else {
								customError(`Cannot compare ${NodeTypeString[parameter1.type]}.`);
								return;
							}
							return newNode(NodeType.BOOLEAN, parameter1.value1 > parameter2.value1);
						},
					},
					{
						identifier: 'less',
						run: async parameters => {
							if (parameters.length != 2) {
								customError(`'less' expects 2 parameter but received ${parameters.length}.`);
								return;
							}
							const parameterValues = await getParameterValues(parameters,scope);
							const parameter1 = parameterValues[0];
							let parameter2;
							if (parameter1.type == NodeType.STRING || parameter1.type == NodeType.LITERAL) {
								parameter2 = builtInToString(parameterValues[1]);
							} else if (parameter1.type == NodeType.NUMBER) {
								parameter2 = builtInToNumber(parameterValues[1]);
							} else if (parameter1.type == NodeType.BOOLEAN) {
								parameter2 = builtInToBoolean(parameterValues[1]);
							} else {
								customError(`Cannot compare ${NodeTypeString[parameter1.type]}.`
								);
								return;
							}
							return newNode(NodeType.BOOLEAN, parameter1.value1 < parameter2.value1);
						},
					},
					{
						identifier: 'and',
						run: async parameters => {
							if (parameters.length != 2) {
								customError(`'and' expects 2 parameter but received ${parameters.length}.`);
								return;
							}
							const [parameter1, parameter2] =
								await getParameterValues(parameters, scope);
							if (parameter1.type != NodeType.BOOLEAN || parameter2.type != NodeType.BOOLEAN) {
								customError(`'and' requires both values to be a boolean.`);
								return;
							}
							return newNode(NodeType.BOOLEAN,parameter1.value1 && parameter2.value1);
						},
					},
					{
						identifier: 'or',
						run: async parameters => {
							if (parameters.length != 2) {
								customError(`'or' expects 2 parameter but received ${parameters.length}.`);
								return;
							}
							const [parameter1, parameter2] =
								await getParameterValues(parameters, scope);
							if (parameter1.type != NodeType.BOOLEAN || parameter2.type != NodeType.BOOLEAN) {
								customError(`'or' requires both values to be a boolean.`);
								return;
							}
							return newNode(NodeType.BOOLEAN, parameter1.value1 || parameter2.value1);
						},
					},
					{
						identifier: 'add',
						run: async parameters => {
							if (parameters.length != 2) {
								customError(`'add' expects 2 parameter but received ${parameters.length}.`);
								return;
							}
							let [parameter1, parameter2] = await getParameterValues(parameters, scope);
							switch (parameter1.type) {
								case NodeType.STRING:
									parameter2 = builtInToString(parameter2);
									return newNode(NodeType.STRING, parameter1.value1 + parameter2.value1);
								case NodeType.NUMBER:
									parameter2 = builtInToNumber(parameter2);
									return newNode(NodeType.NUMBER, parameter1.value1 + parameter2.value1);
								case NodeType.LIST:
									if (parameter2.type != NodeType.LIST) {
										customError(`Cannot add ${NodeTypeString[parameter2.type]} to List.`);
										break;
									}
									return newNode(NodeType.LIST, parameter1.value1.concat(parameter2.value1));
								default:
									customError(`'Unknown type ${NodeTypeString[parameter1.type]} in 'add'.`);
									return;
							}
						},
					},
					{
						identifier: 'add-to',
						run: async parameters => {
							if (parameters.length != 2) {
								customError(`'add-to' expects 2 parameter but received ${parameters.length}.`);
								return;
							}
							if (parameters[0].type != NodeType.IDENTIFIER) {
								customError(`'add-to' expects the 1st value to be an identifeer but received ${NodeTypeString[parameters[0].type]}.`);
							}
							const parameter2 = await getParameterValue(parameters[1], scope);

							const variable = getVariable(parameters[0].value1, scope);
                            if (!variable) {
                                customError(`Unknown variable '${parameters[0].value1}'.`);
                                return;
                            }
                            const value = variable.value;
                            switch (value.type) {
                                case NodeType.NUMBER:
                                    value.value1 += builtInToNumber(parameter2).value1;
                                    break;
                                case NodeType.LITERAL:
                                case NodeType.STRING:
                                    value.value1 += builtInToString(parameter2).value1;
                                    break;
                                case NodeType.LIST:
                                    if (parameter2.type != NodeType.LIST) {
                                        customError(`Cannot add ${NodeTypeString[parameter2.type]} to List.`);
                                        break;
                                    }
                                    value.value1 = value.value1.concat(parameter2.value1);
                                    return;
                                default:
                                    customError(`Unknown type ${NodeTypeString[value.type]} in 'add-to'`);
                                    break;
                            }
						}
					},
					{
						identifier: 'not',
						run: async parameters => {
							if (parameters.length != 1) {
								customError(`'not' expects 1 parameter but received ${parameters.length}.`);
								return;
							}
							const parameter = await getParameterValue(parameters[0], scope);
							if (parameter.type == NodeType.BOOLEAN) {
								return newNode(NodeType.BOOLEAN, !parameter.value1);
							} else {
								customError(`'not' expects a boolean`);
							}
						},
					},
					{
						identifier: 'subtract',
						run: async parameters => {
							if (parameters.length != 2) {
								customError(`'subtract' expects 2 parameter but received ${parameters.length}.`);
								return;
							}
							const [parameter1, parameter2] =
								await getParameterValues(parameters, scope);
							if (parameter1.type != NodeType.NUMBER || parameter2.type != NodeType.NUMBER) {
								customError(`'subtract' requires both values to be a number.`);
								return;
							}
							return newNode(NodeType.NUMBER, parameter1.value1 - parameter2.value1);
						},
					},
					{
						identifier: 'subtract-to',
						run: async parameters => {
							if (parameters.length != 2) {
								customError(`'subtract-to' expects 2 parameter but received ${parameters.length}.`);
								return;
							}
							const [parameter1, parameter2] =
								await getParameterValues(parameters, scope);
							if (parameter1.type != NodeType.NUMBER || parameter2.type != NodeType.NUMBER) {
								customError(`'subtract-to' requires both values to be a number.`);
								return;
							}
							parameter1.value1 = parameter1.value1 - parameter2.value1;
						},
					},
					{
						identifier: 'multiply',
						run: async parameters => {
							if (parameters.length != 2) {
								customError(`'multiply' expects 2 parameter but received ${parameters.length}.`);
								return;
							}
							const [parameter1, parameter2] = await getParameterValues(parameters, scope);
							if (parameter1.type != NodeType.NUMBER || parameter2.type != NodeType.NUMBER) {
								customError(`'multiply' requires both values to be a number.`);
								return;
							}
							return newNode(NodeType.NUMBER,parameter1.value1 * parameter2.value1);
						},
					},
					{
						identifier: 'multiply-to',
						run: async parameters => {
							if (parameters.length != 2) {
								customError(`'multiply-to' expects 2 parameter but received ${parameters.length}.`);
								return;
							}
							const [parameter1, parameter2] = await getParameterValues(parameters, scope);
							if (parameter1.type != NodeType.NUMBER || parameter2.type != NodeType.NUMBER) {
								customError(`'multiply-to' requires both values to be a number.`);
								return;
							}
							parameter1.value1 = parameter1.value1 * parameter2.value1;
						},
					},
					{
						identifier: 'divide',
						run: async parameters => {
							if (parameters.length != 2) {
								customError( `'divide' expects 2 parameter but received ${parameters.length}.`);
								return;
							}
							const [parameter1, parameter2] = await getParameterValues(parameters, scope);
							if (parameter1.type != NodeType.NUMBER || parameter2.type != NodeType.NUMBER) {
								customError(`'divide' requires both values to be a number.`);
								return;
							}
							return newNode(NodeType.NUMBER, parameter1.value1 / parameter2.value1);
						},
					},
					{
						identifier: 'divide-to',
						run: async parameters => {
							if (parameters.length != 2) {
								customError(`'divide-to' expects 2 parameter but received ${parameters.length}.`);
								return;
							}
							const [parameter1, parameter2] = await getParameterValues(parameters, scope);
							if (parameter1.type != NodeType.NUMBER || parameter2.type != NodeType.NUMBER) {
								customError(`'divide-to' requires both values to be a number.`);
								return;
							}
							parameter1.value1 = parameter1.value1 / parameter2.value1;
						},
					},
					{
						identifier: 'remainder',
						run: async parameters => {
							if (parameters.length != 2) {
								customError(`'remainder' expects 2 parameter but received ${parameters.length}.`);
								return;
							}
							const [parameter1, parameter2] = await getParameterValues(parameters, scope);
							if (parameter1.type != NodeType.NUMBER || parameter2.type != NodeType.NUMBER) {
								customError(`'remainder' requires both values to be a number.`);
								return;
							}
							return newNode(NodeType.NUMBER, parameter1.value1 % parameter2.value1);
						},
					},
					{
						identifier: 'if',
						run: async parameters => {
							if (parameters.length != 2) {
								customError(`'if' expects 2 parameters but received ${parameters.length}.`);
								return;
							}
							const parameter1 = await getParameterValue(parameters[0], scope);
							if (parameter1.type != NodeType.BOOLEAN) {
								customError(`The first value of 'if' should be a boolean.`);
								return;
							}
							if (parameter1.value1) {
								/** @type {MyFunction} */
								const functionToRun = await (async () => {
									const parameterToRun = parameters[1];
									if (parameterToRun.type == NodeType.FUNCTION_CALL) {
										if (parameterToRun.value1 === 'function') {
											return builtInFunctionFunction(parameterToRun);
										} else {
											const parameterValue = await getParameterValue(parameterToRun, scope);
											if (parameterValue.type == NodeType.FUNCTION) {
												return parameterValue.value1;
											} else {
												customError(`The second value of 'if' should be type function.`);
											}
										}
									} else {
										const parameterValue = await getParameterValue(parameterToRun, scope);
										if (parameterValue.type == NodeType.FUNCTION) {
											return parameterValue.value1;
										} else {
											customError(`The second value of 'if' should be type function.`);
										}
									}
								})();

								await runFunction(newFunction(functionToRun.statementNodes, newScope(scope)));
							}
						},
					},
					{
						identifier: 'if-else',
						run: async parameters => {
							if (parameters.length != 3) {
								customError(`'if-else' expects 3 parameter but received ${parameters.length}.`);
								return;
							}
							const parameter1 = await getParameterValue(parameters[0], scope);
							if (parameter1.type != NodeType.BOOLEAN) {
								customError(`The first value of 'if-else' should be a boolean.`);
								return;
							}
							/** @type {MyFunction} */
							const functionToRun = await (async () => {
								const parameterToRun = parameter1.value1 ? parameters[1] : parameters[2];
								if (parameterToRun.type == NodeType.FUNCTION_CALL) {
									if (parameterToRun.value1 === 'function') {
										return builtInFunctionFunction(parameterToRun);
									} else {
										const parameterValue = await getParameterValue(parameterToRun, scope);
										if (parameterValue.type == NodeType.FUNCTION) {
											return parameterValue.value1;
										} else {
											customError(`The second and third value of 'if-else' should be type function.`);
										}
									}
								} else {
									const parameterValue = await getParameterValue(parameterToRun, scope);
									if (parameterValue.type == NodeType.FUNCTION) {
										return parameterValue.value1;
									} else {
										customError(`The second and third value of 'if-else' should be type function.`);
									}
								}
							})();

							await runFunction(newFunction(functionToRun.statementNodes, newScope(scope)));
						},
					},
					{
						identifier: 'while',
						run: async parameters => {
							if (parameters.length != 2) {
								customError(`'while' expects 2 parameter but received ${parameters.length}.`);
								return;
							}
							const [ parameter1, parameter2 ] = await getParameterValues(parameters, scope);
							if (parameter1.type != NodeType.FUNCTION || parameter2.type != NodeType.FUNCTION) {
								customError(`Both values of 'while' should be a function.`);
							}

							let i = 0;
							do {
								if (i == loopMax) {
									break;
								}
								const booleanFunctionResult = await runFunction(newFunction(parameter1.value1.statementNodes, scope));
								if (!booleanFunctionResult.value1) {
									break;
								}
								await runFunction(newFunction(parameter2.value1.statementNodes, scope));
								i++;
							} while (true);
							if (i == loopMax) {
								customError(`Loop cannot run more than ${loopMax} times.`);
							}
						},
					},
					{
						identifier: 'list',
						run: async parameters => {
							const parameterValues = await getParameterValues(parameters, scope);
							return newNode(NodeType.LIST, parameterValues);
						},
					},
					{
						identifier: 'length',
						run: async parameters => {
							if (parameters.length != 1) {
								customError(`'length' expects 1 parameter but was given ${parameters.length}.`);
								return;
							}
							const parameter = await getParameterValue(parameters[0], scope);
							switch (parameter.type) {
								case NodeType.LIST:
								case NodeType.STRING:
								case NodeType.TOKEN:
									return newNode(NodeType.NUMBER, parameter.value1.length);
								default:
									customError(`'length' expects a string or a list, but was given a ${NodeTypeString[parameter.value1.type]}.`);
							}
						},
					},
					{
						identifier: 'for-each',
						run: async parameters => {
							if (parameters.length != 2) {
								customError(`'for-each' expects 2 parameters but received ${parameters.length}.`);
								return;
							}
							const [parameter1, parameter2] = await getParameterValues(parameters, scope);
							/** @type {Array.<MyNode>|Array.<string>} */
							let iterable;
							switch (parameter1.type) {
								case NodeType.LITERAL:
								case NodeType.STRING:
									iterable = [...parameter1.value1];
									break;
								case NodeType.LIST:
									iterable = parameter1.value1;
									break;
								default:
									customError(`'for-each' expects an iterable as the 1st parameter (string or list) but received ${NodeTypeString[parameter1.type]}.`);
									return;
							}
							if (parameter2.type != NodeType.FUNCTION) {
								customError(`'for-each' expects a function as the 2nd parameter but received ${NodeTypeString[parameter2.type]}.`);
								return;
							}
							for (let i = 0; i < iterable.length; i++) {
								const element = iterable[i];
								const myFunction = newFunction(parameter2.value1.statementNodes, scope);
								await runFunction(myFunction, [element]);
							}
						},
					},
					{
						identifier: 'enum-for-each',
						run: async parameters => {
							if (parameters.length != 2) {
								customError(`'enum-for-each' expects 2 parameters but received ${parameters.length}.`);
								return;
							}
							const [parameter1, parameter2] = await getParameterValues(parameters, scope);
							/** @type {Array.<MyNode>|Array.<string>} */
							let iterable;
							switch (parameter1.type) {
								case NodeType.LITERAL:
								case NodeType.STRING:
									iterable = [...parameter1.value1];
									break;
								case NodeType.LIST:
									iterable = parameter1.value1;
									break;
								default:
									customError(`'enum-for-each' expects an iterable as the 1st parameter (string or list) but received ${NodeTypeString[parameter1.type]}.`);
									return;
							}
							if (parameter2.type != NodeType.FUNCTION) {
								customError(`'enum-for-each' expects a function as the 2nd parameter but received ${NodeTypeString[parameter2.type]}.`);
								return;
							}
							for (let i = 0; i < iterable.length; i++) {
								const element = iterable[i];
								const myFunction = newFunction(parameter2.value1.statementNodes, scope);
								await runFunction(myFunction, [element, newNode(NodeType.NUMBER, i)]);
							}
						},
					},
					{
						identifier: 'push',
						run: async parameters => {
							if (parameters.length != 2) {
								customError(`'push' expects 2 parameters but was given ${parameters.length}.`);
								return;
							}
							const [list, newItem] = await getParameterValues(parameters, scope);
							if (list.type != NodeType.LIST) {
								customError(`'push' expects the 1st parameter to be a list but was given ${NodeTypeString[list.type]}.`);
								return;
							}
							list.value1.push(newItem);
						},
					},
					{
						identifier: 'pop',
						run: async parameters => {
							if (parameters.length != 1) {
								customError(`'pop' expects 1 parameter but was given ${parameters.length}.`);
								return;
							}
							const list = await getParameterValue(parameters[0], scope);
							return list.value1.pop();
						},
					},
					{
						identifier: 'value-at',
						run: async parameters => {
							if (parameters.length != 2) {
								customError(`'value-at' expects 2 parameter but was given ${parameters.length}.`);
								return;
							}
							const [listLike, index] = await getParameterValues(parameters, scope);
							if (index.type != NodeType.NUMBER || !Number.isInteger(index.value1)) {
								customError(`index in 'value-at' must be an integer.`);
								return;
							}
							switch (listLike.type) {
								case NodeType.LIST:
								case NodeType.STRING:
									if (index.value1 >= listLike.value1.length) {
										customError(`index out of bounds exception in 'value-at'.`);
										return;
									}
									return listLike.value1[index.value1];
								default:
									customError(`Unexpected paramater ${NodeTypeString[listLike.type]} in 'value-at'.`);
									break;
							}
						},
					},
					{
						identifier: 'slice',
						run: async parameters => {
							if (parameters.length > 3 || parameters.length < 2) {
								customError(`'slice' expects 2 or 3 parameters but received ${parameters.length}.`);
							}
							const [listLike, index1, index2] = await getParameterValues(parameters, scope);
							switch (listLike.type) {
								case NodeType.STRING:
								case NodeType.LITERAL:
								case NodeType.LIST:
									if (index1.type != NodeType.NUMBER) {
										customError(`The second value of 'slice' should be Number but received ${NodeTypeString[index1.type]}.`);
										return;
									}
									if (index2) {
										if (index2.type != NodeType.NUMBER) {
											customError(`The second value of 'slice' should be Number but received ${NodeTypeString[index2.type]}.`);
											return;
										}
										return newNode(listLike.type, listLike.value1.slice(index1.value1, index2.value1));
									}
									return newNode(listLike.type, listLike.value1.slice(index1.value1));
								default:
									break;
							}
						},
					},
					{
						identifier: 'round',
						run: async parameters => {
							if (parameters.length != 1) {
								customError(`'round' expects 1 parameter but received ${parameters.length}.`);
								return;
							}
							const number = builtInToNumber(await getParameterValue(parameters[0], scope));
							return newNode(NodeType.NUMBER, Math.round(number.value1));
						},
					},
					{
						identifier: 'floor',
						run: async parameters => {
							if (parameters.length != 1) {
								customError(`'floor' expects 1 parameter but received ${parameters.length}.`);
								return;
							}
							const number = builtInToNumber(await getParameterValue(parameters[0], scope));
							return newNode(NodeType.NUMBER, Math.floor(number.value1));
						},
					},
					{
						identifier: 'ceil',
						run: async parameters => {
							if (parameters.length != 1) {
								customError(`'ceil' expects 1 parameter but received ${parameters.length}.`);
								return;
							}
							const number = builtInToNumber(await getParameterValue(parameters[0], scope));
							return newNode(NodeType.NUMBER, Math.ceil(number.value1));
						},
					},
					{
						identifier: 'trunc',
						run: async parameters => {
							if (parameters.length != 1) {
								customError(`'trunc' expects 1 parameter but received ${parameters.length}.`);
								return;
							}
							const number = builtInToNumber(await getParameterValue(parameters[0], scope));
							return newNode(NodeType.NUMBER, Math.trunc(number.value1));
						},
					},
					{
						identifier: 'rand-int',
						run: async parameters => {
							if (parameters.length > 2 || parameters.length < 1) {
								customError(`'rand-int' expects 1 or 2 parameters but received ${parameters.length}.`);
								return;
							}
							const [first, second] = await getParameterValues(parameters, scope);
							if (first.type != NodeType.NUMBER) {
								customError(`'rand-int' expects numbers but received ${NodeTypeString[first.type]}.`);
								return;
							}
							if (!Number.isInteger(first.value1)) {
								customError(`'rand-int' expects integers but received a double.`);
								return;
							}
							const firstValue = first.value1;
							let value;
							if (second) {
								if (second.type != NodeType.NUMBER) {
									customError(`'rand-int' expects numbers but received ${NodeTypeString[second.type]}.`
									);
									return;
								}
								if (!Number.isInteger(first.value2)) {
									customError(`'rand-int' expects integers but received a double.`);
									return;
								}
								const secondValue = second.value1;
								if (secondValue <= firstValue) {
									customError(`The second value in 'rand-int' must be smaller that the first.`);
									return;
								}
								value = getRandomInt(secondValue - firstValue) + firstValue;
							} else {
								value = getRandomInt(firstValue);
							}
							return newNode(NodeType.NUMBER, value);
						},
					},
					{
						identifier: 'rand-double',
						run: async parameters => {
							if (parameters.length > 2 || parameters.length < 1) {
								customError(`'rand-double' expects 1 or 2 parameters but received ${parameters.length}.`);
								return;
							}
							const [first, second] = await getParameterValues(parameters, scope);
							if (first.type != NodeType.NUMBER) {
								customError(`'rand-double' expects numbers but received ${NodeTypeString[first.type]}.`);
								return;
							}
							if (!Number.isInteger(first.value1)) {
								customError(`'rand-double' expects integers but received a double.`);
								return;
							}
							const firstValue = first.value1;
							let value;
							if (second) {
								if (second.type != NodeType.NUMBER) {
									customError(`'rand-double' expects numbers but received ${NodeTypeString[second.type]}.`);
									return;
								}
								if (!Number.isInteger(first.value2)) {
									customError(`'rand-double' expects integers but received a double.`);
									return;
								}
								const secondValue = second.value1;
								if (secondValue <= firstValue) {
									customError(`The second value in 'rand-double' must be smaller that the first.`);
									return;
								}
								value = Math.random() * (secondValue - firstValue) + firstValue;
							} else {
								value = Math.random() * firstValue;
							}
							return newNode(NodeType.NUMBER, value);
						},
					},
					{
						identifier: 'type-of',
						run: async parameters => {
							if (parameters.length > 1) {
								customError(`'type-of' expects 1 parameter but received ${parameters.length}.`);
								return;
							}
							const value = await getParameterValue(parameters[0], scope);
							return newNode(NodeType.TYPE, value.type);
						},
					},
				]);
			})();
			/**
			 *
			 * @param {MyNode} functionNode
			 * @param {Scope} scope
			 * @returns {Promise.<MyNode|null>}
			 */
			async function callFunction(functionNode, scope) {
				let builtInFunction = builtInFunctions.find(builtInFunction => builtInFunction.identifier === functionNode.value1);
				if (builtInFunction != undefined) {
					return await builtInFunction.run(functionNode.value2);
				}
				let thisFunction = getVariable(functionNode.value1, scope);
				if (thisFunction) {
					if (functionNode.type == NodeType.FUNCTION_CALL) {
						return await runFunction(thisFunction.value.value1, await getParameterValues(functionNode.value2, scope));
					}
				} else {
					if (functionNode.value1 === 'function') {
						return newNode(NodeType.FUNCTION, newFunction(functionNode.value2, scope));
					}
					customError(`Attempting to call unknown function '${functionNode.value1}.`);
				}
			}
			/**
			 *
			 * @param {MyNode} parameter
			 * @param {Scope} scope
			 * @returns {Promise.<MyNode>}
			 */
			async function getParameterValue(parameter, scope) {
				switch (parameter.type) {
					case NodeType.FUNCTION_CALL:
						if (parameter.value1 === 'function') {
							return newNode(NodeType.FUNCTION, builtInFunctionFunction(parameter));
						} else {
							const functionResult = await callFunction(parameter, scope);
							return functionResult;
						}
					case NodeType.IDENTIFIER:
						const variable = getVariable(parameter.value1, scope);
                        if (!variable) {
                            customError(`Unknown variable '${parameter.value1}'.`);
                            return;
                        }
						return variable.value;
					case NodeType.LITERAL:
						const node = newNode(NodeType.STRING, parameter.value1);
						return node;
					case NodeType.FUNCTION:
					case NodeType.STRING:
					case NodeType.NUMBER:
					case NodeType.BOOLEAN:
					case NodeType.LIST:
						return parameter;
					default:
						customError(`Error: Unknown parameter ${parameter.value1}.`);
						break;
				}
			}
			/**
			 *
			 * @param {Array.<MyNode>} parameters
			 * @param {Scope} scope
			 * @returns {Promise.<Array.<MyNode>>}
			 */
			async function getParameterValues(parameters, scope) {
				return await Promise.all(parameters.map(parameter => getParameterValue(parameter, scope)));
			}
			/**
			 *
			 * @param {string} identifier
			 * @param {Scope} scope
			 * @returns {Variable|undefined}
			 */
			function getVariable(identifier, scope) {
				const existingVariable = scope.variables.find(variable => variable.identifier === identifier);
				if (existingVariable) {
					return existingVariable;
				}
				const builtInVariable = builtInVariables.find(variable => variable.identifier === identifier);
				if (builtInVariable) {
					return builtInVariable;
				}
				if (scope.parentScope) {
					return getVariable(identifier, scope.parentScope);
				}
				return undefined;
			}
			/**
			 *
			 * @param {string} identifier
			 * @param {MyNode} value
			 */
			function setVariable(identifier, value) {
				if (value.type == NodeType.LITERAL) {
					value = newNode(NodeType.STRING, value.value1);
				}
				let existingVariable = getVariable(identifier, scope);
				if (existingVariable) {
					existingVariable.value = value;
				} else {
					scope.variables.push(newVariable(identifier, value));
				}
			}
			for (let i = 0; i < statementNodes.length; i++) {
				const statementNode = statementNodes[i];
				if (statementNode.value1 === 'return') {
					if (statementNode.value2.length > 1) {
						customError(`Return was given ${statementNode.value2.length} values but expects 0 or 1.`);
						return;
					}
					if (statementNode.value2.length == 1) {
						const returnNode = statementNode.value2[0];
						if (returnNode.type == NodeType.FUNCTION_CALL) {
							return await callFunction(returnNode, scope);
						} else if (returnNode.type == NodeType.IDENTIFIER) {
							return getVariable(returnNode.value1, scope).value;
						} else {
							return returnNode;
						}
					}
				} else {
					await callFunction(statementNode, scope);
				}
			}

			if (isGlobal) {
				const mainFunction = getVariable('main', scope);
				if (mainFunction != undefined) {
					if (mainFunction.value.type == NodeType.FUNCTION) {
						return await runFunction(mainFunction.value.value1);
					}
				}
				customError(`Cannot find main function.`);
			}
			return;
		}

		await runFunction(newFunction(globalNodes, newScope()), [], true);
	})();
});