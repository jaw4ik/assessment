define(['guard', 'models/reporting/actor'], function (guard, Actor) {
    'use strict';

    var survey = 'http://easygenerator/expapi/question/survey',
        questionType = 'http://easygenerator/expapi/question/type';

    var Statement = function (spec) {
        guard.throwIfNotAnObject(spec, 'You should provide specification for reporting statement');

        this.name = spec.object.definition.name['en-US'];
        this.date = new Date(spec.timestamp);
        this.actor = new Actor(spec.actor);
        
        if (spec.result && spec.result.score && _.isNumber(spec.result.score.scaled)) {
            this.score = Math.round(spec.result.score.scaled * 100);
        } else {
            this.score = null;
        }

        if (spec.result && spec.result.response) {
            this.response = spec.result.response;
        } else {
            this.response = null;
        }

        if (spec.object && spec.object.definition) {
            this.definition = spec.object.definition;
        }

        this.verb = spec.verb.id;

        this.id = spec.object.id;

        if (spec.context) {
            this.attemptId = spec.context.registration;
            if (spec.context.contextActivities && spec.context.contextActivities.parent) {
                this.parentId = spec.context.contextActivities.parent[0].id;
            }
            if (spec.context.extensions) {
                if (spec.context.extensions.hasOwnProperty(survey)) {
                    this.isSurvey = spec.context.extensions[survey];
                }
                if (spec.context.extensions.hasOwnProperty(questionType)) {
                    this.questionType = spec.context.extensions[questionType];
                }
            }
        }

        if (!!this.isSurvey) {
            this.score = null;
        }
    };
    return Statement;
});