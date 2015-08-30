module.exports = function (grunt)
{
    grunt.initConfig({
        copy: {
            bower: {
                files: {
                    'templates/default/static/js/jquery.min.js': 'bower_components/jquery/dist/jquery.min.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('bower', 'copy:bower');
};