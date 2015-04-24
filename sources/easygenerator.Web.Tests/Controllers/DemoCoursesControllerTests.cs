using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using DocumentFormat.OpenXml.Wordprocessing;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Clonning;
using easygenerator.Web.Controllers;
using easygenerator.Web.InMemoryStorages;
using easygenerator.Web.ViewModels.DemoCourses;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using NSubstitute.Core;

namespace easygenerator.Web.Tests.Controllers
{
    [TestClass]
    public class DemoCoursesControllerTests
    {
        private DemoCoursesController _demoCourseController;
        private IDemoCoursesStorage _demoCoursesStorage;
        private ICourseRepository _courseRepository;
        private IDemoCourseInfoRepository _demoCourseInfoRepository;
        private IObjectiveRepository _objectiveRepository;
        private ICloner _cloner;
        private IEntityFactory _entityFactory;

        [TestInitialize]
        public void Initialize()
        {
            _demoCoursesStorage = Substitute.For<IDemoCoursesStorage>();
            _courseRepository = Substitute.For<ICourseRepository>();
            _demoCourseInfoRepository = Substitute.For<IDemoCourseInfoRepository>();
            _objectiveRepository = Substitute.For<IObjectiveRepository>();
            _cloner = Substitute.For<ICloner>();
            _entityFactory = Substitute.For<IEntityFactory>();
            _demoCourseController = new DemoCoursesController(_demoCoursesStorage, _courseRepository, _demoCourseInfoRepository, _objectiveRepository, _cloner, _entityFactory);

            var context = Substitute.For<HttpContextBase>();
            context.User.Returns(Substitute.For<IPrincipal>());

            _demoCourseController.ControllerContext = new ControllerContext(context, new RouteData(), _demoCourseController);
        }

        [TestMethod]
        public void AddDemoCourse_Should_AddDemoCourseToRepository()
        {
            Course courseToAdd = CourseObjectMother.Create();
            _cloner.Clone(Arg.Any<Course>(), Arg.Any<string>()).Returns(courseToAdd);
            _demoCourseController.AddDemoCourse(courseToAdd);

            _courseRepository.Received().Add(courseToAdd);
        }

        [TestMethod]
        public void AddDemoCourse_Should_AddDemoCourseSuffixToCourseTitle()
        {
            Course courseToAdd = CourseObjectMother.Create();
            var courseTitle = courseToAdd.Title;
            _cloner.Clone(Arg.Any<Course>(), Arg.Any<string>()).Returns(courseToAdd);
            _demoCourseController.AddDemoCourse(courseToAdd);
            courseToAdd.Title.Should().Be(courseTitle + " (DEMO course)");
        }

        [TestMethod]
        public void AddDemoCourse_Should_NotAddDemoCourseSuffixIfCourseTitleIsTooLong()
        {
            Course courseToAdd = CourseObjectMother.Create();
            courseToAdd.UpdateTitle("New course!New course!New course!New course!New course!New course!New course!New course!New course!New course!New course!New course!New course!New course!New course!New course!New course!New course!New course!New course!New course!New course!New course!Ne", "modifier");
            var courseTitle = courseToAdd.Title;
            _cloner.Clone(Arg.Any<Course>(), Arg.Any<string>()).Returns(courseToAdd);
            _demoCourseController.AddDemoCourse(courseToAdd);

            courseToAdd.Title.Should().Be(courseTitle);
            _demoCourseController.TempData["ErrorMessage"].Should()
               .Be(
                   "Demo course was added/updated, but '(DEMO course)' text cannot be added to the demo course title, because then course title exceeds 255 chars limit. You may leave demo course with existing title or decrease the title of the source course.");
        }

        [TestMethod]
        public void AddDemoCourse_Should_AddDemoCourseInfoToRepository()
        {
            Course courseToAdd = CourseObjectMother.Create();
            _cloner.Clone(Arg.Any<Course>(), Arg.Any<string>()).Returns(courseToAdd);

            var demoCourseInfo = DemoCourseInfoObjectMother.Create(null, courseToAdd);
            _entityFactory.DemoCourseInfo(Arg.Any<Course>(), Arg.Any<Course>(), Arg.Any<string>()).Returns(demoCourseInfo);

            _demoCourseController.AddDemoCourse(courseToAdd);
            _demoCourseInfoRepository.Received().Add(demoCourseInfo);
        }

        [TestMethod]
        public void AddDemoCourse_Should_AddDemoCourseInfoToMemoryStorage()
        {
            Course courseToAdd = CourseObjectMother.Create();
            _cloner.Clone<Course>(Arg.Any<Course>(), Arg.Any<string>()).Returns(courseToAdd);

            var demoCourseInfo = DemoCourseInfoObjectMother.Create(null, courseToAdd);
            _entityFactory.DemoCourseInfo(Arg.Any<Course>(), Arg.Any<Course>(), Arg.Any<string>()).Returns(demoCourseInfo);

            _demoCourseController.AddDemoCourse(courseToAdd);
            _demoCoursesStorage.Received().AddDemoCourseInfo(demoCourseInfo);
        }

        [TestMethod]
        public void AddDemoCourse_Should_AddErrorMessageToTempDataIfCourseIsNull()
        {
            _demoCourseController.AddDemoCourse(null);
            _demoCourseController.TempData["ErrorMessage"].Should()
                .Be(
                    "Unfortunately, the source course cannot be found, probably it was already deleted, please refresh the page and try again.");
        }

        [TestMethod]
        public void RemoveDemoCourse_Should_AddErrorMessageToTempDataIfCourseIsNull()
        {
            _demoCourseController.RemoveDemoCourse(null);
            _demoCourseController.TempData["ErrorMessage"].Should()
                .Be("Unfortunately, the demo course cannot be found, probably it was already deleted, please refresh the page and try again.");
        }

        [TestMethod]
        public void RemoveDemoCourse_Should_RemoveDemoCourseWithObjectivesFromRepository()
        {
            var course = CourseObjectMother.Create();
            var objective1 = ObjectiveObjectMother.Create();
            var objective2 = ObjectiveObjectMother.Create();
            course.RelateObjective(objective1, null, course.CreatedBy);
            course.RelateObjective(objective2, null, course.CreatedBy);

            var demoCourseInfo = DemoCourseInfoObjectMother.Create(null, course);
            _demoCourseController.RemoveDemoCourse(demoCourseInfo);

            _objectiveRepository.Received().Remove(objective1);
            _objectiveRepository.Received().Remove(objective2);
            _courseRepository.Received().Remove(course);
        }

        [TestMethod]
        public void RemoveDemoCourse_Should_RemoveDemoCourseFromMemoryStorage()
        {
            var demoCourseInfo = DemoCourseInfoObjectMother.Create();
            _demoCourseController.RemoveDemoCourse(demoCourseInfo);

            _demoCoursesStorage.Received().RemoveDemoCourseInfo(demoCourseInfo);
        }

        [TestMethod]
        public void UpdateDemoCourse_Should_AddErrorMessageToTempDataIfCourseInfoIsNull()
        {
            _demoCourseController.UpdateDemoCourse(null);
            _demoCourseController.TempData["ErrorMessage"].Should()
                .Be("Unfortunately, the demo course cannot be found, probably it was already deleted, please refresh the page and try again.");
        }

        [TestMethod]
        public void UpdateDemoCourse_Should_AddErrorMessageToTempDataIfSourseCourseIsNull()
        {
            var demoCourseInfo = DemoCourseInfoObjectMother.CreateWithEmptySourceCourse();
            _demoCourseController.UpdateDemoCourse(demoCourseInfo);
            _demoCourseController.TempData["ErrorMessage"].Should()
                .Be("Cannot update the demo course, because source course was already deleted. Current demo course will be used for new users, but it cannot be updated.");
        }

        [TestMethod]
        public void UpdateDemoCourse_Should_AddNewCourseToRepository()
        {
            var course = CourseObjectMother.Create();
            _cloner.Clone(Arg.Any<Course>(), Arg.Any<string>()).Returns(course);

            _demoCourseController.UpdateDemoCourse(DemoCourseInfoObjectMother.Create());
            _courseRepository.Received().Add(course);
        }


        [TestMethod]
        public void UpdateDemoCourse_Should_UpdateDemoCourseInfoWithNewCourse()
        {
            var course = CourseObjectMother.Create();
            _cloner.Clone(Arg.Any<Course>(), Arg.Any<string>()).Returns(course);
            var demoCourseInfo = DemoCourseInfoObjectMother.Create();
            _demoCourseController.UpdateDemoCourse(demoCourseInfo);
            demoCourseInfo.DemoCourse.Should().Be(course);
        }

        [TestMethod]
        public void UpdateDemoCourse_Should_RemoveOldDemoCourseWithObjectives()
        {
            var course = CourseObjectMother.Create();
            var objective1 = ObjectiveObjectMother.Create();
            var objective2 = ObjectiveObjectMother.Create();
            course.RelateObjective(objective1, null, course.CreatedBy);
            course.RelateObjective(objective2, null, course.CreatedBy);

            _cloner.Clone(Arg.Any<Course>(), Arg.Any<string>()).Returns(course);
            var demoCourseInfo = DemoCourseInfoObjectMother.Create(CourseObjectMother.Create(), course);
            _demoCourseController.UpdateDemoCourse(demoCourseInfo);

            _objectiveRepository.Received().Remove(objective1);
            _objectiveRepository.Received().Remove(objective2);
            _courseRepository.Received().Remove(course);
        }

        [TestMethod]
        public void UpdateDemoCourse_Should_UpdateDemoCourseInfoInMemoryStorage()
        {
            _cloner.Clone(Arg.Any<Course>(), Arg.Any<string>()).Returns(CourseObjectMother.Create());
            var demoCourseInfo = DemoCourseInfoObjectMother.Create();
            _demoCourseController.UpdateDemoCourse(demoCourseInfo);
            _demoCoursesStorage.Received().UpdateDemoCourseInfo(demoCourseInfo);
        }

        [TestMethod]
        public void Index_Should_FillModelWithCorrectCourses()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var course1 = CourseObjectMother.Create();

            DateTimeWrapper.Now = () => DateTime.Now.AddMonths(1);
            var course2 = CourseObjectMother.Create();

            var demoCourseInfo1 = DemoCourseInfoObjectMother.Create();
            var demoCourseInfo2 = DemoCourseInfoObjectMother.Create();

            _courseRepository.GetAvailableCoursesCollection(Arg.Any<string>()).Returns(new[] { course1, course2 });
            _demoCoursesStorage.DemoCoursesInfo.Returns(new[] { demoCourseInfo1, demoCourseInfo2 });

            var actionResult = _demoCourseController.Index();
            actionResult.Should().BeOfType<ViewResult>();
            var viewResult = actionResult as ViewResult;
            viewResult.Model.Should().BeOfType<DemoCoursesViewModel>();

            var viewModel = viewResult.Model as DemoCoursesViewModel;
            viewModel.DemoCoursesInfo.ElementAt(0).Title.Should().Be(demoCourseInfo1.DemoCourse.Title);
            viewModel.DemoCoursesInfo.ElementAt(0).Id.Should().Be(demoCourseInfo1.Id);

            viewModel.DemoCoursesInfo.ElementAt(1).Title.Should().Be(demoCourseInfo2.DemoCourse.Title);
            viewModel.DemoCoursesInfo.ElementAt(1).Id.Should().Be(demoCourseInfo2.Id);

            viewModel.UserCourses.ElementAt(0).Title.Should().Be(course2.Title);
            viewModel.UserCourses.ElementAt(0).Id.Should().Be(course2.Id);

            viewModel.UserCourses.ElementAt(1).Title.Should().Be(course1.Title);
            viewModel.UserCourses.ElementAt(1).Id.Should().Be(course1.Id);
        }
    }
}
