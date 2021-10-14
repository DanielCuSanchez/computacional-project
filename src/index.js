const { appFunctions, complete } = require('./utils/appFunctions')
const prompt = require('prompt-sync')({ sigint: true })

const main = () => {
  console.log('---------------------')
  console.log('WELCOME'.bgWhite.blue)
  console.log('---------------------')

  // eslint-disable-next-line no-undef
  const nameFile = prompt('Put name of the file (USE TABULATOR) = '.yellow, { autocomplete: complete(['test1.txt', 'test2.txt']) })
  const chain = prompt('Put name of the chain (USE TABULATOR) = '.magenta, { autocomplete: complete(['a', 'ab', 'aba', 'aab']) })

  console.log('Starting.....')

  setTimeout(() => {
    const file = appFunctions.openFile(nameFile)
    const data = appFunctions.getInitialData(file)
    const resultState = appFunctions.getExtendedTransitionFunction(data, 'q0', chain)
    appFunctions.validateChain(data, resultState)
  }, 5000)
}

main()
