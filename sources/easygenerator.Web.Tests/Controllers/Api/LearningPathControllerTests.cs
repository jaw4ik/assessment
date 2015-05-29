using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Controllers.Api;
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
    public class LearningPathControllerTests
    {
        private const string Username = "easygenerator@easygenerator.com";
        private const string Title = "easygenerator@easygenerator.com";

        private LearningPathController _controller;

        private ILearningPathRepository _repository;
        private IEntityModelMapper<LearningPath> _mapper;
        private IEntityFactory _entityFactory;
        IPrincipal _user;
        HttpContextBase _context;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _mapper = Substitute.For<IEntityModelMapper<LearningPath>>();
            _repository = Substitute.For<ILearningPathRepository>();

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);

            _controller = new LearningPathController(_repository, _mapper, _entityFactory);
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
            learningPath.Received().AddCourse(course, null, Username);
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
            learningPath.Received().RemoveCourse(course, Username);
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

        #region UpdateCourseOrder

        [TestMethod]
        public void UpdateCourseOrder_ShouldReturnHttpNotFound_WhenCourseIsNull()
        {
            //Arrange

            //Act
            var result = _controller.UpdateCourseOrder(null, new List<Course>());

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.LearningPathNotFoundError);
        }

        [TestMethod]
        public void UpdateCourseOrder_ShouldCallMethodReorderCourses()
        {
            //Arrange
            var learningPath = Substitute.For<LearningPath>();
            var courses = new Collection<Course>();
            _user.Identity.Name.Returns(Username);

            //Act
            _controller.UpdateCourseOrder(learningPath, courses);

            //Assert
            learningPath.Received().UpdateCoursesOrder(courses, Username);
        }

        [TestMethod]
        public void UpdateCourseOrder_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var learnignPath = LearningPathObjectMother.Create();

            //Act
            var result = _controller.UpdateCourseOrder(learnignPath, new List<Course>());

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion UpdateObjectivesOrder
    }
}
