const {walkSync} = require('./util')
const {Client} = require('../client')

function buildExecution(specObject, browser) {
  const {beforeEach, afterEach, ...flows} = specObject

  const flow = [
    ...Object.keys(flows).map((flowname) => {
      return async function() {
        if(beforeEach) (await beforeEach())

        await flows[flowname](new Client(browser))

        if(afterEach) {await afterEach()}
      }
    })
  ]
  return flow
}

async function runner(config) {
  const {
    paralel = 1,
    browsers,
    rerunCount = 1,
    specsPath
  } = config

  const specs = walkSync(specsPath)

  const specObjectArray = specs.map((filePath) => {
    return require(filePath)
  })

  const runs = Object.keys(browsers).reduce((runArr, browser) => {
    const currentBrowserRun = specObjectArray.map((suitObject) => {
      return buildExecution(suitObject, browser)
    })
    runArr.push(...currentBrowserRun)
    return runArr
  }, [])


  async function exeRun(runs) {
    let currentSessionCount = 0
    let maxSessionCount = paralel
    runArr = runs

    const failedTests = await new Array(rerunCount).fill(rerunCount).reduce((resolver) => {
      return resolver.then((resolvedArr) => performRun(resolvedArr, []).then((failedArr) => failedArr))
    }, Promise.resolve(runArr))

    async function runCommandsArr(runnCommandsArr, failedArr) {
      if(maxSessionCount > currentSessionCount && runnCommandsArr.length) {
        currentSessionCount += 1
        const result = await runArr.splice(0, 1)[0].catch(console.error)
        if(result) {failedArr.push(result)}
        currentSessionCount -= 1
      }
    }

    async function performRun(runSuits, failedRun) {
      const asserter = setInterval(() => runCommandsArr(runSuits, failedRun), intervalPoll)

      do {
        if(runSuits.length) {await runCommandsArr(runSuits, failedRun)}
        if(currentSessionCount) {await sleep(2000)}
      } while(runSuits.length || currentSessionCount)

      if(everyCycleCallback && typeof everyCycleCallback === 'function') {
        try {await everyCycleCallback()} catch(e) {console.log(e)}
      }

      clearInterval(asserter)
      return failedRun
    }

    return [...failedTests]
  }

  await exeRun(runs)
}