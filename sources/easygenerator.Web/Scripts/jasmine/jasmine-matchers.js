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

        toBeResolved: function () {
            return toBeResolved.call(this, this.actual);
        },

        toBeResolvedWith: function (value) {
            return toBeResolvedWith.apply(this, [this.actual, value]);
        },

        toBeRejected: function () {
            return toBeRejected.call(this, this.actual);
        },

        toBeRejectedWith: function (reason) {
            return toBeRejectedWith.apply(this, [this.actual, reason]);
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

function toBeResolved(actual) {
    if (this.isNot) {
        throw '[.not] is not supported';
    }

    if (!toBePromise(actual)) {
        throw 'Expected to be promise';
    }

    this.message = function () {
        return "Expected promise to be resolved";
    };

    return actual.inspect().state == "fulfilled";
}

function toBeResolvedWith(actual, value) {
    var isResolved = toBeResolved.call(this, actual);
    if (!isResolved) {
        return false;
    }

    this.message = function () {
        return "Expected promise to be resolved with value '" + JSON.stringify(value) + "', but it was resolved with value '" + actual.inspect().value + "'";
    };

    return actual.inspect().value == value;
}

function toBeRejected(actual) {
    if (this.isNot) {
        throw '[.not] is not supported';
    }

    if (!toBePromise(actual)) {
        throw 'Expected to be promise';
    }

    this.message = function () {
        return "Expected promise to be rejected";
    };

    return actual.inspect().state == "rejected";
}

function toBeRejectedWith(actual, reason) {
    var isRejected = toBeRejected.call(this, actual);
    if (!isRejected) {
        return false;
    }    

    this.message = function () {
        return "Expected promise to be rejected with reason '" + reason + "', but it was rejected with reason '" + actual.inspect().reason + "'";
    };

    return actual.inspect().reason == reason;
}