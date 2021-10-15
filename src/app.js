require('colors')
const fs = require('fs')
const path = require('path')

/**
    * @function
    * @desc This is the init app function
    * @version 1.0.0
*/
exports.app = (nameFile, string) => {
  //With this works the app
  const file = openFile(nameFile)
  const automata = getInitialAutomata(file)
  console.log('AUTOMATA'.rainbow, automata)
  const statesResults = getExtendedTransitionFunction('q0', string)
  validateString(statesResults)

  /**
   * Since here starts the methods
   */



  /**
   * @method openFile
   * @desc This function generates initial automota from the file
   * @version 1.0.0
   * @param {text} file file already opened
   */
  function openFile(file) {
    const fileOpened = fs.readFileSync(path.join(__dirname, `/files/${file}`), { encoding: 'utf-8' })
    const fileFormated = fileOpened.split('\r').map(line => line.replace('\n', ''))
    return fileFormated
  }


  /**
  * @method getInitialAutomata
  * @desc This function generates the initial automata
  * @version 1.0.0
  * @param {object} file a txt file already opened
  * @returns {object} initial automata
  */
  function getInitialAutomata(file) {
    const states = accessToFile(file, 0)
    const alphabet = accessToFile(file, 1)
    const initialState = accessToFile(file, 2)
    const finalStates = accessToFile(file, 3)
    const transitions = cutFile([...file], 4)
    return {
      states,
      alphabet,
      initialState,
      finalStates,
      transitions
    }
  }


  /**
    * @method getTransitionTable
    * @desc This function generates the transition table
    * @version 1.0.0
    *@returns {object} transition table
  */
  function getTransitionTable() {
    const { states, transitions } = automata
    const table = transitions.map(transition => formatTransition(transition))
    table.forEach(transition => {
      transition.splice(1, 0, [...transition[1].split('=>')][0])
      transition[2] = [...transition[2].split('=>')][1]
    })
    const transitionTable = {}
    states.map(state => {
      transitionTable[state] = {}
    })
    Object.keys(transitionTable).map(key => {
      table.map((element, index) => {
        if (key === element[0]) {
          transitionTable[key][element[1]] = {}
          if (transitionTable[key][element[1]]) {
            transitionTable[key][element[1]] = table[index].slice(2, table[index].length)
          }
        }
      })
    })
    return transitionTable
  }


  /**
    * @method getTransitionFunction
    * @desc This function returns the states from each character that we wan to validate
    * @version 1.0.0
    * @param {string} state current state to find in transition table
    * @param {string} string current string to find in transition table
    *@returns {Array} current transition
  */
  function getTransitionFunction(state, char) {
    const transitionTable = getTransitionTable(automata)
    if (!transitionTable[state]) {
      return null
    } else if (!transitionTable[state][char]) {
      return null
    } else {
      return transitionTable[state][char]
    }
  }


  /**
    * @method getExtendedTransitionFunction
    * @desc This function returns the states from each character that we want to process
    * @version 1.0.0
    * @param {string} state current state to process
    * @param {string} string current string to process
    *@returns {Array} acumStates are the states that arrives after the process string
    *@returns {Array} transition is the simple array with the states from the string
    *@returns {Array} state when is not string to process
  */
  function getExtendedTransitionFunction(state, string) {
    if (string.length === 0) {
      return state
    } else if (string.length === 1) {
      const transition = getTransitionFunction(state, string)
      console.log('CHARACTER TO REVIEW'.red, string)
      console.log('STATE = ', state, 'string = ', string)
      console.log('TRANSITION = '.cyan, transition)
      return transition
    } else {
      const restString = string.slice(0, string.length - 1)
      const arrStates = getExtendedTransitionFunction(state, restString)
      if (!arrStates) return []

      let acumStates = []
      const firtChar = string[string.length - 1]
      console.log('---------------------------')
      console.log('CHARACTER TO REVIEW'.red, firtChar)
      console.log('STATES_CHARACTER'.magenta, arrStates)
      console.log('---------------------------')
      // Loops each state into arrStates that is for each "char"
      for (let i = 0; i < arrStates.length; i++) {
        const stateArr = arrStates[i]
        const transition = getTransitionFunction(stateArr, firtChar)
        console.log('STATE = ', stateArr, 'CHAIN = ', firtChar)
        console.log('TRANSITION = '.cyan, (transition === null ? 'NOT TRANSITION' : transition))
        if (transition !== null) {
          acumStates = union(acumStates, transition)// Here is the union function
        }
      }
      console.log('RESULT_STATES'.blue, acumStates.filter((v, i) => acumStates.indexOf(v) === i))
      return acumStates.filter((v, i) => acumStates.indexOf(v) === i) // Returns array union
    }
  }


  /**
    * @method validateString
    * @desc This function compare the final state from the automata with the final states after the running process
    * @version 1.0.0
    * @param {Array} result the result state as final state after the execution process
  */
  function validateString(result) {
    let isValidate = false
    const { finalStates } = automata
    for (const state of result) {
      for (const final of finalStates) {
        if (state === final) {
          isValidate = true
        }
      }
    }
    if (isValidate) {
      console.log('CONCLUSION ='.bgWhite.black, 'STRING IS ACCEPTED'.blue.bgWhite)
    } else {
      console.log('CONCLUSION ='.bgWhite.black, 'STRING IS NOT ACCEPTED'.red.bgWhite)
    }
  }


  /**
    * @method union
    * @desc This function is the unión of the states
    * @version 1.0.0
    * @param {Array} acumTransitions  the unión of the transitions states
    * @param {Array} transition result of transition function
    *@returns {Array} acumTransitions  the unión of the transitions states
    *@returns {Array} transition result of transition function
  */
  function union(acumTransitions, transition) {
    return [...acumTransitions, ...transition]
  }


  /**
    * @method accessToFile
    * @desc This function separate lines
    * @version 1.0.0
    * @param {Object} File  File to read
    * @param {Integer} line line of the file
  */
  function accessToFile(file, line) {
    return file[line].split(',')
  }


  /**
    * @method cutFile
    * @desc  This function gets the automata from the file
    * @version 1.0.0
    * @param {Object} File  File to read
    * @param {Integer} start start of the file
  */
  function cutFile(file, start) {
    return file.splice(start, file.length)
  }



  /**
   * @method formatTransition
   * @desc This function formats the transitions automata
   * @version 1.0.0
   * @param {Array} transition result of transition formatted
   *@returns {Array} transitionFormates  the transition with format
  */
  function formatTransition(transition) {
    const transitionFormated = transition.split(',')
    return transitionFormated
  }
}

/**
  * @method complete
  * @desc This function is used to acomplete line terminal
  * @version 1.0.0
  * @param {Array} commands default values to enter in terminal
  *@returns {Array} ret chosen values
*/
exports.complete = (commands) => {
  return function (str) {
    let i
    const ret = []
    for (i = 0; i < commands.length; i++) {
      if (commands[i].indexOf(str) === 0) { ret.push(commands[i]) }
    }
    return ret
  }
}
