const config = require('../../../nightwatch.conf.js');
require('dotenv').config();

module.exports = { // adapted from: https://git.io/vodU0
  'manage users': function (browser) {
    browser
      .url('http://localhost:7000/#/login')
      .waitForElementVisible('body')
      .waitForElementVisible('input[name=email]', 5000)
      .setValue('input[name=email]', process.env.ADMIN_EMAIL)
      .setValue('input[name=password]', process.env.ADMIN_PASSWORD)
      .click('button[type=submit]')
      .pause(1000)
      .waitForElementNotPresent('.loginForm', 1000)
      .waitForElementPresent('nav', 1000)
      .assert.urlEquals('http://localhost:7000/#/dashboard')
      .click('#manage-users')
      .waitForElementVisible('.user-list')
      .assert.urlEquals('http://localhost:7000/#/dashboard/users')
      .setValue('input[name=query]', ['mure', browser.Keys.ENTER])
      .pause(2000)
      .clearValue('input[name=query]')
      .setValue('input[name=query]', ['mudfdfadfafdsre', browser.Keys.ENTER])
      .pause(2000)
      .waitForElementNotPresent('.progress')
      .click('#manage-users')
      .pause(1000)
      .click('li.next')
      .waitForElementNotPresent('.progress')
      .assert.urlEquals('http://localhost:7000/#/dashboard/users?query=&page=2')
      .click('li.previous')
      .pause(1000)
      .waitForElementNotPresent('.progress')
      .assert.urlEquals('http://localhost:7000/#/dashboard/users?query=&page=1')
      .click('.user-list ul:nth-child(1) .deleteUser')
      .pause(500)
      .click('button.cancel')
      .pause(500)
      .click('button.confirm')
      .pause(500)
      .click('.user-list ul:nth-child(1) .deleteUser')
      .pause(500)
      .click('button.confirm')
      .pause(500)
      .click('.logout')
      .pause(2000)
      .end();
  }
};
