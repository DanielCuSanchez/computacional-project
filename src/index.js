const { appFunctions } = require("./utils/appFunctions")


const app = () => {
  const file = appFunctions.openFile("test1.txt")
  const data = appFunctions.getInitialData(file)
  console.log(data)
  const transitionTable = appFunctions.getTransitionTable(data)
  console.log(transitionTable)
}



app()