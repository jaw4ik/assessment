import ko from 'knockout';
import moment from 'moment';
import imageUpload from 'imageUpload';
import notify from 'notify';
import _ from 'underscore';
import QuestionViewModel from './QuestionViewModel';
import sectionRepository from 'repositories/objectiveRepository';

var mapQuestions = (sectionId, questions) => _.map(questions, question => new QuestionViewModel(sectionId, question, false));

var updateModifiedOn = modifiedOn => moment(modifiedOn).format('DD/MM/YY');

export default class SectionViewModel{
    constructor (courseId, section, isProcessed) {
        this.courseId = courseId;
        this.id = ko.observable(section.id || '');
        this.title = ko.observable(section.title || '');
        this.modifiedOn = ko.observable(section.modifiedOn ? updateModifiedOn(section.modifiedOn) : '');
        this.image = ko.observable(section.image || '');
        this.imageLoading = ko.observable(false);
        this.menuExpanded = ko.observable(false);
        this.questionsExpanded = ko.observable(!isProcessed);
        this.questions = ko.observableArray(mapQuestions(this.id(), section.questions));
        this.notContainQuestions = ko.computed(() => this.questions().length === 0, this);
    }
    toggleMenu() {
        this.menuExpanded(!this.menuExpanded());
    }
    toggleQuestions() {
        this.questionsExpanded(!this.questionsExpanded());
    }
    updateImage() {
        let that = this;
        imageUpload.upload({
            startLoading: () => that.imageLoading(true),
            success: async url => {
                let result = await sectionRepository.updateImage(that.id(), url);
                that.image(result.imageUrl);
                that.modifiedOn(updateModifiedOn(result.modifiedOn));
                that.imageLoading(false);
                notify.saved();
            },
            error: () => that.imageLoading(false)
        });
    }
    deleteQuestion(question) {
        if (_.contains(this.questions(), question)) {
            this.questions.remove(question);
        } else {
            notify.error();
        }
    }
    addQuestion(question, index) {
        if (_.isObject(question)) {
            notify.error();
            return;
        }
        let questionViewModel = null;

        if (question instanceof QuestionViewModel) {
            questionViewModel = question;
        } else {
            questionViewModel = new QuestionViewModel(this.id(), question);
        }


        if (_.isNumber(index)) {
            this.questions.splice(index, 0, questionViewModel);
        } else {
            this.questions.push(questionViewModel);
        }
    }
}