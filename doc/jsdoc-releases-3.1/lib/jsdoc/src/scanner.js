/**
    @module jsdoc/src/scanner
    @requires module:fs
    
    @author Michael Mathews <micmath@gmail.com>
    @license Apache License 2.0 - See file 'LICENSE.md' in this project.
 */


var fs = require('jsdoc/fs');

/**
    @constructor
    @mixes module:events
 */
exports.Scanner = function() {};
exports.Scanner.prototype = Object.create( require('events').EventEmitter.prototype );

/**
    Recursively searches the given searchPaths for js files.
    @param {Array.<string>} searchPaths
    @param {number} [depth=1]
    @fires sourceFileFound
 */
exports.Scanner.prototype.scan = function(searchPaths, depth, filter) {
    var filePaths = [],
        self = this;

    searchPaths = searchPaths || [];
    depth = depth || 1;

    searchPaths.forEach(function($) {
        var filepath = decodeURIComponent($);
        if ( fs.statSync(filepath).isFile() ) {
            filePaths.push(filepath);
        }
        else {
            filePaths = filePaths.concat(fs.ls(filepath, depth));
        }
    });
    
    filePaths = filePaths.filter(function($) {
        return filter.isIncluded($);
    });
    
    filePaths = filePaths.filter(function($) {
        var e = { fileName: $ };
        self.emit('sourceFileFound', e);
        
        return !e.defaultPrevented;
    });

    return filePaths;
};
