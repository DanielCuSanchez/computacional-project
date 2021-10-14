/**
  * @author  Daniel Cu Sánchez, Marcela Arcos Caballero
  * @version 1.0
  * @since   2021 - 10 - 14
 */

const { app, complete } = require('./app')
const prompt = require('prompt-sync')({ sigint: true })

const main = () => {
  console.log('---------------------')
  console.log('WELCOME'.bgWhite.blue)
  console.log('---------------------')

  const nameFile = prompt('Put name of the file (USE TABULATOR) = '.yellow, { autocomplete: complete(['test1.txt', 'test2.txt']) })
  const string = prompt('Insert the string (USE TABULATOR) = '.magenta, { autocomplete: complete(['a', 'ab', 'aba', 'aab']) })

  app(nameFile, string)
}

main()
