define(['durandal/http', 'models/objective', 'configuration/images', 'models/objective', 'models/question', 'models/experience'],
    function (http, objectiveModel, images, ObjectiveModel, QuestionModel, ExperienceModel) {

        var
            objectives = [],
            experiences = [],
            initialize = function () {

                return http.post('api/objectives').then(function (response) {
                    var questions = [];
                    for (var q = 0; q < 100; q++) {
                        questions.push(new QuestionModel({ id: q, title: 'Ļồяệო Ĭρśụм ĭŝ śîмρļỹ ďủოмỷ ť℮χť ǒƒ ťһё ряіŉťìאָġ ầňđ ţỵрềš℮ťťíņğ іאַđủšťŗỷ. Ľōřệм Ĩρŝựм ĥẫş βêệŋ ťҺệ ǐŋďứśţřỳ\'ş ŝŧäŉďâяđ ďűოოγ ťęхť εϋĕŕ şïńċẹ ťĥẹ 1500ŝ,шħëņ ǻאּ ựאַκńợẅŋ ρříאָŧёя ţồọҝ â ġâļł℮ÿ ợƒ ţýρē äńđ śçŗắмьłėď įţ ťō ოẩķē ẩ ťỹрẹ šрểćîмėň ьọόҝ.' + q }));
                    }
                    for (var j = 0; j < images.length; j++)
                        experiences.push(new ExperienceModel({
                            id: j,
                            title: 'Experience #' + (j + 1),
                            objectives: []
                        }));
                    _.each(response, function (item) {
                        objectives.push(new ObjectiveModel({ id: item.id, title: item.title, image: item.image, questions: questions }));
                    });
                });

            };
        return {
            initialize: initialize,
            objectives: objectives,
            experiences: experiences
        };
    });