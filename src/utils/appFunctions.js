/* eslint-disable prefer-const */
/* eslint-disable array-callback-return */
require('colors')
const fs = require('fs')
const path = require('path')

exports.appFunctions = {
  // This function opens the selected file
  openFile: (file) => {
    const fileOpened = fs.readFileSync(path.join(__dirname, `../inputFiles/${file}`), { encoding: 'utf-8' })
    const fileFormated = fileOpened.split('\r').map(line => line.replace('\n', ''))
    return fileFormated
  },

  /**
    * @method
    * @desc This function generates initial automota from the file
    * @version 1.0.0
    * @param {text} file file already opened
  */
  getInitialAutomata: (file) => {
    const states = accessToFile(file, 0)
    const keys = accessToFile(file, 1)
    const initialState = accessToFile(file, 2)
    const finalStates = accessToFile(file, 3)
    const transitions = cutFile([...file], 4)
    return {
      states,
      keys,
      initialState,
      finalStates,
      transitions
    }
  },
  /**
    * @method
    * @desc This function generates the transition table
    * @version 1.0.0
    * @param {object} automata initial automata
  */
  getTransitionTable: (automata = {}) => {
    const { states, transitions } = automata
    const table = transitions.map(transition => formatTransition(transition))
    table.forEach(transition => {
      transition.splice(1, 0, [...transition[1].split('=>')][0])
      transition[2] = [...transition[2].split('=>')][1]
    })
    const transitionTable = {}
    // Inicializamos la tabla con los estados
    states.map(state => {
      transitionTable[state] = {}
    })
    // Recorremos cada llave de la tabla
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
  },
  // This function returns the states from each character that we want to validate
  getTransitionFunction: (automata, state, char) => {
    const transitionTable = this.appFunctions.getTransitionTable(automata)
    if (!transitionTable[state]) {
      return null
    } else if (!transitionTable[state][char]) {
      return null
    } else {
      return transitionTable[state][char]
    }
  },
  // This function is recursive. Gets states and for each state compares in transition table
  getExtendedTransitionFunction: (automata, state, string) => {
    if (string.length === 0) {
      return state
    } else if (string.length === 1) {
      const transition = this.appFunctions.getTransitionFunction(automata, state, string)
      console.log('CHARACTER TO REVIEW'.red, string)
      console.log('STATE = ', state, 'string = ', string)
      console.log('TRANSITION = '.cyan, transition)
      return transition
    } else {
      const restString = string.slice(0, string.length - 1)
      const arrStates = this.appFunctions.getExtendedTransitionFunction(automata, state, restString)
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
        const transition = this.appFunctions.getTransitionFunction(automata, stateArr, firtChar)
        console.log('STATE = ', stateArr, 'CHAIN = ', firtChar)
        console.log('TRANSITION = '.cyan, (transition === null ? 'NOT TRANSITION' : transition))
        if (transition !== null) {
          acumStates = union(acumStates, transition)// invokes the union function
        }
      }
      console.log('RESULT_STATES'.blue, acumStates.filter((v, i) => acumStates.indexOf(v) === i))
      return acumStates.filter((v, i) => acumStates.indexOf(v) === i) // Returns array union
    }
  },
  // This function compare the final state in the chain with the final states in the file
  validateString: (automata, result) => {
    let isValidate = false
    const { finalStates } = automata
    for (const state of result) {
      for (const final of finalStates) {
        if (state === final) {
          isValidate = true
        }
      }
    }
    // This is the conclusion
    if (isValidate) {
      console.log('CONCLUSION ='.bgWhite.black, 'STRING IS ACCEPTED'.blue.bgWhite)
    } else {
      console.log('CONCLUSION ='.bgWhite.black, 'STRING IS NOT ACCEPTED'.red.bgWhite)
    }
  }
}
// This function is used to do the autocomplete function in terminal
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

// Auxiliar functions

const union = (acumTransitions, transition) => {
  return [...acumTransitions, ...transition]
}

// This function separate lines
const accessToFile = (file, line) => file[line].split(',')
// This function gets the automata from the file
const cutFile = (file, start) => file.splice(start, file.length)
// This function gets the transitions automata
const formatTransition = (transition) => {
  const transitionFormated = transition.split(',')
  return transitionFormated
}
