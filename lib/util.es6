import _      from 'underscore-plus'
import fs     from 'fs'
import path   from 'path'
import wrench from 'wrench'

var exports = {};

var regBlockComment = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

exports.extractBlockComment = (src) => src.match(regBlockComment);

var regBlank = /^\s+|\s+$/g;

exports.trimBlank = (str) => str.replace(regBlank, '');

exports.last = (arr) =>
{
    if (arr.length < 1) return;

    return arr[arr.length - 1];
};

/* If given a relative path, search the path where configuration file is located first.
 * If not found, search the path where protodoc is located.
 */
exports.getResPath = (filePath) =>
{
    var ret = path.resolve(env.cwd, filePath);
    if (exports.pathExists(ret)) return ret;

    return path.resolve(env.dirname, filePath);
};

exports.pathExists = (filePath) =>
{
    try {
        fs.readdirSync(filePath);
    } catch (e)
    {
        return false;
    }

    return true;
};

exports.mkPath = (path) =>
{
    wrench.mkdirSyncRecursive(path);
};

exports.copyFileSync = (inFile, outDir, fileName) =>
{
    var BUF_LENGTH = 64 * 1024,
        read, write;

    var buffer = new Buffer(BUF_LENGTH),
        bytesRead = 1,
        outFile = path.join( outDir, fileName || path.basename(inFile) ),
        pos = 0;

    wrench.mkdirSyncRecursive(outDir);

    read  = fs.openSync(inFile, 'r');
    write = fs.openSync(outFile, 'w');

    while (bytesRead > 0)
    {
        bytesRead = fs.readSync(read, buffer, 0, BUF_LENGTH, pos);
        fs.writeSync(write, buffer, 0, bytesRead);
        pos += bytesRead;
    }

    fs.closeSync(read);

    return fs.closeSync(write);
};

export default _.extend(_, exports);