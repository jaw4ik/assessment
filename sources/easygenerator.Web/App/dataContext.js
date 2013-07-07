define(['models/objective', 'configuration/images', 'models/objective', 'models/question', 'models/experience'],
    function (objectiveModel, images, ObjectiveModel, QuestionModel, ExperienceModel) {

        var
            objectives = [],
            experiences = [],
            initialize = function () {
                return Q.fcall(function () {
                    for (var i = 0; i < images.length; i++) {
                        objectives.push(new ObjectiveModel({
                            id: i,
                            title: 'Objective #' + i,
                            image: images[i],
                            questions: [
                                new QuestionModel({ id: 0, title: 'Ļồяệო Ĭρśụм ĭŝ śîмρļỹ ďủოмỷ ť℮χť' }),
                                new QuestionModel({ id: 1, title: 'ǒƒ ťһё ряіŉťìאָġ ầňđ ţỵрềš℮ťťíņğ іאַđủšťŗỷ.' }),
                                new QuestionModel({ id: 2, title: 'Ľōřệм Ĩρŝựм ĥẫş βêệŋ ťҺệ ǐŋďứśţřỳ\'ş ŝŧäŉďâяđ ďűოოγ ťęхť' }),
                                new QuestionModel({ id: 3, title: 'εϋĕŕ şïńċẹ ťĥẹ 1500ŝ,' }),
                                new QuestionModel({ id: 4, title: 'шħëņ ǻאּ ựאַκńợẅŋ ρříאָŧёя ţồọҝ â ġâļł℮ÿ ợƒ ţýρē äńđ śçŗắмьłėď įţ ťō ოẩķē ẩ ťỹрẹ šрểćîмėň ьọόҝ.' })
                            ]
                        }));
                    }

                    for (var j = 0; j < images.length; j++)
                        experiences.push(new ExperienceModel({
                            id: j,
                            title: 'Experience #' + (j + 1),
                            objectives: []
                        }));
                });
            };

        return {
            initialize: initialize,
            objectives: objectives,
            experiences: experiences
        };
    });