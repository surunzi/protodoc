import path from 'path'
import walk from 'walk'
import Q    from 'q'

var exports = {};

class Scanner
{
    constructor(filePath)
    {
        this.filePath = path.resolve(env.cwd, filePath);
    }

    scan()
    {
        var filePath  = path.resolve(env.cwd, this.filePath),
            filePaths = [],
            deffered  = Q.defer();

        var options = {
            filters: env.conf.filters
        };

        var walker = walk.walk(filePath, options);

        walker.on('file', (root, fileStats, next) =>
        {
            filePaths.push(path.resolve(root, fileStats.name));
            next();
        });

        walker.on('end', () =>
        {
            deffered.resolve(filePaths);
        });

        return deffered.promise;
    }
}

exports.Scanner = Scanner;

exports.scan = (path) =>
{
    var scanner = new Scanner(path);
    return scanner.scan();
};

export default exports
