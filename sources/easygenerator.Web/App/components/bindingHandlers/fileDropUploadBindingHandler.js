import ko from 'knockout';
import composition from 'durandal/composition';

ko.bindingHandlers.dropUpload = {
    init: function (element, valueAccessor) {
        let $element = $(element),
            beforeHandler = valueAccessor().before,
            callbackHandler = valueAccessor().callback,
            css = {
                active: 'active',
                hover: 'hover'
            },
            events = {
                dragenter:'dragenter',
                dragleave:'dragleave',
                dragover: 'dragover',
                drop:'drop'
            },
            bodyEventCounter = 0,
            elementEventCounter = 0;

        let handlers = {
            body: {
                onDragEnter: e => {
                    return fileUploadEventHandler(e, () => {
                        bodyEventCounter++;
                        $element.addClass(css.active);
                        e.dataTransfer.dropEffect = 'none';
                    });
                },
                onDragLeave: e => {
                    return fileUploadEventHandler(e, () => {
                        bodyEventCounter--;
                        if (bodyEventCounter === 0) {
                            $element.removeClass(css.active);
                        }
                    });
                },
                onDrop: fileUploadEventHandler
            },
            element:{
                onDragEnter: e => {
                    return fileUploadEventHandler(e, () => {
                        elementEventCounter++;
                        $element.addClass(css.hover);
                    });
                },
                onDragLeave: e => {
                    return fileUploadEventHandler(e, () => {
                        elementEventCounter--;
                        if(elementEventCounter === 0){
                            $element.removeClass(css.hover);
                        }
                    });
                },
                onDragOver: fileUploadEventHandler,
                onDrop: e => {
                    return fileUploadEventHandler(e, () => {
                        let files = e.dataTransfer.files;
                        if (files.length > 0) {
                            $element.removeClass(css.active);
                            $element.removeClass(css.hover);

                            if (_.isFunction(beforeHandler) && !beforeHandler()) {
                                return false;
                            }

                            for (let i = 0; i < files.length; i++) {
                                callbackHandler(files[i]);
                            }
                        }
                    });
                }
            }
        };

        document.addEventListener(events.dragenter, handlers.body.onDragEnter, false);
        document.addEventListener(events.dragleave, handlers.body.onDragLeave, false);
        document.addEventListener(events.drop, handlers.body.onDrop, false);

        element.addEventListener(events.dragenter, handlers.element.onDragEnter, false);
        element.addEventListener(events.dragleave, handlers.element.onDragLeave, false);
        element.addEventListener(events.dragover, handlers.element.onDragOver, false);
        element.addEventListener(events.drop, handlers.element.onDrop, false);

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            document.removeEventListener(events.dragenter, handlers.body.onDragEnter, false);
            document.removeEventListener(events.dragleave, handlers.body.onDragLeave, false);
            document.removeEventListener(events.drop, handlers.body.onDrop, false);
        });

        function fileUploadEventHandler(e, handler){
            e.preventDefault();
            if (containsFiles(e) && handler) {
                handler();
            }

            return false;
        }

        function containsFiles(e) {
            if (e.dataTransfer.types) {
                for (let i = 0; i < e.dataTransfer.types.length; i++) {
                    if (e.dataTransfer.types[i] === "Files") {
                        return true;
                    }
                }
            }
    
            return false;
        }
    }
};

composition.addBindingHandler('dropUpload');
