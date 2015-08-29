import _ from 'underscore-plus'

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

export default _.extend(_, exports);