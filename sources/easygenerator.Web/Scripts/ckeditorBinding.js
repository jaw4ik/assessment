ko.bindingHandlers.ckeditor = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // This will be called when the binding is first applied to an element
        // Set up any initial state, event handlers, etc. here
        var bindingArguments = valueAccessor();
        var editor = undefined;
        var intervalId = '';

        CKEDITOR.domReady(initEditor);
        
        function initEditor() {
            editor = CKEDITOR.replace(element);
            editor.setData(bindingArguments.data());
            
            editor.on('blur', function () {
                bindingArguments.data(editor.getData());
                clearInterval(intervalId);
                editor.destroy();
                bindingArguments.blur(viewModel);
            });

            intervalId = setInterval(function () {
                if (bindingArguments.data() !== editor.getData())
                    bindingArguments.data(editor.getData());
            }, 100);
            
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                clearInterval(intervalId);
                editor.destroy();
            });
        }
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // This will be called once when the binding is first applied to an element,
        // and again whenever the associated observable changes value.
        // Update the DOM element based on the supplied values here.
    }
};