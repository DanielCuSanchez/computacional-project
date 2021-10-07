const fs = require("fs")
const path = require("path")


exports.appFunctions = {
  //Abre el archivo
  openFile: (file) => {
    const fileOpened = fs.readFileSync(path.join(__dirname, `../test/${file}`), { encoding: "utf-8" })
    const fileFormated = fileOpened.split("\r").map(line => line.replace("\n", ""))
    return fileFormated
  },
  //Toma los datos iniciales
  getInitialData: (file) => {
    const states = accessToFile(file, 0)
    const keys = accessToFile(file, 1)
    const initialState = accessToFile(file, 2)
    const finalState = accessToFile(file, 3)
    const transitions = cutFile([...file], 4)
    return {
      states,
      keys,
      initialState,
      finalState,
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
  }
}
const accessToFile = (file, line) => file[line].split(',')
const cutFile = (file, start) => file.splice(start, file.length)
const formatTransition = (transition) => {
  let tf = transition.split(',')
  return tf
}