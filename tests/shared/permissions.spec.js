/*
 * Copyright 2017 resin.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable quotes */

'use strict'

const m = require('mochainon')
const os = require('os')
const permissions = require('../../lib/shared/permissions')

describe('Shared: permissions', function () {
  describe('.createLaunchScript()', function () {
    describe('given windows', function () {
      beforeEach(function () {
        this.osPlatformStub = m.sinon.stub(os, 'platform')
        this.osPlatformStub.returns('win32')
      })

      afterEach(function () {
        this.osPlatformStub.restore()
      })

      it('should escape environment variables and arguments', function () {
        m.chai.expect(
          permissions.createLaunchScript(
            "C:\\Users\\Alice & Bob's Laptop\\\"what\"\\balenaEtcher",
            [
              '"a Laser"',
              'arg1',
              "'&/ ^ \\",
              '" $ % *'
            ],
            {
              key: 'value',
              key2: ' " ^ & = + $ % / \\',
              key3: 8
            }
          )
        ).to.equal(
          'set "key=value"\n' +
          'set "key2= " ^^ ^& = + $ % / \\"\n' +
          'set "key3=8"\n' +
          '"C:\\Users\\Alice & Bob\'s Laptop\\\\"what\\"\\balenaEtcher" "\\"a Laser\\"" "arg1" "\'&/ ^ \\" "\\" $ % *"'
        )
      })
    })

    describe('given unix', function () {
      beforeEach(function () {
        this.osPlatformStub = m.sinon.stub(os, 'platform')
        this.osPlatformStub.returns('linux')
      })

      afterEach(function () {
        this.osPlatformStub.restore()
      })

      it('should escape environment variables and arguments', function () {
        m.chai.expect(
          permissions.createLaunchScript(
            "/home/Alice & Bob's Laptop/\"what\"/balenaEtcher",
            [ 'arg1', "'&/ ^ \\", '" $ % *' ],
            {
              key: 'value',
              key2: ' " ^ & = + $ % / \\',
              key3: 8
            }
          )
        ).to.equal(
          "export key='value'\n" +
          "export key2=' \" ^ & = + $ % / \\'\n" +
          "export key3='8'\n" +
          "'/home/Alice & Bob'\\''s Laptop/\"what\"/balenaEtcher' 'arg1' ''\\''&/ ^ \\' '\" $ % *'"
        )
      })
    })
  })
})
