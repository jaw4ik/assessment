define([], function () {

    var
        createString = function (length) {
            return new Array(length + 1).join("*");
        },
        
        getDateFromString = function (str) {
            return new Date(parseInt(str.substr(6), 10));
        };

    return {
        createString: createString,
        getDateFromString: getDateFromString
    };
});