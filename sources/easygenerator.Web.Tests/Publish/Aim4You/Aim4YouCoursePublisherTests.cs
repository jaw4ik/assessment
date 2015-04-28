using easygenerator.Web.Publish.Aim4You;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NSubstitute;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Components;
using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Tests.Publish.Aim4You
{
    [TestClass]
    public class Aim4YouCoursePublisherTests
    {
        private IAim4YouCoursePublisher _aim4YouCoursePublisher;
        private PhysicalFileManager _physicalFileManager;
        private BuildPathProvider _buildPathProvider;
        private IAim4YouApiService _aim4YouApiService;
        private const string userEmail = "easygenerator@eg.com";

        [TestInitialize]
        public void InitializePublisher()
        {
            _physicalFileManager = Substitute.For<PhysicalFileManager>();
            _buildPathProvider = Substitute.For<BuildPathProvider>(Substitute.For<HttpRuntimeWrapper>());
            _aim4YouApiService = Substitute.For<IAim4YouApiService>();
            _aim4YouCoursePublisher = new Aim4YouCoursePublisher(_aim4YouApiService, _physicalFileManager, _buildPathProvider);
        }

        #region PublishCourse

        [TestMethod]
        public void PublishCourse_ShouldCheckIfUserIsRegisteredOnAim4You()
        {
            // Arrange
            Guid aim4YouCourseId = Guid.NewGuid();
            var course = CourseObjectMother.CreateWithAim4YouIntegration(aim4YouCourseId);

            // Act
            _aim4YouCoursePublisher.PublishCourse(userEmail, course, null);

            // Assert
            _aim4YouApiService.Received().IsUserRegistered(userEmail, Arg.Any<string>());
        }

        [TestMethod]
        public void PublishCourse_ShouldRegisterUser_WhenUserIsNotRegisteredOnAim4You()
        {
            // Arrange
            Guid aim4YouCourseId = Guid.NewGuid();
            var course = CourseObjectMother.CreateWithAim4YouIntegration(aim4YouCourseId);
            _aim4YouApiService.IsUserRegistered(userEmail, Arg.Any<string>()).Returns(false);
            // Act
            _aim4YouCoursePublisher.PublishCourse(userEmail, course, null);

            // Assert
            _aim4YouApiService.Received().RegisterUser(userEmail, Arg.Any<string>());
        }

        [TestMethod]
        public void PublishCourse_ShouldReturnFalse_WhenUserRegistrationFailed()
        {
            // Arrange
            Guid aim4YouCourseId = Guid.NewGuid();
            var course = CourseObjectMother.CreateWithAim4YouIntegration(aim4YouCourseId);
            _aim4YouApiService.IsUserRegistered(userEmail, Arg.Any<string>()).Returns(false);
            _aim4YouApiService.RegisterUser(Arg.Any<string>(), Arg.Any<string>()).Returns(false);
            // Act
            var result = _aim4YouCoursePublisher.PublishCourse(userEmail, course, null);

            // Assert
            result.Should().Be(false);
        }


        [TestMethod]
        public void PublishCourse_ShouldCheckIfCourseIsRegisteredOnAim4You_IfCourseAim4YouCourseIdExist()
        {
            // Arrange
            Guid aim4YouCourseId = Guid.NewGuid();
            var course = CourseObjectMother.CreateWithAim4YouIntegration(aim4YouCourseId);
            _aim4YouApiService.IsUserRegistered(userEmail, Arg.Any<string>()).Returns(true);
            // Act
            _aim4YouCoursePublisher.PublishCourse(userEmail, course, null);

            // Assert
            _aim4YouApiService.Received().IsCourseRegistered(aim4YouCourseId);
        }

        [TestMethod]
        public void PublishCourse_ShouldCallRegisterCourseMethod_IfCourseDoesntRegisteredYet()
        {
            // Arrange
            var course = CourseObjectMother.Create();
            _aim4YouApiService.IsUserRegistered(userEmail, Arg.Any<string>()).Returns(true);
            // Act
            _aim4YouCoursePublisher.PublishCourse(userEmail, course, null);

            // Assert
            _aim4YouApiService.Received().RegisterCourse(userEmail, course.Id, course.Title);
        }


        [TestMethod]
        public void PublishCourse_ShouldntCallRegisterCourseMethod_IfCourseAlreadyRegisteredAndExistOnAim4You()
        {
            // Arrange
            Guid aim4YouCourseId = Guid.NewGuid();
            var course = CourseObjectMother.CreateWithAim4YouIntegration(aim4YouCourseId);
            _aim4YouApiService.IsUserRegistered(userEmail, Arg.Any<string>()).Returns(true);
            _aim4YouApiService.IsCourseRegistered(aim4YouCourseId).Returns(true);

            // Act
            _aim4YouCoursePublisher.PublishCourse(userEmail, course, null);

            // Assert
            _aim4YouApiService.DidNotReceive().RegisterCourse(userEmail, course.Id, course.Title);
        }

        [TestMethod]
        public void PublishCourse_ShouldCallRegisterCourseMethod_IfCourseAlreadyRegisteredButDoesntExistOnAim4You()
        {
            // Arrange
            Guid aim4YouCourseId = Guid.NewGuid();
            var course = CourseObjectMother.CreateWithAim4YouIntegration(aim4YouCourseId);
            _aim4YouApiService.IsUserRegistered(userEmail, Arg.Any<string>()).Returns(true);
            _aim4YouApiService.IsCourseRegistered(aim4YouCourseId).Returns(false);

            // Act
            _aim4YouCoursePublisher.PublishCourse(userEmail, course, null);

            // Assert
            _aim4YouApiService.Received().RegisterCourse(userEmail, course.Id, course.Title);
        }

        [TestMethod]
        public void PublishCourse_ShouldReturnFalse_IfCourseWasNotRegistered()
        {
            // Arrange
            var course = CourseObjectMother.Create();
            _aim4YouApiService.IsUserRegistered(userEmail, Arg.Any<string>()).Returns(true);
            _aim4YouApiService.RegisterCourse(Arg.Any<string>(), Arg.Any<Guid>(), Arg.Any<string>()).Returns((Guid?)null);

            // Act
            var result = _aim4YouCoursePublisher.PublishCourse(userEmail, course, null);

            // Assert
            result.Should().Be(false);
        }

        [TestMethod]
        public void PublishCourse_ShouldUpdateAim4YouCourseId_IfCourseWasNotRegisteredYet()
        {
            // Arrange
            var course = Substitute.For<Course>();
            Guid aim4YouCourseId = Guid.NewGuid();
            _aim4YouApiService.IsUserRegistered(userEmail, Arg.Any<string>()).Returns(true);

            _aim4YouApiService.RegisterCourse(Arg.Any<string>(), Arg.Any<Guid>(), Arg.Any<string>()).Returns(aim4YouCourseId);

            // Act
            _aim4YouCoursePublisher.PublishCourse(userEmail, course, null);

            // Assert
            course.Received().RegisterOnAim4YOu(aim4YouCourseId);
        }

        [TestMethod]
        public void PublishCourse_ShouldUpdateAim4YouCourseId_IfItWasAlreadyRegisteredAndExistsOnAim4You()
        {
            // Arrange
            var aim4YouCourseId = Guid.NewGuid();
            var course = Substitute.For<Course>();
            var aim4YouIntegration = new Aim4YouIntegration();
            _aim4YouApiService.IsUserRegistered(userEmail, Arg.Any<string>()).Returns(true);
            aim4YouIntegration.UpdateAim4YouCourseId(aim4YouCourseId);
            course.Aim4YouIntegration.Returns(aim4YouIntegration);
            _aim4YouApiService.IsCourseRegistered(aim4YouCourseId).Returns(true);

            // Act
            _aim4YouCoursePublisher.PublishCourse(userEmail, course, null);

            // Assert
            course.Received().RegisterOnAim4YOu(aim4YouCourseId);
        }

        [TestMethod]
        public void PublishCourse_ShouldShouldCallUploadCourse_IfRegisterCourseReturnedResult()
        {
            // Arrange
            var course = CourseObjectMother.Create();
            var aim4YouCourseId = Guid.NewGuid();
            _aim4YouApiService.IsUserRegistered(userEmail, Arg.Any<string>()).Returns(true);
            _aim4YouApiService.RegisterCourse(Arg.Any<string>(), Arg.Any<Guid>(), Arg.Any<string>()).Returns(aim4YouCourseId);
            _aim4YouApiService.UploadCourse(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<byte[]>()).Returns(false);

            // Act
            var result = _aim4YouCoursePublisher.PublishCourse(userEmail, course, null);

            // Assert
            _aim4YouApiService.Received().UploadCourse(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<byte[]>());
        }


        [TestMethod]
        public void PublishCourse_ShouldShouldCallReployCourse_IfUploadCourseReturnedTrue()
        {
            // Arrange
            var course = CourseObjectMother.Create();
            var aim4YouCourseId = Guid.NewGuid();
            _aim4YouApiService.IsUserRegistered(userEmail, Arg.Any<string>()).Returns(true);
            _aim4YouApiService.RegisterCourse(Arg.Any<string>(), Arg.Any<Guid>(), Arg.Any<string>()).Returns(aim4YouCourseId);
            _aim4YouApiService.UploadCourse(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<byte[]>()).Returns(true);

            // Act
            var result = _aim4YouCoursePublisher.PublishCourse(userEmail, course, null);

            // Assert
            _aim4YouApiService.Received().DeployCourse(Arg.Any<Guid>());
        }

        [TestMethod]
        public void PublishCourse_ShouldReturnFalse_IfUploadCourseReturnedFalse()
        {
            // Arrange
            var course = CourseObjectMother.Create();
            var aim4YouCourseId = Guid.NewGuid();
            _aim4YouApiService.IsUserRegistered(userEmail, Arg.Any<string>()).Returns(true);
            _aim4YouApiService.RegisterCourse(Arg.Any<string>(), Arg.Any<Guid>(), Arg.Any<string>()).Returns(aim4YouCourseId);
            _aim4YouApiService.UploadCourse(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<byte[]>()).Returns(false);
            _aim4YouApiService.DeployCourse(Arg.Any<Guid>()).Returns(true);

            // Act
            var result = _aim4YouCoursePublisher.PublishCourse(userEmail, course, null);

            // Assert
            result.Should().Be(false);
        }

        [TestMethod]
        public void PublishCourse_ShouldReturnFalse_IfDeployCourseReturnedFalse()
        {
            // Arrange
            var course = CourseObjectMother.Create();
            var aim4YouCourseId = Guid.NewGuid();
            _aim4YouApiService.IsUserRegistered(userEmail, Arg.Any<string>()).Returns(true);
            _aim4YouApiService.RegisterCourse(Arg.Any<string>(), Arg.Any<Guid>(), Arg.Any<string>()).Returns(aim4YouCourseId);
            _aim4YouApiService.UploadCourse(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<byte[]>()).Returns(true);
            _aim4YouApiService.DeployCourse(Arg.Any<Guid>()).Returns(false);

            // Act
            var result = _aim4YouCoursePublisher.PublishCourse(userEmail, course, null);

            // Assert
            result.Should().Be(false);
        }

        [TestMethod]
        public void PublishCourse_ShouldReturnTrue_IfAllServiceMethodReturnedSuccessResults()
        {
            // Arrange
            var course = CourseObjectMother.Create();
            var aim4YouCourseId = Guid.NewGuid();
            _aim4YouApiService.IsUserRegistered(userEmail, Arg.Any<string>()).Returns(true);
            _aim4YouApiService.RegisterCourse(Arg.Any<string>(), Arg.Any<Guid>(), Arg.Any<string>()).Returns(aim4YouCourseId);
            _aim4YouApiService.UploadCourse(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<byte[]>()).Returns(true);
            _aim4YouApiService.DeployCourse(Arg.Any<Guid>()).Returns(true);

            // Act
            var result = _aim4YouCoursePublisher.PublishCourse(userEmail, course, null);

            // Assert
            result.Should().Be(true);
        }

        #endregion
    }
}
