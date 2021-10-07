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
  getTransitionTable: (file = '', data = {}) => {
    let transitionTable = {}
    const { states, transitions } = data
    const table = transitions.map(t => formatTransition(t))
    table.forEach(t => {
      t.splice(1, 0, [...t[1].split('=>')][0])
      t[2] = [...t[2].split('=>')][1]

    })
    console.log(table)
  }
}
const accessToFile = (file, line) => file[line].split(',')
const cutFile = (file, start) => file.splice(start, file.length)
const formatTransition = (transition) => {
  let tf = transition.split(',')
  return tf
}