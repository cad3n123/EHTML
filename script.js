// Global Constants
const [ $form ] = [ 'form' ].map(selector => document.querySelector(selector));
const [ $textBoxes, $textEditor, $console ] = [ 'text-boxes', 'text-editor', 'console' ].map(id => document.getElementById(id));
const loopMax = 10000;

// Global Variables

// Custom Types/Constructor Functions
/**
 * @typedef {number} TokenType
 */
const TokenType = {
    ELEMENT: 0,
    LITERAL: 1
};
/**
 * @typedef {number} TokenSubType
 */
const TokenSubType = {
    NONE: 0,
    START: 1,
    END: 2
}
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
        subType: subType
    }
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
    TYPE: 10
};
const NodeTypeString = ['Null', 'Token', 'Literal', 'Identifier', 'Function Call', 'String', 'Number', 'Boolean', 'Function', 'List', 'Type'];
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
        value2: value2
    }
}
/**
 * 
 * @returns {HTMLParagraphElement}
 */
function newCarrot() {
    const p = document.createElement('p');
    p.class = 'carrot';
    p.innerHTML = '>'
    return p;
};
function newConsoleLine() {
    const $div = document.createElement('div');
    $div.classList.add('line');
    return $div;
}

// Functions
function main() {
}
/**
 * @param {string} text
 */
function addToConsole(text) {
    const $line = newConsoleLine();
    const $text = document.createElement('p');
    $text.innerHTML = text;
    $line.appendChild(newCarrot());
    $line.appendChild($text);
    $console.appendChild($line);
}
/**
 * 
 * @returns {Promise<string>}
 */
async function getConsoleInput() {
    const $line = newConsoleLine();
    $line.classList.add('input');
    const $textarea = document.createElement('textarea');
    $line.appendChild(newCarrot());
    $line.appendChild($textarea);
    $console.appendChild($line);

    const promise = new Promise((resolve) => {
        $textarea.addEventListener('keydown', (event) => {
            if (event.key == 'Enter') {
                const text = $textarea.value;
                const $text = document.createElement('p');
                $text.innerHTML = text;
                $line.appendChild($text);
                $textarea.remove();
                $line.classList.remove('input');
                resolve(text);
            }
        });
    })
    
    return promise;
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// Event Listeners
window.addEventListener('load', main);
$textEditor.addEventListener('keydown', (event) => {
    if (event.key == 'Tab') {
        event.preventDefault();
        var start = $textEditor.selectionStart;
        var end = $textEditor.selectionEnd;
    
        // set textarea value to: text before caret + tab + text after caret
        $textEditor.value = $textEditor.value.substring(0, start) +"\t" + $textEditor.value.substring(end);
    
        // put caret at right position again
        $textEditor.selectionStart = $textEditor.selectionEnd = start + 1;
      }
});
$form.addEventListener('submit', (event) => {
    event.preventDefault();

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
        let tokens = /** @type {Array.<Token>} */([]);
        while (isRoom()) {
            let word = '';
            if (/\s/g.test(peek())) {
                consume();
            }
            else if (peekIs('<')) {
                consume();
                const subType = (peek() === '/' ?
                (() => {
                    consume();
                    return TokenSubType.END;
                })() : TokenSubType.START);
                while (peekIsNotRoom('>')) {
                    word += consume();
                }
                if (peekIs('>')) {
                    consume();
                    tokens.push(newToken(word, TokenType.ELEMENT, subType));
                } else {
                    console.error(`Expected '>' at the end of the element.`)
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
                    console.error(`Expected '"' at the end of the string.`)
                    break;
                }
            } else {
                while (peekIsNotRoom('<')) {
                    word += consume();
                }
                if (peekIs('<')) {
                    tokens.push(newToken(word, TokenType.LITERAL));
                } else {
                    console.error(`Expected an end tag after a literal.`);
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
        let nodeStack = /** @type {Array.<MyNode>} */([]);
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
                        console.error(`Unexpected end tag '/${peek().value}' with no matching start tag.`);
                        break;
                    }
                    let parameters = /** @type {Array.<MyNode>} */([]);
                    const originalLength = nodeStack.length - 1;
                    for (functionCallIndex; functionCallIndex < originalLength; functionCallIndex++) {
                        const nextElement = nodeStack.pop();
                        if (nextElement.type == NodeType.TOKEN) {
                            const nextElementToken = /** @type {Token} */(nextElement.value1);
                            parameters.push((nextElementToken.type == TokenType.ELEMENT) ? newNode(NodeType.IDENTIFIER, nextElementToken.value) : newNode(NodeType.LITERAL, nextElementToken.value));
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
    
    console.log("Tokens:")
    tokens.forEach(token => console.log(token));
    console.log("\nRoot Node:");
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
                value: value
            }
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
                parentScope: parentScope
            }
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
                scope: scope
            }
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
                return [
                    newVariable('true', newNode(NodeType.BOOLEAN, true)),
                    newVariable('false', newNode(NodeType.BOOLEAN, false))
                ]
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
                            console.error(`Cannot convert ${NodeTypeString[parameter.type]} to string.`);
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
                    if (parameter.type == NodeType.LITERAL || parameter.type == NodeType.STRING || parameter.type == NodeType.BOOLEAN) {
                        /** @type {string|boolean} */
                        const value = parameter.value1;
                        newValue = Number(value);
                    } else {
                        console.error(`Cannot convert ${NodeTypeString[parameter.type]} to number.`);
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
                        console.error(`Cannot convert ${NodeTypeString[parameter.type]} to boolean.`);
                        return;
                    }

                    return newNode(NodeType.BOOLEAN, newValue);
                }

                return /** @type {Array.<BuiltInFunction>} */([
                    {
                        identifier: 'set',
                        run: async (parameters) => {
                            if (parameters.length != 2) {
                                console.error(`'set' expects 2 parameters but received ${parameters.length}.`);
                                return;
                            }
                            if (parameters[0].type != NodeType.IDENTIFIER) {
                                console.error(`'set' expects an identifier as the first parameter.`);
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
                                    setVariable(identifier, {...returnValue})
                                    return;
                                }
                                console.error(`Cannot set identifier '${identifier}' to nothing.`);
                                return;
                            }
                            if (value.type == NodeType.IDENTIFIER) {
                                const otherVariable = getVariable(value);
                                setVariable(identifier, otherVariable.value);
                                return;
                            }
                            if (value.type == NodeType.LITERAL || value.type == NodeType.STRING || value.type == NodeType.NUMBER || value.type == NodeType.BOOLEAN || value.type == NodeType.FUNCTION) {
                                setVariable(identifier, {...value});
                                return;
                            }
                            console.error(`Error assigning value to '${identifier}'.`);
                        }
                    },
                    {
                        identifier: 'set-at',
                        run: async (parameters) => {
                            if (parameters.length != 3) {
                                console.error(`'set-at' expects 3 parameters but received ${parameters.length}.`);
                                return;
                            }
                            if (parameters[0].type != NodeType.IDENTIFIER) {
                                console.error(`'set-at' expects an identifier as the first parameter.`);
                                return;
                            }
                            const variableName = parameters[0].value1;
                            const variable = getVariable(variableName, scope);
                            if (!variable) {
                                console.error(`Unknown variable '${variableName}'.`);
                                return;
                            }
                            const listLike = variable.value;
                            const [ index, value ] = await getParameterValues(parameters.slice(1), scope);
                            if (index.type != NodeType.NUMBER) {
                                console.error(`A number is expected as the second value of 'set-at', but ${NodeTypeString[index.type]} was given.`);
                                return;
                            }
                            switch (listLike.type) {
                                case NodeType.LIST:
                                case NodeType.STRING:
                                case NodeType.LITERAL:
                                    listLike.value1[index.value1] = value;
                                    break;
                                default:
                                    console.error(`Cannot use 'set-at' on ${NodeTypeString[listLike.type]}.`);
                                    break;
                            }
                        }
                    },
                    {
                        identifier: 'print',
                        run: async (parameters) => {
                            if (parameters.length != 1) {
                                console.error(`'print' expects 1 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const parameter = builtInToString(await getParameterValue(parameters[0], scope));
                            if (parameter.type == NodeType.STRING) {
                                addToConsole(parameter.value1);
                                return;
                            }
                            console.error(`'print' expects a string but was given a ${NodeTypeString[parameter.type]}.`)
                        }
                    },
                    {
                        identifier: 'input',
                        run: async (parameters) => {
                            if (parameters.length != 0) {
                                console.error(`'input' expects 0 parameters but received ${parameters.length}.`);
                                return;
                            }
                            const input = await getConsoleInput();
                            return newNode(NodeType.STRING, input);
                        }
                    },
                    {
                        identifier: 'params',
                        run: async (parameters) => {
                            if (params.length != parameters.length) {
                                console.error(`Expected ${parameters.length} parameters but was given ${params.length}.`);
                                return;
                            }
                            const promise = new Promise((resolve) => {
                                parameters.forEach(async (parameter, i) => {
                                    setVariable(parameter.value1, await getParameterValue(params[i]));
                                    if (i == parameters.length - 1) {
                                        const grade = getVariable('grade', scope);
                                        resolve();
                                    }
                                });
                            });

                            return promise;
                        }
                    },
                    {
                        identifier: 'string',
                        run: async (parameters) => {
                            if (parameters.length != 1) {
                                console.error(`'string' expects 1 parameter but was given ${parameters.length}.`);
                            }
                            return builtInToString(await getParameterValue(parameters[0], scope));
                        }
                    },
                    {
                        identifier: 'number',
                        run: async (parameters) => {
                            if (parameters.length != 1) {
                                console.error(`'number' expects 1 parameter but was given ${parameters.length}.`);
                            }
                            return builtInToNumber(await getParameterValue(parameters[0], scope));
                        }
                    },
                    {
                        identifier: 'boolean',
                        run: async (parameters) => {
                            if (parameters.length != 1) {
                                console.error(`'boolean' expects 1 parameter but was given ${parameters.length}.`);
                            }
                            return builtInToBoolean(await getParameterValue(parameters[0], scope));
                        }
                    },
                    {
                        identifier: 'equal',
                        run: async (parameters) => {
                            if (parameters.length != 2) {
                                console.error(`'equal' expects 2 parameter but received ${parameters.length}.`);
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
                                case NodeType.TYPE:
                                    parameter2 = parameterValues[1];
                                    if (parameter2.type != NodeType.TYPE) {
                                        console.error(`Cannot compare type to ${NodeTypeString[parameter2.type]}.`);
                                        return;
                                    }
                                    break;
                                default:
                                    console.error(`Cannot compare ${NodeTypeString[parameter1.type]}.`);
                                    return;
                            }
                            console.log('parameter1:');
                            console.log(parameter1);
                            console.log('parameter2:');
                            console.log(parameter2);
                            return newNode(NodeType.BOOLEAN, parameter1.value1 === parameter2.value1);
                        }
                    },
                    {
                        identifier: 'not-equal',
                        run: async (parameters) => {
                            if (parameters.length != 2) {
                                console.error(`'not-equal' expects 2 parameter but received ${parameters.length}.`);
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
                                    console.error(`Cannot compare ${NodeTypeString[parameter1.type]}.`);
                                    return;
                            }
                            return newNode(NodeType.BOOLEAN, parameter1.value1 !== parameter2.value1);
                        }
                    },
                    {
                        identifier: 'greater',
                        run: async (parameters) => {
                            if (parameters.length != 2) {
                                console.error(`'greater' expects 2 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const parameterValues = await getParameterValues(parameters, scope);
                            const parameter1 = parameterValues[0];
                            let parameter2;
                            if (parameter1.type == NodeType.STRING || parameter1.type == NodeType.LITERAL) {
                                parameter2 = builtInToString(parameterValues[1]);
                            } else if (parameter1.type == NodeType.NUMBER) {
                                parameter2 = builtInToNumber(parameterValues[1]);
                            } else if (parameter1.type == NodeType.BOOLEAN) {
                                parameter2 = builtInToBoolean(parameterValues[1]);
                            } else {
                                console.error(`Cannot compare ${NodeTypeString[parameter1.type]}.`);
                                return;
                            }
                            return newNode(NodeType.BOOLEAN, parameter1.value1 > parameter2.value1);
                        }
                    },
                    {
                        identifier: 'less',
                        run: async (parameters) => {
                            if (parameters.length != 2) {
                                console.error(`'less' expects 2 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const parameterValues = await getParameterValues(parameters, scope);
                            const parameter1 = parameterValues[0];
                            let parameter2;
                            if (parameter1.type == NodeType.STRING || parameter1.type == NodeType.LITERAL) {
                                parameter2 = builtInToString(parameterValues[1]);
                            } else if (parameter1.type == NodeType.NUMBER) {
                                parameter2 = builtInToNumber(parameterValues[1]);
                            } else if (parameter1.type == NodeType.BOOLEAN) {
                                parameter2 = builtInToBoolean(parameterValues[1]);
                            } else {
                                console.error(`Cannot compare ${NodeTypeString[parameter1.type]}.`);
                                return;
                            }
                            return newNode(NodeType.BOOLEAN, parameter1.value1 < parameter2.value1);
                        }
                    },
                    {
                        identifier: 'and',
                        run: async (parameters) => {
                            if (parameters.length != 2) {
                                console.error(`'and' expects 2 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const [ parameter1, parameter2 ] = await getParameterValues(parameters, scope);
                            if (parameter1.type != NodeType.BOOLEAN || parameter2.type != NodeType.BOOLEAN) {
                                console.error(`'and' requires both values to be a boolean.`);
                                return;
                            }
                            return newNode(NodeType.BOOLEAN, parameter1.value1 && parameter2.value1);
                        }
                    },
                    {
                        identifier: 'or',
                        run: async (parameters) => {
                            if (parameters.length != 2) {
                                console.error(`'or' expects 2 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const [ parameter1, parameter2 ] = await getParameterValues(parameters, scope);
                            if (parameter1.type != NodeType.BOOLEAN || parameter2.type != NodeType.BOOLEAN) {
                                console.error(`'or' requires both values to be a boolean.`);
                                return;
                            }
                            return newNode(NodeType.BOOLEAN, parameter1.value1 || parameter2.value1);
                        }
                    },
                    {
                        identifier: 'add',
                        run: async (parameters) => {
                            if (parameters.length != 2) {
                                console.error(`'add' expects 2 parameter but received ${parameters.length}.`);
                                return;
                            }
                            let [ parameter1, parameter2 ] = await getParameterValues(parameters, scope);
                            switch (parameter1.type) {
                                case NodeType.STRING:
                                    parameter2 = builtInToString(parameter2);
                                    return newNode(NodeType.STRING, parameter1.value1 + parameter2.value1);
                                case NodeType.NUMBER:
                                    parameter2 = builtInToNumber(parameter2);
                                    return newNode(NodeType.NUMBER, parameter1.value1 + parameter2.value1);
                                case NodeType.LIST:
                                    if (parameter2.type != NodeType.LIST) {
                                        console.error(`Cannot add ${NodeTypeString[parameter2.type]} to List.`);
                                        break;
                                    }
                                    return newNode(NodeType.LIST, parameter1.value1.concat(parameter2.value1));
                                default:
                                    console.error(`'Unknown type ${NodeTypeString[parameter1.type]} in 'add'.`);
                                    return;
                            }
                            
                        }
                    },
                    {
                        identifier: 'add-to',
                        run: async (parameters) => {
                            if (parameters.length != 2) {
                                console.error(`'add-to' expects 2 parameter but received ${parameters.length}.`);
                                return;
                            }
                            if (parameters[0].type != NodeType.IDENTIFIER) {
                                console.error(`'add-to' expects the 1st value to be an identifeer but received ${NodeTypeString[parameters[0].type]}.`);
                            }
                            const parameter2 = await getParameterValue(parameters[1], scope);
                            
                            const variable = getVariable(parameters[0].value1, scope);
                            if (variable) {
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
                                            console.error(`Cannot add ${NodeTypeString[parameter2.type]} to List.`);
                                            break;
                                        }
                                    return value.value1 = value.value1.concat(parameter2.value1);
                                    default:
                                        console.error(`Unknown type ${NodeTypeString[value.type]} in 'add-to'`)
                                        break;
                                }
                            }
                        }
                    },
                    {
                        identifier: 'not',
                        run: async (parameters) => {
                            if (parameters.length != 1) {
                                console.error(`'not' expects 1 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const parameter = await getParameterValue(parameters[0], scope);
                            if (parameter.type == NodeType.BOOLEAN) {
                                return newNode(NodeType.BOOLEAN, !parameter.value1);
                            } else {
                                console.error(`'not' expects a boolean`);
                            }
                        }
                    },
                    {
                        identifier: 'subtract',
                        run: async (parameters) => {
                            if (parameters.length != 2) {
                                console.error(`'subtract' expects 2 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const [ parameter1, parameter2 ] = await getParameterValues(parameters, scope);
                            if (parameter1.type != NodeType.NUMBER || parameter2.type != NodeType.NUMBER) {
                                console.error(`'subtract' requires both values to be a number.`);
                                return;
                            }
                            return newNode(NodeType.NUMBER, parameter1.value1 - parameter2.value1);
                        }
                    },
                    {
                        identifier: 'multiply',
                        run: async (parameters) => {
                            if (parameters.length != 2) {
                                console.error(`'multiply' expects 2 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const [ parameter1, parameter2 ] = await getParameterValues(parameters, scope);
                            if (parameter1.type != NodeType.NUMBER || parameter2.type != NodeType.NUMBER) {
                                console.error(`'multiply' requires both values to be a number.`);
                                return;
                            }
                            return newNode(NodeType.NUMBER, parameter1.value1 * parameter2.value1);
                        }
                    },
                    {
                        identifier: 'divide',
                        run: async (parameters) => {
                            if (parameters.length != 2) {
                                console.error(`'divide' expects 2 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const [ parameter1, parameter2 ] = await getParameterValues(parameters, scope);
                            if (parameter1.type != NodeType.NUMBER || parameter2.type != NodeType.NUMBER) {
                                console.error(`'divide' requires both values to be a number.`);
                                return;
                            }
                            return newNode(NodeType.NUMBER, parameter1.value1 / parameter2.value1);
                        }
                    },
                    {
                        identifier: 'remainder',
                        run: async (parameters) => {
                            if (parameters.length != 2) {
                                console.error(`'remainder' expects 2 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const [ parameter1, parameter2 ] = await getParameterValues(parameters, scope);
                            if (parameter1.type != NodeType.NUMBER || parameter2.type != NodeType.NUMBER) {
                                console.error(`'remainder' requires both values to be a number.`);
                                return;
                            }
                            return newNode(NodeType.NUMBER, parameter1.value1 % parameter2.value1);
                        }
                    },
                    {
                        identifier: 'if',
                        run: async (parameters) => {
                            if (parameters.length != 2) {
                                console.error(`'if' expects 2 parameters but received ${parameters.length}.`);
                                return;
                            }
                            const parameter1 = await getParameterValue(parameters[0], scope);
                            if (parameter1.type != NodeType.BOOLEAN) {
                                console.error(`The first value of 'if' should be a boolean.`);
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
                                                console.error(`The second value of 'if' should be type function.`);
                                            }
                                        }
                                    } else {
                                        const parameterValue = await getParameterValue(parameterToRun, scope);
                                        if (parameterValue.type == NodeType.FUNCTION) {
                                            return parameterValue.value1;
                                        } else {
                                            console.error(`The second value of 'if' should be type function.`);
                                        }
                                    }
                                })();
    
                                await runFunction(newFunction(functionToRun.statementNodes, newScope(scope)));
                            }
                        }
                    },
                    {
                        identifier: 'if-else',
                        run: async (parameters) => {
                            if (parameters.length != 3) {
                                console.error(`'if-else' expects 3 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const parameter1 = await getParameterValue(parameters[0], scope);
                            if (parameter1.type != NodeType.BOOLEAN) {
                                console.error(`The first value of 'if-else' should be a boolean.`);
                                return;
                            }
                            /** @type {MyFunction} */
                            const functionToRun = await (async () => {
                                const parameterToRun = (parameter1.value1) ? parameters[1] : parameters[2];
                                if (parameterToRun.type == NodeType.FUNCTION_CALL) {
                                    if (parameterToRun.value1 === 'function') {
                                        return builtInFunctionFunction(parameterToRun);
                                    } else {
                                        const parameterValue = await getParameterValue(parameterToRun, scope);
                                        if (parameterValue.type == NodeType.FUNCTION) {
                                            return parameterValue.value1;
                                        } else {
                                            console.error(`The second and third value of 'if-else' should be type function.`);
                                        }
                                    }
                                } else {
                                    const parameterValue = await getParameterValue(parameterToRun, scope);
                                    if (parameterValue.type == NodeType.FUNCTION) {
                                        return parameterValue.value1;
                                    } else {
                                        console.error(`The second and third value of 'if-else' should be type function.`);
                                    }
                                }
                            })();

                            await runFunction(newFunction(functionToRun.statementNodes, newScope(scope)));
                        }
                    },
                    {
                        identifier: 'while',
                        run: async (parameters) => {
                            if (parameters.length != 2) {
                                console.error(`'while' expects 2 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const parameter1 = parameters[0];
                            const parameter2 = parameters[1];
                            if (parameter1.type != NodeType.FUNCTION_CALL || parameter2.type != NodeType.FUNCTION_CALL || parameter1.value1 !== 'function' || parameter2.value1 !== 'function') {
                                //TODO: Should accept any function
                                console.error(`Both values of 'while' should be the function call to 'function'.`);
                            }
                            let i = 0
                            do {
                                if (i == loopMax) {
                                    break;
                                }
                                const booleanFunctionResult = await runFunction(newFunction(parameter1.value2, scope));
                                if (!booleanFunctionResult.value1) {
                                    break;
                                }
                                await runFunction(newFunction(parameter2.value2, scope));
                                i++;
                            } while (true)
                            if (i == loopMax) {
                                console.error(`Loop cannot run more than ${loopMax} times.`);
                            }
                        }
                    },
                    {
                        identifier: 'list',
                        run: async (parameters) => {
                            const parameterValues = await getParameterValues(parameters, scope);
                            return newNode(NodeType.LIST, parameterValues);
                        }
                    },
                    {
                        identifier: 'length',
                        run: async (parameters) => {
                            if (parameters.length != 1) {
                                console.error(`'length' expects 1 parameter but was given ${parameters.length}.`);
                                return;
                            }
                            const parameter = await getParameterValue(parameters[0], scope);
                            switch (parameter.type) {
                                case NodeType.LIST:
                                case NodeType.STRING:
                                case NodeType.TOKEN:
                                    return newNode(NodeType.NUMBER, parameter.value1.length);
                                default:
                                    console.error(`'length' expects a string or a list, but was given a ${NodeTypeString[parameter.value1.type]}.`)
                            }
                        }
                    },
                    {
                        identifier: 'for-each',
                        run: async (parameters) => {
                            if (parameters.length != 2) {
                                console.error(`'for-each' expects 2 parameters but received ${parameters.length}.`);
                                return;
                            }
                            const [ parameter1, parameter2 ] = await getParameterValues(parameters, scope);
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
                                    console.error(`'for-each' expects an iterable as the 1st parameter (string or list) but received ${NodeTypeString[parameter1.type]}.`)
                                    return;
                            }
                            if (parameter2.type != NodeType.FUNCTION) {
                                console.error(`'for-each' expects a function as the 2nd parameter but received ${NodeTypeString[parameter2.type]}.`);
                                return;
                            }
                            for (let i = 0; i < iterable.length; i++) {
                                const element = iterable[i];
                                const myFunction = newFunction(parameter2.value1.statementNodes, scope);
                                await runFunction(myFunction, [element]);
                            }
                        }
                    },
                    {
                        identifier: 'enum-for-each',
                        run: async (parameters) => {
                            if (parameters.length != 2) {
                                console.error(`'enum-for-each' expects 2 parameters but received ${parameters.length}.`);
                                return;
                            }
                            const [ parameter1, parameter2 ] = await getParameterValues(parameters, scope);
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
                                    console.error(`'enum-for-each' expects an iterable as the 1st parameter (string or list) but received ${NodeTypeString[parameter1.type]}.`)
                                    return;
                            }
                            if (parameter2.type != NodeType.FUNCTION) {
                                console.error(`'enum-for-each' expects a function as the 2nd parameter but received ${NodeTypeString[parameter2.type]}.`);
                                return;
                            }
                            for (let i = 0; i < iterable.length; i++) {
                                const element = iterable[i];
                                const myFunction = newFunction(parameter2.value1.statementNodes, scope);
                                await runFunction(myFunction, [element, newNode(NodeType.NUMBER, i)]);
                            }
                        }
                    },
                    {
                        identifier: 'push',
                        run: async (parameters) => {
                            if (parameters.length != 2) {
                                console.error(`'push' expects 2 parameters but was given ${parameters.length}.`);
                                return;
                            }
                            const [ list, newItem ] = await getParameterValues(parameters, scope);
                            if (list.type != NodeType.LIST) {
                                console.error(`'push' expects the 1st parameter to be a list but was given ${NodeTypeString[list.type]}.`);
                                return;
                            }
                            list.value1.push(newItem);
                        }
                    },
                    {
                        identifier: 'pop',
                        run: async (parameters) => {
                            if (parameters.length != 1) {
                                console.error(`'pop' expects 1 parameter but was given ${parameters.length}.`);
                                return;
                            }
                            const list = await getParameterValue(parameters[0], scope);
                            return list.value1.pop();
                        }
                    },
                    {
                        identifier: 'value-at',
                        run: async (parameters) => {
                            if (parameters.length != 2) {
                                console.error(`'value-at' expects 2 parameter but was given ${parameters.length}.`);
                                return;
                            }
                            const [ listLike, index ] = await getParameterValues(parameters, scope);
                            if (index.type != NodeType.NUMBER || !Number.isInteger(index.value1)) {
                                console.error(`index in 'value-at' must be an integer.`);
                                return;
                            }
                            switch (listLike.type) {
                                case NodeType.LIST:
                                case NodeType.STRING:
                                    if (index.value1 >= listLike.value1.length) {
                                        console.error(`index out of bounds exception in 'value-at'.`);
                                        return;
                                    }
                                    return listLike.value1[index.value1];
                                default:
                                    console.error(`Unexpected paramater ${NodeTypeString[listLike.type]} in 'value-at'.`)
                                    break;
                            }
                        }
                    },
                    {
                        identifier: 'slice',
                        run: async (parameters) => {
                            if (parameters.length > 3 || parameters.length < 2) {
                                console.error(`'slice' expects 2 or 3 parameters but received ${parameters.length}.`);
                            }
                            const [listLike, index1, index2] = await getParameterValues(parameters, scope);
                            switch (listLike.type) {
                                case NodeType.STRING:
                                case NodeType.LITERAL:
                                case NodeType.LIST:
                                    if (index1.type != NodeType.NUMBER) {
                                        console.error(`The second value of 'slice' should be Number but received ${NodeTypeString[index1.type]}.`);
                                        return;
                                    }
                                    if (index2) {
                                        if (index2.type != NodeType.NUMBER) {
                                            console.error(`The second value of 'slice' should be Number but received ${NodeTypeString[index2.type]}.`);
                                            return;
                                        }
                                        return newNode(listLike.type, listLike.value1.slice(index1.value1, index2.value1));
                                    }
                                    return newNode(listLike.type, listLike.value1.slice(index1.value1));
                                default:
                                    break;
                            }
                        }
                    },
                    {
                        identifier: 'round',
                        run: async (parameters) => {
                            if (parameters.length != 1) {
                                console.error(`'round' expects 1 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const number = builtInToNumber(await getParameterValue(parameters[0], scope));
                            return newNode(NodeType.NUMBER, Math.round(number.value1));
                        }
                    },
                    {
                        identifier: 'floor',
                        run: async (parameters) => {
                            if (parameters.length != 1) {
                                console.error(`'floor' expects 1 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const number = builtInToNumber(await getParameterValue(parameters[0], scope));
                            return newNode(NodeType.NUMBER, Math.floor(number.value1));
                        }
                    },
                    {
                        identifier: 'ceil',
                        run: async (parameters) => {
                            if (parameters.length != 1) {
                                console.error(`'ceil' expects 1 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const number = builtInToNumber(await getParameterValue(parameters[0], scope));
                            return newNode(NodeType.NUMBER, Math.ceil(number.value1));
                        }
                    },
                    {
                        identifier: 'trunc',
                        run: async (parameters) => {
                            if (parameters.length != 1) {
                                console.error(`'trunc' expects 1 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const number = builtInToNumber(await getParameterValue(parameters[0], scope));
                            return newNode(NodeType.NUMBER, Math.trunc(number.value1));
                        }
                    },
                    {
                        identifier: 'rand-int',
                        run: async (parameters) => {
                            if (parameters.length > 2 || parameters.length < 1) {
                                console.error(`'rand-int' expects 1 or 2 parameters but received ${parameters.length}.`);
                                return;
                            }
                            const [ first, second ] = await getParameterValues(parameters, scope);
                            if (first.type != NodeType.NUMBER) {
                                console.error(`'rand-int' expects numbers but received ${NodeTypeString[first.type]}.`);
                                return;
                            }
                            if (!Number.isInteger(first.value1)) {
                                console.error(`'rand-int' expects integers but received a double.`);
                                return;
                            }
                            const firstValue = first.value1;
                            let value;
                            if (second) {
                                if (second.type != NodeType.NUMBER) {
                                    console.error(`'rand-int' expects numbers but received ${NodeTypeString[second.type]}.`);
                                    return;
                                }
                                if (!Number.isInteger(first.value2)) {
                                    console.error(`'rand-int' expects integers but received a double.`);
                                    return;
                                }
                                const secondValue = second.value1;
                                if (secondValue <= firstValue) {
                                    console.error(`The second value in 'rand-int' must be smaller that the first.`);
                                    return;
                                }
                                value = getRandomInt(secondValue - firstValue) + firstValue;
                            } else {
                                value = getRandomInt(firstValue);
                            }
                            return newNode(NodeType.NUMBER, value);
                        }
                    },
                    {
                        identifier: 'rand-double',
                        run: async (parameters) => {
                            if (parameters.length > 2 || parameters.length < 1) {
                                console.error(`'rand-double' expects 1 or 2 parameters but received ${parameters.length}.`);
                                return;
                            }
                            const [ first, second ] = await getParameterValues(parameters, scope);
                            if (first.type != NodeType.NUMBER) {
                                console.error(`'rand-double' expects numbers but received ${NodeTypeString[first.type]}.`);
                                return;
                            }
                            if (!Number.isInteger(first.value1)) {
                                console.error(`'rand-double' expects integers but received a double.`);
                                return;
                            }
                            const firstValue = first.value1;
                            let value;
                            if (second) {
                                if (second.type != NodeType.NUMBER) {
                                    console.error(`'rand-double' expects numbers but received ${NodeTypeString[second.type]}.`);
                                    return;
                                }
                                if (!Number.isInteger(first.value2)) {
                                    console.error(`'rand-double' expects integers but received a double.`);
                                    return;
                                }
                                const secondValue = second.value1;
                                if (secondValue <= firstValue) {
                                    console.error(`The second value in 'rand-double' must be smaller that the first.`);
                                    return;
                                }
                                value = Math.random() * (secondValue - firstValue) + firstValue;
                            } else {
                                value = Math.random() * firstValue;
                            }
                            return newNode(NodeType.NUMBER, value);
                        }
                    },
                    {
                        identifier: 'type-of',
                        run: async (parameters) => {
                            if (parameters.length > 1) {
                                console.error(`'type-of' expects 1 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const value = await getParameterValue(parameters[0], scope);
                            return newNode(NodeType.TYPE, value.type);
                        }
                    }
                ])
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
                    console.error(`Attempting to call unknown function '${functionNode.value1}.`);
                }
            }
            /**
             * 
             * @param {MyNode} parameter
             * @param {Scope} scope
             * @returns {Promise.<MyNode>}
             */
            async function getParameterValue(parameter, scope) {
                console.log('parameter:');
                console.log(parameter);
                switch (parameter.type) {
                            case NodeType.FUNCTION_CALL:
                                if (parameter.value1 === 'function') {
                                    return newNode(NodeType.FUNCTION, builtInFunctionFunction(parameter));
                                } else {
                                    const functionResult = await callFunction(parameter, scope);
                                    return functionResult
                                }
                            case NodeType.IDENTIFIER:
                                const variable = getVariable(parameter.value1, scope);
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
                                console.error(`Error: Unknown parameter ${parameter.value1}.`);
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
                        console.error(`Return was given ${statementNode.value2.length} values but expects 0 or 1.`);
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
                console.error(`Cannot find main function.`);
            }
            return;
        }

        await runFunction(newFunction(globalNodes, newScope()), [], true);
    })();
});