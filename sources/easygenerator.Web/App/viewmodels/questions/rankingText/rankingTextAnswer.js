export default class RankingTextAnswer {
    constructor(id, text) {
        this.id = id;
        this.text = ko.observable(text);

        this.text.original = text;
        this.text.isEditing = ko.observable(false);
    }
}