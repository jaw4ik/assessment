import ko from 'knockout';
import commentContextFactory from 'review/comments/context/commentContextFactory';

export default class Comment {
    constructor(courseId, item) {
        this.id = item.id;
        this.text = item.text;
        this.email = item.email;
        this.name = item.name;
        this.avatarLetter = item.name.charAt(0);
        this.originalContext = item.context;
        this.context = commentContextFactory.createContext(courseId, item.context);
        this.createdOn = item.createdOn;
        this.isDeleted = ko.observable(false);
        this.isExpanded = ko.observable(false);
        this.isExpandable = ko.observable(false);
    }

    toggleIsExpanded() {
        this.isExpanded(!this.isExpanded());
    }
}