using easygenerator.Infrastructure;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Publish.Aim4You;
using easygenerator.Web.Publish.Aim4You.Entities;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;

namespace easygenerator.Web.Tests.Publish.Aim4You
{
    [TestClass]
    public class Aim4YouApiServiceTests
    {
        private Aim4YouApiService _aim4YouApiService;
        private ConfigurationReader _configurationReader;
        private Aim4YouHttpClient _aim4YouHttpClient;
        private ILog _logger;

        private const string userName = "serviceUserName";
        private const string password = "servicePassword";
        private const string serviceUrl = "serviceUrl";
        private const string domain = "egDomain";

        private const string registerUserMethodPath = serviceUrl + "/api/RegisterUser";
        private const string isUserRegisteredMethodPath = serviceUrl + "/api/RegisterUser";
        private const string registerCourseMethodPath = serviceUrl + "/api/CourseRegister";
        private const string isCourseRegisteredMethodPath = serviceUrl + "/api/CourseRegister";
        private const string uploadCourseMethodPath = serviceUrl + "/api/CourseUpload";
        private const string deployCourseMethodPath = serviceUrl + "/api/CourseDeploy";

        [TestInitialize]
        public void InitializeService()
        {
            _configurationReader = Substitute.For<ConfigurationReader>();
            _aim4YouHttpClient = Substitute.For<Aim4YouHttpClient>();
            _logger = Substitute.For<ILog>();

            _configurationReader.Aim4YouConfiguration.Returns(new Aim4YouConfigurationSection() { UserName = userName, Password = password, ServiceUrl = serviceUrl });
            _aim4YouApiService = new Aim4YouApiService(_configurationReader, _aim4YouHttpClient, _logger);
        }

        #region RegisterUser

        [TestMethod]
        public void RegisterUser_ShouldPostDataToAim4YouApi()
        {
            // Arrange
            // Act
            _aim4YouApiService.RegisterUser(userName, domain);
            // Assert
            _aim4YouHttpClient.Received().Post<Aim4YouUser>(registerUserMethodPath, Arg.Any<object>(), userName, password);
        }

        [TestMethod]
        public void RegisterUser_ShouldReturnTrueIfEmailMatchesReturnedEmail()
        {
            // Arrange
            var user = new Aim4YouUser { Email = userName };
            _aim4YouHttpClient.Post<Aim4YouUser>(registerUserMethodPath, Arg.Any<object>(), userName, password).Returns(user);
            // Act
            var result = _aim4YouApiService.RegisterUser(userName, domain);
            // Assert
            result.Should().Be(true);
        }

        [TestMethod]
        public void RegisterUser_ShouldReturnFalseIfEmailDoesntMatchReturnedEmail()
        {
            // Arrange
            var user = new Aim4YouUser { Email = "someotherusername" };
            _aim4YouHttpClient.Post<Aim4YouUser>(registerUserMethodPath, Arg.Any<object>(), userName, password).Returns(user);
            // Act
            var result = _aim4YouApiService.RegisterUser(userName, domain);
            // Assert
            result.Should().Be(false);
        }

        [TestMethod]
        public void RegisterUser_ShouldLogAnExceptionIfItWasThrown()
        {
            // Arrange
            var ex = new Exception();
            _aim4YouHttpClient.Post<Aim4YouUser>(registerUserMethodPath, Arg.Any<object>(), userName, password).Returns(x => { throw ex; });
            // Act
            var result = _aim4YouApiService.RegisterUser(userName, domain);
            // Assert
            _logger.Received().LogException(ex);
        }

        [TestMethod]
        public void RegisterUser_ShouldReturnFalseIfExceptionWasThrown()
        {
            // Arrange
            _aim4YouHttpClient.Post<Aim4YouUser>(registerUserMethodPath, Arg.Any<object>(), userName, password).Returns(x => { throw new Exception(); });
            // Act
            var result = _aim4YouApiService.RegisterUser(userName, domain);
            // Assert
            result.Should().Be(false);
        }

        #endregion

        #region IsUserRegistered

        [TestMethod]
        public void IsUserRegistered_ShouldDoRequestToAim4YouApi()
        {
            // Arrange
            // Act
            _aim4YouApiService.IsUserRegistered(userName, domain);
            // Assert
            _aim4YouHttpClient.Received().Get<string>(isUserRegisteredMethodPath, Arg.Any<Dictionary<string, string>>(), userName, password);
        }

        [TestMethod]
        public void IsUserRegistered_ShouldLogAnExceptionIfItWasThrown()
        {
            // Arrange
            var ex = new Exception();
            _aim4YouHttpClient.Get<string>(isUserRegisteredMethodPath, Arg.Any<Dictionary<string, string>>(), userName, password).Returns(x => { throw ex; });
            // Act
            _aim4YouApiService.IsUserRegistered(userName, domain);
            // Assert
            _logger.Received().LogException(ex);
        }

        [TestMethod]
        public void IsUserRegistered_ShouldReturnFalseIfExceptionWasThrown()
        {
            // Arrange
            _aim4YouHttpClient.Get<string>(isUserRegisteredMethodPath, Arg.Any<Dictionary<string, string>>(), userName, password).Returns(x => { throw new Exception(); });
            // Act
            var result = _aim4YouApiService.IsUserRegistered(userName, domain);
            // Assert
            result.Should().Be(false);
        }

        [TestMethod]
        public void IsUserRegistered_ShouldReturnFalseIfMinusOneWasReturned()
        {
            // Arrange
            _aim4YouHttpClient.Get<string>(isUserRegisteredMethodPath, Arg.Any<Dictionary<string, string>>(), userName, password).Returns("-1");
            // Act
            var result = _aim4YouApiService.IsUserRegistered(userName, domain);
            // Assert
            result.Should().Be(false);
        }

        [TestMethod]
        public void IsUserRegistered_ShouldReturnTrueIfNotMinusOneWasReturned()
        {
            // Arrange
            _aim4YouHttpClient.Get<string>(isUserRegisteredMethodPath, Arg.Any<Dictionary<string, string>>(), userName, password).Returns("123");
            // Act
            var result = _aim4YouApiService.IsUserRegistered(userName, domain);
            // Assert
            result.Should().Be(true);
        }

        #endregion

        #region RegisterCourse

        [TestMethod]
        public void RegisterCourse_ShouldDoRequestToAim4YouApi()
        {
            // Arrange
            // Act
            _aim4YouApiService.RegisterCourse(userName, Guid.NewGuid(), "CourseTitle");
            // Assert
            _aim4YouHttpClient.Received().Post<Aim4YouCourse>(registerCourseMethodPath, Arg.Any<object>(), userName, password);
        }

        [TestMethod]
        public void RegisterCourse_ShouldReturnNullIfApiReturnedNull()
        {
            // Arrange
            _aim4YouHttpClient.Post<Aim4YouCourse>(registerCourseMethodPath, Arg.Any<object>(), userName, password).Returns((Aim4YouCourse)null);
            // Act
            var result = _aim4YouApiService.RegisterCourse(userName, Guid.NewGuid(), "CourseTitle");
            // Assert
            result.Should().Be(null);
        }

        [TestMethod]
        public void RegisterCourse_ShouldReturnNullIfApiReturnedResultWithEmptyGuid()
        {
            // Arrange
            _aim4YouHttpClient.Post<Aim4YouCourse>(registerCourseMethodPath, Arg.Any<object>(), userName, password).Returns(
                x => new Aim4YouCourse() { CourseId = Guid.Empty });
            // Act
            var result = _aim4YouApiService.RegisterCourse(userName, Guid.NewGuid(), "CourseTitle");
            // Assert
            result.Should().Be(null);
        }

        [TestMethod]
        public void RegisterCourse_ShouldReturnCourseIdIfApiReturnedCourseInfo()
        {
            // Arrange
            Guid courseId = Guid.NewGuid();
            _aim4YouHttpClient.Post<Aim4YouCourse>(registerCourseMethodPath, Arg.Any<object>(), userName, password).Returns(
                x => new Aim4YouCourse() { CourseId = courseId });
            // Act
            var result = _aim4YouApiService.RegisterCourse(userName, Guid.NewGuid(), "CourseTitle");
            // Assert
            result.Should().Be(courseId);
        }

        [TestMethod]
        public void RegisterCourse_ShouldLogAnExceptionIfItWasThrown()
        {
            // Arrange
            var ex = new Exception();
            _aim4YouHttpClient.Post<Aim4YouCourse>(registerCourseMethodPath, Arg.Any<object>(), userName, password).Returns(x => { throw ex; });
            // Act
            _aim4YouApiService.RegisterCourse(userName, Guid.NewGuid(), "CourseTitle");
            // Assert
            _logger.Received().LogException(ex);
        }

        [TestMethod]
        public void RegisterCourse_ShouldReturnNullIfExceptionWasThrown()
        {
            // Arrange
            _aim4YouHttpClient.Post<Aim4YouCourse>(registerCourseMethodPath, Arg.Any<object>(), userName, password).Returns(x => { throw new Exception(); });
            // Act
            var result = _aim4YouApiService.RegisterCourse(userName, Guid.NewGuid(), "CourseTitle");
            // Assert
            result.Should().Be(null);
        }

        #endregion

        #region IsCourseRegistered

        [TestMethod]
        public void IsCourseRegistered_ShouldDoRequestToAim4YouApi()
        {
            // Arrange
            // Act
            var result = _aim4YouApiService.IsCourseRegistered(Guid.NewGuid());
            // Assert
            _aim4YouHttpClient.Received().Get<bool>(isCourseRegisteredMethodPath, Arg.Any<Dictionary<string, string>>(), userName, password);
        }

        [TestMethod]
        public void IsCourseRegistered_ShouldLogAnExceptionIfItWasThrown()
        {
            // Arrange
            var ex = new Exception();
            _aim4YouHttpClient.Get<bool>(isCourseRegisteredMethodPath, Arg.Any<Dictionary<string, string>>(), userName, password).Returns(x => { throw ex; });
            // Act
            _aim4YouApiService.IsCourseRegistered(Guid.NewGuid());
            // Assert
            _logger.Received().LogException(ex);
        }

        [TestMethod]
        public void IsCourseRegistered_ShouldReturnFalseIfExceptionWasThrown()
        {
            // Arrange
            _aim4YouHttpClient.Get<bool>(isCourseRegisteredMethodPath, Arg.Any<Dictionary<string, string>>(), userName, password).Returns(x => { throw new Exception(); });
            // Act
            var result = _aim4YouApiService.IsCourseRegistered(Guid.NewGuid());
            // Assert
            result.Should().Be(false);
        }

        [TestMethod]
        public void IsCourseRegistered_ShouldReturnFalseIfApiReturnedFalse()
        {
            // Arrange
            _aim4YouHttpClient.Get<bool>(isCourseRegisteredMethodPath, Arg.Any<Dictionary<string, string>>(), userName, password).Returns(false);
            // Act
            var result = _aim4YouApiService.IsCourseRegistered(Guid.NewGuid());
            // Assert
            result.Should().Be(false);
        }

        [TestMethod]
        public void IsCourseRegistered_ShouldReturnTrueIfApiReturnedTrue()
        {
            // Arrange
            _aim4YouHttpClient.Get<bool>(isCourseRegisteredMethodPath, Arg.Any<Dictionary<string, string>>(), userName, password).Returns(true);
            // Act
            var result = _aim4YouApiService.IsCourseRegistered(Guid.NewGuid());
            // Assert
            result.Should().Be(true);
        }

        #endregion

        #region UploadCourse

        [TestMethod]
        public void UploadCourse_ShouldDoRequestToAim4YouApi()
        {
            // Arrange
            Guid courseId = Guid.NewGuid();
            // Act
            _aim4YouApiService.UploadCourse(courseId, "courseTitle", new byte[] { });
            // Assert
            _aim4YouHttpClient.Received().PostCourseInChunks(uploadCourseMethodPath, courseId.ToString(), "courseTitle", Arg.Any<byte[]>(), userName, password);
        }

        [TestMethod]
        public void UploadCourse_ShouldLogAnExceptionIfItWasThrown()
        {
            // Arrange
            var ex = new Exception();
            Guid courseId = Guid.NewGuid();
            _aim4YouHttpClient.When(x => x.PostCourseInChunks(uploadCourseMethodPath, courseId.ToString(), "courseTitle", Arg.Any<byte[]>(), userName, password)).Do(x => { throw ex; });
            // Act
            _aim4YouApiService.UploadCourse(courseId, "courseTitle", new byte[] { });
            // Assert
            _logger.Received().LogException(ex);
        }

        [TestMethod]
        public void UploadCourse_ShouldReturnFalseIfExceptionWasThrown()
        {
            // Arrange
            Guid courseId = Guid.NewGuid();
            _aim4YouHttpClient.When(x => x.PostCourseInChunks(uploadCourseMethodPath, courseId.ToString(), "courseTitle", Arg.Any<byte[]>(), userName, password)).Do(x => { throw new Exception(); });
            // Act
            var result = _aim4YouApiService.UploadCourse(courseId, "courseTitle", new byte[] { });
            // Assert
            result.Should().Be(false);
        }

        [TestMethod]
        public void UploadCourse_ShouldReturnTrueIfApiReturnedTrue()
        {
            // Arrange
            Guid courseId = Guid.NewGuid();
            // Act
            var result = _aim4YouApiService.UploadCourse(courseId, "courseTitle", new byte[] { });
            // Assert
            result.Should().Be(true);
        }

        #endregion

        #region DeployCourse

        [TestMethod]
        public void DeployCourse_ShouldDoRequestToAim4YouApi()
        {
            // Arrange
            // Act
            var result = _aim4YouApiService.DeployCourse(Guid.NewGuid());
            // Assert
            _aim4YouHttpClient.Received().GetWithNoReply(deployCourseMethodPath, Arg.Any<Dictionary<string, string>>(), userName, password);
        }

        [TestMethod]
        public void DeployCourse_ShouldLogAnExceptionIfItWasThrown()
        {
            // Arrange
            var ex = new Exception();
            _aim4YouHttpClient.When(_ => _.GetWithNoReply(deployCourseMethodPath, Arg.Any<Dictionary<string, string>>(), userName, password)).Do(x => { throw ex; });
            // Act
            _aim4YouApiService.DeployCourse(Guid.NewGuid());
            // Assert
            _logger.Received().LogException(ex);
        }

        [TestMethod]
        public void DeployCourse_ShouldReturnFalseIfExceptionWasThrown()
        {
            // Arrange
            _aim4YouHttpClient.When(_ => _.GetWithNoReply(deployCourseMethodPath, Arg.Any<Dictionary<string, string>>(), userName, password)).Do(x => { throw new Exception(); });
            // Act
            var result = _aim4YouApiService.DeployCourse(Guid.NewGuid());
            // Assert
            result.Should().Be(false);
        }

        [TestMethod]
        public void DeployCourse_ShouldReturnTrueIfApiReturnedTrue()
        {
            // Arrange
            _aim4YouHttpClient.Get<bool>(deployCourseMethodPath, Arg.Any<Dictionary<string, string>>(), userName, password).Returns(true);
            // Act
            var result = _aim4YouApiService.DeployCourse(Guid.NewGuid());
            // Assert
            result.Should().Be(true);
        }

        #endregion
    }
}
