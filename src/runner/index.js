const {walkSync} = require('./util')
const {Client} = require('../client')

function buildExecution(specObject, browser, seleniumUrl) {
  const {beforeEach, afterEach, ...flows} = specObject

  const flow = [
    ...Object.keys(flows).map((flowname) => {
      const client = new Client({browser, seleniumUrl})
      return async function() {
        console.log(flowname, 'FLOW STARTED')
        if(beforeEach) (await beforeEach(client))
        await flows[flowname](client)

        if(afterEach) {await afterEach(client)}
      }
    })
  ]
  return flow
}

async function runner(config) {
  const {
    paralel = 1,
    seleniumUrl = 'http://localhost:4444/wd/hub/',
    browsers,
    rerunCount = 1,
    specsPath,
    intervalPoll = 100
  } = config

  const specs = walkSync(specsPath)

  const specObjectArray = specs.map((filePath) => {
    return require(filePath)
  })

  const runs = Object.keys(browsers).reduce((runArr, browser) => {
    const currentBrowserRun = specObjectArray.map((suitObject) => {
      return buildExecution(suitObject, browsers[browser], seleniumUrl)
    })
    currentBrowserRun.forEach((runWithBrowser) => {
      runArr.push(...runWithBrowser)
    })
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
        const a = runArr.splice(0, 1)
        const result = await a[0]() //.catch(console.error)
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

      // if(everyCycleCallback && typeof everyCycleCallback === 'function') {
      //   try {await everyCycleCallback()} catch(e) {console.log(e)}
      // }

      clearInterval(asserter)
      return failedRun
    }

    return [...failedTests]
  }

  await exeRun(runs)
}

module.exports = runner
