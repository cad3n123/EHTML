// Global Constants
const [ $form ] = [ 'form' ].map(selector => document.querySelector(selector));
const [ $textBoxes, $textEditor, $console ] = [ 'text-boxes', 'text-editor', 'console' ].map(id => document.getElementById(id));

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
    FUNCTION: 8
};
const NodeTypeString = ['Null', 'Token', 'Literal', 'Identifier', 'Function Call', 'String', 'Number', 'Boolean', 'Function'];
/**
 * @typedef {Object} MyFunction
 * @property {Array.<MyNode>} statementNodes
 * @property {Scope} scope
 */
/**
 * @typedef {Token|MyFunction|string|number|boolean} NodeValue1
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
                    console.error(`Expected '>' at the end of the element. Got '${consume()}' instead.`)
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
                 * @returns {Promise.<MyNode>}
                 */
                async function builtInToString(parameter) {
                    const parameterValue = await getParameterValue(parameter, scope);
                    if (parameterValue.type == NodeType.STRING) {
                        return parameterValue;
                    }
                    let newValue = '';
                    if (parameterValue.type == NodeType.LITERAL) {
                        newValue = parameterValue.value1;
                    } else if (parameterValue.type == NodeType.NUMBER || parameterValue.type == NodeType.BOOLEAN) {
                        /** @type {number|boolean} */
                        const value = parameterValue.value1;
                        newValue = value.toString();
                    } else {
                        console.error(`Cannot convert ${NodeTypeString[parameterValue.type]} to string.`);
                        return;
                    }

                    return newNode(NodeType.STRING, newValue);
                }
                /**
                 * 
                 * @param {MyNode} parameters 
                 * @returns {Promise.<MyNode>}
                 */
                async function builtInToNumber(parameters) {
                    const parameterValue = await getParameterValue(parameters, scope);
                    if (parameterValue.type == NodeType.NUMBER) {
                        return parameterValue;
                    }
                    let newValue;
                    if (parameterValue.type == NodeType.LITERAL || parameterValue.type == NodeType.STRING || parameterValue.type == NodeType.BOOLEAN) {
                        /** @type {string|boolean} */
                        const value = parameterValue.value1;
                        newValue = Number(value);
                    } else {
                        console.error(`Cannot convert ${NodeTypeString[parameterValue.type]} to number.`);
                        return;
                    }

                    return newNode(NodeType.NUMBER, newValue);
                }
                /**
                 * 
                 * @param {MyNode} parameter
                 * @returns {Promise.<MyNode>} 
                 */
                async function builtInToBoolean(parameter) {
                    const parameterValue = await getParameterValues(parameter, scope);
                    if (parameterValue.type == NodeType.BOOLEAN) {
                        return parameterValue;
                    }
                    let newValue;
                    if (parameterValue.type == NodeType.NUMBER) {
                        /** @type {number} */
                        const value = parameterValue.value1;
                        newValue = Boolean(value);
                    } else if (parameterValue.type == NodeType.STRING || parameterValue.type == NodeType.LITERAL) {
                        newValue = parameterValue.value1 === 'true';
                    } else {
                        console.error(`Cannot convert ${NodeTypeString[parameterValue.type]} to boolean.`);
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
                                    setVariable(identifier, returnValue)
                                    return;
                                }
                                console.error(`Cannot set identifier '${identifier}' to nothing.`);
                                return;
                            }
                            if (value.type == NodeType.IDENTIFIER) {
                                const otherVariable = getVariable(value);
                                setVariable(identifier, otherVariable.type, otherVariable.value);
                                return;
                            }
                            if (value.type == NodeType.LITERAL || value.type == NodeType.STRING || value.type == NodeType.NUMBER || value.type == NodeType.BOOLEAN || value.type == NodeType.FUNCTION) {
                                setVariable(identifier, value);
                                return;
                            }
                            console.error(`Error assigning value to '${identifier}'.`);
                        }
                    },
                    {
                        identifier: 'print',
                        run: async (parameters) => {
                            if (parameters.length != 1) {
                                console.error(`'print' expects 1 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const parameter = await builtInToString(await getParameterValue(parameters[0], scope));
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
                        run: (parameters) => {
                            if (params.length != parameters.length) {
                                console.error(`Expected ${parameters.length} parameters but was given ${params.length}.`);
                                return;
                            }
                            parameters.forEach((parameter, i) => {
                                setVariable(
                                parameter.value1,
                                getParameterValue(params[i])
                            )});
                        }
                    },
                    {
                        identifier: 'string',
                        run: async (parameters) => {
                            if (parameters.length != 1) {
                                console.error(`'string' expects 1 parameter but was given ${parameters.length}.`);
                            }
                            return await builtInToString(parameters[0]);
                        }
                    },
                    {
                        identifier: 'number',
                        run: async (parameters) => {
                            if (parameters.length != 1) {
                                console.error(`'number' expects 1 parameter but was given ${parameters.length}.`);
                            }
                            return await builtInToNumber(parameters[0]);
                        }
                    },
                    {
                        identifier: 'boolean',
                        run: async (parameters) => {
                            if (parameters.length != 1) {
                                console.error(`'boolean' expects 1 parameter but was given ${parameters.length}.`);
                            }
                            return await builtInToBoolean(parameters[0]);
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
                            let result;
                            if (parameter1.type == NodeType.STRING || parameter1.type == NodeType.LITERAL) {
                                const parameter2 = await builtInToString(parameterValues[1]);
                                result = parameter1.value1 === parameter2.value1;
                            } else if (parameter1.type == NodeType.NUMBER) {
                                const parameter2 = await builtInToNumber(parameterValues[1]);
                                result = parameter1.value1 == parameter2.value1;
                            } else if (parameter1.type == NodeType.BOOLEAN) {
                                const parameter2 = await builtInToBoolean(parameterValues[1]);
                                result = parameter1.value1 == parameter2.value1;
                            } else {
                                console.error(`Cannot compare ${NodeTypeString[parameter1.type]}.`);
                                return;
                            }
                            return newNode(NodeType.BOOLEAN, result);
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
                                parameter2 = await builtInToString(parameterValues[1]);
                            } else if (parameter1.type == NodeType.NUMBER) {
                                parameter2 = await builtInToNumber(parameterValues[1]);
                            } else if (parameter1.type == NodeType.BOOLEAN) {
                                parameter2 = await builtInToBoolean(parameterValues[1]);
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
                                parameter2 = await builtInToString(parameterValues[1]);
                            } else if (parameter1.type == NodeType.NUMBER) {
                                parameter2 = await builtInToNumber(parameterValues[1]);
                            } else if (parameter1.type == NodeType.BOOLEAN) {
                                parameter2 = await builtInToBoolean(parameterValues[1]);
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
                            const [ parameter1, parameter2 ] = await getParameterValues(parameters, scope);
                            if (parameter1.type != NodeType.NUMBER || parameter2.type != NodeType.NUMBER) {
                                console.error(`'add' requires both values to be a number.`);
                                return;
                            }
                            return newNode(NodeType.NUMBER, parameter1.value1 + parameter2.value1);
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
                            if (parameters.length != 3) {
                                console.error(`'if' expects 3 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const parameter1 = await getParameterValue(parameters[0], scope);
                            if (parameter1.type != NodeType.BOOLEAN) {
                                console.error(`The first value of 'if' should be a boolean.`);
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
                                            console.error(`The second and third value of 'if' should be type function.`);
                                        }
                                    }
                                } else {
                                    const parameterValue = await getParameterValue(parameterToRun, scope);
                                    if (parameterValue.type == NodeType.FUNCTION) {
                                        return parameterValue.value1;
                                    } else {
                                        console.error(`The second and third value of 'if' should be type function.`);
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
                                console.error(`Both values of 'while' should be the function call to 'function'.`);
                            }
                            let loopMax = 10000;
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
                switch (parameter.type) {
                            case NodeType.FUNCTION_CALL:
                                const functionResult = await callFunction(parameter, scope);
                                return functionResult
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