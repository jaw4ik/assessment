using System.Collections.Generic;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Extensions;
using WebGrease.Css.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public class CourseEntityModelMapper : IEntityModelMapper<Course>
    {
        private readonly IUrlHelperWrapper _urlHelper;
        private readonly IUserRepository _userRepository;
        private readonly IEntityModelMapper<CourseCollaborator> _collaboratorEntityModelMapper;

        public CourseEntityModelMapper(IUrlHelperWrapper urlHelper, IUserRepository userRepository, IEntityModelMapper<CourseCollaborator> collaboratorEntityModelMapper)
        {
            _urlHelper = urlHelper;
            _userRepository = userRepository;
            _collaboratorEntityModelMapper = collaboratorEntityModelMapper;
        }

        public dynamic Map(Course course)
        {
            return new
            {
                Id = course.Id.ToNString(),
                Title = course.Title,
                IntroductionContent = course.IntroductionContent,
                CreatedBy = course.CreatedBy,
                Collaborators = GetCourseCollaborators(course),
                CreatedOn = course.CreatedOn,
                ModifiedOn = course.ModifiedOn,
                Template = new { Id = course.Template.Id.ToNString() },
                PackageUrl = course.PackageUrl,
                PublishedPackageUrl = course.PublicationUrl,
                ReviewUrl = course.PublishedOn != null ? GetCourseReviewUrl(course.Id.ToString()) : null,
                RelatedObjectives = course.RelatedObjectives.Select(obj => new
                {
                    Id = obj.Id.ToNString()
                })
            };
        }

        private IEnumerable<dynamic> GetCourseCollaborators(Course course)
        {
            var collaborators = new List<object>();
            course.Collaborators.ForEach(e => collaborators.Add(_collaboratorEntityModelMapper.Map(e)));

            var owner = _userRepository.GetUserByEmail(course.CreatedBy);
            if (owner != null)
            {
                collaborators.Add(new
                {
                    Email = owner.Email,
                    FullName = owner.FullName,
                    CreatedOn = course.CreatedOn
                });
            }

            return collaborators;
        }

        private string GetCourseReviewUrl(string courseId)
        {
            return _urlHelper.ToAbsoluteUrl(string.Format("~/review/{0}/", courseId));
        }
    }
}