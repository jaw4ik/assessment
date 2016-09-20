import CourseModel from 'models/course';

class CourseModelMapper {
    map(item, sections, templates) {
        return new CourseModel({
            id: item.Id,
            title: item.Title,
            createdBy: item.CreatedBy,
            createdByName: item.CreatedByName,
            createdOn: new Date(item.CreatedOn),
            modifiedOn: new Date(item.ModifiedOn),
            sections: _.map(item.RelatedSections, relatedSection => _.find(sections, section => section.id === relatedSection.Id)),
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
            template: _.find(templates, template => template.id === item.Template.Id),
            introductionContent: item.IntroductionContent,
            courseCompanies: _.map(item.CourseCompanies, courseCompany => ({ id: courseCompany.Id })),
            ownership: item.Ownership,
            publicationAccessControlList: _.map(item.PublicationAccessControlList, accessControlListEntry => ({
                userIdentity: accessControlListEntry.UserIdentity,
                userInvited: accessControlListEntry.UserInvited
            }))
        });
    }
}

export default new CourseModelMapper();