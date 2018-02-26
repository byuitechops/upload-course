# Upload Course
### *Package Name*: upload-course
### *Child Type*: shell
### *Platform*: all
### *Required*: Required

This child module is built to be used by the Brigham Young University - Idaho D2L to Canvas Conversion Tool. It utilizes the standard `module.exports => (course, stepCallback)` signature and uses the Conversion Tool's standard logging functions. You can view extended documentation [Here](https://github.com/byuitechops/d2l-to-canvas-conversion-tool/tree/master/documentation).

## Purpose
This child module uploads a D2L zip export file to an existing Canvas course, triggering the Canvas migration tool and populating the course with the contents of the export file.

## How to Install
```
npm install upload-course
```
OR
```
npm install https://github.com/byuitechops/upload-course.git
```

## Run Requirements
This child module requires the following fields in the course.info object:
* `migrationID`
* `canvasOU`
* `domain`
* `uploadZipPath`


## Options
None

## Outputs
A new property titled `migrationID` is created on course.info. This required by the child module [get-migration-issues](https://github.com/byuitechops/get-migration-issues)

## Process
1. Inform Canvas of the file upload
2. Upload the zip file to Canvas
3. Confirm upload
4. GET migration object from canvas
5. GET status of upload until it has completed or failed

## Log Categories
This module does not use course.log anywhere.


## Requirements
This shell module is required for the conversion tool to run properly. Its goal is to upload a D2L course export file (.zip) to an existing Canvas course.