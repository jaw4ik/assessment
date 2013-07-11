define(['durandal/http', 'models/objective', 'configuration/images', 'models/objective', 'models/question', 'models/experience'],
    function (http, objectiveModel, images, ObjectiveModel, QuestionModel, ExperienceModel) {

        var
            objectives = [],
            experiences = [],
            initialize = function () {

                return http.post('api/objectives').then(function (response) {
                    var questions = [];
                    for (var q = 0; q < 100; q++) {
                       questions.push(new QuestionModel({
                                id: q, title: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit' + q,
                                answerOptions: [{ isCorrect: true, text: 'lalala' }, { isCorrect: false, text: 'tololo' }, { isCorrect: true, text: 'One of the major benefits to using CSS for layout is that you can design your Web page and then put the HTML together so that the most important content comes first. This is important for SEO because most search engines weight the content towards the top of the page more than content towards the bottom. Search engines do this because they are not human. They cant just look at a Web page design and pick out the most important part. They are programmed to read HTML, while we look at the results of the HTML.' }],
                                explanations: ['explanation1', 'sms',
                                    'One of the major benefits to using CSS for layout is that you can design your Web page and then put the HTML together so that the most important content comes first. This is important for SEO because most search engines weight the content towards the top of the page more than content towards the bottom. Search engines do this because they are not human. They cant just look at a Web page design and pick out the most important part. They are programmed to read HTML, while we look at the results of the HTML.']
                            }));
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