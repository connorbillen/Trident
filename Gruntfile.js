'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  // var pkg = require('./package.json');

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-cucumber');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');    
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-string-replace');

  grunt.initConfig({
    copy: {
      css: {
        files: [
          {
            expand: true,
            src: ['app/css/*'],
            dest: 'public/css/',
            filter: 'isFile'
          }
        ]
      }
    },

    clean: ['public'],

    jshint: {
      options : {
        jshintrc : true
      },
      all: ['Gruntfile.js', 'features/step_definitions/**/*.js', 'app/js/**/*.js']
    },
 
    'string-replace': {
      inline: {
        files: {
          'public/index.html': 'app/index.html',
        },
        options: {
          replacements: [
            {
              pattern: /(<script src=".*?" type=".*?"><\/script>)/g,
              replacement: ''
            },
            {
              pattern: /<!-- end user javascript files -->/g,
              replacement: '<script src="js/script.min.js" type="text/javascript"></script>'
            },
            {
              pattern: /(<link rel="stylesheet" href=".*?" type=".*?">)/g,
              replacement: '<link rel="stylesheet" href="css/style.min.css" type="text/css">'
            }
          ]
        }
      }
    },

    concat: {
      css: {
        src: ['app/css/**/*.css', 'node_modules/bulma/css/bulma.min.css'],
        dest: 'public/css/style.css',
      },
      js: {
        src: ['node_modules/underscore/underscore-min.js', 'node_modules/jquery/dist/jquery.min.js', 'node_modules/ejs/ejs.min.js', 'node_modules/backbone/backbone-min.js', 'node_modules/backbone.stickit/backbone.stickit.js', 'app/templates/**/*.js', 'app/js/**/*.js'],
        dest: 'public/js/script.js',
      },
    },

    uglify: {
      scripts: {
        files: {
          'public/js/script.min.js': ['public/js/script.js']
        }
      }        
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'public/css',
          src: ['*.css', '!*.min.css'],
          dest: 'public/css',
          ext: '.min.css'
        }]
      }
    }
  });

  grunt.registerTask('runCmd', function(directory, cmd, csvArgs){
    var next = this.async();
    var deployTask = grunt.util.spawn({
      cmd: cmd,
      args: csvArgs?csvArgs.split(','):[],
      opts: {
        cwd: directory
      }
    }, function (err, result, code) {
      if (err) {
        grunt.fail.fatal(err, code);
        next(code);
      } else {
        if (result) { 
          console.log('Command result: ' + result);
        }
        grunt.log.ok();
        next();
      }
    });

    if (!deployTask) {
      grunt.fail.fatal(cmd + ' task failed. Is \''+cmd+'\' on PATH?');
    }
    deployTask.stdout.on('data', function (buf) {
      grunt.log.write(String(buf));
    });
    deployTask.stderr.on('data', function (buf) {
      grunt.log.error(String(buf));
    });
  });

  grunt.registerTask('cuke', function(tags) {
    var remoteURL = grunt.option('remoteURL') || 'http://localhost:1337';

    process.env.remoteURL = remoteURL;
    process.env.CUKE_TAGS = tags;

    grunt.initConfig({
      cucumberjs: {
        src: 'features',
        options: {
          steps: 'features/step_definitions',
          tags : tags.split('&')
        }
      }
    });

    grunt.task.run('cucumberjs');
  });

  grunt.registerTask('build', [
    'runCmd:.:npm:install',
    'jshint',
    'copy',
    'string-replace',
    'concat',
    'uglify',
    'cssmin'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'copy',
    'string-replace',
    'concat',
    'uglify',
    'cssmin'
  ]);
};
