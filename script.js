// Global Constants
const [ $form ] = [ 'form' ].map(selector => document.querySelector(selector));
const [ $textBoxes ] = [ 'text-boxes' ].map(id => document.getElementById(id));
const [ $textEditor, $console ] = [ 'textarea', 'p' ].map(selector => $textBoxes.querySelector(selector));

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
    BOOLEAN: 7
};
const NodeTypeString = ['Null', 'Token', 'Literal', 'Identifier', 'Function Call', 'String', 'Number', 'Boolean'];
/**
 * @typedef {Token|string|number|boolean} NodeValue1
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

// Functions

// Event Listeners
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
    (() => {
        $console.innerHTML = '';
        let anonymousFunctionCount = 0;
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
         * @typedef {Object} MyFunction
         * @property {string} identifier
         * @property {Array.<MyNode>} statementNodes
         * @property {Array.<Variable} localVariables
         * @property {Array.<MyFunction} localFunctions
         */
        /**
         * 
         * @param {string} identifier 
         * @param {Array.<MyNode>} statementNodes 
         * @param {Array.<Variable>} localVariables 
         * @param {Array.<MyFunction} localFunctions 
         * @returns {MyFunction}
         */
        function newFunction(identifier, statementNodes, localVariables, localFunctions) {
            return {
                identifier: identifier,
                statementNodes: statementNodes,
                localVariables: localVariables,
                localFunctions: localFunctions
            }
        }
        /**
         * @typedef {Object} RunFunctionReturnValue
         * @property {Array.<Variable>} updatedLocalVariables
         * @property {Array.<Function>} updatedLocalFunctions
         * @property {MyNode|null} returnValue
         */
        /**
         * 
         * @param {MyFunction} thisFunction
         * @param {Array.<MyNode>} [params=[]] 
         * @param {boolean} [isGlobal=false]
         * @returns {RunFunctionReturnValue}
         */
        function runFunction(thisFunction, params, isGlobal) {
            if (!isGlobal) {
                isGlobal = false;
            }
            if (!params) {
                params = [];
            }
            const statementNodes = thisFunction.statementNodes;
            let localVariables = thisFunction.localVariables;
            let localFunctions = thisFunction.localFunctions;
            let variables = /** @type {Array.<Variable} */([]);
            let functions = /** @type {Array.<MyFunction} */([]);
            /**
             * 
             * @param {MyNode} [value=null] 
             * @returns {RunFunctionReturnValue}
             */
            function newRunFunctionReturnValue(value) {
                if (!value) {
                    value = null;
                }
                return {
                    updatedLocalVariables: localVariables,
                    updatedLocalFunctions: localFunctions,
                    returnValue: value
                }
            }
            /**
             * 
             * @param {RunFunctionReturnValue} returnValue 
             */
            function updateAfterRunningFunction(returnValue) {
                if (returnValue) {
                    const updatedVariables = returnValue.updatedLocalVariables;
                    const updatedFunctions = returnValue.updatedLocalFunctions;
                    variables = updatedVariables.slice(0, variables.length);
                    localFunctions = updatedVariables.slice(variables.length);
                    functions = updatedFunctions.slice(0, functions.length);
                    localFunctions = updatedFunctions.slice(functions.length);
                }
            }
            /**
             * @callback BuiltInFunctionRun
             * @param {Array.<MyNode>} parameters
             * @returns {MyNode|null}
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
                    const parameterValue = getParameterValues([parameter])[0];
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
                 * @returns {MyNode}
                 */
                function builtInToNumber(parameters) {
                    const parameterValue = getParameterValues([parameters])[0];
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
                 * @returns {MyNode} 
                 */
                function builtInToBoolean(parameter) {
                    const parameterValue = getParameterValues([parameter])[0];
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
                        run: (parameters) => {
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
                                    setFunction(identifier, value.value2);
                                    return;
                                }
                                const returnValue = callFunction(value);
                                if (returnValue != null) {
                                    setVariable(identifier, returnValue)
                                    return;
                                }
                                console.error(`Cannot set identifier '${identifier}' to nothing.`);
                                return;
                            }
                            if (value.type == NodeType.IDENTIFIER) {
                                setVariable(identifier, getVariable(value));
                                return;
                            }
                            if (value.type == NodeType.LITERAL || value.type == NodeType.STRING || value.type == NodeType.NUMBER || value.type == NodeType.BOOLEAN) {
                                setVariable(identifier, value);
                                return;
                            }
                            console.error(`Error assigning value to '${identifier}'.`);
                        }
                    },
                    {
                        identifier: 'print',
                        run: (parameters) => {
                            if (parameters.length != 1) {
                                console.error(`'print' expects 1 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const parameter = builtInToString(getParameterValues(parameters)[0]);
                            if (parameter.type == NodeType.STRING) {
                                $console.innerHTML += parameter.value1 + '<br>';
                                return;
                            }
                            console.error(`'print' expects a string but was given a ${NodeTypeString[parameter.type]}.`)
                        }
                    },
                    {
                        identifier: 'params',
                        run: (parameters) => {
                            if (params.length != parameters.length) {
                                console.error(`Expected ${parameters.length} parameters but was given ${params.length}.`);
                                return;
                            }
                            parameters.forEach((parameter, i) => setVariable(parameter.value1, params[i]));
                        }
                    },
                    {
                        identifier: 'string',
                        run: (parameters) => {
                            if (parameters.length != 1) {
                                console.error(`'string' expects 1 parameter but was given ${parameters.length}.`);
                            }
                            return builtInToString(parameters[0]);
                        }
                    },
                    {
                        identifier: 'number',
                        run: (parameters) => {
                            if (parameters.length != 1) {
                                console.error(`'number' expects 1 parameter but was given ${parameters.length}.`);
                            }
                            return builtInToNumber(parameters[0]);
                        }
                    },
                    {
                        identifier: 'boolean',
                        run: (parameters) => {
                            if (parameters.length != 1) {
                                console.error(`'boolean' expects 1 parameter but was given ${parameters.length}.`);
                            }
                            return builtInToBoolean(parameters[0]);
                        }
                    },
                    {
                        identifier: 'equal',
                        run: (parameters) => {
                            if (parameters.length != 2) {
                                console.error(`'equal' expects 2 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const parameterValues = getParameterValues(parameters);
                            const parameter1 = parameterValues[0];
                            let result;
                            if (parameter1.type == NodeType.STRING || parameter1.type == NodeType.LITERAL) {
                                const parameter2 = builtInToString(parameterValues[1]);
                                result = parameter1.value1 === parameter2.value1;
                            } else if (parameter1.type == NodeType.NUMBER) {
                                const parameter2 = builtInToNumber(parameterValues[1]);
                                result = parameter1.value1 == parameter2.value1;
                            } else if (parameter1.type == NodeType.BOOLEAN) {
                                const parameter2 = builtInToBoolean(parameterValues[1]);
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
                        run: (parameters) => {
                            if (parameters.length != 2) {
                                console.error(`'greater' expects 2 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const parameterValues = getParameterValues(parameters);
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
                        run: (parameters) => {
                            if (parameters.length != 2) {
                                console.error(`'less' expects 2 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const parameterValues = getParameterValues(parameters);
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
                        run: (parameters) => {
                            if (parameters.length != 2) {
                                console.error(`'and' expects 2 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const [ parameter1, parameter2 ] = getParameterValues(parameters);
                            if (parameter1.type != NodeType.BOOLEAN || parameter2.type != NodeType.BOOLEAN) {
                                console.error(`'and' requires both values to be a boolean.`);
                                return;
                            }
                            return newNode(NodeType.BOOLEAN, parameter1.value1 && parameter2.value1);
                        }
                    },
                    {
                        identifier: 'or',
                        run: (parameters) => {
                            if (parameters.length != 2) {
                                console.error(`'or' expects 2 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const [ parameter1, parameter2 ] = getParameterValues(parameters);
                            if (parameter1.type != NodeType.BOOLEAN || parameter2.type != NodeType.BOOLEAN) {
                                console.error(`'or' requires both values to be a boolean.`);
                                return;
                            }
                            return newNode(NodeType.BOOLEAN, parameter1.value1 || parameter2.value1);
                        }
                    },
                    {
                        identifier: 'add',
                        run: (parameters) => {
                            if (parameters.length != 2) {
                                console.error(`'add' expects 2 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const [ parameter1, parameter2 ] = getParameterValues(parameters);
                            if (parameter1.type != NodeType.NUMBER || parameter2.type != NodeType.NUMBER) {
                                console.error(`'add' requires both values to be a number.`);
                                return;
                            }
                            return newNode(NodeType.NUMBER, parameter1.value1 + parameter2.value1);
                        }
                    },
                    {
                        identifier: 'subtract',
                        run: (parameters) => {
                            if (parameters.length != 2) {
                                console.error(`'subtract' expects 2 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const [ parameter1, parameter2 ] = getParameterValues(parameters);
                            if (parameter1.type != NodeType.NUMBER || parameter2.type != NodeType.NUMBER) {
                                console.error(`'subtract' requires both values to be a number.`);
                                return;
                            }
                            return newNode(NodeType.NUMBER, parameter1.value1 - parameter2.value1);
                        }
                    },
                    {
                        identifier: 'multiply',
                        run: (parameters) => {
                            if (parameters.length != 2) {
                                console.error(`'multiply' expects 2 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const [ parameter1, parameter2 ] = getParameterValues(parameters);
                            if (parameter1.type != NodeType.NUMBER || parameter2.type != NodeType.NUMBER) {
                                console.error(`'multiply' requires both values to be a number.`);
                                return;
                            }
                            return newNode(NodeType.NUMBER, parameter1.value1 * parameter2.value1);
                        }
                    },
                    {
                        identifier: 'remainder',
                        run: (parameters) => {
                            if (parameters.length != 2) {
                                console.error(`'remainder' expects 2 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const [ parameter1, parameter2 ] = getParameterValues(parameters);
                            if (parameter1.type != NodeType.NUMBER || parameter2.type != NodeType.NUMBER) {
                                console.error(`'remainder' requires both values to be a number.`);
                                return;
                            }
                            return newNode(NodeType.NUMBER, parameter1.value1 % parameter2.value1);
                        }
                    },
                    {
                        identifier: 'if',
                        run: (parameters) => {
                            if (parameters.length != 3) {
                                console.error(`'if' expects 3 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const parameter1 = getParameterValues([parameters[0]])[0];
                            if (parameter1.type != NodeType.BOOLEAN) {
                                console.error(`The first value of 'if' should be a boolean.`);
                                return;
                            }
                            if (parameters[1].type != NodeType.FUNCTION_CALL || parameters[2].type != NodeType.FUNCTION_CALL || parameters[1].value1 !== 'function' || parameters[2].value1 !== 'function') {
                                console.error(`The second and third value of 'if' should be the function call to 'function'.`);
                            }
                            /** @type {Array.<MyNode>} */
                            let functionToRun = (parameter1.value1) ? parameters[1].value2 : parameters[2].value2;

                            const result = runFunction(newFunction(anonymousFunctionCount.toString(), functionToRun, variables.concat(localVariables)), functions.concat(localFunctions));
                            anonymousFunctionCount++;
                            updateAfterRunningFunction(result);
                            
                        }
                    },
                    {
                        identifier: 'while',
                        run: (parameters) => {
                            if (parameters.length != 2) {
                                console.error(`'while' expects 2 parameter but received ${parameters.length}.`);
                                return;
                            }
                            const parameter1 = parameters[0];
                            const parameter2 = parameters[1];
                            if (parameter1.type != NodeType.FUNCTION_CALL || parameter2.type != NodeType.FUNCTION_CALL || parameter1.value1 !== 'function' || parameter2.value1 !== 'function') {
                                console.error(`Both values of 'while' should be the function call to 'function'.`);
                            }
                            let innerVariables = variables.concat(thisFunction.localVariables);
                            let innerFunctions = functions.concat(thisFunction.localFunctions);
                            let loopMax = 10000;
                            let i = 0
                            do {
                                if (i == loopMax) {
                                    break;
                                }
                                let result = runFunction(newFunction(anonymousFunctionCount.toString(), parameter1.value2, innerVariables, innerFunctions));
                                updateAfterRunningFunction(result);

                                const booleanFunctionResult = result.returnValue;
                                anonymousFunctionCount++;
                                if (!booleanFunctionResult.value1) {
                                    break;
                                }
                                result = runFunction(newFunction(anonymousFunctionCount.toString(), parameter2.value2, innerVariables, innerFunctions));
                                console.log(result);
                                updateAfterRunningFunction(result);
                                anonymousFunctionCount++;
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
             * @returns {MyNode|null}
             */
            function callFunction(functionNode) {
                let builtInFunction = builtInFunctions.find(builtInFunction => builtInFunction.identifier === functionNode.value1);
                if (builtInFunction != undefined) {
                    return builtInFunction.run(functionNode.value2);
                }
                let thisFunction = functions.find(myFunction => myFunction.identifier === functionNode.value1);
                if (thisFunction != undefined) {
                    let returnValue = runFunction(thisFunction, getParameterValues(functionNode.value2));
                    updateAfterRunningFunction(returnValue);
                    return returnValue.returnValue;
                }
                let localFunction = localFunctions.find(myFunction => myFunction.identifier === functionNode.value1);
                if (localFunction != undefined) {
                    let returnValue = runFunction(localFunction, getParameterValues(functionNode.value2));
                    updateAfterRunningFunction(returnValue);
                    return returnValue.returnValue;
                }
                console.error(`Attempting to call unknown function '${functionNode.value1}.`);
            }
            /**
             * 
             * @param {MyNode} variableNode 
             * @returns {MyNode}
             */
            function getVariable(variableNode) {
                let variable = variables.find(variable => variable.identifier === variableNode.value1);
                if (variable != undefined) {
                    return variable.value;
                }
                let localVariable = localVariables.find(variable => variable.identifier === variableNode.value1);
                if (localVariable != undefined) {
                    return localVariable.value;
                }
                console.error(`Attempint to access unknown variable ${variableNode.value1}.`);
            }
            /**
             * 
             * @param {Array.<MyNode>} parameters 
             * @returns {Array.<MyNode|null>}
             */
            function getParameterValues(parameters) {
                return parameters.map(
                    /**
                     * 
                     * @param {MyNode} parameter 
                     * @returns {MyNode|null}
                     */
                    parameter => {
                    if (parameter.type == NodeType.FUNCTION_CALL) {
                        return callFunction(parameter);
                    } else if (parameter.type == NodeType.IDENTIFIER) {
                        return getVariable(parameter);
                    } else if (parameter.type == NodeType.LITERAL) {
                        return newNode(NodeType.STRING, parameter.value1);
                    } else if (parameter.type == NodeType.STRING || parameter.type == NodeType.NUMBER || parameter.type == NodeType.BOOLEAN) {
                        return parameter;
                    } else {
                        console.error(`Error: Unknown parameter ${parameter.value1}.`);
                    }
                });
            }
            /**
             * 
             * @param {string} identifier 
             * @param {Array.<MyNode>} statementNodes 
             * @param {Array.<Variable>} localVariables 
             * @param {Array.<Function>} localFunctions 
             */
            function setFunction(identifier, statementNodes) {
                functions.push(newFunction(identifier, statementNodes, variables.concat(localVariables)), functions.concat(localFunctions));
            }
            /**
             * 
             * @param {string} identifier 
             * @param {MyNode} value 
             */
            function setVariable(identifier, value) {
                let existingIndex = variables.findIndex(variable => variable.identifier === identifier);
                if (existingIndex == -1) {
                    existingIndex = localVariables.findIndex(variable => variable.identifier === identifier);
                    if (existingIndex == -1) {
                        variables.push(newVariable(identifier, value));
                    } else {
                        const variable = localVariables[existingIndex];
                        variable.value = value;
                        localVariables[existingIndex] = variable;
                    }
                } else {
                    const variable = variables[existingIndex];
                    variable.value = value;
                    variables[existingIndex] = variable;
                }
            }
            for (let i = 0; i < statementNodes.length; i++) {
                const statementNode = statementNodes[i];
                if (statementNode.value1 === 'return') {
                    if (statementNode.value2.length > 1) {
                        console.error(`Return was given ${statementNode.value2.length} values but expects 0 or 1.`);
                        return newRunFunctionReturnValue();
                    }
                    if (statementNode.value2.length == 1) {
                        const returnNode = statementNode.value2[0];
                        if (returnNode.type == NodeType.FUNCTION_CALL) {
                            return newRunFunctionReturnValue(callFunction(returnNode));
                        } else if (returnNode.type == NodeType.IDENTIFIER) {
                            return newRunFunctionReturnValue(getVariable(returnNode));
                        } else if (returnNode.type == NodeType.LITERAL) {
                            return newRunFunctionReturnValue(returnNode);
                        } else {
                            console.error(`Cannot return ${returnNode.type}.`);
                        }
                    }
                } else {
                    callFunction(statementNode);
                }
            }

            if (isGlobal) {
                const mainFunction = functions.find(myFunction => myFunction.identifier === 'main');
                if (mainFunction != undefined) {
                    let returnValue = runFunction(mainFunction);
                    updateAfterRunningFunction(returnValue);
                    return newRunFunctionReturnValue();
                }
                console.error(`Cannot find main function.`);
            }
            return newRunFunctionReturnValue();
        }

        runFunction(newFunction('global', globalNodes, [], []), [], true);
    })();
});