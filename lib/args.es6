import nopt from 'nopt'

var knowOpts = {
    help     : Boolean,
    version  : Boolean
};

var shortHands = {
    h: ['--help'],
    v: ['--version']
};

exports.parse = (args) =>
{
    return nopt(knowOpts, shortHands, args, 2);
};

export default exports