import errorHandlingTask from 'bootstrapping/errorHandlingTask';
import localizationTask from 'bootstrapping/localizationTask';
import routingTask from 'bootstrapping/routingTask';
import compositionTask from 'bootstrapping/compositionTask';
import viewLocatorTask from 'bootstrapping/viewLocatorTask';
import knockoutBindingsTask from 'bootstrapping/knockoutBindingsTask';
import addWindowEventsTask from 'bootstrapping/addWindowEventsTask';
import trackVideoUploadTask from 'bootstrapping/trackVideoUploadTask';

function getCollection () {
    return [
        errorHandlingTask,
        localizationTask,
        routingTask,
        compositionTask,
        viewLocatorTask,
        knockoutBindingsTask,
        addWindowEventsTask,
        trackVideoUploadTask
    ];
}

export default { getCollection };