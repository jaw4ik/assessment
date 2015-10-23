define(['constants', 'reporting/viewmodels/expandableStatement', 'reporting/xApiProvider'], function (constants, ExpandableStatement, xApiProvider) {
    "use strict";

    var StartedStatement = function (startedLrsStatement) {
        ExpandableStatement.call(this, startedLrsStatement, this.expandLoadAction);
        this.learnerDisplayName = this.lrsStatement.actor.name + ' (' + this.lrsStatement.actor.email + ')';
        this.started = true;
        this.passed = false;
        this.isExpandable = false;
        this.isExpanded = null;
        this.children = null;
    }

    return StartedStatement;
});