import errorHandlingTask from 'bootstrapping/errorHandlingTask';
import routingTask from 'bootstrapping/routingTask';
import compositionTask from 'bootstrapping/compositionTask';
import viewLocatorTask from 'bootstrapping/viewLocatorTask';
import knockoutBindingsTask from 'bootstrapping/knockoutBindingsTask';
import addWindowEventsTask from 'bootstrapping/addWindowEventsTask';
import trackVideoUploadTask from 'bootstrapping/trackVideoUploadTask';
import underscoreExtensionsTask from 'bootstrapping/underscoreExtensionsTask';

export function getCollection () {
    return [
        errorHandlingTask,
        routingTask,
        compositionTask,
        viewLocatorTask,
        knockoutBindingsTask,
        addWindowEventsTask,
        trackVideoUploadTask,
        underscoreExtensionsTask
    ];
}
export default { getCollection };