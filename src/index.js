const { appFunctions } = require('./utils/appFunctions')

const app = () => {
  const file = appFunctions.openFile('test1.txt')
  const data = appFunctions.getInitialData(file)
  // console.log(data)
  // const transitionTable = appFunctions.getTransitionTable(data)
  // console.log(transitionTable)
  const result = appFunctions.getExtendedTransitionFunction(data, 'q0', 'adb')
  if (result[0] === undefined) {
    console.log('La cadena no es parte del automata')
  } else {
    console.log(result)
  }
}

app()
