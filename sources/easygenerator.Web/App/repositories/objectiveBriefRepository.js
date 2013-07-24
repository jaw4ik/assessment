define([], function () {

    var self = {};

    self.dataSet = [];
    self.isDataSetReady = false;

    self.invalidate = function () {
        self.isDataSetReady = false;
    };

    self.getCollection = function () {
        var deferred = Q.defer();

        if (self.isDataSetReady) {
            deferred.resolve(self.dataSet);
        } else {
            $.ajax({
                url: 'data.js?v=' + Math.random(),
                contentType: 'application/json',
                dataType: 'json'
            }).done(function (response) {
                self.dataSet = _.map(response.objectives, function (objective) {
                    return { id: objective.id, title: objective.title, image: objective.image, questionsCount: objective.questions.length };
                });
                self.isDataSetReady = true;
                deferred.resolve(self.dataSet);
            });
        }
        return deferred.promise;
    };

    return {
        invalidate: self.invalidate,
        getCollection: self.getCollection
    };
}
);