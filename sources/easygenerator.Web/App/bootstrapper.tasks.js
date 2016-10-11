﻿import errorHandlingTask from 'bootstrapping/errorHandlingTask';
import compositionTask from 'bootstrapping/compositionTask';
import viewLocatorTask from 'bootstrapping/viewLocatorTask';
import knockoutBindingsTask from 'bootstrapping/knockoutBindingsTask';
import addWindowEventsTask from 'bootstrapping/addWindowEventsTask';
import trackVideoUploadTask from 'bootstrapping/trackVideoUploadTask';
import requestTrackingTask from 'bootstrapping/requestTrackingTask';
import htmlEditorInitializationTask from 'bootstrapping/htmlEditorInitializationTask';

function getCollection () {
    return [
        errorHandlingTask,
        compositionTask,
        viewLocatorTask,
        knockoutBindingsTask,
        addWindowEventsTask,
        trackVideoUploadTask,
        requestTrackingTask,
        htmlEditorInitializationTask
    ];
}
export default { getCollection };