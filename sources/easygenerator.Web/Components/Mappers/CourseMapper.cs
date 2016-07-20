using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Extensions;
using easygenerator.Web.Storage;
using System.Linq;
using easygenerator.Web.Components.DomainOperations.CourseOperations;

namespace easygenerator.Web.Components.Mappers
{
    public class CourseEntityModelMapper : EntityModelMapper<Course>
    {
        private readonly IUrlHelperWrapper _urlHelper;
        private readonly ICourseStateStorage _courseStateStorage;
        private readonly IUserIdentityProvider _userIdentityProvider;
        private readonly CourseOwnershipProvider _courseOwnershipProvider;
        private readonly IUserRepository _userRepository;

        public CourseEntityModelMapper(IUrlHelperWrapper urlHelper, ICourseStateStorage courseStateStorage, IUserIdentityProvider userIdentityProvider,
            CourseOwnershipProvider courseOwnershipProvider, IUserRepository userRepository)
        {
            _urlHelper = urlHelper;
            _courseStateStorage = courseStateStorage;
            _userIdentityProvider = userIdentityProvider;
            _courseOwnershipProvider = courseOwnershipProvider;
            _userRepository = userRepository;
        }

        public override dynamic Map(Course course)
        {
            var username = _userIdentityProvider.GetCurrentUsername();
            return Map(course, username);
        }

        public override dynamic Map(Course course, string username)
        {
            var createdByUser = _userRepository.GetUserByEmail(course.CreatedBy);

            return new
            {
                Id = course.Id.ToNString(),
                Title = course.Title,
                IntroductionContent = course.IntroductionContent,
                CreatedBy = course.CreatedBy,
                CreatedByName = createdByUser?.FullName,
                CreatedOn = course.CreatedOn,
                ModifiedOn = course.ModifiedOn,
                Template = new { Id = course.Template.Id.ToNString() },
                PackageUrl = course.PackageUrl,
                PublishedPackageUrl = _urlHelper.AddCurrentSchemeToUrl(course.PublicationUrl),
                IsDirty = _courseStateStorage.IsDirty(course),
                IsDirtyForSale = _courseStateStorage.IsDirtyForSale(course),
                SaleInfo = new { course.SaleInfo.DocumentId, course.SaleInfo.IsProcessing },
                ReviewUrl = course.PublishedOn != null ? GetCourseReviewUrl(course.Id.ToString()) : null,
                RelatedSections = course.RelatedSections.Select(obj => new
                {
                    Id = obj.Id.ToNString()
                }),
                CourseCompanies = course.Companies.Select(obj => new
                {
                    Id = obj.Id.ToNString()
                }),
                Ownership = _courseOwnershipProvider.GetCourseOwnership(course, username)
            };
        }

        private string GetCourseReviewUrl(string courseId)
        {
            return _urlHelper.ToAbsoluteUrl(string.Format("~/review/{0}/", courseId));
        }
    }
}