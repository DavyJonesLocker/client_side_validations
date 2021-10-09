#!/usr/bin/env node

// Inspired by David Taylor's qunit puppeteer
//

/* global QUnit */

var args = process.argv.slice(2)

if (args.length < 1 || args.length > 2) {
  console.log('Usage: node run-qunit.js <URL> <timeout>')
  process.exit(1)
}

const targetURL = args[0]
const timeout = parseInt(args[1] || 300000, 10)

const chromeLauncher = require('chrome-launcher')
const puppeteer = require('puppeteer-core');

(async () => {
  console.log('\nRunning QUnit tests\n')

  function wait (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  try {
    const chromeExecutablePath = chromeLauncher.Launcher.getInstallations()[0]
    const browser = await puppeteer.launch({ executablePath: chromeExecutablePath, headless: true })
    const page = await browser.newPage()

    // Attach to browser console log events, and log to node console
    await page.on('console', (...params) => {
      for (let i = 0; i < params.length; ++i) { console.log(`${(typeof (params[i]) === 'object') ? params[i]._text : params[i]}`) }
    })

    var moduleErrors = []
    var testErrors = []
    var assertionErrors = []

    await page.exposeFunction('harness_moduleStart', context => {
      testErrors = []
      var skippedTests = context.tests.filter(t => t.skip).length
      if (skippedTests === context.tests.length) {
        // console.log(`\x1b[4m\x1b[36mSkipping Module: ${context.name}\x1b[0m`)
      } else {
        // console.log(`\x1b[4mRunning Module: ${context.name}\x1b[0m`)
      }
    })

    await page.exposeFunction('harness_moduleDone', context => {
      if (context.failed) {
        var msg = 'Module Failed: ' + context.name + '\n' + testErrors.join('\n')
        moduleErrors.push(msg)
      }
    })

    await page.exposeFunction('harness_testDone', context => {
      if (context.failed) {
        var msg = '  Test Failed: ' + context.name + assertionErrors.join('    ')
        testErrors.push(msg)
        assertionErrors = []
        process.stdout.write('\x1b[31mF\x1b[0m')
      } else if (context.skipped) {
        process.stdout.write('\x1b[33mS\x1b[0m')
      } else {
        process.stdout.write('\x1b[32m.\x1b[0m')
      }
    })

    await page.exposeFunction('harness_log', context => {
      if (context.result) { return } // If success don't log

      var msg = '\n    Assertion Failed:'
      if (context.message) {
        msg += ' ' + context.message
      }

      if (context.expected) {
        msg += '\n      Expected: ' + context.expected + ', Actual: ' + context.actual
      }

      assertionErrors.push(msg)
    })

    await page.exposeFunction('harness_done', context => {
      process.stdout.write('\n')

      if (moduleErrors.length > 0) {
        for (var idx = 0; idx < moduleErrors.length; idx++) {
          console.log(moduleErrors[idx])
        }
      }

      var stats = [
        'Time: ' + context.runtime + 'ms',
        'Total: ' + context.total,
        'Passed: ' + context.passed,
        'Failed: ' + context.failed
      ]

      console.log(`\n${stats.join(', ')}\n`)

      browser.close()

      if (context.failed > 0) {
        process.exit(1)
      } else {
        process.exit()
      }
    })

    await page.goto(targetURL)

    await page.evaluate(() => {
      QUnit.config.testTimeout = 10000

      // Cannot pass the window.harness_blah methods directly, because they are
      // automatically defined as async methods, which QUnit does not support
      QUnit.log((context) => { window.harness_log(context) })
      QUnit.moduleStart((context) => { window.harness_moduleStart(context) })
      QUnit.moduleDone((context) => { window.harness_moduleDone(context) })
      QUnit.testDone((context) => { window.harness_testDone(context) })
      QUnit.done((context) => { window.harness_done(context) })

      if (Object.keys(QUnit.urlParams).length) {
        console.log('With params: ' + JSON.stringify(QUnit.urlParams) + '\n')
      }

      if (!QUnit.config.autostart) {
        QUnit.start()
      }
    })

    await wait(timeout)

    console.error('\nTests timed out\n')
    await browser.close()
    process.exit(124)
  } catch (error) {
    console.error(`\nERROR: ${error.message}\n`)
  } finally {
    await browser.close()
  }
})()
