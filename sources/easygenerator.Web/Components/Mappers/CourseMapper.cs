using System.Collections.Generic;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Extensions;
using WebGrease.Css.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public class CourseMapper : IEntityMapper<Course>
    {
        private readonly IUrlHelperWrapper _urlHelper;
        private readonly IUserRepository _userRepository;
        private readonly IEntityMapper<CourseCollaborator> _collaboratorMapper;

        public CourseMapper(IUrlHelperWrapper urlHelper, IUserRepository userRepository, IEntityMapper<CourseCollaborator> collaboratorMapper)
        {
            _urlHelper = urlHelper;
            _userRepository = userRepository;
            _collaboratorMapper = collaboratorMapper;
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
            course.Collaborators.ForEach(e => collaborators.Add(_collaboratorMapper.Map(e)));

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