define([], function () {

    return function Command(func) {
        this.execute = func;
    };

});