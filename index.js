// q0,q1,q2,q3 (estados)
// a,b (Llaves)
// q0 (Estado inicial)
// q3 (Estado final)

const fs = require("fs")


const main = () => {
  const data = getInitialStates("test1.txt")

  console.log(data)

  return 0
}





// Obtiene todos los estados
const getInitialStates = (file) => {
  const openedFile = fs.readFileSync(`./test/${file}`, { encoding: "utf-8" })
  const arrStates = openedFile.split('\r')[0].split(',')
  const arrKeys = getKeys(openedFile)
  const initiaState = getInitialAndFinalState(openedFile, 2)
  const finalState = getInitialAndFinalState(openedFile, 3)
  return {
    states: arrStates,
    keys: arrKeys,
    initiaState: initiaState,
    finalState: finalState
  }
}

const getKeys = (openedFile) => {
  const arrKeys = openedFile.split('\n')[1].split(',')
  arrKeys[0].split('')
  return arrKeys
}

const getInitialAndFinalState = (openedFile, line) => {
  const state = openedFile.split('\n')[line]
  return state
}
main()