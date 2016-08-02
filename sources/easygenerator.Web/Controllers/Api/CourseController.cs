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
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Domain.DomainOperations;
using easygenerator.Web.Extensions;
using easygenerator.Web.Publish;
using easygenerator.Web.Publish.Coggno;
using easygenerator.Web.Publish.External;
using easygenerator.Web.ViewModels.Api;
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
        private const string DuplicatedEntityTitleSuffix = "(copy)";
        private const string DuplicatedEntityBigTitleSuffix = "... (copy)";

        private readonly ICourseBuilder _builder;
        private readonly IEntityFactory _entityFactory;
        private readonly ICourseRepository _courseRepository;
        private readonly ISectionRepository _sectionRepository;
        private readonly IUrlHelperWrapper _urlHelper;
        private readonly IScormCourseBuilder _scormCourseBuilder;
        private readonly IPublisher _publisher;
        private readonly ICoggnoPublisher _coggnoPublisher;
        private readonly IEntityMapper _entityMapper;
        private readonly IDomainEventPublisher _eventPublisher;
        private readonly ITemplateRepository _templateRepository;
        private readonly IExternalPublisher _externalPublisher;
        private readonly IUserRepository _userRepository;
        private readonly ICloner _cloner;
        private readonly ICourseOperations _courseOperations;
        private readonly ISamlServiceProviderRepository _samlServiceProviderRepository;
        private readonly ILog _logger;
        private readonly ConfigurationReader _configurationReader;

        public CourseController(ICourseBuilder courseBuilder, IScormCourseBuilder scormCourseBuilder, ICourseRepository courseRepository, ISectionRepository sectionRepository,
            IEntityFactory entityFactory, IUrlHelperWrapper urlHelper, IPublisher publisher, ICoggnoPublisher coggnoPublisher, IEntityMapper entityMapper,
            IDomainEventPublisher eventPublisher, ITemplateRepository templateRepository, IExternalPublisher externalpublisher, IUserRepository userRepository, ICloner cloner,
            ICourseOperations courseOperations, ISamlServiceProviderRepository samlServiceProviderRepository, ILog logger, ConfigurationReader configurationReader)
        {
            _builder = courseBuilder;
            _courseRepository = courseRepository;
            _sectionRepository = sectionRepository;
            _entityFactory = entityFactory;
            _urlHelper = urlHelper;
            _scormCourseBuilder = scormCourseBuilder;
            _publisher = publisher;
            _coggnoPublisher = coggnoPublisher;
            _entityMapper = entityMapper;
            _eventPublisher = eventPublisher;
            _templateRepository = templateRepository;
            _externalPublisher = externalpublisher;
            _userRepository = userRepository;
            _cloner = cloner;
            _courseOperations = courseOperations;
            _samlServiceProviderRepository = samlServiceProviderRepository;
            _logger = logger;
            _configurationReader = configurationReader;
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
            _courseOperations.CreateCourse(course);

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
            _courseOperations.CreateCourse(duplicatedCourse);

            return JsonSuccess(new
            {
                course = _entityMapper.Map(duplicatedCourse),
                sections = duplicatedCourse.RelatedSections.Select(e => _entityMapper.Map(e))
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

            var deletedSectionIds = new List<string>();
            var deletedFromLearningPathIds = new List<string>();

            if (course.LearningPaths.Any())
            {
                foreach (var learningPath in course.LearningPaths)
                {
                    deletedFromLearningPathIds.Add(learningPath.Id.ToNString());
                    learningPath.RemoveEntity(course, GetCurrentUsername());
                }
            }

            foreach (var section in course.RelatedSections)
            {
                if (section.Courses.Count() == 1)
                {
                    deletedSectionIds.Add(section.Id.ToNString());
                    foreach (var question in section.Questions)
                    {
                        section.RemoveQuestion(question, GetCurrentUsername());
                    }
                    _sectionRepository.Remove(section);
                }
            }

            _courseRepository.Remove(course);
            _eventPublisher.Publish(new CourseDeletedEvent(course, deletedSectionIds, GetCurrentUsername()));

            return JsonSuccess(new { deletedSectionIds, deletedFromLearningPathIds });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Course))]
        [Route("api/course/build")]
        public ActionResult Build(Course course, bool includeMedia = false)
        {
            return Deliver(course, () => _builder.Build(course, includeMedia), () => JsonSuccess(new { course.PackageUrl, course.BuildOn }));
        }

        [EntityCollaborator(typeof(Course))]
        [HttpPost, StarterAccess(ErrorMessageResourceKey = Errors.UpgradeToStarterPlanToUseScormResourceKey)]
        [Route("api/course/scormbuild")]
        public ActionResult ScormBuild(Course course, bool includeMedia = false)
        {
            return Deliver(course, () => _scormCourseBuilder.Build(course, includeMedia), () => JsonSuccess(new { course.ScormPackageUrl }));
        }

        [HttpPost]
        [EntityCollaborator(typeof(Course))]
        [Route("api/course/publish")]
        public ActionResult Publish(Course course)
        {
            return Deliver(course, () => _publisher.Publish(course), () => JsonSuccess(new { PublishedPackageUrl = _urlHelper.AddCurrentSchemeToUrl(course.PublicationUrl) }));
        }

        [HttpPost, PlusAccess(ErrorMessageResourceKey = Errors.UpgradeToPlusPlanToSellCourses)]
        [EntityCollaborator(typeof(Course))]
        [Route("api/course/publishToCoggno")]
        public ActionResult PublishToCoggno(Course course)
        {
            if (course.SaleInfo.IsProcessing)
            {
                return JsonError(Errors.CourseIsBeingProcessedAndCannotBePublished);
            }
            if (string.IsNullOrEmpty(course.SaleInfo.DocumentId) && course.CreatedBy != GetCurrentUsername())
            {
                return JsonError(Errors.CourseHasNotBeenPublishedByTheOwner);
            }
            var user = _userRepository.GetUserByEmail(course.CreatedBy);
            if (user == null)
            {
                return JsonLocalizableError(Errors.UserDoesntExist, Errors.UserDoesntExistResourceKey);
            }
            var coggnoServiceProvider = _samlServiceProviderRepository.GetByAssertionConsumerService(_configurationReader.CoggnoConfiguration.AssertionConsumerServiceUrl);
            if (coggnoServiceProvider == null || !user.IsAllowed(coggnoServiceProvider))
            {
                return JsonError(Errors.CoggnoSamlServiceProviderNotAllowed);
            }
            return Deliver(course, () => _coggnoPublisher.Publish(course, user.FirstName, user.LastName), JsonSuccess);
        }

        [HttpPost, AllowAnonymous, CoggnoApiKeyAccess]
        [Route("api/course/publish/coggno/completed")]
        public ActionResult PublishToCoggnoCompleted(CoggnoPublishCompletedViewModel info)
        {
            Guid id;
            if (!Guid.TryParse(info.id, out id))
            {
                throw new ArgumentException(Errors.CourseIdHasInvalidFormat);
            }
            var course = _courseRepository.Get(id);
            if (course == null)
                return new HttpStatusCodeResult(200);

            if (!info.success)
            {
                course.ProcessingForSaleFailed();
                _logger.LogException(new Exception($"{Errors.CourseCoggnoProcessingFailed}, CourseId = {id}"));
                return new HttpStatusCodeResult(200);
            }
            ArgumentValidation.ThrowIfNullOrEmpty(info.documentId, nameof(info.documentId));
            course.UpdateDocumentIdForSale(info.documentId);
            return new HttpStatusCodeResult(200);
        }

        [HttpPost]
        [EntityCollaborator(typeof(Course))]
        [Route("api/course/publishForReview")]
        public ActionResult PublishForReview(Course course)
        {
            return Deliver(course, () => _publisher.Publish(course), () => JsonSuccess(new { ReviewUrl = GetCourseReviewUrl(course.Id.ToString()) }));
        }

        [HttpPost]
        [EntityCollaborator(typeof(Course))]
        [Route("api/course/publishToCustomLms")]
        public ActionResult PublishToCustomLms(Course course, Company company)
        {
            var user = _userRepository.GetUserByEmail(GetCurrentUsername());
            if (user == null)
            {
                return JsonLocalizableError(Errors.UserDoesntExist, Errors.UserDoesntExistResourceKey);
            }
            var userCompany = user.Companies.SingleOrDefault(e => e == company);

            return userCompany == null ? JsonLocalizableError(Errors.UserNotMemberOfCompany, Errors.UserNotMemberOfCompanyResourceKey) :
                Deliver(course, () => _externalPublisher.Publish(course, userCompany, user.Email), JsonSuccess);
        }

        [HttpPost]
        [Route("api/courses")]
        public ActionResult GetCollection()
        {
            return JsonSuccess(_courseRepository.GetAvailableCoursesCollection(GetCurrentUsername()).Select(c => _entityMapper.Map(c)));
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

            return JsonSuccess(new { course.ModifiedOn });
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

            return JsonSuccess(new { course.ModifiedOn });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Course))]
        [Route("api/course/relateSection")]
        public ActionResult RelateSection(Course course, Section section, int? index)
        {
            if (course == null)
            {
                return JsonLocalizableError(Errors.CourseNotFoundError, Errors.CourseNotFoundResourceKey);
            }

            if (section == null)
            {
                return JsonLocalizableError(Errors.SectionNotFoundError, Errors.SectionNotFoundResourceKey);
            }

            course.RelateSection(section, index, GetCurrentUsername());

            return JsonSuccess(new
            {
                course.ModifiedOn
            });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Course))]
        [Route("api/course/unrelateSections")]
        public ActionResult UnrelateSections(Course course, ICollection<Section> sections)
        {
            if (course == null)
            {
                return JsonLocalizableError(Errors.CourseNotFoundError, Errors.CourseNotFoundResourceKey);
            }

            if (sections.Count == 0)
            {
                return JsonLocalizableError(Errors.SectionsNotFoundError, Errors.SectionsNotFoundResourceKey);
            }

            foreach (var section in sections)
            {
                course.UnrelateSection(section, GetCurrentUsername());
            }

            return JsonSuccess(new
            {
                course.ModifiedOn
            });
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

            return JsonSuccess(new { course.ModifiedOn });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Course))]
        [Route("api/course/updatesectionsorder")]
        public ActionResult UpdateSectionsOrderedList(Course course, ICollection<Section> sections)
        {
            if (course == null)
            {
                return HttpNotFound(Errors.CourseNotFoundError);
            }

            course.UpdateSectionsOrder(sections, GetCurrentUsername());

            return JsonSuccess(new { course.ModifiedOn });
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
            duplicatedCourse.RelatedSections.ForEach(obj => obj.UpdateTitle(GetDuplicatedEntityTitle(obj.Title), GetCurrentUsername()));

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