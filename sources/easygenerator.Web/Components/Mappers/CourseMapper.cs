﻿using easygenerator.DomainModel.Entities;
using easygenerator.Web.DomainEvents.ChangeTracking;
using easygenerator.Web.Extensions;
using System.Linq;

namespace easygenerator.Web.Components.Mappers
{
    public class CourseEntityModelMapper : IEntityModelMapper<Course>
    {
        private readonly IUrlHelperWrapper _urlHelper;
        private readonly ICourseStateInfoStorage _courseStateStorage;

        public CourseEntityModelMapper(IUrlHelperWrapper urlHelper, ICourseStateInfoStorage courseStateStorage)
        {
            _urlHelper = urlHelper;
            _courseStateStorage = courseStateStorage;
        }

        public dynamic Map(Course course)
        {
            return new
            {
                Id = course.Id.ToNString(),
                Title = course.Title,
                IntroductionContent = course.IntroductionContent,
                CreatedBy = course.CreatedBy,
                CreatedOn = course.CreatedOn,
                ModifiedOn = course.ModifiedOn,
                Template = new { Id = course.Template.Id.ToNString() },
                PackageUrl = course.PackageUrl,
                PublishedPackageUrl = course.PublicationUrl,
                HasUnpublishedChanges = _courseStateStorage.GetCourseStateInfo(course).HasUnpublishedChanges,
                ReviewUrl = course.PublishedOn != null ? GetCourseReviewUrl(course.Id.ToString()) : null,
                RelatedObjectives = course.RelatedObjectives.Select(obj => new
                {
                    Id = obj.Id.ToNString()
                })
            };
        }

        private string GetCourseReviewUrl(string courseId)
        {
            return _urlHelper.ToAbsoluteUrl(string.Format("~/review/{0}/", courseId));
        }
    }
}