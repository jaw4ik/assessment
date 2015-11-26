import _ from 'underscore';
import ko from 'knockout';
import moment from 'moment';
import QuestionsViewModel from 'editor/course/questions/QuestionsViewModel';

var mapSections = sections => _.map(sections, section => {
    return {
        id: section.id,
        title: section.title,
        modifiedOn: ko.observable(moment(section.modifiedOn).format('DD/MM/YY')),
        image: section.image,
        menuExpanded: ko.observable(false),
        toggleMenu: self => self.menuExpanded(!self.menuExpanded()),
        questionsExpanded: ko.observable(true),
        toggleQuestions: self => self.questionsExpanded(!self.questionsExpanded()),
        questionsViewModel: new QuestionsViewModel(section.id, section.questions)
    };
});

export default class SectionsViewModel{
    constructor (courseId, sections) {
        this.courseId = courseId;
        this.sections = ko.observableArray(mapSections(sections));
        this.questions = ko.observableArray([]);
        this.notContainSections = ko.computed(() => this.sections().length === 0, this);
    }
};