import cli  from './cli'
import fs   from 'fs'
import path from 'path'
import util from './lib/util'

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
