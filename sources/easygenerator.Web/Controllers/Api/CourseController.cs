﻿using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.BuildCourse.Scorm;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Extensions;
using easygenerator.Web.Publish;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
    public class CourseController : DefaultController
    {
        private readonly ICourseBuilder _builder;
        private readonly IEntityFactory _entityFactory;
        private readonly ICourseRepository _repository;
        private readonly IUrlHelperWrapper _urlHelper;
        private readonly IScormCourseBuilder _scormCourseBuilder;
        private readonly ICoursePublisher _coursePublisher;
        private readonly IUserRepository _userRepository;

        public CourseController(ICourseBuilder courseBuilder, IScormCourseBuilder scormCourseBuilder, ICourseRepository repository, IEntityFactory entityFactory,
            IUrlHelperWrapper urlHelper, ICoursePublisher coursePublisher, IUserRepository userRepository)
        {
            _builder = courseBuilder;
            _repository = repository;
            _entityFactory = entityFactory;
            _urlHelper = urlHelper;
            _scormCourseBuilder = scormCourseBuilder;
            _coursePublisher = coursePublisher;
            _userRepository = userRepository;
        }

        [HttpPost]
        [LimitCoursesAmount]
        public ActionResult Create(string title, Template template)
        {
            var course = _entityFactory.Course(title, template, GetCurrentUsername());

            _repository.Add(course);

            return JsonSuccess(new
            {
                Id = course.Id.ToNString(),
                CreatedOn = course.CreatedOn
            });
        }

        [HttpPost]
        public ActionResult Delete(Course course)
        {
            if (course != null)
            {
                _repository.Remove(course);
            }

            return JsonSuccess();
        }

        private ActionResult DoPublishAction(Course course, Func<bool> publishAction, Func<ActionResult> getSuccessResultAction)
        {
            if (course == null)
            {
                return JsonLocalizableError(Errors.CourseNotFoundError, Errors.CourseNotFoundResourceKey);
            }

            var result = publishAction();

            if (!result)
            {
                return JsonLocalizableError(Errors.CoursePublishActionFailedError, Errors.CoursePublishActionFailedResourceKey);
            }

            return getSuccessResultAction();
        }

        [HttpPost]
        public ActionResult Build(Course course)
        {
            return DoPublishAction(course, () => _builder.Build(course), () => JsonSuccess(new { PackageUrl = course.PackageUrl, BuildOn = course.BuildOn }));
        }

        [HttpPost, StarterAccess(ErrorMessageResourceKey = Errors.UpgradeToStarterPlanToUseScormResourceKey)]
        public ActionResult ScormBuild(Course course)
        {
            return DoPublishAction(course, () => _scormCourseBuilder.Build(course), () => JsonSuccess(new { ScormPackageUrl = course.ScormPackageUrl }));
        }

        [HttpPost]
        [Route("course/publish")]
        public ActionResult Publish(Course course)
        {
            return DoPublishAction(course, () => _coursePublisher.Publish(course), () => JsonSuccess(new { PublishedPackageUrl = course.PublicationUrl }));
        }

        [HttpPost]
        [Route("course/publishForReview")]
        public ActionResult PublishForReview(Course course)
        {
            return DoPublishAction(course, () => _coursePublisher.Publish(course), () => JsonSuccess(new { ReviewUrl = GetCourseReviewUrl(course.Id.ToString()) }));
        }

        [HttpPost]
        public ActionResult GetCollection()
        {
            var courses = _repository.GetCollection(course => course.IsPermittedTo(User.Identity.Name));

            var result = courses.Select(course => new
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
            });

            return JsonSuccess(result);
        }

        [HttpPost]
        [Route("api/courseExists")]
        public ActionResult CourseExists(Course course)
        {
            return JsonSuccess(course != null);
        }

        [HttpPost]
        public ActionResult UpdateTitle(Course course, string courseTitle)
        {
            if (course == null)
            {
                return JsonLocalizableError(Errors.CourseNotFoundError, Errors.CourseNotFoundResourceKey);
            }

            course.UpdateTitle(courseTitle, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = course.ModifiedOn });
        }

        [HttpPost]
        public ActionResult UpdateTemplate(Course course, Template template)
        {
            if (course == null)
            {
                return JsonLocalizableError(Errors.CourseNotFoundError, Errors.CourseNotFoundResourceKey);
            }

            course.UpdateTemplate(template, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = course.ModifiedOn });
        }

        [HttpPost]
        [Route("api/course/relateObjective")]
        public ActionResult RelateObjectives(Course course, Objective objective, int? index)
        {
            if (course == null)
            {
                return JsonLocalizableError(Errors.CourseNotFoundError, Errors.CourseNotFoundResourceKey);
            }

            if (objective == null)
            {
                return JsonLocalizableError(Errors.ObjectiveNotFoundError, Errors.ObjectiveNotFoundResourceKey);
            }

            course.RelateObjective(objective, index, GetCurrentUsername());

            return JsonSuccess(new
            {
                ModifiedOn = course.ModifiedOn
            });
        }

        [HttpPost]
        [Route("api/course/unrelateObjectives")]
        public ActionResult UnrelateObjectives(Course course, ICollection<Objective> objectives)
        {
            if (course == null)
            {
                return JsonLocalizableError(Errors.CourseNotFoundError, Errors.CourseNotFoundResourceKey);
            }

            if (objectives.Count == 0)
            {
                return JsonLocalizableError(Errors.ObjectivesNotFoundError, Errors.ObjectivesNotFoundResourceKey);
            }

            foreach (Objective objective in objectives)
            {
                course.UnrelateObjective(objective, GetCurrentUsername());
            }

            return JsonSuccess(new
            {
                ModifiedOn = course.ModifiedOn
            });
        }

        [ActionName("TemplateSettings"), HttpGet]
        public ActionResult GetTemplateSettings(Course course, Template template)
        {
            if (course == null)
            {
                return HttpNotFound(Errors.CourseNotFoundError);
            }

            if (template == null)
            {
                return HttpNotFound(Errors.TemplateNotFoundError);
            }

            return Json(course.GetTemplateSettings(template), JsonRequestBehavior.AllowGet);
        }

        [ActionName("TemplateSettings"), HttpPost]
        public ActionResult SaveTemplateSettings(Course course, Template template, string settings)
        {
            if (course == null)
            {
                return HttpNotFound(Errors.CourseNotFoundError);
            }

            if (template == null)
            {
                return HttpNotFound(Errors.TemplateNotFoundError);
            }

            course.SaveTemplateSettings(template, settings);

            return Json(true);
        }

        [HttpPost]
        [Route("api/course/updateintroductioncontent")]
        public ActionResult UpdateIntroductionContent(Course course, string introductionContent)
        {
            if (course == null)
            {
                return HttpNotFound(Errors.CourseNotFoundError);
            }

            course.UpdateIntroductionContent(introductionContent, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = course.ModifiedOn });
        }

        [HttpPost]
        [Route("api/course/updateobjectivesorder")]
        public ActionResult UpdateObjectivesOrderedList(Course course, ICollection<Objective> objectives)
        {
            if (course == null)
            {
                return HttpNotFound(Errors.CourseNotFoundError);
            }

            course.UpdateObjectivesOrder(objectives, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = course.ModifiedOn });
        }

        private IEnumerable<object> GetCourseCollaborators(Course course)
        {
            var collaborators = new List<object>(course.Collaborators.Select(e => new
            {
                Email = e.Email,
                FullName = e.FullName
            }));

            var owner = _userRepository.GetUserByEmail(course.CreatedBy);
            if (owner != null)
            {
                collaborators.Add(new
                {
                    Email = owner.Email,
                    FullName = owner.FullName
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