/**
 * yesbee commands/ls
 *
 * MIT LICENSE
 *
 * Copyright (c) 2014 PT Sagara Xinix Solusitama - Xinix Technology
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @author     Ganesha <reekoheek@gmail.com>
 * @copyright  2014 PT Sagara Xinix Solusitama
 */
var Table = require('easy-table'),
    _ = require('lodash'),
    optimist = require('optimist');

module.exports = function() {
    "use strict";

    var argv = optimist.parse(Array.prototype.slice.call(arguments, 0)),
        t = new Table(),
        that = this;

    if (argv.a || argv.all) {
        this.container.send('remoteGetAllServices').then(function(result) {
            for(var i in result) {
                for(var j in result[i]) {
                    t.cell('Worker', '#' + i);
                    t.cell('Name', result[i][j].name);
                    t.cell('Status', (result[i][j].status) ? 'running' : 'stopped');
                    t.newRow();
                }
            }

            that.write(t.toString());
            that.writePrompt();
        });
        return false;
    }

    var services = this.container.find('services::*');

    _.each(services, function(service) {
        t.cell('Name', service.name);
        t.cell('Status', (service.status) ? 'running' : 'stopped');
        t.newRow();
    });

    this.write(t.toString());
};