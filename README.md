ProtoDoc
========

A documentation generator for data exchange format, mainly json format used in communication between browser and back-end services.

Installation and Usage
----------------------

Install ProtoDoc globally using Node.js:

    npm install -g protodoc

Create a file name `ProtoConf.js` inside your project directory, and paste the configuration below in it.

    module.exports = {
        source     : './code',
        filters    : [],
        encoding   : 'utf8',
        title      : 'TaskMVC',
        destination: './out'
    };

1. Source: Source directory.
2. Filters: Directories with these keys will be skipped.
3. Encoding: File encoding.
4. Title: Project name.
5. Destination: Output directories.

Inside the same directory where `ProtoConf.js` is created, run command:

    protodoc

Documentation rules
-------------------

You should follow a few rules to write your documentation so that ProtoDoc can recognize it. Check the [test](https://github.com/surunzi/protodoc/tree/master/test) directory to see some examples.

    /* protocol
     *
     * name: Add Task
     * method: post
     * desc: Add task to list. \
     * > You don't have to send the **id** of task. \
     * > It will be generated automatically by server, \
     * > same as **createTime** and **complete**.
     * url: http://www.taskmvc.com/task/add
     *
     * params:
     * - title: string Task title
     * - detail: string Task detail
     *
     * return:
     * - id: number Id of the new task
     */

To see what the final output is like, visit: [http://surunzi.github.io/protodoc/](http://surunzi.github.io/protodoc/)

