beforeEach(function () {
    var matchers = {
        toBeSortedAsc: function (sortingField) {
            return toBeSorted(sortingField, this.actual, true);
        },

        toBeSortedDesc: function (sortingField) {
            return toBeSorted(sortingField, this.actual, false);
        },
        
        toBeObservable: function () {
            return toBeObservable(this.actual);
        },
        
        toBeComputed: function () {
            return toBeComputed(this.actual);
        },
        
        toBeFunction: function () {
            return toBeFunction(this.actual);
        },

        toBeObject: function () {
            return toBeObject(this.actual);
        },
        
        toBePromise: function() {
            return toBePromise(this.actual);
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