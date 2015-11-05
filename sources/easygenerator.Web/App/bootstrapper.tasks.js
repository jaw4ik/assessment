﻿import errorHandlingTask from 'bootstrapping/errorHandlingTask';
import routingTask from 'bootstrapping/routingTask';
import compositionTask from 'bootstrapping/compositionTask';
import viewLocatorTask from 'bootstrapping/viewLocatorTask';
import knockoutBindingsTask from 'bootstrapping/knockoutBindingsTask';
import addWindowEventsTask from 'bootstrapping/addWindowEventsTask';
import trackVideoUploadTask from 'bootstrapping/trackVideoUploadTask';

export function getCollection () {
    return [
        errorHandlingTask,
        routingTask,
        compositionTask,
        viewLocatorTask,
        knockoutBindingsTask,
        addWindowEventsTask,
        trackVideoUploadTask
    ];
}
export default { getCollection };
export var __useDefault = true;