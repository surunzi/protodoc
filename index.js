var path      = require('path'),
    requizzle = require('requizzle');

require = requizzle({
    requirePaths: {
        before: [path.join(__dirname, 'lib')],
        after : [path.join(__dirname, 'node_modules')]
    },
    infect: true
});

var cli  = require('./cli'),
    util = require('./lib/util'),
    fs   = require('fs');

global.env = {
    opts   : {},
    args   : process.argv,
    dirname: __dirname,
    cwd    : process.cwd()
};

env.version = JSON.parse(
                  fs.readFileSync(
                      path.join(env.dirname, 'package.json'),
                      'utf8'
                  )
              ).version;

cli.runCmd();
