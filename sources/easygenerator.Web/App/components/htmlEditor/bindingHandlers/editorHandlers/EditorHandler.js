class EditorHandler {
    constructor($element) {
        this.$element = $element;
    }

    on() {
        throw 'Editor handler on() method not implemented';
    }
    
    off() {
        throw 'Editor handler off() method not implemented';
    }
}

export default EditorHandler;