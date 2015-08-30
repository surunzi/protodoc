import args    from 'args'
import path    from 'path'
import fs      from 'fs'
import scanner from 'scanner'
import parser  from 'parser'
import util    from './lib/util'

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
    env.conf.destination = path.join(env.cwd, env.conf.destination || './docs');

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
        env.ast = parser.parse(filePaths);
        cli.generateDocs();
    });
};

cli.generateDocs = () =>
{
    var templatePath = env.conf.template ?
                       env.conf.template :
                       'templates/default';

    var template;

    templatePath = util.getResPath(templatePath);

    try
    {
        template = require(templatePath + '/publish');
    } catch (e)
    {
        console.log('Unable to load template.');
    }

    if (util.isFunction(template))
    {
        console.log('Generating output files..');
        template(env.ast);
    }
};

export default cli