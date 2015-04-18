﻿define(['viewmodels/reporting/reportingStatement'], function (ReportingStatement) {
    "use strict";

    var ExpandeableStatement = function (lrsStatement, expandLoadAction) {
        ReportingStatement.call(this, lrsStatement);

        this.isExpandeable = !_.isNullOrUndefined(this.lrsStatement.attemptId);
        this.isExpanded = ko.observable(false);
        this.children = ko.observableArray([]);

        this.expandLoadAction = expandLoadAction;
    };

    ExpandeableStatement.prototype.expand = function () {
        var that = this;
        return Q.fcall(function () {
            if (that.isExpandeable) {
                if (that.children().length) {
                    that.isExpanded(true);
                } else {
                    return that.expandLoadAction();
                }
            }
            return undefined;
        });
    }

    ExpandeableStatement.prototype.collapse = function () {
        this.isExpanded(false);
    }

    return ExpandeableStatement;
});