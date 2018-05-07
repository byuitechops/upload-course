/* eslint no-console:0 */

const canvas = require('canvas-wrapper'),
    path = require('path'),
    chalk = require('chalk');

var filePath = path.resolve('.', 'test.zip');

// cb needs: migrationID, 
canvas.uploadCourse(10471, filePath, (err, migration, uploadObj) => {
    if(err) {
        console.error(chalk.red(err.stack));
        return;
    }
    // console.log(`STUFF:${JSON.stringify(uploadObj, null,2)}\nMigration ID:${migration.id}`);
    console.log(`Migration ID:${migration.id}`);
    console.log('Done');

});