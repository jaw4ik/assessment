import CourseModel from 'models/course';

class CourseModelMapper{
    map(item, sections, templates) {
        return new CourseModel({
            id: item.Id,
            title: item.Title,
            createdBy: item.CreatedBy,
            createdByName: item.CreatedByName,
            createdOn: new Date(item.CreatedOn),
            modifiedOn: new Date(item.ModifiedOn),
            sections: _.map(item.RelatedSections, function(relatedSection) {
                return _.find(sections, function(section) {
                    return section.id === relatedSection.Id;
                });
            }),
            publishedPackageUrl: item.PublishedPackageUrl,
            isDirty: item.IsDirty,
            isDirtyForSale: item.IsDirtyForSale,
            saleInfo: {
                documentId: item.SaleInfo.DocumentId,
                isProcessing: item.SaleInfo.IsProcessing
            },
            builtOn: _.isNullOrUndefined(item.builtOn) ? null : new Date(item.builtOn),
            packageUrl: item.PackageUrl,
            reviewUrl: item.ReviewUrl,
            template: _.find(templates, function(tItem) {
                return tItem.id === item.Template.Id;
            }),
            introductionContent: item.IntroductionContent,
            courseCompanies: _.map(item.CourseCompanies, function(courseCompany) {
                return {
                    id: courseCompany.Id
                }
            }),
            ownership: item.Ownership
        });
    }
}

export default new CourseModelMapper();