import args    from './lib/args'
import path    from 'path'
import fs      from 'fs'
import scanner from './lib/scanner'
import parser  from './lib/parser'

var cli = {};

cli.runCmd = () =>
{
    env.opts = args.parse(env.args);

    var opts = env.opts,
        cmd  = cli.main;

    if (opts.help)
    {
        cmd = cli.printHelp;
    } else if (opts.version)
    {
        cmd = cli.printVersion;
    } else
    {
        cmd = cli.main;
    }

    cmd();
};

cli.printHelp = () =>
{
    console.log('Nothing here!');
};

cli.getVersion = () =>
{
    return 'ProtoDoc ' + env.version;
};

cli.printVersion = () =>
{
    console.log(cli.getVersion());
};

cli.loadConf = () =>
{
    var confPath = path.join(env.cwd, 'ProtoConf.js');

    try
    {
        if (!fs.statSync(confPath).isFile()) return false;
    } catch (e)
    {
        return false;
    }

    env.conf = require(confPath);

    return true;
};

cli.main = () =>
{
    if(!cli.loadConf())
    {
        console.log('Configuration file "ProtoConf.js" is not found!');
        return;
    }
    scanner.scan(env.conf.source).then((filePaths) =>
    {
        env.srcFiles = filePaths;
        cli.parseFiles();
    });
};

cli.parseFiles = () =>
{
    var nodes = parser.parse(env.srcFiles);
    console.dir(nodes);
};

export default cli