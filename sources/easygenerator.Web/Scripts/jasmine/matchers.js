jasmine.getEnv().beforeEach(function () {
    jasmine.addMatchers(getCustomMatchers());
});

function getCustomMatchers() {

    return {
        toBeFunction: toBeFunction,
        toBeObject: toBeObject,
        toBeNumber: toBeNumber,
        toBePromise: toBePromise,
        toBeRejected: toBeRejected,
        toBeRejectedWith: toBeRejectedWith,
        toBeResolved: toBeResolved,
        toBeResolvedWith: toBeResolvedWith,
        toBeSortedAsc: toBeSortedAsc,
        toBeSortedDesc: toBeSortedDesc,
        toBeObservable: toBeObservable,
        toBeObservableArray: toBeObservableArray,
        toBeComputed: toBeComputed,
        toBeArray: toBeArray,
        toBeString: toBeString,
        toBeInstanceOf: toBeInstanceOf
    };
}


function toBeFunction(util, customEqualityTesters) {
    return {
        compare: function (actual) {
            var result = {};
            result.pass = util.equals(actual, jasmine.any(Function), customEqualityTesters);

            if (result.pass) {
                result.message = "Ok";
            } else {
                result.message = "Expected to be function";
            }
            return result;
        }
    };
}

function toBeObject(util, customEqualityTesters) {
    return {
        compare: function (actual) {
            var result = {};
            result.pass = util.equals(actual, jasmine.any(Object), customEqualityTesters);

            if (result.pass) {
                result.message = "Ok";
            } else {
                result.message = "Expected to be object";
            }
            return result;
        }
    };
}

function toBeNumber(util, customEqualityTesters) {
    return {
        compare: function (actual) {
            var result = {};
            result.pass = util.equals(actual, jasmine.any(Number), customEqualityTesters);

            if (result.pass) {
                result.message = "Ok";
            } else {
                result.message = "Expected to be object";
            }
            return result;
        }
    };
}

function toBePromise(util, customEqualityTesters) {
    return {
        compare: function (actual) {
            var result = {};
            result.pass = toBeObject(util, customEqualityTesters).compare(actual) && actual.then !== undefined && toBeFunction(util, customEqualityTesters).compare(actual.then);

            if (result.pass) {
                result.message = "Ok";
            } else {
                result.message = "Expected to be promise";
            }
            return result;
        }
    };
}

function toBeRejected(util, customEqualityTesters) {
    return {
        compare: function (actual) {

            if (!toBePromise(util, customEqualityTesters).compare(actual)) {
                throw 'Expected to be promise';
            }

            var result = {};
            result.pass = util.equals(actual.inspect().state, "rejected", customEqualityTesters);

            if (result.pass) {
                result.message = "Ok";
            } else {
                result.message = "Expected promise to be rejected";
            }
            return result;
        }
    };
}

function toBeRejectedWith(util, customEqualityTesters) {
    return {
        compare: function (actual, reason) {

            if (!toBePromise(util, customEqualityTesters).compare(actual)) {
                throw 'Expected to be promise';
            }

            var result = {};
            result.pass = toBeRejected(util, customEqualityTesters).compare(actual) && util.equals(actual.inspect().reason, reason, customEqualityTesters);

            if (result.pass) {
                result.message = "Ok";
            } else {
                result.message = "Expected promise to be rejected with reason '" + reason + "', but it was rejected with reason '" + actual.inspect().reason + "'";
            }
            return result;
        }
    };
}

function toBeResolved(util, customEqualityTesters) {
    return {
        compare: function (actual) {

            if (!toBePromise(util, customEqualityTesters).compare(actual)) {
                throw 'Expected to be promise';
            }

            var result = {};
            result.pass = util.equals(actual.inspect().state, "fulfilled", customEqualityTesters);

            if (result.pass) {
                result.message = "Ok";
            } else {
                result.message = "Expected promise to be resolved";
            }
            return result;
        }
    };
}

function toBeResolvedWith(util, customEqualityTesters) {
    return {
        compare: function (actual, value) {

            var valueJson = JSON.stringify(value);
            var actualJson = JSON.stringify(actual.inspect().value);

            if (!toBePromise(util, customEqualityTesters).compare(actual)) {
                throw 'Expected to be promise';
            }

            var result = {};
            result.pass = toBeResolved(util, customEqualityTesters).compare(actual) && util.equals(actualJson, valueJson, customEqualityTesters);

            if (result.pass) {
                result.message = "Ok";
            } else {
                result.message = "Expected promise to be resolved with value '" + valueJson + "', but it was resolved with value '" + actualJson + "'";
            }
            return result;
        }
    };
}

function toBeSorted(util, customEqualityTesters) {
    return {
        compare: function (sortingField, actual, asc) {

            if (_.isEmpty(sortingField)) {
                throw 'You should specify sorting field';
            }

            var result = {};
            result.pass = true;

            var arr = actual;
            for (var i = 0, length = arr.length; i < length - 1; i++) {
                var value1 = ko.unwrap(arr[i][sortingField]);
                var value2 = ko.unwrap(arr[i + 1][sortingField]);

                if (_.isString(value1)) {
                    value1 = value1.toLowerCase();
                }

                if (_.isString(value2)) {
                    value2 = value2.toLowerCase();
                }

                if (asc) {
                    if (value1 > value2) {
                        result.pass = false;
                    }
                } else {
                    if (value1 < value2) {
                        result.pass = false;
                    }
                }
            }

            if (result.pass) {
                result.message = "Ok";
            } else {
                if (asc) {
                    result.message = "Expected " + JSON.stringify(this.actual) + " to be sorted ascending by '" + sortingField + "'";
                } else {
                    result.message = "Expected " + JSON.stringify(this.actual) + " to be sorted descending by '" + sortingField + "'";
                }
            }
            return result;
        }
    };
}

function toBeSortedAsc(util, customEqualityTesters) {
    return {
        compare: function (actual, sortingField) {
            return toBeSorted(util, customEqualityTesters).compare(actual, sortingField, true);
        }
    };
}

function toBeSortedDesc(util, customEqualityTesters) {
    return {
        compare: function (actual, sortingField) {
            return toBeSorted(util, customEqualityTesters).compare(actual, sortingField, false);
        }
    };
}

function toBeObservable(util, customEqualityTesters) {
    return {
        compare: function (actual) {

            var result = {};
            result.pass = ko.isObservable(actual);

            if (result.pass) {
                result.message = "Ok";
            } else {
                result.message = "Expected to be observable";
            }
            return result;
        }
    };
}

function toBeObservableArray(util, customEqualityTesters) {
    return {
        compare: function (actual) {

            var result = {};
            result.pass = ko.isObservable(actual) && util.equals(ko.unwrap(actual), jasmine.any(Array), customEqualityTesters);

            if (result.pass) {
                result.message = "Ok";
            } else {
                result.message = "Expected to be observable array";
            }
            return result;
        }
    };
}

function toBeComputed(util, customEqualityTesters) {
    return {
        compare: function (actual) {

            var result = {};
            result.pass = ko.isComputed(actual);

            if (result.pass) {
                result.message = "Ok";
            } else {
                result.message = "Expected to be computed";
            }
            return result;
        }
    };
}

function toBeArray(util, customEqualityTesters) {
    return {
        compare: function (actual, length) {

            var hasLengthRestriction = length != undefined && _.isNumber(length);

            var result = {};

            if (hasLengthRestriction) {
                result.pass = util.equals(ko.unwrap(actual), jasmine.any(Array), customEqualityTesters) && actual.length === length;
            } else {
                result.pass = util.equals(ko.unwrap(actual), jasmine.any(Array), customEqualityTesters);
            }

            if (result.pass) {
                result.message = "Ok";
            } else {
                if (hasLengthRestriction) {
                    result.message = "Expected to be an Array of length " + length;
                } else {
                    result.message = "Expected to be an Array";
                }
            }

            return result;
        }
    };
}

function toBeString(util, customEqualityTesters) {
    return {
        compare: function (actual) {

            var result = {};
            result.pass = util.equals(ko.unwrap(actual), jasmine.any(String), customEqualityTesters);

            if (result.pass) {
                result.message = "Ok";
            } else {
                result.message = "Expected to be string";
            }
            return result;
        }
    };
}

function toBeInstanceOf(util, customEqualityTesters) {
    return {
        compare: function (actual, value) {

            var result = {
                pass: false
            };

            if (_.isNullOrUndefined(actual)) {
                result.message = "Expected to be defined";
            } else if (!(actual instanceof value)) {
                result.message = "Expected to be instance of specified type";
            } else {
                result.message = "Ok";
                result.pass = true;
            }

            return result;
        }
    };
}