using DocumentFormat.OpenXml.InkML;
using easygenerator.Auth.Attributes.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Clonning;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.BuildCourse.Scorm;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Publish;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using WebGrease.Css.Extensions;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
    public class CourseController : DefaultApiController
    {
        private const string DuplicatedCourseTitleSuffix = "(copy)";
        private const string DuplicatedCourseBigTitleSuffix = "... (copy)";

        private readonly ICourseBuilder _builder;
        private readonly IEntityFactory _entityFactory;
        private readonly ICourseRepository _courseRepository;
        private readonly IUrlHelperWrapper _urlHelper;
        private readonly IScormCourseBuilder _scormCourseBuilder;
        private readonly ICoursePublisher _coursePublisher;
        private readonly IEntityMapper _entityMapper;
        private readonly IDomainEventPublisher _eventPublisher;
        private readonly ITemplateRepository _templateRepository;
        private readonly ICloner _cloner;

        public CourseController(ICourseBuilder courseBuilder, IScormCourseBuilder scormCourseBuilder, ICourseRepository courseRepository, IEntityFactory entityFactory,
            IUrlHelperWrapper urlHelper, ICoursePublisher coursePublisher, IEntityMapper entityMapper,
            IDomainEventPublisher eventPublisher, ITemplateRepository templateRepository, ICloner cloner)
        {
            _builder = courseBuilder;
            _courseRepository = courseRepository;
            _entityFactory = entityFactory;
            _urlHelper = urlHelper;
            _scormCourseBuilder = scormCourseBuilder;
            _coursePublisher = coursePublisher;
            _entityMapper = entityMapper;
            _eventPublisher = eventPublisher;
            _templateRepository = templateRepository;
            _cloner = cloner;
        }

        [HttpPost]
        [LimitCoursesAmount]
        [Route("api/course/create")]
        public ActionResult Create(string title)
        {
            var template = _templateRepository.GetDefaultTemplate();
            var course = _entityFactory.Course(title, template, GetCurrentUsername());

            _courseRepository.Add(course);

            return JsonSuccess(_entityMapper.Map(course));
        }

        [HttpPost]
        [LimitCoursesAmount]
        [Route("api/course/duplicate")]
        public ActionResult Duplicate(Course course)
        {
            if (course == null)
            {
                return BadRequest();
            }

            var duplicatedCourse = GetDuplicatedCourse(course);
            _courseRepository.Add(duplicatedCourse);

            return JsonSuccess(new
            {
                course = _entityMapper.Map(duplicatedCourse),
                objectives = duplicatedCourse.RelatedObjectives.Select(e => _entityMapper.Map(e))
            });
        }

        [HttpPost]
        [EntityOwner(typeof(Course))]
        [Route("api/course/delete")]
        public ActionResult Delete(Course course)
        {
            if (course != null)
            {
                if (course.RelatedObjectives.Any() || course.LearningPaths.Any())
                {
                    return JsonLocalizableError(Errors.CourseCannotBeDeleted, Errors.CourseCannotBeDeletedResourceKey);
                }

                var collaborators = course.Collaborators.Select(e => e.Email).ToList();
                var invitedCollaborators = new Dictionary<Guid, string>();
                course.Collaborators.Where(e => !e.Locked && !e.IsAccepted).ForEach(i => invitedCollaborators.Add(i.Id, i.Email));

                _courseRepository.Remove(course);

                _eventPublisher.Publish(new CourseDeletedEvent(course, collaborators, invitedCollaborators, GetCurrentUsername()));
            }

            return JsonSuccess();
        }

        [HttpPost]
        [EntityCollaborator(typeof(Course))]
        [Route("api/course/build")]
        public ActionResult Build(Course course)
        {
            return Deliver(course, () => _builder.Build(course), () => JsonSuccess(new { PackageUrl = course.PackageUrl, BuildOn = course.BuildOn }));
        }

        [EntityCollaborator(typeof(Course))]
        [HttpPost, StarterAccess(ErrorMessageResourceKey = Errors.UpgradeToStarterPlanToUseScormResourceKey)]
        [Route("api/course/scormbuild")]
        public ActionResult ScormBuild(Course course)
        {
            return Deliver(course, () => _scormCourseBuilder.Build(course), () => JsonSuccess(new { ScormPackageUrl = course.ScormPackageUrl }));
        }

        [HttpPost]
        [EntityCollaborator(typeof(Course))]
        [Route("api/course/publish")]
        public ActionResult Publish(Course course)
        {
            return Deliver(course, () => _coursePublisher.Publish(course), () => JsonSuccess(new { PublishedPackageUrl = course.PublicationUrl }));
        }

        [HttpPost]
        [EntityCollaborator(typeof(Course))]
        [Route("api/course/publishForReview")]
        public ActionResult PublishForReview(Course course)
        {
            return Deliver(course, () => _coursePublisher.Publish(course), () => JsonSuccess(new { ReviewUrl = GetCourseReviewUrl(course.Id.ToString()) }));
        }

        [HttpPost]
        [Route("api/courses")]
        public ActionResult GetCollection()
        {
            var courses = _courseRepository.GetAvailableCoursesCollection(User.Identity.Name);

            return JsonSuccess(courses.Select(c => _entityMapper.Map(c)));
        }

        [HttpPost]
        [EntityCollaborator(typeof(Course))]
        [Route("api/course/updateTitle")]
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
        [EntityCollaborator(typeof(Course))]
        [Route("api/course/updateTemplate")]
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
        [EntityCollaborator(typeof(Course))]
        [Route("api/course/relateObjective")]
        public ActionResult RelateObjective(Course course, Objective objective, int? index)
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
        [EntityCollaborator(typeof(Course))]
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

            foreach (var objective in objectives)
            {
                course.UnrelateObjective(objective, GetCurrentUsername());
            }

            return JsonSuccess(new
            {
                ModifiedOn = course.ModifiedOn
            });
        }

        [Scope("settings")]
        [EntityCollaborator(typeof(Course))]
        [ActionName("TemplateSettings"), HttpGet]
        [Route("api/course/{courseId}/template/{templateId}")]
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

            return Json(new
            {
                settings = course.GetTemplateSettings(template),
                extraData = course.GetExtraDataForTemplate(template)
            },
                JsonRequestBehavior.AllowGet);
        }

        [Scope("settings")]
        [EntityCollaborator(typeof(Course))]
        [ActionName("TemplateSettings"), HttpPost]
        [Route("api/course/{courseId}/template/{templateId}")]
        public ActionResult SaveTemplateSettings(Course course, Template template, string settings, string extraData)
        {
            if (course == null)
            {
                return HttpNotFound(Errors.CourseNotFoundError);
            }

            if (template == null)
            {
                return HttpNotFound(Errors.TemplateNotFoundError);
            }

            course.SaveTemplateSettings(template, settings, extraData);

            return Json(true);
        }

        [HttpPost]
        [EntityCollaborator(typeof(Course))]
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
        [EntityCollaborator(typeof(Course))]
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

        private string GetCourseReviewUrl(string courseId)
        {
            return _urlHelper.ToAbsoluteUrl(string.Format("~/review/{0}/", courseId));
        }

        private ActionResult Deliver(Course course, Func<bool> publishAction, Func<ActionResult> getSuccessResultAction)
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

        private Course GetDuplicatedCourse(Course course)
        {
            var duplicatedCourse = _cloner.Clone(course, GetCurrentUsername(), true);

            if (duplicatedCourse.Title == null || duplicatedCourse.Title.EndsWith(DuplicatedCourseTitleSuffix))
                return duplicatedCourse;

            var newTitle = string.Format("{0} {1}", duplicatedCourse.Title, DuplicatedCourseTitleSuffix);
            if (newTitle.Length > 255)
            {
                newTitle = string.Format("{0} {1}", duplicatedCourse.Title.Substring(0, 244),
                    DuplicatedCourseBigTitleSuffix);
            }
            duplicatedCourse.UpdateTitle(newTitle, GetCurrentUsername());
            return duplicatedCourse;
        }
    }
}