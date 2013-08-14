beforeEach(function () {
    var matchers = {
        toBeSortedAsc: function (sortingField) {
            return toBeSorted.apply(this, [sortingField, this.actual, true]);
        },

        toBeSortedDesc: function (sortingField) {
            return toBeSorted.apply(this, [sortingField, this.actual, false]);
        },

        toBeObservable: function () {
            return toBeObservable.call(this, this.actual);
        },

        toBeComputed: function () {
            return toBeComputed.call(this, this.actual);
        },

        toBeFunction: function () {
            return toBeFunction.call(this, this.actual);
        },

        toBeObject: function () {
            return toBeObject.call(this, this.actual);
        },

        toBePromise: function () {
            return toBePromise.call(this, this.actual);
        },

        toBeResolved: function (value) {
            return toBeResolved.apply(this, [this.actual, value]);
        },

        toBeRejected: function (reason) {
            return toBeRejected.apply(this, [this.actual, reason]);
        }

    };

    this.addMatchers(matchers);
});

function toBeSorted(sortingField, actual, asc) {
    if (this.isNot) {
        throw '[.not] is not supported';
    }

    if (_.isEmpty(sortingField)) {
        throw 'You should specify sorting field';
    }

    this.message = function () {
        if (asc)
            return "Expected " + JSON.stringify(this.actual) + " to be sorted ascending by '" + sortingField + "'";

        return "Expected " + JSON.stringify(this.actual) + " to be sorted descending by '" + sortingField + "'";
    };

    var arr = actual;
    for (var i = 0, len = arr.length; i < len - 1; i++) {
        var value1 = ko.unwrap(arr[i][sortingField]);
        var value2 = ko.unwrap(arr[i + 1][sortingField]);

        if (asc) {
            if (value1.toLowerCase() > value2.toLowerCase()) return false;
        } else if (value1.toLowerCase() < value2.toLowerCase()) return false;
    }

    return true;
}

function toBeObservable(actual) {
    if (this.isNot) {
        throw '[.not] is not supported';
    }

    this.message = function () {
        return "Expected to be observable";
    };

    return ko.isObservable(actual);
}

function toBeComputed(actual) {
    if (this.isNot) {
        throw '[.not] is not supported';
    }

    this.message = function () {
        return "Expected to be computed";
    };

    return ko.isComputed(actual);
}

function toBeFunction(actual) {
    if (this.isNot) {
        throw '[.not] is not supported';
    }

    this.message = function () {
        return "Expected to be function";
    };

    return jasmine.getEnv().equals_(actual, jasmine.any(Function));
}

function toBeObject(actual) {
    if (this.isNot) {
        throw '[.not] is not supported';
    }

    this.message = function () {
        return "Expected to be object";
    };

    return jasmine.getEnv().equals_(actual, jasmine.any(Object));
}

function toBePromise(actual) {
    if (this.isNot) {
        throw '[.not] is not supported';
    }

    this.message = function () {
        return "Expected to be promise";
    };

    return toBeObject(actual) && actual.then !== undefined && toBeFunction(actual.then);
}

function toBeResolved(actual, value) {
    if (this.isNot) {
        throw '[.not] is not supported';
    }

    if (!toBePromise(actual)) {
        throw 'Expected to be promise';
    }

    this.message = function () {
        return "Expected promise to be resolved";
    };

    var isResolved = actual.inspect().state == "fulfilled";

    if (typeof value != "undefined") {
        this.message = function () {
            return "Expected promise to be resolved with value '" + JSON.stringify(value) + "'";
        };
        return isResolved && actual.inspect().value == value;
    };

    return isResolved;
}

function toBeRejected(actual, reason) {
    if (this.isNot) {
        throw '[.not] is not supported';
    }

    if (!toBePromise(actual)) {
        throw 'Expected to be promise';
    }

    this.message = function () {
        return "Expected promise to be rejected";
    };

    var isRejected = actual.inspect().state == "rejected";

    if (typeof reason != "undefined") {
        this.message = function () {
            return "Expected promise to be rejected with reason '" + reason + "'";
        };
        return isRejected && actual.inspect().reason == reason;
    };

    return isRejected;
}