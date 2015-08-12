using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Clonning;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.BuildCourse.Scorm;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Publish;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class CourseControllerTests
    {
        private const string CreatedBy = "easygenerator@easygenerator.com";

        private CourseController _controller;
        private ICourseBuilder _builder;
        private IScormCourseBuilder _scormCourseBuilder;
        private IEntityFactory _entityFactory;
        private ICourseRepository _courseRepository;
        private IPrincipal _user;
        private HttpContextBase _context;
        private IUrlHelperWrapper _urlHelper;
        private ICoursePublisher _coursePublisher;
        private IEntityMapper _entityMapper;
        private IDomainEventPublisher _eventPublisher;
        private ITemplateRepository _templateRepository;
        private ICloner _cloner;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _courseRepository = Substitute.For<ICourseRepository>();
            _builder = Substitute.For<ICourseBuilder>();
            _scormCourseBuilder = Substitute.For<IScormCourseBuilder>();
            _coursePublisher = Substitute.For<ICoursePublisher>();
            _urlHelper = Substitute.For<IUrlHelperWrapper>();
            _entityMapper = Substitute.For<IEntityMapper>();
            _eventPublisher = Substitute.For<IDomainEventPublisher>();
            _templateRepository = Substitute.For<ITemplateRepository>();
            _cloner = Substitute.For<ICloner>();
            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();

            _context.User.Returns(_user);

            _controller = new CourseController(_builder, _scormCourseBuilder, _courseRepository, _entityFactory, _urlHelper, _coursePublisher, _entityMapper, _eventPublisher, _templateRepository, _cloner);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region Create course

        [TestMethod]
        public void Create_ShouldAddCourse()
        {
            const string title = "Course title";
            var template = TemplateObjectMother.Create();
            _user.Identity.Name.Returns(CreatedBy);
            var course = CourseObjectMother.CreateWithTitle(title);
            course.UpdateTemplate(template, CreatedBy);

            _entityFactory.Course(title, template, CreatedBy).Returns(course);

            _controller.Create(title, template);

            _courseRepository.Received().Add(Arg.Is<Course>(exp => exp.Title == title));
        }

        [TestMethod]
        public void Create_ShouldReturnJsonSuccessResult()
        {
            const string title = "Course title";
            var template = TemplateObjectMother.Create();
            _user.Identity.Name.Returns(CreatedBy);
            var course = CourseObjectMother.CreateWithTitle(title);
            course.UpdateTemplate(template, CreatedBy);

            _entityFactory.Course(title, template, CreatedBy).Returns(course);

            var result = _controller.Create(title, template);

            ActionResultAssert.IsJsonSuccessResult(result);
        }

        #endregion

        #region Duplicate course

        [TestMethod]
        public void Duplicate_WhenCourseIsNotExistsShouldReturnJsonSuccessResult()
        {
            var result = _controller.Duplicate(null);
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void Duplicate_ShouldAddDuplicatedCourseToRepository()
        {

            Course courseToDuplicate = CourseObjectMother.Create();
            _cloner.Clone(Arg.Any<Course>(), Arg.Any<string>(), true).Returns(courseToDuplicate);
            _controller.Duplicate(courseToDuplicate);

            _courseRepository.Received().Add(courseToDuplicate);
        }

        [TestMethod]
        public void Duplicate_ShouldAddDuplicatedCourseSuffixToCourseTitle()
        {
            Course courseToDuplicate = CourseObjectMother.Create();
            var courseTitle = courseToDuplicate.Title;
            _cloner.Clone(Arg.Any<Course>(), Arg.Any<string>(), true).Returns(courseToDuplicate);
            _controller.Duplicate(courseToDuplicate);
            courseToDuplicate.Title.Should().Be(courseTitle + " (copy)");
        }

        [TestMethod]
        public void Duplicate_ShouldRemoveLast10SymbolsOfCourseTitleAndAddBigDuplicatedCourseSuffix()
        {
            Course courseToDuplicate = CourseObjectMother.Create();
            courseToDuplicate.UpdateTitle("New course!New course!NewNew course!New course!NewNew course!New course!NewNew course!New course!NewNew course!New course!NewNew course!New course!NewNew course!New course!NewNew course!New course!NewNew course!New course!NewNew course!New course!New cour", "modifier");
            var courseTitle = courseToDuplicate.Title;
            var newTitle = String.Format("{0} {1}", courseTitle.Substring(0, 244), "... (copy)");
            _cloner.Clone(Arg.Any<Course>(), Arg.Any<string>(), true).Returns(courseToDuplicate);
            _controller.Duplicate(courseToDuplicate);

            courseToDuplicate.Title.Should().Be(newTitle);
        }

        [TestMethod]
        public void Duplicate_ShouldReturnJsonSuccessResult()
        {
            Course courseToDuplicate = CourseObjectMother.Create();
            _cloner.Clone(Arg.Any<Course>(), Arg.Any<string>(), true).Returns(courseToDuplicate);
            var result = _controller.Duplicate(courseToDuplicate);
            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region Delete course

        [TestMethod]
        public void Delete_ShouldReturnJsonSuccessResult()
        {
            var course = CourseObjectMother.Create();

            var result = _controller.Delete(course);

            result.Should().BeJsonSuccessResult();
        }

        [TestMethod]
        public void Build_ShouldReturnJsonErrorResult_WhenCourseHasConnectedObjectives()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            course.RelateObjective(ObjectiveObjectMother.Create(), 0, CreatedBy);

            //Act
            var result = _controller.Delete(course);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.CourseCannotBeDeleted);
        }

        [TestMethod]
        public void Build_ShouldReturnJsonErrorResult_WhenCourseIsConnectedToLearningPath()
        {
            //Arrange
            var course = Substitute.For<Course>();
            course.LearningPaths.Returns(new List<LearningPath>() { LearningPathObjectMother.Create() });

            //Act
            var result = _controller.Delete(course);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.CourseCannotBeDeleted);
        }

        [TestMethod]
        public void Delete_ShouldRemoveCourse_WhenItNotNull()
        {
            var course = CourseObjectMother.Create();

            _controller.Delete(course);

            _courseRepository.Received().Remove(course);
        }

        [TestMethod]
        public void Delete_ShouldPublishDomainEvent_WhenCourseIsNotNull()
        {
            var course = CourseObjectMother.Create();

            _controller.Delete(course);

            _eventPublisher.Received().Publish(Arg.Any<CourseDeletedEvent>());
        }

        [TestMethod]
        public void Delete_ReturnJsonSuccessResult_WhenCourseIsNull()
        {
            var result = _controller.Delete(null);

            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region Build course

        [TestMethod]
        public void Build_ShouldReturnJsonErrorResult_WhenCourseNotFound()
        {
            //Arrange


            //Act
            var result = _controller.Build(null);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.CourseNotFoundError);
        }

        [TestMethod]
        public void Build_ShouldReturnJsonErrorResult_WhenBuildFails()
        {
            //Arrange
            _builder.Build(Arg.Any<Course>()).Returns(false);

            //Act
            var result = _controller.Build(CourseObjectMother.Create());

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.CoursePublishActionFailedError);
        }

        [TestMethod]
        public void Build_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _builder.Build(course).Returns(true);
            _builder.When(x => x.Build(course)).Do(x => ((Course)x.Args()[0]).UpdatePackageUrl("Some url"));

            //Act
            var result = _controller.Build(course);

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { PackageUrl = course.PackageUrl, BuildOn = course.BuildOn });
        }

        #endregion

        #region Scorm Build course

        [TestMethod]
        public void ScormBuild_ShouldReturnJsonErrorResult_WhenCourseNotFound()
        {
            //Arrange


            //Act
            var result = _controller.Build(null);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.CourseNotFoundError);
        }

        [TestMethod]
        public void ScormBuild_ShouldReturnJsonErrorResult_WhenBuildFails()
        {
            //Arrange
            _builder.Build(Arg.Any<Course>()).Returns(false);

            //Act
            var result = _controller.ScormBuild(CourseObjectMother.Create());

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.CoursePublishActionFailedError);
        }

        [TestMethod]
        public void ScormBuild_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _scormCourseBuilder.Build(course).Returns(true);
            _scormCourseBuilder.When(x => x.Build(course)).Do(x => ((Course)x.Args()[0]).UpdateScormPackageUrl("Some url"));

            //Act
            var result = _controller.ScormBuild(course);

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ScormPackageUrl = course.ScormPackageUrl });
        }

        #endregion

        #region Publish course

        [TestMethod]
        public void Publish_ShouldReturnJsonErrorResult_WhenCourseNotFound()
        {
            //Arrange

            //Act
            var result = _controller.Publish(null);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.CourseNotFoundError);
        }

        [TestMethod]
        public void Publish_ShouldReturnJsonErrorResult_WhenPublishFails()
        {
            //Arrange
            _coursePublisher.Publish(Arg.Any<Course>()).Returns(false);

            //Act
            var result = _controller.Publish(CourseObjectMother.Create());

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.CoursePublishActionFailedError);
        }

        [TestMethod]
        public void Publish_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _coursePublisher.Publish(course).Returns(true);
            course.UpdatePublicationUrl("url");

            //Act
            var result = _controller.Publish(course);

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { PublishedPackageUrl = course.PublicationUrl });
        }

        #endregion

        #region Publish course for review

        [TestMethod]
        public void PublishForReview_ShouldReturnJsonErrorResult_WhenCourseNotFound()
        {
            //Arrange

            //Act
            var result = _controller.PublishForReview(null);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.CourseNotFoundError);
        }

        [TestMethod]
        public void PublishForReview_ShouldReturnJsonErrorResult_WhenPublishFails()
        {
            //Arrange
            _coursePublisher.Publish(Arg.Any<Course>()).Returns(false);

            //Act
            var result = _controller.PublishForReview(CourseObjectMother.Create());

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.CoursePublishActionFailedError);
        }

        [TestMethod]
        public void PublishForReview_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _coursePublisher.Publish(course).Returns(true);
            _urlHelper.ToAbsoluteUrl(Arg.Any<string>()).Returns("url");

            //Act
            var result = _controller.PublishForReview(course);

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ReviewUrl = "url" });
        }

        #endregion

        #region GetCollection

        [TestMethod]
        public void GetCollection_ShouldReturnJsonSuccessResult()
        {
            var collection = new Collection<Course>(new List<Course>() { CourseObjectMother.Create() });

            _courseRepository.GetCollection().Returns(collection);

            var result = _controller.GetCollection();

            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region Update Title

        [TestMethod]
        public void Update_ShouldReturnJsonErrorResult_WhenCourseIsNull()
        {
            var result = _controller.UpdateTitle(null, String.Empty);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Course is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("courseNotFoundError");
        }

        [TestMethod]
        public void Update_ShouldUpdateCourseTitle()
        {
            const string title = "updated title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var course = Substitute.For<Course>("Some title", TemplateObjectMother.Create(), CreatedBy);

            _controller.UpdateTitle(course, title);

            course.Received().UpdateTitle(title, user);
        }

        [TestMethod]
        public void Update_ShouldReturnJsonSuccessResult()
        {
            var course = Substitute.For<Course>("Some title", TemplateObjectMother.Create(), CreatedBy);

            var result = _controller.UpdateTitle(course, String.Empty);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = course.ModifiedOn });
        }


        #endregion

        #region Update Template

        [TestMethod]
        public void UpdateTemplate_ShouldReturnJsonErrorResult_WhenCourseIsNull()
        {
            //Arrange
            var template = TemplateObjectMother.Create();

            //Act
            var result = _controller.UpdateTemplate(null, template);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be("Course is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("courseNotFoundError");
        }


        [TestMethod]
        public void UpdateTemplate_ShouldUpdateCourseTemplate()
        {
            //Arrange
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var course = Substitute.For<Course>("Some title", TemplateObjectMother.Create(), CreatedBy);
            var template = TemplateObjectMother.Create();

            //Act
            _controller.UpdateTemplate(course, template);

            //Assert
            course.Received().UpdateTemplate(template, user);
        }

        [TestMethod]
        public void UpdateTemplate_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var course = Substitute.For<Course>("Some title", TemplateObjectMother.Create(), CreatedBy);
            var template = TemplateObjectMother.Create();

            //Act
            var result = _controller.UpdateTemplate(course, template);

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = course.ModifiedOn });
        }

        #endregion

        #region Relate Objectives

        [TestMethod]
        public void RelateObjectives_ShouldReturnJson()
        {
            //Arrange
            _user.Identity.Name.Returns("Test user");
            var course = CourseObjectMother.Create();
            var relatedObjective = ObjectiveObjectMother.Create();

            //Act
            var result = _controller.RelateObjective(course, relatedObjective, null);

            //Assert
            ActionResultAssert.IsJsonSuccessResult(result);
        }

        [TestMethod]
        public void RelateObjectives_ShouldRelateObjectiveToCourse()
        {
            //Arrange
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var course = Substitute.For<Course>("title", TemplateObjectMother.Create(), CreatedBy);
            var objective = ObjectiveObjectMother.Create();

            //Act
            _controller.RelateObjective(course, objective, null);

            //Assert
            course.Received().RelateObjective(objective, null, user);
        }

        [TestMethod]
        public void RelateObjectives_ShouldReturnJsonErrorResult_WhenCourseIsNull()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();

            //Act
            var result = _controller.RelateObjective(null, objective, null);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be("Course is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("courseNotFoundError");
        }

        [TestMethod]
        public void RelateObjectives_ShouldReturnJsonErrorResult_WhenObjectiveListIsEmpty()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var objective = ObjectiveObjectMother.Create();

            //Act
            var result = _controller.RelateObjective(course, null, null);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be("Objective is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("objectiveNotFoundError");
        }

        #endregion

        #region Unrelate Objectives

        [TestMethod]
        public void UnrelateObjectives_ShouldReturnJson()
        {
            //Arrange
            _user.Identity.Name.Returns("Test user");
            var course = CourseObjectMother.Create();
            var relatedObjectives = new List<Objective>() { ObjectiveObjectMother.Create() };

            //Act
            var result = _controller.UnrelateObjectives(course, relatedObjectives);

            //Assert
            ActionResultAssert.IsJsonSuccessResult(result);
        }

        [TestMethod]
        public void UnrelateObjectives_ShouldUnrelateObjectiveFromCourse()
        {
            //Arrange
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var objective = ObjectiveObjectMother.Create();
            var course = Substitute.For<Course>("title", TemplateObjectMother.Create(), CreatedBy);

            //Act
            _controller.UnrelateObjectives(course, new List<Objective>() { objective });

            //Assert
            course.Received().UnrelateObjective(objective, user);
        }

        [TestMethod]
        public void UnrelateObjectives_ShouldReturnJsonErrorResult_WhenCourseIsNull()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();

            //Act
            var result = _controller.UnrelateObjectives(null, new List<Objective>() { objective });

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be("Course is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("courseNotFoundError");
        }

        [TestMethod]
        public void UnrelateObjectives_ShouldReturnJsonErrorResult_WhenObjectiveListIsEmpty()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            var result = _controller.UnrelateObjectives(course, new List<Objective>() { });

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be("Objectives are not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("objectivesNotFoundError");
        }

        #endregion

        #region GetTemplateSettings

        [TestMethod]
        public void GetTemplateSettings_ShouldReturnHttpNotFound_WhenCourseIsNull()
        {
            //Arrange


            //Act
            var result = _controller.GetTemplateSettings(null, Substitute.For<Template>());

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.CourseNotFoundError);
        }

        [TestMethod]
        public void GetTemlateSettings_ShouldReturnHttpNotFound_WhenTemplateIsNull()
        {
            //Arrange


            //Act
            var result = _controller.GetTemplateSettings(Substitute.For<Course>(), null);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.TemplateNotFoundError);
        }

        [TestMethod]
        public void GetTemplateSettings_ShouldReturnJsonResultWithTemplateSettingsAndExtraData()
        {
            //Arrange
            const string settings = "settings";
            const string extraData = "settings";
            var course = Substitute.For<Course>();
            var template = Substitute.For<Template>();
            course.GetTemplateSettings(template).Returns(settings);
            course.GetExtraDataForTemplate(template).Returns(extraData);

            //Act
            var result = _controller.GetTemplateSettings(course, template);

            //Assert
            result.Should().BeJsonResult().And.Data.ShouldBeSimilar(new { settings = settings, extraData = extraData });
        }

        [TestMethod]
        public void GetTemplateSettings_ShouldReturnJsonResultUsingGetRequest()
        {
            //Arrange
            var course = Substitute.For<Course>();
            var template = Substitute.For<Template>();

            //Act
            var result = _controller.GetTemplateSettings(course, template);

            //Assert
            result.Should().BeJsonResult().And.JsonRequestBehavior.Should().Be(JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region  SaveTemplateSettings

        [TestMethod]
        public void SaveTemplateSettings_ShouldReturnHttpNotFound_WhenCourseIsNull()
        {
            //Arrange


            //Act
            var result = _controller.SaveTemplateSettings(null, Substitute.For<Template>(), null, null);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.CourseNotFoundError);
        }

        [TestMethod]
        public void SaveTemplateSettings_ShouldReturnHttpNotFound_WhenTemplateIsNull()
        {
            //Arrange


            //Act
            var result = _controller.SaveTemplateSettings(Substitute.For<Course>(), null, null, null);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.TemplateNotFoundError);
        }

        [TestMethod]
        public void SaveTemplateSettings_ShouldSaveTemplateSettings()
        {
            //Arrange
            var course = Substitute.For<Course>();
            var template = Substitute.For<Template>();
            const string settings = "settings";
            const string extraData = "extra data";

            //Act
            _controller.SaveTemplateSettings(course, template, settings, extraData);

            //Assert
            course.Received().SaveTemplateSettings(template, settings, extraData);

        }

        [TestMethod]
        public void SaveTemplateSettings_ShouldReturnJsonResult()
        {
            //Arrange
            var course = Substitute.For<Course>();
            var template = Substitute.For<Template>();
            const string settings = "settings";
            const string extraData = "extra data";

            //Act
            var result = _controller.SaveTemplateSettings(course, template, settings, extraData);

            //Assert
            result.Should().BeJsonResult().And.Data.Should().Be(true);
        }

        #endregion

        #region UpdateIntroductionContent

        [TestMethod]
        public void UpdateIntroductionContent_ShouldReturnHttpNotFound_WhenCourseIsNull()
        {
            //Arrange

            //Act
            var result = _controller.UpdateIntroductionContent(null, "some user");

            //Assert 
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.CourseNotFoundError);
        }

        [TestMethod]
        public void UpdateIntroductionContent_ShouldUpdateContent()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var content = "some content";

            //Act
            _controller.UpdateIntroductionContent(course, content);

            //Assert
            course.IntroductionContent.Should().Be(content);
        }

        [TestMethod]
        public void UpdateIntroductionContent_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            var result = _controller.UpdateIntroductionContent(course, "some content");

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = course.ModifiedOn });
        }

        #endregion UpdateContent

        #region UpdateObjectivesOrder

        [TestMethod]
        public void UpdateObjectivesOrderedList_ShouldReturnHttpNotFound_WhenCourseIsNull()
        {
            //Arrange

            //Act
            var result = _controller.UpdateObjectivesOrderedList(null, new List<Objective>());

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.CourseNotFoundError);
        }

        [TestMethod]
        public void UpdateObjectivesOrderedList_ShouldCallMethodReorderRelatedObjectives()
        {
            //Arrange
            var course = Substitute.For<Course>();
            var objectivesCollection = new Collection<Objective>();
            _user.Identity.Name.Returns("user");

            //Act
            _controller.UpdateObjectivesOrderedList(course, objectivesCollection);

            //Assert
            course.Received().UpdateObjectivesOrder(objectivesCollection, "user");
        }

        [TestMethod]
        public void UpdateObjectivesOrderedList_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            //Act
            var result = _controller.UpdateObjectivesOrderedList(course, new List<Objective>());

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = course.ModifiedOn });
        }

        #endregion UpdateObjectivesOrder

    }
}
