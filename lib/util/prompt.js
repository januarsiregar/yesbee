var readline = require('readline');

var Prompt = function() {
    var that = this;
    this.handlers = {};

    var rl = this.rl = readline.createInterface(process.stdin, process.stdout);
    rl.setPrompt('> ');

    this.motd();
    rl.prompt();

    rl.on('line', function(line) {
        var argv = that.argv(line);

        if (argv.length !== 0) {
            if (that.handlers[argv[0]]) {
                that.handlers[argv[0]].callback.apply(null, argv.slice(1));
            } else {
                that.fallback(argv);
            }
        }

        rl.prompt();
    }).on('close', function() {
        console.log('Quitting!');
        process.exit(0);
    });
};

Prompt.prototype.argv = function(line) {
    var len = line.length;
    var quote = '';
    var token = '';
    var tokens = [];

    var pushToken = function() {
        tokens.push(token.trim());
        token = '';
        quote = '';
    };

    for(var i = 0; i < len; i++) {
        if (token == '' && line[i] == ' ') {
            continue;
        }

        if (quote != '') {
            if (line[i] == quote) {
                pushToken();
            } else {
                token += line[i];
            }
        } else {
            if (line[i] == '"' || line[i] == "'") {
                if (token != '') {
                    pushToken();
                }
                quote = line[i];
            } else if (line[i] == ' ') {
                pushToken();
            } else {
                token += line[i];
            }
        }
    }

    if (token.trim()) {
        pushToken();
    }
    return tokens;
};

Prompt.prototype.close = function() {
    this.rl.close();
};

Prompt.prototype.on = function(name, description, callback) {
    if (typeof description == 'function') {
        callback = description;
        description = '';
    }
    this.handlers[name] = {
        name: name,
        description: description,
        callback: callback
    };
};

Prompt.prototype.fallback = function() {
    console.log('Command not found, type "help" to see available commands!');
};

Prompt.prototype.motd = function() {
    console.log('Welcome to the system');
};

module.exports = new Prompt();
module.exports.Prompt = Prompt;