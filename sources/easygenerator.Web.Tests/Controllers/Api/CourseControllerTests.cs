using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
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
using easygenerator.Web.Publish.External;
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
using easygenerator.Web.Components.DomainOperations.CourseOperations;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Publish.Coggno;
using easygenerator.Web.ViewModels.Api;

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
        private ISectionRepository _sectionRepository;
        private IPrincipal _user;
        private HttpContextBase _context;
        private IUrlHelperWrapper _urlHelper;
        private IPublisher _publisher;
        private ICoggnoPublisher _coggnoPublisher;
        private IEntityMapper _entityMapper;
        private IDomainEventPublisher _eventPublisher;
        private ITemplateRepository _templateRepository;
        private IExternalPublisher _externalPublisher;
        private IUserRepository _userRepository;
        private ICloner _cloner;
        private ICourseDomainOperationExecutor _courseDomainOperationExecutor;
        private ISamlServiceProviderRepository _samlServiceProviderRepository;
        private ILog _logger;
        private ConfigurationReader _configurationReader;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _courseRepository = Substitute.For<ICourseRepository>();
            _sectionRepository = Substitute.For<ISectionRepository>();
            _builder = Substitute.For<ICourseBuilder>();
            _scormCourseBuilder = Substitute.For<IScormCourseBuilder>();
            _publisher = Substitute.For<IPublisher>();
            _coggnoPublisher = Substitute.For<ICoggnoPublisher>();
            _urlHelper = Substitute.For<IUrlHelperWrapper>();
            _entityMapper = Substitute.For<IEntityMapper>();
            _eventPublisher = Substitute.For<IDomainEventPublisher>();
            _templateRepository = Substitute.For<ITemplateRepository>();
            _externalPublisher = Substitute.For<IExternalPublisher>();
            _userRepository = Substitute.For<IUserRepository>();
            _cloner = Substitute.For<ICloner>();
            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _courseDomainOperationExecutor = Substitute.For<ICourseDomainOperationExecutor>();
            _samlServiceProviderRepository = Substitute.For<ISamlServiceProviderRepository>();
            _logger = Substitute.For<ILog>();
            _configurationReader = Substitute.For<ConfigurationReader>();

            _context.User.Returns(_user);

            _controller = new CourseController(_builder, _scormCourseBuilder, _courseRepository, _sectionRepository, _entityFactory, _urlHelper, _publisher, _coggnoPublisher,
                _entityMapper, _eventPublisher, _templateRepository, _externalPublisher, _userRepository, _cloner, _courseDomainOperationExecutor, _samlServiceProviderRepository,
                _logger,  _configurationReader);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region Create

        [TestMethod]
        public void Create_WhenTemplateDefined_ShouldReturnJsonSuccessResult()
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

        [TestMethod]
        public void Create_WhenTemplateNotDefined_ShouldAddCourse_WithDefaultTemplate()
        {
            const string title = "Course title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var course = CourseObjectMother.CreateWithTitle(title);
            var template = TemplateObjectMother.Create();
            _entityFactory.Course(title, template, user).Returns(course);
            _templateRepository.GetDefaultTemplate().Returns(template);

            _controller.Create(title, null);

            _courseDomainOperationExecutor.Received().CreateCourse(Arg.Is<Course>(exp => exp.Title == title));
        }

        [TestMethod]
        public void Create_WhenTemplateNotDefined_ShouldReturnJsonSuccessResult()
        {
            const string title = "Course title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var course = CourseObjectMother.CreateWithTitle(title);
            var template = TemplateObjectMother.Create();
            _entityFactory.Course(title, template, user).Returns(course);
            _templateRepository.GetDefaultTemplate().Returns(template);

            var result = _controller.Create(title, null);

            ActionResultAssert.IsJsonSuccessResult(result);
        }

        [TestMethod]
        public void Create_ShouldexecuteDomainOperation()
        {
            const string title = "Course title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var course = CourseObjectMother.CreateWithTitle(title);
            var template = TemplateObjectMother.Create();
            _entityFactory.Course(title, template, user).Returns(course);
            _templateRepository.GetDefaultTemplate().Returns(template);

            _controller.Create(title, null);

            _courseDomainOperationExecutor.Received().CreateCourse(course);
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
        public void Duplicate_ShouldExecuteDomainOperation()
        {
            Course courseToDuplicate = CourseObjectMother.Create();
            _cloner.Clone(Arg.Any<Course>(), Arg.Any<string>(), true).Returns(courseToDuplicate);
            _controller.Duplicate(courseToDuplicate);

            _courseDomainOperationExecutor.Received().CreateCourse(courseToDuplicate);
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
        public void Duplicate_WhenCourseTitleIsLarge_ShouldRemoveLast10SymbolsOfCourseTitleAndAddBigDuplicatedCourseSuffix()
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
        public void Duplicate_ShouldAddDuplicatedSectionSuffixToSectionsTitles()
        {
            Course courseToDuplicate = CourseObjectMother.Create();
            Section sectionToDuplicate = SectionObjectMother.Create();
            courseToDuplicate.RelateSection(sectionToDuplicate, 0, "some@user.com");
            var sectionTitle = sectionToDuplicate.Title;
            _cloner.Clone(Arg.Any<Course>(), Arg.Any<string>(), true).Returns(courseToDuplicate);
            _controller.Duplicate(courseToDuplicate);
            sectionToDuplicate.Title.Should().Be(sectionTitle + " (copy)");
        }

        [TestMethod]
        public void Duplicate_WhenSectionTitleIsLarge_ShouldRemoveLast10SymbolsOfCourseTitleAndAddBigDuplicatedSectionSuffix()
        {
            Course courseToDuplicate = CourseObjectMother.Create();
            Section sectionToDuplicate = SectionObjectMother.Create();
            sectionToDuplicate.UpdateTitle("New section!New section!New section!New section!New section!New section!New section!New section!New section!New section!New section!New section!New section!New section!New section!New section!New section!New section!New section!New section!New section!New", "modifier");
            courseToDuplicate.RelateSection(sectionToDuplicate, 0, "some@user.com");
            var sectionTitle = sectionToDuplicate.Title;
            var newTitle = String.Format("{0} {1}", sectionTitle.Substring(0, 244), "... (copy)");
            _cloner.Clone(Arg.Any<Course>(), Arg.Any<string>(), true).Returns(courseToDuplicate);
            _controller.Duplicate(courseToDuplicate);
            sectionToDuplicate.Title.Should().Be(newTitle);
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
        public void Delete_ShouldRemoveCourse_WhenItNotNull()
        {
            var course = CourseObjectMother.Create();

            _controller.Delete(course);

            _courseRepository.Received().Remove(course);
        }

        [TestMethod]
        public void Delete_ShouldDeleteCourseFromLearningPath_WhenCourseIsInLearningPath()
        {
            var course = Substitute.For<Course>();
            var courses = new Collection<Course>();
            courses.Add(course);

            var learningPath = Substitute.For<LearningPath>(); ;
            var learningPaths = new Collection<LearningPath>();
            learningPaths.Add(learningPath);

            learningPath.Entities.Returns(courses);
            course.LearningPaths.Returns(learningPaths);

            _controller.Delete(course);

            learningPath.Received().RemoveEntity(course, Arg.Any<string>());
        }

        [TestMethod]
        public void Delete_ShouldDeleteSection_WhenItIsNotRelatedToOtherCourse()
        {
            var course = Substitute.For<Course>();
            var courses = new Collection<Course>();
            courses.Add(course);

            var section = Substitute.For<Section>(); ;
            var sections = new Collection<Section>();
            sections.Add(section);

            course.RelatedSections.Returns(sections);
            section.Courses.Returns(courses);

            _controller.Delete(course);

            _sectionRepository.Received().Remove(section);
        }

        [TestMethod]
        public void Delete_ShouldNotDeleteSection_WhenItIsRelatedToOtherCourse()
        {
            var course1 = Substitute.For<Course>("Some title1", TemplateObjectMother.Create(), CreatedBy);
            var course2 = Substitute.For<Course>("Some title2", TemplateObjectMother.Create(), CreatedBy);
            var courses = new Collection<Course>();
            courses.Add(course1);
            courses.Add(course2);

            var section = Substitute.For<Section>(); ;
            var sections = new Collection<Section>();
            sections.Add(section);

            course1.RelatedSections.Returns(sections);
            section.Courses.Returns(courses);

            _controller.Delete(course1);

            _sectionRepository.DidNotReceive().Remove(section);
        }

        [TestMethod]
        public void Delete_ShouldDeleteAllQuestions_WhenCourseSectionIsDeleted()
        {
            var course = Substitute.For<Course>();
            var courses = new Collection<Course>();
            courses.Add(course);

            var section = Substitute.For<Section>(); ;
            var sections = new Collection<Section>();
            sections.Add(section);

            var question = Substitute.For<Question>();
            var questions = new Collection<Question>();
            questions.Add(question);

            course.RelatedSections.Returns(sections);
            section.Courses.Returns(courses);
            section.Questions.Returns(questions);

            _controller.Delete(course);

            section.Received().RemoveQuestion(question, Arg.Any<string>());
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
            _publisher.Publish(Arg.Any<Course>()).Returns(false);

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
            _publisher.Publish(course).Returns(true);
            course.UpdatePublicationUrl("url");
            _urlHelper.AddCurrentSchemeToUrl(course.PublicationUrl).Returns("http:" + course.PublicationUrl);

            //Act
            var result = _controller.Publish(course);

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { PublishedPackageUrl = "http:" + course.PublicationUrl });
        }

        #endregion

        #region Publish course to Coggno

        [TestMethod]
        public void PublishToCoggno_ShouldReturnJsonErrorResult_WhenCourseIsBeingProcessed()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            course.MarkAsPublishedForSale();

            //Act
            var result = _controller.PublishToCoggno(course);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.CourseIsBeingProcessedAndCannotBePublished);
        }

        [TestMethod]
        public void PublishToCoggno_ShouldReturnJsonErrorResult_WhenCourseHasNotBeenPublishedByTheOwnerYet()
        {
            //Arrange
            var course = CourseObjectMother.CreateWithCreatedBy("r@p.com");

            //Act
            var result = _controller.PublishToCoggno(course);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.CourseHasNotBeenPublishedByTheOwner);
        }

        [TestMethod]
        public void PublishToCoggno_ShouldReturnJsonErrorResult_WhenUserDoesNotExist()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            course.UpdateDocumentIdForSale("12345");
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns((User)null);

            //Act
            var result = _controller.PublishToCoggno(course);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.UserDoesntExist);
        }

        [TestMethod]
        public void PublishToCoggno_ShouldReturnJsonErrorResult_WhenCoggnoServiceProviderDoesNotExistOrNotAllowed()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            course.UpdateDocumentIdForSale("12345");
            var user = UserObjectMother.Create();
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(user);
            _samlServiceProviderRepository.GetByAssertionConsumerService(Arg.Any<string>())
                .Returns((SamlServiceProvider) null);
            _configurationReader.CoggnoConfiguration.Returns(new CoggnoConfigurationSection());
            //Act
            var result = _controller.PublishToCoggno(course);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.CoggnoSamlServiceProviderNotAllowed);
        }

        [TestMethod]
        public void PublishToCoggno_ShouldReturnJsonErrorResult_WhenPublishFails()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            course.UpdateDocumentIdForSale("12345");
            var user = UserObjectMother.Create();
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(user);
            var samlServiceProvider = SamlServiceProviderObjectMother.Create();
            _samlServiceProviderRepository.GetByAssertionConsumerService(Arg.Any<string>())
                .Returns(samlServiceProvider);
            user.Allow(samlServiceProvider, "r@p.com");
            _configurationReader.CoggnoConfiguration.Returns(new CoggnoConfigurationSection());
            _coggnoPublisher.Publish(course, Arg.Any<string>(), Arg.Any<string>()).Returns(false);

            //Act
            var result = _controller.PublishToCoggno(course);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.CoursePublishActionFailedError);
        }

        [TestMethod]
        public void PublishToCoggno_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            course.UpdateDocumentIdForSale("12345");
            var user = UserObjectMother.Create();
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(user);
            var samlServiceProvider = SamlServiceProviderObjectMother.Create();
            _samlServiceProviderRepository.GetByAssertionConsumerService(Arg.Any<string>())
                .Returns(samlServiceProvider);
            user.Allow(samlServiceProvider, "r@p.com");
            _configurationReader.CoggnoConfiguration.Returns(new CoggnoConfigurationSection());
            _coggnoPublisher.Publish(course, Arg.Any<string>(), Arg.Any<string>()).Returns(true);

            //Act
            var result = _controller.PublishToCoggno(course);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region publish to Coggno completed

        [TestMethod]
        public void PublishToCoggnoCompleted_ShouldThrowArgumentException_WhenIdIsNotAValidGuid()
        {
            //Arrange
            var viewModel = new CoggnoPublishCompletedViewModel()
            {
                id = "id"
            };
            //Act
            Action action = () => _controller.PublishToCoggnoCompleted(viewModel);

            //Assert
            action.ShouldThrow<ArgumentException>().And.Message.Should().Be(Errors.CourseIdHasInvalidFormat);
        }

        [TestMethod]
        public void PublishToCoggnoCompleted_ShouldReturnOk_WhenCourseWasNotFound()
        {
            //Arrange
            var viewModel = new CoggnoPublishCompletedViewModel()
            {
                id = Guid.NewGuid().ToString()
            };
            _courseRepository.Get(Arg.Any<Guid>()).Returns((Course)null);
            //Act
            var result = _controller.PublishToCoggnoCompleted(viewModel);

            //Assert
            result.Should().BeHttpStatusCodeResult().And.StatusCode.Should().Be(200);
        }

        [TestMethod]
        public void PublishToCoggnoCompleted_ShouldMarkCourseProcessingAsFailed_WhenProcessingWasNotSuccessfull()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            course.MarkAsPublishedForSale();
            var viewModel = new CoggnoPublishCompletedViewModel()
            {
                id = Guid.NewGuid().ToString(),
                success = false
            };
            _courseRepository.Get(Arg.Any<Guid>()).Returns(course);
            //Act
            _controller.PublishToCoggnoCompleted(viewModel);

            //Assert
            course.SaleInfo.IsProcessing.Should().BeFalse();
        }

        [TestMethod]
        public void PublishToCoggnoCompleted_ShouldLogException_WhenProcessingWasNotSuccessfull()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            course.MarkAsPublishedForSale();
            var viewModel = new CoggnoPublishCompletedViewModel()
            {
                id = Guid.NewGuid().ToString(),
                success = false
            };
            _courseRepository.Get(Arg.Any<Guid>()).Returns(course);
            //Act
            _controller.PublishToCoggnoCompleted(viewModel);

            //Assert
            _logger.Received().LogException(Arg.Any<Exception>());
        }

        [TestMethod]
        public void PublishToCoggnoCompleted_ShouldReturnOk_WhenProcessingWasNotSuccessfull()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            course.MarkAsPublishedForSale();
            var viewModel = new CoggnoPublishCompletedViewModel()
            {
                id = Guid.NewGuid().ToString(),
                success = false
            };
            _courseRepository.Get(Arg.Any<Guid>()).Returns(course);
            //Act
            var result = _controller.PublishToCoggnoCompleted(viewModel);

            //Assert
            result.Should().BeHttpStatusCodeResult().And.StatusCode.Should().Be(200);
        }

        [TestMethod]
        public void PublishToCoggnoCompleted_ShouldThrowArgumentException_WhenProcessingWasSuccessfull_AndDocumentIdIsNullOrEmpty()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            course.MarkAsPublishedForSale();
            var viewModel = new CoggnoPublishCompletedViewModel()
            {
                id = Guid.NewGuid().ToString(),
                success = true,
                documentId = null
            };
            _courseRepository.Get(Arg.Any<Guid>()).Returns(course);
            //Act
            Action action = () => _controller.PublishToCoggnoCompleted(viewModel);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be(nameof(viewModel.documentId));
        }

        [TestMethod]
        public void PublishToCoggnoCompleted_ShouldUpdateDocumentId_WhenProcessingWasSuccessfull()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            course.MarkAsPublishedForSale();
            var viewModel = new CoggnoPublishCompletedViewModel()
            {
                id = Guid.NewGuid().ToString(),
                success = true,
                documentId = "1234567"
            };
            _courseRepository.Get(Arg.Any<Guid>()).Returns(course);
            //Act
            _controller.PublishToCoggnoCompleted(viewModel);

            //Assert
            course.SaleInfo.DocumentId.Should().Be(viewModel.documentId);
        }

        [TestMethod]
        public void PublishToCoggnoCompleted_ShouldReturnOk_WhenProcessingWasSuccessfull()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            course.MarkAsPublishedForSale();
            var viewModel = new CoggnoPublishCompletedViewModel()
            {
                id = Guid.NewGuid().ToString(),
                success = true,
                documentId = "1234567"
            };
            _courseRepository.Get(Arg.Any<Guid>()).Returns(course);
            //Act
            var result = _controller.PublishToCoggnoCompleted(viewModel);

            //Assert
            result.Should().BeHttpStatusCodeResult().And.StatusCode.Should().Be(200);
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
            _publisher.Publish(Arg.Any<Course>()).Returns(false);

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
            _publisher.Publish(course).Returns(true);
            _urlHelper.ToAbsoluteUrl(Arg.Any<string>()).Returns("url");

            //Act
            var result = _controller.PublishForReview(course);

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ReviewUrl = "url" });
        }

        #endregion

        #region Publish to custom LMS

        [TestMethod]
        public void PublishToCustomLms_ShouldReturnJsonErrorResult_WhenUserDoesNotExist()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var company = CompanyObjectMother.Create();

            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns((User)null);

            //Act
            var result = _controller.PublishToCustomLms(course, company);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.UserDoesntExist);
        }

        [TestMethod]
        public void PublishToCustomLms_ShouldReturnJsonErrorResult_WhenUserNotMemberOfCompany()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var user = UserObjectMother.Create();
            var company = CompanyObjectMother.Create();
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(user);

            //Act
            var result = _controller.PublishToCustomLms(course, company);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.UserNotMemberOfCompany);
        }

        [TestMethod]
        public void PublishToCustomLms_ShouldReturnJsonErrorResult_WhenCourseNotFound()
        {
            //Arrange
            var company = CompanyObjectMother.Create();
            var user = UserObjectMother.CreateWithCompany(company);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(user);

            //Act
            var result = _controller.PublishToCustomLms(null, company);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.CourseNotFoundError);
        }

        [TestMethod]
        public void PublishToCustomLms_ShouldReturnJsonErrorResult_WhenPublishFails()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var company = CompanyObjectMother.Create();
            var user = UserObjectMother.CreateWithCompany(company);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(user);
            _externalPublisher.Publish(course, company, user.Email).Returns(false);

            //Act
            var result = _controller.PublishToCustomLms(course, company);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.CoursePublishActionFailedError);
        }

        [TestMethod]
        public void PublishToCustomLms_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var company = CompanyObjectMother.Create();
            var user = UserObjectMother.CreateWithCompany(company);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(user);
            _externalPublisher.Publish(course, company, user.Email).Returns(true);

            //Act
            var result = _controller.PublishToCustomLms(course, company);

            //Assert
            result.Should().BeJsonSuccessResult();
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

        #region Relate Sections

        [TestMethod]
        public void RelateSections_ShouldReturnJson()
        {
            //Arrange
            _user.Identity.Name.Returns("Test user");
            var course = CourseObjectMother.Create();
            var relatedSection = SectionObjectMother.Create();

            //Act
            var result = _controller.RelateSection(course, relatedSection, null);

            //Assert
            ActionResultAssert.IsJsonSuccessResult(result);
        }

        [TestMethod]
        public void RelateSections_ShouldRelateSectionToCourse()
        {
            //Arrange
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var course = Substitute.For<Course>("title", TemplateObjectMother.Create(), CreatedBy);
            var section = SectionObjectMother.Create();

            //Act
            _controller.RelateSection(course, section, null);

            //Assert
            course.Received().RelateSection(section, null, user);
        }

        [TestMethod]
        public void RelateSections_ShouldReturnJsonErrorResult_WhenCourseIsNull()
        {
            //Arrange
            var section = SectionObjectMother.Create();

            //Act
            var result = _controller.RelateSection(null, section, null);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be("Course is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("courseNotFoundError");
        }

        [TestMethod]
        public void RelateSections_ShouldReturnJsonErrorResult_WhenSectionListIsEmpty()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var section = SectionObjectMother.Create();

            //Act
            var result = _controller.RelateSection(course, null, null);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be("Section is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("sectionNotFoundError");
        }

        #endregion

        #region Unrelate Sections

        [TestMethod]
        public void UnrelateSections_ShouldReturnJson()
        {
            //Arrange
            _user.Identity.Name.Returns("Test user");
            var course = CourseObjectMother.Create();
            var relatedSections = new List<Section>() { SectionObjectMother.Create() };

            //Act
            var result = _controller.UnrelateSections(course, relatedSections);

            //Assert
            ActionResultAssert.IsJsonSuccessResult(result);
        }

        [TestMethod]
        public void UnrelateSections_ShouldUnrelateSectionFromCourse()
        {
            //Arrange
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var section = SectionObjectMother.Create();
            var course = Substitute.For<Course>("title", TemplateObjectMother.Create(), CreatedBy);

            //Act
            _controller.UnrelateSections(course, new List<Section>() { section });

            //Assert
            course.Received().UnrelateSection(section, user);
        }

        [TestMethod]
        public void UnrelateSections_ShouldReturnJsonErrorResult_WhenCourseIsNull()
        {
            //Arrange
            var section = SectionObjectMother.Create();

            //Act
            var result = _controller.UnrelateSections(null, new List<Section>() { section });

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be("Course is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("courseNotFoundError");
        }

        [TestMethod]
        public void UnrelateSections_ShouldReturnJsonErrorResult_WhenSectionListIsEmpty()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            var result = _controller.UnrelateSections(course, new List<Section>() { });

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be("Sections are not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("sectionsNotFoundError");
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

        #region UpdateSectionsOrder

        [TestMethod]
        public void UpdateSectionsOrderedList_ShouldReturnHttpNotFound_WhenCourseIsNull()
        {
            //Arrange

            //Act
            var result = _controller.UpdateSectionsOrderedList(null, new List<Section>());

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.CourseNotFoundError);
        }

        [TestMethod]
        public void UpdateSectionsOrderedList_ShouldCallMethodReorderRelatedSections()
        {
            //Arrange
            var course = Substitute.For<Course>();
            var sectionsCollection = new Collection<Section>();
            _user.Identity.Name.Returns("user");

            //Act
            _controller.UpdateSectionsOrderedList(course, sectionsCollection);

            //Assert
            course.Received().UpdateSectionsOrder(sectionsCollection, "user");
        }

        [TestMethod]
        public void UpdateSectionsOrderedList_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            //Act
            var result = _controller.UpdateSectionsOrderedList(course, new List<Section>());

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = course.ModifiedOn });
        }

        #endregion UpdateSectionsOrder

    }
}