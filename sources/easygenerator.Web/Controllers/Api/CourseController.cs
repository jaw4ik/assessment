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
using easygenerator.Web.Publish.External;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure.Http;
using easygenerator.Web.Components.ActionResults;
using easygenerator.Web.Extensions;
using WebGrease.Css.Extensions;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
    public class CourseController : DefaultApiController
    {
        private const string DuplicatedEntityTitleSuffix = "(copy)";
        private const string DuplicatedEntityBigTitleSuffix = "... (copy)";

        private readonly ICourseBuilder _builder;
        private readonly IEntityFactory _entityFactory;
        private readonly ICourseRepository _courseRepository;
        private readonly IObjectiveRepository _objectiveRepository;
        private readonly IUrlHelperWrapper _urlHelper;
        private readonly IScormCourseBuilder _scormCourseBuilder;
        private readonly ICoursePublisher _coursePublisher;
        private readonly IEntityMapper _entityMapper;
        private readonly IDomainEventPublisher _eventPublisher;
        private readonly ITemplateRepository _templateRepository;
        private readonly IExternalCoursePublisher _externalCoursePublisher;
        private readonly IUserRepository _userRepository;
        private readonly ICloner _cloner;

        public CourseController(ICourseBuilder courseBuilder, IScormCourseBuilder scormCourseBuilder, ICourseRepository courseRepository,
            IObjectiveRepository objectiveRepository, IEntityFactory entityFactory, IUrlHelperWrapper urlHelper, ICoursePublisher coursePublisher,
            IEntityMapper entityMapper, IDomainEventPublisher eventPublisher, ITemplateRepository templateRepository, IExternalCoursePublisher externalCoursePublisher,
            IUserRepository userRepository, ICloner cloner)
        {
            _builder = courseBuilder;
            _courseRepository = courseRepository;
            _objectiveRepository = objectiveRepository;
            _entityFactory = entityFactory;
            _urlHelper = urlHelper;
            _scormCourseBuilder = scormCourseBuilder;
            _coursePublisher = coursePublisher;
            _entityMapper = entityMapper;
            _eventPublisher = eventPublisher;
            _templateRepository = templateRepository;
            _externalCoursePublisher = externalCoursePublisher;
            _userRepository = userRepository;
            _cloner = cloner;
        }

        [HttpPost]
        [LimitCoursesAmount]
        [Route("api/course/create")]
        public ActionResult Create(string title, Template template)
        {
            if (template == null)
            {
                template = _templateRepository.GetDefaultTemplate();
            }

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
            if (course == null)
            {
                return JsonSuccess();
            }

            var deletedObjectiveIds = new List<string>();
            var deletedFromLearningPathIds = new List<string>();

            if (course.LearningPaths.Any())
            {
                foreach (var learningPath in course.LearningPaths)
                {
                    deletedFromLearningPathIds.Add(learningPath.Id.ToNString());
                    learningPath.RemoveCourse(course, GetCurrentUsername());
                }
            }

            foreach (var objective in course.RelatedObjectives)
            {
                if (objective.Courses.Count() == 1)
                {
                    deletedObjectiveIds.Add(objective.Id.ToNString());
                    foreach (Question question in objective.Questions)
                    {
                        objective.RemoveQuestion(question, GetCurrentUsername());
                    }
                    _objectiveRepository.Remove(objective);
                }
            }
            var collaborators = course.Collaborators.Select(e => e.Email).ToList();
            var invitedCollaborators = new Dictionary<Guid, string>();
            course.Collaborators.Where(e => !e.IsAccepted).ForEach(i => invitedCollaborators.Add(i.Id, i.Email));

            _courseRepository.Remove(course);
            _eventPublisher.Publish(new CourseDeletedEvent(course, deletedObjectiveIds, collaborators, invitedCollaborators, GetCurrentUsername()));
            
            return JsonSuccess(new { deletedObjectiveIds = deletedObjectiveIds, deletedFromLearningPathIds = deletedFromLearningPathIds });
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
            return Deliver(course, () => _coursePublisher.Publish(course), () => JsonSuccess(new { PublishedPackageUrl = _urlHelper.AddCurrentSchemeToUrl(course.PublicationUrl) }));
        }

        [HttpPost]
        [EntityCollaborator(typeof(Course))]
        [Route("api/course/publishForReview")]
        public ActionResult PublishForReview(Course course)
        {
            return Deliver(course, () => _coursePublisher.Publish(course), () => JsonSuccess(new { ReviewUrl = GetCourseReviewUrl(course.Id.ToString()) }));
        }

        [HttpPost]
        [EntityCollaborator(typeof(Course))]
        [Route("api/course/publishToCustomLms")]
        public ActionResult PublishToCustomLms(Course course)
        {
            var user = _userRepository.GetUserByEmail(GetCurrentUsername());
            if (user == null)
            {
                return JsonLocalizableError(Errors.UserDoesntExist, Errors.UserDoesntExistResourceKey);
            }

            if (user.Company == null)
            {
                return JsonLocalizableError(Errors.UserNotMemberOfAnyCompany, Errors.UserNotMemberOfAnyCompanyResourceKey);
            }

            return Deliver(course, () => _externalCoursePublisher.PublishCourseUrl(course, user.Company, user.Email), () => JsonSuccess());
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

        [Scope("settings", "api")]
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

        [Scope("settings", "api")]
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
            duplicatedCourse.UpdateTitle(GetDuplicatedEntityTitle(duplicatedCourse.Title), GetCurrentUsername());
            duplicatedCourse.RelatedObjectives.ForEach(obj => obj.UpdateTitle(GetDuplicatedEntityTitle(obj.Title), GetCurrentUsername()));

            return duplicatedCourse;
        }

        private static string GetDuplicatedEntityTitle(string title)
        {
            var newTitle = title;
            if (title == null || title.EndsWith(DuplicatedEntityTitleSuffix))
            {
                return newTitle;
            }
            newTitle = string.Format("{0} {1}", title, DuplicatedEntityTitleSuffix);
            if (newTitle.Length > 255)
            {
                newTitle = string.Format("{0} {1}", title.Substring(0, 244), DuplicatedEntityBigTitleSuffix);
            }
            return newTitle;
        }
    }
}