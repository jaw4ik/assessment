using System.Linq;
using DocumentFormat.OpenXml.Bibliography;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure.Clonning;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters.Authorization;
using System.Web.Mvc;
using easygenerator.Web.InMemoryStorages;
using easygenerator.Web.ViewModels.DemoCourses;
using easygenerator.Web.Components.ActionFilters;

namespace easygenerator.Web.Controllers
{
    [NoCache]
    [AllowedUsers("demoCourses.allowedUsers")]
    public class DemoCoursesController : DefaultController
    {
        private const string DemoCoursesOwnerEmail = "democourses.easygenerator.com";
        private const string DemoCourseTitleSuffix = "(DEMO course)";

        private const string DemoCourseInfoNotFoundMessage =
            "Unfortunately, the demo course cannot be found, probably it was already deleted, please refresh the page and try again.";
        private const string CourseNotFoundMessage =
            "Unfortunately, the source course cannot be found, probably it was already deleted, please refresh the page and try again.";
        private const string SourceCourseNotFoundMessage =
            "Cannot update the demo course, because source course was already deleted. Current demo course will be used for new users, but it cannot be updated.";
        private const string DemoCourseWasUpdated = "Demo course was successfully updated.";
        private const string DemoCourseSuffixCannotBeAdded = "Demo course was added/updated, but '(DEMO course)' text cannot be added to the demo course title, because then course title exceeds 255 chars limit. You may leave demo course with existing title or decrease the title of the source course.";

        private readonly IDemoCoursesStorage _demoCoursesInMemoryStorage;
        private readonly ICourseRepository _courseRepository;
        private readonly ICloner _cloner;
        private readonly IEntityFactory _entityFactory;
        private readonly IDemoCourseInfoRepository _demoCourseInfoRepository;
        private readonly ISectionRepository _sectionRepository;

        public DemoCoursesController(IDemoCoursesStorage demoCoursesInMemoryStorage, ICourseRepository courseRepository, IDemoCourseInfoRepository demoCourseInfoRepository,
            ISectionRepository sectionRepository, ICloner cloner, IEntityFactory entityFactory)
        {
            _demoCoursesInMemoryStorage = demoCoursesInMemoryStorage;
            _courseRepository = courseRepository;
            _cloner = cloner;
            _entityFactory = entityFactory;
            _demoCourseInfoRepository = demoCourseInfoRepository;
            _sectionRepository = sectionRepository;
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("democourses/add", Name = "AddDemoCourse")]
        public ActionResult AddDemoCourse(Course course)
        {
            if (course == null)
            {
                return ErrorResult(CourseNotFoundMessage);
            }

            var clonedCourse = GetClonedDemoCourse(course);
            _courseRepository.Add(clonedCourse);

            var demoCourseInfo = _entityFactory.DemoCourseInfo(course, clonedCourse, DemoCoursesOwnerEmail);
            _demoCourseInfoRepository.Add(demoCourseInfo);

            _demoCoursesInMemoryStorage.AddDemoCourseInfo(demoCourseInfo);

            return RedirectToAction("Index");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("democourses/remove", Name = "RemoveDemoCourse")]
        public ActionResult RemoveDemoCourse(DemoCourseInfo demoCourseInfo)
        {
            if (demoCourseInfo == null)
            {
                return ErrorResult(DemoCourseInfoNotFoundMessage);
            }

            _demoCoursesInMemoryStorage.RemoveDemoCourseInfo(demoCourseInfo);
            RemoveCourseWithSections(demoCourseInfo.DemoCourse);

            return RedirectToAction("Index");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("democourses/update", Name = "UpdateDemoCourse")]
        public ActionResult UpdateDemoCourse(DemoCourseInfo demoCourseInfo)
        {
            if (demoCourseInfo == null)
            {
                return ErrorResult(DemoCourseInfoNotFoundMessage);
            }

            if (demoCourseInfo.SourceCourse == null)
            {
                return ErrorResult(SourceCourseNotFoundMessage);
            }

            var oldDemoCourse = demoCourseInfo.DemoCourse;
            var newDemoCourse = GetClonedDemoCourse(demoCourseInfo.SourceCourse);
            _courseRepository.Add(newDemoCourse);
            demoCourseInfo.UpdateDemoCourse(newDemoCourse, DemoCoursesOwnerEmail);
            RemoveCourseWithSections(oldDemoCourse);
            _demoCoursesInMemoryStorage.UpdateDemoCourseInfo(demoCourseInfo);

            return SuccessResult(DemoCourseWasUpdated);
        }

        [HttpGet]
        [Route("democourses")]
        public ActionResult Index()
        {
            var userCourses = _courseRepository.GetAvailableCoursesCollection(User.Identity.Name).OrderByDescending(course => course.CreatedOn);
            return View(new DemoCoursesViewModel(_demoCoursesInMemoryStorage.DemoCoursesInfo, userCourses));
        }

        private ActionResult ErrorResult(string errorMessage)
        {
            TempData["ErrorMessage"] = errorMessage;
            return RedirectToAction("Index");
        }

        private ActionResult SuccessResult(string successMessage)
        {
            TempData["SuccessMessage"] = successMessage;
            return RedirectToAction("Index");
        }

        private Course GetClonedDemoCourse(Course course)
        {
            var clonedCourse = _cloner.Clone(course, DemoCoursesOwnerEmail);
            if (clonedCourse.Title != null && !clonedCourse.Title.EndsWith(DemoCourseTitleSuffix))
            {
                var newTitle = string.Format("{0} {1}", clonedCourse.Title, DemoCourseTitleSuffix);
                if (newTitle.Length < 255)
                {
                    clonedCourse.UpdateTitle(newTitle, DemoCoursesOwnerEmail);
                }
                else
                {
                    TempData["ErrorMessage"] = DemoCourseSuffixCannotBeAdded;
                }
            }
            return clonedCourse;
        }

        private void RemoveCourseWithSections(Course course)
        {
            foreach (var section in course.RelatedSections)
            {
                _sectionRepository.Remove(section);
            }
            _courseRepository.Remove(course);
        }
    }
}