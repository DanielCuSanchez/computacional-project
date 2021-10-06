const { appFunctions } = require("./utils/appFunctions")


const app = () => {
  const file = appFunctions.openFile("test1.txt")
  const data = appFunctions.getInitialData(file)
  console.log(data)
  appFunctions.getTransitionTable(file, data)
}



app()