define(['reporting/viewmodels/expandableStatement'], function (ExpandableStatement) {
    "use strict";

    var StartedStatement = function (startedLrsStatement) {
        ExpandableStatement.call(this, startedLrsStatement, null);
        this.learnerDisplayName = this.lrsStatement.actor.name + ' (' + this.lrsStatement.actor.email + ')';
        this.isExpandable = false;
        this.isExpanded = null;
        this.children = null;
    }

    return StartedStatement;
});