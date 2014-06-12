define([], function () {

    return {
        execute: function () {
            return Q.fcall(function () {
                console.log('add dropsot');
            });
        }
    }

})