define(['models/course', 'mappers/collaboratorModelMapper'],
    function (CourseModel, collaboratorModelMapper) {
        "use strict";

        var
            map = function (item, objectives, templates) {
                return new CourseModel({
                    id: item.Id.split('-').join(''),
                    title: item.Title,
                    createdBy: item.CreatedBy,
                    collaborators: _.map(item.Collaborators, function (collaborator) {
                        return collaboratorModelMapper.map(collaborator);
                    }),
                    createdOn: new Date(item.CreatedOn),
                    modifiedOn: new Date(item.ModifiedOn),
                    objectives: _.map(item.RelatedObjectives, function (relatedObjective) {
                        return _.find(objectives, function (objective) {
                            return objective.id == relatedObjective.Id.split('-').join('');
                        });
                    }),
                    publishedPackageUrl: item.PublishedPackageUrl,
                    builtOn: _.isNullOrUndefined(item.builtOn) ? null : new Date(item.builtOn),
                    packageUrl: item.PackageUrl,
                    reviewUrl: item.ReviewUrl,
                    template: _.find(templates, function (tItem) {
                        return tItem.id === item.Template.Id;
                    }),
                    introductionContent: item.IntroductionContent
                });
            };

        return {
            map: map
        };
    });