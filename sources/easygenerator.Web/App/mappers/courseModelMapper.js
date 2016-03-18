define(['models/course'],
    function (CourseModel) {
        "use strict";

        var
            map = function (item, sections, templates) {
                return new CourseModel({
                    id: item.Id,
                    title: item.Title,
                    createdBy: item.CreatedBy,
                    createdOn: new Date(item.CreatedOn),
                    modifiedOn: new Date(item.ModifiedOn),
                    sections: _.map(item.RelatedSections, function (relatedSection) {
                        return _.find(sections, function (section) {
                            return section.id == relatedSection.Id;
                        });
                    }),
                    publishedPackageUrl: item.PublishedPackageUrl,
                    isDirty: item.IsDirty,
                    builtOn: _.isNullOrUndefined(item.builtOn) ? null : new Date(item.builtOn),
                    packageUrl: item.PackageUrl,
                    reviewUrl: item.ReviewUrl,
                    template: _.find(templates, function (tItem) {
                        return tItem.id === item.Template.Id;
                    }),
                    introductionContent: item.IntroductionContent,
                    courseCompanies: _.map(item.CourseCompanies, function(courseCompany) {
                        return {
                            id: courseCompany.Id
                        }
                    })
                });
            };

        return {
            map: map
        };
    });