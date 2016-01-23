using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildLearningPath;
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
using easygenerator.Web.Components;
using easygenerator.Web.Publish.External;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class LearningPathControllerTests
    {
        private const string Username = "easygenerator@easygenerator.com";
        private const string Title = "easygenerator@easygenerator.com";

        private LearningPathController _controller;

        private IUrlHelperWrapper _urlHelper;
        private ILearningPathRepository _repository;
        private IEntityModelMapper<LearningPath> _mapper;
        private IEntityFactory _entityFactory;
        private ILearningPathBuilder _builder;
        private ILearningPathPublisher _publisher;
        private IUserRepository _userRepository;
        private IDocumentRepository _documentRepository;
        private IExternalLearningPathPublisher _externalPublisher;

        private IPrincipal _user;
        private HttpContextBase _context;

        [TestInitialize]
        public void InitializeContext()
        {
            _urlHelper = Substitute.For<IUrlHelperWrapper>();
            _entityFactory = Substitute.For<IEntityFactory>();
            _mapper = Substitute.For<IEntityModelMapper<LearningPath>>();
            _repository = Substitute.For<ILearningPathRepository>();
            _builder = Substitute.For<ILearningPathBuilder>();
            _publisher = Substitute.For<ILearningPathPublisher>();
            _userRepository = Substitute.For<IUserRepository>();
            _documentRepository = Substitute.For<IDocumentRepository>();
            _externalPublisher = Substitute.For<IExternalLearningPathPublisher>();

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);

            _controller = new LearningPathController(_urlHelper, _repository, _mapper, _entityFactory, _builder, _publisher, _userRepository, _documentRepository, _externalPublisher);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region Create

        [TestMethod]
        public void Create_ShouldAddLearningPathToRepository()
        {
            //Arrange
            _user.Identity.Name.Returns(Username);

            var learningPath = LearningPathObjectMother.CreateWithTitle(Title);
            _entityFactory.LearningPath(Title, Username).Returns(learningPath);

            //Act
            _controller.Create(Title);

            //Assert
            _repository.Received().Add(learningPath);
        }

        [TestMethod]
        public void Create_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            _user.Identity.Name.Returns(Username);

            var learningPath = LearningPathObjectMother.CreateWithTitle(Title);
            _entityFactory.LearningPath(Title, Username).Returns(learningPath);

            //Act
            var result = _controller.Create(Title);

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.Should().NotBeNull();
        }

        #endregion

        #region GetCollection

        [TestMethod]
        public void GetCollection_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var learningPath1 = LearningPathObjectMother.Create();
            var learningPath2 = LearningPathObjectMother.Create();
            var learningPaths = new[] { learningPath1, learningPath2 };
            _repository.GetCollection().ReturnsForAnyArgs(learningPaths);
            _mapper.Map(learningPath1).Returns(learningPath1);
            _mapper.Map(learningPath2).Returns(learningPath2);

            //Act
            var result = _controller.GetCollection();

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.Should().NotBeNull();
        }

        #endregion

        #region Update Title

        [TestMethod]
        public void Update_ShouldReturnJsonErrorResult_WhenLearningPathIsNull()
        {
            var result = _controller.UpdateTitle(null, String.Empty);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Learning path is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("learningPathNotFoundError");
        }

        [TestMethod]
        public void Update_ShouldUpdateLearningPathTitle()
        {
            const string title = "updated title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var learningPath = Substitute.For<LearningPath>("Some title", "author@com.ua");

            _controller.UpdateTitle(learningPath, title);

            learningPath.Received().UpdateTitle(title, user);
        }

        [TestMethod]
        public void Update_ShouldReturnJsonSuccessResult()
        {
            var learningPath = Substitute.For<LearningPath>("Some title", "author@com.ua");

            var result = _controller.UpdateTitle(learningPath, String.Empty);

            result.Should().BeJsonSuccessResult();
        }


        #endregion

        #region AddCourse

        [TestMethod]
        public void AddCourse_ShouldReturnJson()
        {
            //Arrange
            _user.Identity.Name.Returns(Username);
            var learningPath = LearningPathObjectMother.Create();
            var course = CourseObjectMother.Create();

            //Act
            var result = _controller.AddCourse(learningPath, course, null);

            //Assert
            ActionResultAssert.IsJsonSuccessResult(result);
        }

        [TestMethod]
        public void AddCourse_ShouldAddCourseToLearningPath()
        {
            //Arrange
            _user.Identity.Name.Returns(Username);
            var learningPath = Substitute.For<LearningPath>();
            var course = CourseObjectMother.Create();

            //Act
            _controller.AddCourse(learningPath, course, null);

            //Assert
            learningPath.Received().AddEntity(course, null, Username);
        }

        [TestMethod]
        public void AddCourse_ShouldReturnJsonErrorResult_WhenLearningPathIsNull()
        {
            //Arrange
            _user.Identity.Name.Returns(Username);
            var course = CourseObjectMother.Create();

            //Act
            var result = _controller.AddCourse(null, course, null);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.LearningPathNotFoundError);
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be(Errors.LearningPathNotFoundResourceKey);
        }

        [TestMethod]
        public void AddCourse_ShouldReturnJsonErrorResult_WhenCourseIsNull()
        {
            //Arrange
            _user.Identity.Name.Returns(Username);
            var learningPath = Substitute.For<LearningPath>();

            //Act
            var result = _controller.AddCourse(learningPath, null, null);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.CourseNotFoundError);
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be(Errors.CourseNotFoundResourceKey);
        }

        #endregion

        #region RemoveCourse

        [TestMethod]
        public void RemoveCourse_ShouldReturnJson()
        {
            //Arrange
            _user.Identity.Name.Returns(Username);
            var learningPath = LearningPathObjectMother.Create();
            var course = CourseObjectMother.Create();

            //Act
            var result = _controller.RemoveCourse(learningPath, course);

            //Assert
            ActionResultAssert.IsJsonSuccessResult(result);
        }

        [TestMethod]
        public void RemoveCourse_ShouldRemoveCourseFromLearningPath()
        {
            //Arrange
            _user.Identity.Name.Returns(Username);
            var learningPath = Substitute.For<LearningPath>();
            var course = CourseObjectMother.Create();

            //Act
            _controller.RemoveCourse(learningPath, course);

            //Assert
            learningPath.Received().RemoveEntity(course, Username);
        }

        [TestMethod]
        public void RemoveCourse_ShouldReturnJsonErrorResult_WhenLearningPathIsNull()
        {
            //Arrange
            _user.Identity.Name.Returns(Username);
            var course = CourseObjectMother.Create();

            //Act
            var result = _controller.RemoveCourse(null, course);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.LearningPathNotFoundError);
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be(Errors.LearningPathNotFoundResourceKey);
        }

        [TestMethod]
        public void RemoveCourse_ShouldReturnJsonErrorResult_WhenCourseIsNull()
        {
            //Arrange
            _user.Identity.Name.Returns(Username);
            var learningPath = Substitute.For<LearningPath>();

            //Act
            var result = _controller.RemoveCourse(learningPath, null);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.CourseNotFoundError);
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be(Errors.CourseNotFoundResourceKey);
        }

        #endregion

        #region AddDocument

        [TestMethod]
        public void AddDocument_ShouldReturnJson()
        {
            //Arrange
            _user.Identity.Name.Returns(Username);
            var learningPath = LearningPathObjectMother.Create();
            var document = DocumentObjectMother.Create();

            //Act
            var result = _controller.AddDocument(learningPath, document, null);

            //Assert
            ActionResultAssert.IsJsonSuccessResult(result);
        }

        [TestMethod]
        public void AddDocument_ShouldAddDocumentToLearningPath()
        {
            //Arrange
            _user.Identity.Name.Returns(Username);
            var learningPath = Substitute.For<LearningPath>();
            var document = DocumentObjectMother.Create();

            //Act
            _controller.AddDocument(learningPath, document, null);

            //Assert
            learningPath.Received().AddEntity(document, null, Username);
        }

        [TestMethod]
        public void AddDocument_ShouldReturnJsonErrorResult_WhenLearningPathIsNull()
        {
            //Arrange
            _user.Identity.Name.Returns(Username);
            var document = DocumentObjectMother.Create();

            //Act
            var result = _controller.AddDocument(null, document, null);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.LearningPathNotFoundError);
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be(Errors.LearningPathNotFoundResourceKey);
        }

        [TestMethod]
        public void AddDocument_ShouldReturnJsonErrorResult_WhenDocumentIsNull()
        {
            //Arrange
            _user.Identity.Name.Returns(Username);
            var learningPath = Substitute.For<LearningPath>();

            //Act
            var result = _controller.AddDocument(learningPath, null, null);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.DocumentNotFoundError);
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be(Errors.DocumentNotFoundResourceKey);
        }

        #endregion

        #region RemoveDocument

        [TestMethod]
        public void RemoveDocument_ShouldReturnJson()
        {
            //Arrange
            _user.Identity.Name.Returns(Username);
            var learningPath = LearningPathObjectMother.Create();
            var document = DocumentObjectMother.Create();

            //Act
            var result = _controller.RemoveDocument(learningPath, document);

            //Assert
            ActionResultAssert.IsJsonSuccessResult(result);
        }

        [TestMethod]
        public void RemoveDocument_ShouldRemoveDocumentFromLearningPath()
        {
            //Arrange
            _user.Identity.Name.Returns(Username);
            var learningPath = Substitute.For<LearningPath>();
            var document = DocumentObjectMother.Create();

            //Act
            _controller.RemoveDocument(learningPath, document);

            //Assert
            learningPath.Received().RemoveEntity(document, Username);
        }

        [TestMethod]
        public void RemoveDocument_ShouldReturnJsonErrorResult_WhenLearningPathIsNull()
        {
            //Arrange
            _user.Identity.Name.Returns(Username);
            var document = DocumentObjectMother.Create();

            //Act
            var result = _controller.RemoveDocument(null, document);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.LearningPathNotFoundError);
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be(Errors.LearningPathNotFoundResourceKey);
        }

        [TestMethod]
        public void RemoveDocument_ShouldReturnJsonErrorResult_WhenDocumentIsNull()
        {
            //Arrange
            _user.Identity.Name.Returns(Username);
            var learningPath = Substitute.For<LearningPath>();

            //Act
            var result = _controller.RemoveDocument(learningPath, null);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.DocumentNotFoundError);
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be(Errors.DocumentNotFoundResourceKey);
        }

        #endregion

        #region UpdateEntitiesOrder

        [TestMethod]
        public void UpdateCourseOrder_ShouldReturnHttpNotFound_WhenLearningPathIsNull()
        {
            //Arrange

            //Act
            var result = _controller.UpdateEntitiesOrder(null, new List<ILearningPathEntity>());

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.LearningPathNotFoundError);
        }

        [TestMethod]
        public void UpdateEntitiesOrder_ShouldCallMethodReorderEntities()
        {
            //Arrange
            var learningPath = Substitute.For<LearningPath>();
            var entities = new Collection<ILearningPathEntity>();
            _user.Identity.Name.Returns(Username);

            //Act
            _controller.UpdateEntitiesOrder(learningPath, entities);

            //Assert
            learningPath.Received().UpdateEntitiesOrder(entities, Username);
        }

        [TestMethod]
        public void UpdateEntitiesOrder_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var learnignPath = LearningPathObjectMother.Create();

            //Act
            var result = _controller.UpdateEntitiesOrder(learnignPath, new List<ILearningPathEntity>());

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region DeleteLearningPath

        [TestMethod]
        public void DeleteLearningPath_ShouldReturnJsonSuccess_WhenLearningPathIsNull()
        {
            //Arrange

            //Act
            var result = _controller.Delete(null);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        [TestMethod]
        public void DeleteLearningPath_ShouldDeleteAllIncludedDocuments()
        {
            //Arrange
            _user.Identity.Name.Returns(Username);

            var learningPath = LearningPathObjectMother.Create();
            var document1 = DocumentObjectMother.Create();
            var document2 = DocumentObjectMother.Create();
            learningPath.AddEntity(document1, null, Username);
            learningPath.AddEntity(document2, null, Username);

            //Act
            _controller.Delete(learningPath);

            //Assert
            _documentRepository.Received().Remove(document1);
            _documentRepository.Received().Remove(document2);
            _repository.Received().Remove(learningPath);
        }

        [TestMethod]
        public void DeleteLearningPath_WhenLearningPathContainsDocuments_ShouldReturnJsonSuccessResultWithDeletedDocumentIds()
        {
            //Arrange
            _user.Identity.Name.Returns(Username);

            var learningPath = LearningPathObjectMother.Create();
            var document1 = DocumentObjectMother.Create();
            var document2 = DocumentObjectMother.Create();
            learningPath.AddEntity(document1, null, Username);
            learningPath.AddEntity(document2, null, Username);

            //Act
            var result = _controller.Delete(learningPath);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        [TestMethod]
        public void DeleteLearningPath_ShouldDeleteLearningPath()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();

            //Act
            _controller.Delete(learningPath);

            //Assert
            _repository.Received().Remove(learningPath);
        }

        [TestMethod]
        public void DeleteLearningPath_ShouldReturnJsonSuccess()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();

            //Act
            var result = _controller.Delete(learningPath);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region Build

        [TestMethod]
        public void Build_ShouldReturnJsonErrorResult_WhenLearningPathIsNull()
        {
            //Arrange

            //Act
            var result = _controller.Build(null);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.LearningPathNotFoundError);
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be(Errors.LearningPathNotFoundResourceKey);
        }

        [TestMethod]
        public void Build_ShouldBuildLearningPath()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();

            //Act
            _controller.Build(learningPath);

            //Assert
            _builder.Received().Build(learningPath);
        }

        [TestMethod]
        public void Build_ShouldReturnJsonErrorResult_WhenBuildIsFailed()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            _builder.Build(learningPath).Returns(false);

            //Act
            var result = _controller.Build(learningPath);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.LearningPathBuildActionFailedError);
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be(Errors.LearningPathBuildActionFailedResourceKey);
        }

        [TestMethod]
        public void Build_ShoudReturnPackageUrl_WhenBuildIsSucced()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            learningPath.UpdatePackageUrl("packageUrl");
            _builder.Build(learningPath).Returns(true);

            //Act
            var result = _controller.Build(learningPath);

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { PackageUrl = "packageUrl" });
        }

        #endregion

        #region Publish

        [TestMethod]
        public void Publish_ShouldReturnJsonErrorResult_WhenLearningPathIsNull()
        {
            //Arrange

            //Act
            var result = _controller.Publish(null);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.LearningPathNotFoundError);
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be(Errors.LearningPathNotFoundResourceKey);
        }

        [TestMethod]
        public void Publish_ShouldPublishLearningPath()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();

            //Act
            _controller.Publish(learningPath);

            //Assert
            _publisher.Received().Publish(learningPath);
        }

        [TestMethod]
        public void Publish_ShouldReturnJsonErrorResult_WhenPublishFailed()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            _publisher.Publish(learningPath).Returns(false);

            //Act
            var result = _controller.Publish(learningPath);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.LearningPathPublishActionFailedError);
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be(Errors.LearningPathPublishActionFailedResourceKey);
        }

        [TestMethod]
        public void Publish_ShouldReturnPublicationUrl_WhenPublishSucced()
        {
            //Arrange
            var publicationUrl = "PublicationUrl";
            var learningPath = LearningPathObjectMother.Create();
            learningPath.UpdatePublicationUrl(publicationUrl);
            _publisher.Publish(learningPath).Returns(true);
            _urlHelper.AddCurrentSchemeToUrl(publicationUrl).Returns("http:" + publicationUrl);

            //Act
            var result = _controller.Publish(learningPath);

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { PublicationUrl = "http:" + publicationUrl });
        }

        #endregion

        #region PublishToCustomLms

        [TestMethod]
        public void PublishToCustomLms_ShouldReturnJsonErrorResult_WhenLearningPathIsNull()
        {
            //Arrange

            //Act
            var result = _controller.PublishToCustomLms(null);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.LearningPathNotFoundError);
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be(Errors.LearningPathNotFoundResourceKey);
        }

        [TestMethod]
        public void PublishToCustomLms_ShouldReturnJsonErrorResult_WhenUserDoesNotExist()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns((User)null);

            //Act
            var result = _controller.PublishToCustomLms(learningPath);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.UserDoesntExist);
        }

        [TestMethod]
        public void PublishToCustomLms_ShouldReturnJsonErrorResult_WhenUserNotMemberOfAnyCompany()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var user = UserObjectMother.Create();
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(user);

            //Act
            var result = _controller.PublishToCustomLms(learningPath);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.UserNotMemberOfAnyCompany);
        }

        [TestMethod]
        public void PublishToCustomLms_ShouldPublishLearningPath()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var company = new Company();
            var user = UserObjectMother.CreateWithCompany(company);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(user);

            //Act
            _controller.PublishToCustomLms(learningPath);

            //Assert
            _externalPublisher.Received().Publish(learningPath, company, user.Email);
        }

        [TestMethod]
        public void PublishToCustomLms_ShouldReturnJsonErrorResult_WhenPublishFailed()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var user = UserObjectMother.CreateWithCompany(new Company());
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(user);
            _externalPublisher.Publish(learningPath, Arg.Any<Company>(), user.Email).Returns(false);

            //Act
            var result = _controller.PublishToCustomLms(learningPath);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.LearningPathPublishActionFailedError);
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be(Errors.LearningPathPublishActionFailedResourceKey);
        }

        [TestMethod]
        public void PublishToCustomLms_ShouldReturnSuccess_WhenPublishSucced()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var user = UserObjectMother.CreateWithCompany(new Company());
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(user);
            _externalPublisher.Publish(learningPath, Arg.Any<Company>(), user.Email).Returns(true);
            

            //Act
            var result = _controller.PublishToCustomLms(learningPath);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion
    }
}
