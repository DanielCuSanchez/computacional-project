const { appFunctions } = require('./utils/appFunctions')

const main = () => {
  const file = appFunctions.openFile('test1.txt')
  const data = appFunctions.getInitialData(file)
  console.log(data)
  const transitionTable = appFunctions.getTransitionTable(data)
  console.log(transitionTable)
  appFunctions.getExtendedTransitionFunction(data, 'q0', 'aab')
}

main()
