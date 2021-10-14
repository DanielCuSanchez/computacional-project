/* eslint-disable prefer-const */
/* eslint-disable array-callback-return */
const fs = require('fs')
const path = require('path')
const colors = require('colors')

exports.appFunctions = {
  // Abre el archivo
  openFile: (file) => {
    const fileOpened = fs.readFileSync(path.join(__dirname, `../inputFiles/${file}`), { encoding: 'utf-8' })
    const fileFormated = fileOpened.split('\r').map(line => line.replace('\n', ''))
    return fileFormated
  },
  // Toma los datos iniciales
  getInitialData: (file) => {
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
  getTransitionTable: (data = {}) => {
    const { states, transitions } = data
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
  getTransitionFunction: (data, state, char) => {
    const transitionTable = this.appFunctions.getTransitionTable(data)
    if (!transitionTable[state]) {
      return null
    } else if (!transitionTable[state][char]) {
      return null
    } else {
      return transitionTable[state][char]
    }
  },
  getExtendedTransitionFunction: (data, initialState, chain) => {
    if (chain.length === 0) {
      return initialState
    } else if (chain.length === 1) {
      const table = this.appFunctions.getTransitionFunction(data, initialState, chain)
      console.log('CHARACTER TO REVIEW'.red, chain)
      console.log('TRANSITION = '.green, table)
      return table
    } else {
      const restChain = chain.slice(0, chain.length - 1)
      const arrStates = this.appFunctions.getExtendedTransitionFunction(data, initialState, restChain)
      if (!arrStates) return []

      let finalStates = []

      const firtChar = chain[chain.length - 1]
      console.log('---------------------------')
      console.log('CHARACTER TO REVIEW'.red, firtChar)
      console.log('STATES_CHARACTER'.magenta, arrStates)
      console.log('---------------------------')
      for (let i = 0; i < arrStates.length; i++) {
        const stateArr = arrStates[i]
        const transition = this.appFunctions.getTransitionFunction(data, stateArr, firtChar)
        console.log('STATE = ', stateArr, 'CHAIN = ', firtChar)
        console.log('TRANSITION = '.cyan, (transition === null ? 'NOT TRANSITION' : transition))
        if (transition !== null) {
          finalStates = [...finalStates, ...transition]
        }
      }
      console.log('RESULT_STATES'.blue, finalStates.filter((v, i) => finalStates.indexOf(v) === i))
      return finalStates.filter((v, i) => finalStates.indexOf(v) === i)
    }
  },
  validateChain: (data, result) => {
    let isValidate = false
    const { finalStates } = data
    for (const state of result) {
      for (const final of finalStates) {
        if (state === final) {
          isValidate = true
        }
      }
    }
    if (isValidate) {
      console.log('CONCLUSION ='.bgWhite.black, 'CHAIN IS ACCEPTED'.blue.bgWhite)
    } else {
      console.log('CONCLUSION ='.bgWhite.black, 'CHAIN IS NOT ACCEPTED'.red.bgWhite)
    }
  }
}

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

// Funciones auxiliares
const accessToFile = (file, line) => file[line].split(',')
const cutFile = (file, start) => file.splice(start, file.length)
const formatTransition = (transition) => {
  const tf = transition.split(',')
  return tf
}
