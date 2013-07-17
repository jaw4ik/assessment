define([], function () {

    var explanation = function (explanationText) {
        var text = ko.observable(explanationText),
            editingText = ko.observable(),
            isEditing = ko.observable(false),
            startEditing = function() {
                this.editingText(text());
                this.isEditing(true);
            },
            stopEditing = function() {
                this.text(this.editingText());
                this.isEditing(false);
            };

        return {
            text: text,
            isEditing: isEditing,
            editingText: editingText,
            startEditing: startEditing,
            stopEditing: stopEditing,
        };
    };

    return explanation;
});