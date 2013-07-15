function Test() {
    var
        dataContext = require('dataContext'),
        images = require('configuration/images'),
        ObjectiveModel = require('models/objective'),
        PubModel = require('models/experience'),
        QuestionModel = require('models/question');

    var findObjectiveByTitle = function (title) {
        for (var i = 0; i < dataContext.objectives.length; i++) {
            var item = dataContext.objectives[i];
            if (item.title === title)
                return item;
        }
    };

    var findQuestionByTitle = function (objective, title) {
        for (var i = 0; i < objective.questions.length; i++) {
            var item = objective.questions[i];
            if (item.title === title)
                return item;
        }
    };

    this.AddNewObjective = function (newId, newTitle) {
        dataContext.objectives.push(
            new ObjectiveModel({
                id: newId,
                title: newTitle,
                image: images[0],
                questions: []
            })
        );
    };
    this.AddQuestionsToObjective = function (objTitle, questId, questTitle) {
        var obj = findObjectiveByTitle(objTitle);
        obj.questions.push(new QuestionModel({ id: questId, title: questTitle }));
    };

    this.AddAnswerOptionsToQuestion = function (objTitle, questionTitle, answerText, isCorrect) {
        var obj = findObjectiveByTitle(objTitle);
        var quest = findQuestionByTitle(obj, questionTitle);
        quest.answerOptions.push({ text: answerText, isCorrect: isCorrect });

    };

    this.AddExplanationsToQuestion = function (objTitle, questionTitle, explanation) {
        var obj = findObjectiveByTitle(objTitle);
        var quest = findQuestionByTitle(obj, questionTitle);
        quest.explanations.push(explanation);

    };

    this.AddNewPublication = function (newId, newTitle) {
        dataContext.experiences.push(
            new PubModel({
                id: newId,
                title: newTitle,
                objectives: []
            })
        );
    };

    this.EmptyExplanationsOfQuestion = function (objTitle, questionTitle) {
        var obj = findObjectiveByTitle(objTitle);
        var quest = findQuestionByTitle(obj, questionTitle);
        quest.explanations = [];
    };

    this.EmptyAnswerOptionsOfQuestion = function (objTitle, questionTitle) {
        var obj = findObjectiveByTitle(objTitle);
        var quest = findQuestionByTitle(obj, questionTitle);
        quest.answerOptions = [];
    };

    this.EmptyQuestionsOfObjective = function (objTitle) {
        var obj = findObjectiveByTitle(objTitle);
        obj.questions = [];
    };
    this.EmptyObjectivesList = function () {
        dataContext.objectives = [];
    };
    this.EmptyPublicationsList = function () {
        dataContext.experiences = [];
    };
    this.RebuildObjectivesListView = function () {
        require('viewmodels/objectives/objectives').activate();
    };
};
var test = new Test();