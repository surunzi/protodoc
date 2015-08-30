import path from 'path'
import fs   from 'fs'

import {jade, util} from 'helper'

export default (ast) =>
{
    var templatePath = path.resolve(__dirname, 'tpl/index.jade');

    try {
        var indexTpl = jade.compile(fs.readFileSync(templatePath, 'utf8'), {pretty: true});

        var output = indexTpl({
            title: env.conf.title,
            data : ast
        });
    } catch (e) {
        console.log(e.message);
    }

    var outputPath = env.conf.destination;

    util.each(['', '/js', '/css'], (val) => util.mkPath(outputPath + val));

    util.each(['protodoc', 'jquery.min'], (val) =>
    {
        var inPath = path.resolve(__dirname, './static/js/' + val + '.js');
        util.copyFileSync(inPath, outputPath + '/js');
    });

    util.each(['style'], (val) =>
    {
        var inPath = path.resolve(__dirname, './static/css/' + val + '.css');
        util.copyFileSync(inPath, outputPath + '/css');
    });

    fs.writeFileSync(outputPath + '/index.html', output, 'utf8');
}