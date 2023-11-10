import type { Services } from '@wdio/types';
const express = require('express');
const path = require('path');
const PORT = 3001
const debug = process.env.DEBUG;
class ExpressServiceLauncher implements Services.ServiceInstance {
    async onPrepare(): Promise<void> {
        const port = 3001;
        const app = require('../services/server.js')
        await new Promise<void>((resolve, reject) => {
            app.listen(port, (err) => {
                if (err) {
                    console.error(`[Express Service] Error starting server: ${err}`);
                    reject(err);
                } else {
                    console.log(`[Express Service] App listening on port ${port}\n`);
                    resolve();
                }
            });
        });
    }
}

export const config: WebdriverIO.Config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    //
    // WebdriverIO supports running e2e tests as well as unit and component tests.
    runner: 'local',
    autoCompileOpts: {
        autoCompile: true,
        tsNodeOpts: {
            transpileOnly: true,
            project: './tsconfig.json',
        },
    },
    //
    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // from which `wdio` was called.
    //
    // The specs are defined as an array of spec files (optionally using wildcards
    // that will be expanded). The test for each spec file will be run in a separate
    // worker process. In order to have a group of spec files run in the same worker
    // process simply enclose them in an array within the specs array.
    //
    // If you are calling `wdio` from an NPM script (see https://docs.npmjs.com/cli/run-script),
    // then the current working directory is where your `package.json` resides, so `wdio`
    // will be called from there.
    //
    specs: ['../test/*.ts'],
    // Patterns to exclude.
    exclude: [
        // Exclude utam tests until working again
        './test/__utam__/*.ts',
    ],
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude options in
    // order to group specific specs to a specific capability.
    //
    // First, you can define how many instances should be started at the same time. Let's
    // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
    // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
    // files and you set maxInstances to 10, all spec files will get tested at the same time
    // and 30 processes will get spawned. The property handles how many capabilities
    // from the same test should run tests.
    //
    maxInstances: 1,
    capabilities: [
        {
            maxInstances: 1,
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: ['--disable-gpu'],
            },
        },
    ],
    execArgv: debug ? ['--inspect'] : [],
    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'info',
    //
    // Set specific log levels per logger
    // loggers:
    // - webdriver, webdriverio
    // - @wdio/applitools-service, @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
    // - @wdio/mocha-framework, @wdio/jasmine-framework
    // - @wdio/local-runner, @wdio/lambda-runner
    // - @wdio/sumologic-reporter
    // - @wdio/cli, @wdio/config, @wdio/sync, @wdio/utils
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    // logLevels: {
    //     webdriver: 'info',
    //     '@wdio/applitools-service': 'info'
    // },
    //
    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,
    //
    // Set a base URL in order to shorten url command calls. If your `url` parameter starts
    // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
    // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
    // gets prepended directly.
    baseUrl: `http://localhost:${PORT}`,
    //
    // Default timeout for all waitFor* commands.
    waitforTimeout: 20 * 1000,
    //
    // Default timeout in milliseconds for request
    // if browser driver or grid doesn't send response
    connectionRetryTimeout: 120000,
    //
    // Default request retries count
    connectionRetryCount: 3,
    framework: 'mocha',
    mochaOpts: {
        timeout: 30 * 1000,
    },
    services: [
        ['chromedriver', { port: 8020 }],
        [ExpressServiceLauncher, {}],
    ],
    before(caps, spec: string[], browser: WebdriverIO.Browser): void {
        browser.addCommand('shadowDeep$', async (selector: string) => {
            return browser.$('>>>' + selector);
        });
        browser.addCommand('shadowDeep$$', async (selector: string) => {
            return browser.$$('>>>' + selector);
        });
        browser.addCommand('waitForElement', async (selector: string) => {
            return browser.waitUntil(
                async (): Promise<any> => {
                    const element = await browser.shadowDeep$(selector);
                    if (!(await element.isExisting())) {
                        return undefined;
                    }
                    return element;
                },
                {
                    timeoutMsg: `'${selector}' did not become available before the timeout`,
                },
            );
        });
    },
};
