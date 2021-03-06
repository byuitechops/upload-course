'use-strict';

const chalk = require('chalk'),
    canvas = require('canvas-wrapper');

/**************************************
 * uploads the zip to a canvas course
 * saves migrationId to course object
 **************************************/
module.exports = function (course, stepCallback) {

    /**************************************
     * GETs the status of the upload ONCE
     *************************************/
    function checkProgress(progressUrl) {
        course.message('Canvas Migration Status:');
        // TODO replace setInterval with recursive calls to avoid multiple calls to stepCallback
        var checkLoop = setInterval(() => {
            canvas.get(progressUrl, (err, migrations) => {
                if (err) {
                    course.fatalError(err);
                    stepCallback(err, course);
                    return;
                }
                var migration = migrations[0];

                course.message(`${chalk.blue('Import Progress:')} ${migration.workflow_state}`);
                if (migration.workflow_state === 'completed') {
                    clearInterval(checkLoop);
                    course.message('Zip successfully uploaded to Canvas');
                    stepCallback(null, course);
                    return;
                } else if (migration.workflow_state === 'failed' || migration.workflow_state === 'waiting_for_select') {
                    clearInterval(checkLoop);
                    var unknownErr = new Error('Unknown error occurred. Please check the status of the migration via Canvas UI');
                    course.fatalError(unknownErr);
                    stepCallback(unknownErr, course);
                    return;
                }
            });
        }, 5000);
    }

    /*********************************************
     * GETs migration object so we can
     * know the progressURL
     *******************************************/
    function getMigration() {
        var url = `https://byui.instructure.com/api/v1/courses/${course.info.canvasOU}/content_migrations/${course.info.migrationID}`;
        canvas.get(url, (err, migrations) => {
            if (err) {
                course.fatalError(err);
                stepCallback(err, course);
                return;
            }
            var migration = migrations[0];

            course.message(chalk.green('Retrieved Migration'));

            if (migration.errors) {
                var migrationErr = new Error(JSON.stringify(migration.errors));
                course.fatalError(migrationErr);
                stepCallback(migrationErr, course);
                return;
            } else {
                checkProgress(migration.progress_url);
            }
        });
    }

    /****************************************
     * START HERE
     * Use the canvas wrapper to perform the 
     * 3 part file upload dance
     ***************************************/
    if (course.info.canvasOU == undefined || course.info.canvasOU === 'unspecified' || course.info.canvasOU === '' ) {
        var err = new Error('Missing CanvasOU. Unable to import course');
        course.fatalError(err);
        stepCallback(err, course);
        return;
    }
    canvas.uploadCourse(course.info.canvasOU, course.info.uploadZipPath, (err, migration) => {
        if (err) {
            course.fatalError(err);
            stepCallback(err, course);
            return;
        }
        course.newInfo('migrationID', migration.id);
        getMigration();
    });
};