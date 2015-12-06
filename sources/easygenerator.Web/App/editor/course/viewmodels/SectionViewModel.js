import ko from 'knockout';
import moment from 'moment';
import imageUpload from 'imageUpload';
import notify from 'notify';
import _ from 'underscore';
import QuestionViewModel from './QuestionViewModel';
import sectionRepository from 'repositories/objectiveRepository';
import updateSectionTitleCommand from '../commands/updateSectionTitleCommand';

var mapQuestions = (sectionId, questions) => _.map(questions, question => new QuestionViewModel(sectionId, question, false));

var updateModifiedOn = modifiedOn => moment(modifiedOn).format('DD/MM/YY');

var maxLength = 255;

export default class SectionViewModel{
    constructor (courseId, section, isProcessed) {
        this.courseId = courseId;
        this.id = ko.observable(section.id || '');
        this.title = ko.observable(section.title || '');
        this.title.isEditing = ko.observable(false);
        this.title.isValid = ko.computed(() => this.title().length <= maxLength, this);
        this.originalTitle = this.title();
        this.modifiedOn = ko.observable(section.modifiedOn ? updateModifiedOn(section.modifiedOn) : '');
        this.image = ko.observable(section.image || '');
        this.imageLoading = ko.observable(false);
        this.menuExpanded = ko.observable(false);
        this.questionsExpanded = ko.observable(!isProcessed);
        this.questions = ko.observableArray(mapQuestions(this.id(), section.questions));
        this.notContainQuestions = ko.computed(() => this.questions().length === 0, this);
        this.isProcessed = ko.observable(isProcessed);
    }
    startEditingTitle() {
        this.title.isEditing(true);
    }
    async stopEditingTitle() {
        this.title.isEditing(false);
        if (this.title.isValid() && this.title() !== this.originalTitle) {
            await updateSectionTitleCommand.execute(this.id(), this.title());
            this.originalTitle = this.title();
            notify.saved();
        } else {
            this.title(this.originalTitle);
        }
    }
    updateFields(section) {
        this.id(section.id);
        this.title(section.title);
        this.originalTitle = this.title();
        this.modifiedOn(updateModifiedOn(section.modifiedOn));
        this.image(section.image);
        this.questions(mapQuestions(this.id(), section.questions));
        this.questionsExpanded(true);
        this.isProcessed(false);
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
        if (!_.isObject(question)) {
            notify.error();
            return undefined;
        }

        let questionViewModel = null;

        if (_.isEmpty(question)) {
            questionViewModel = new QuestionViewModel(this.id(), question, true);
        } else if (question instanceof QuestionViewModel) {
            question.sectionId = this.id();
            questionViewModel = question;
        } else {
            questionViewModel = new QuestionViewModel(this.id(), question);
        }

        if (_.isNumber(index)) {
            this.questions.splice(index, 0, questionViewModel);
        } else {
            this.questions.push(questionViewModel);
        }

        return questionViewModel;
    }
    updateQuestion () {
        
    }
}