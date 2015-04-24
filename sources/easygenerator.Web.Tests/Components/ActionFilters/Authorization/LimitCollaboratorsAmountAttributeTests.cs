using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Security.FeatureAvailability;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Globalization;
using System.Net;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;

namespace easygenerator.Web.Tests.Components.ActionFilters.Authorization
{
    [TestClass]
    public class CollaborationEnaledAttributeTests
    {
        private LimitCollaboratorsAmountAttribute _attribute;

        private AuthorizationContext _filterContext;
        private IIdentity _identity;
        private User _user;
        private IUserRepository _userRepository;
        private ICourseRepository _courseRepository;
        private IValueProvider _valueProvider;
        private string CourseId = "207DC508-2AC2-4F56-9A25-3FA063C4D66E";
        private IFeatureAvailabilityChecker _featureAvailabilityChecker;


        [TestInitialize]
        public void InitializeContext()
        {
            _attribute = new LimitCollaboratorsAmountAttribute();

            _courseRepository = Substitute.For<ICourseRepository>();
            _attribute.CourseRepository = _courseRepository;

            _featureAvailabilityChecker = Substitute.For<IFeatureAvailabilityChecker>();
            _attribute.FeatureAvailabilityChecker = _featureAvailabilityChecker;

            _identity = Substitute.For<IIdentity>();
            _filterContext = Substitute.For<AuthorizationContext>();
            _filterContext.HttpContext = Substitute.For<HttpContextBase>();
            _userRepository = Substitute.For<IUserRepository>();
            _attribute.UserRepository = _userRepository;
            _user = Substitute.For<User>();

            _valueProvider = Substitute.For<IValueProvider>();
            _filterContext.Controller = Substitute.For<ControllerBase>();
            ValueProviderFactories.Factories.PutValueProvider(_valueProvider);

            var principal = Substitute.For<IPrincipal>();
            _filterContext.HttpContext.User.Returns(principal);
            principal.Identity.Returns(_identity);
        }

        #region OnAuthorization

        [TestMethod]
        public void OnAuthorization_ShouldThrowArgumentNullException_WhenFilterContextIsNull()
        {
            //Arrange

            //Act
            Action action = () => _attribute.OnAuthorization(null);

            //Assert
            action.ShouldThrow<ArgumentNullException>();
        }

        [TestMethod]
        public void OnAuthorization_ShouldNotSetResult_WhenResultIsAlreadySet()
        {
            //Arrange
            _filterContext.Result = new HttpStatusCodeResult(HttpStatusCode.OK);

            //Act
            _attribute.OnAuthorization(_filterContext);

            //Assert
            _filterContext.Result.Should().BeHttpStatusCodeResultWithStatus((int)HttpStatusCode.OK);
        }

        [TestMethod]
        public void OnAuthorization_ShouldThrowInvalidOperationException_WhenHttpContextIsNull()
        {
            //Arrange
            _filterContext.HttpContext.Returns(null as HttpContextBase);

            //Act
            Action action = () => _attribute.OnAuthorization(_filterContext);

            //Assert
            action.ShouldThrow<InvalidOperationException>();
        }

        [TestMethod]
        public void OnAuthorization_ShouldThrowInvalidOperationException_WhenHttpContextUserIsNull()
        {
            //Arrange
            _filterContext.HttpContext.User.Returns(null as IPrincipal);

            //Act
            Action action = () => _attribute.OnAuthorization(_filterContext);

            //Assert
            action.ShouldThrow<InvalidOperationException>();
        }

        [TestMethod]
        public void OnAuthorization_ShouldThrowInvalidOperationException_WhenHttpContextUserIsNouAuthenticated()
        {
            //Arrange
            _identity.IsAuthenticated.Returns(false);

            //Act
            Action action = () => _attribute.OnAuthorization(_filterContext);

            //Assert
            action.ShouldThrow<InvalidOperationException>();
        }

        [TestMethod]
        public void OnAuthorization_ShouldSetForbiddenResult_WhenUserFromRepositoryIsNull()
        {
            //Arrange
            _filterContext.Result = null;
            _identity.IsAuthenticated.Returns(true);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(null as User);

            //Act
            _attribute.OnAuthorization(_filterContext);

            //Assert
            _filterContext.Result.Should().BeForbiddenResult();
        }

        [TestMethod]
        public void OnAuthorization_ShouldThrowInvalidOperationException_WhenCourseIdIsNotDefined()
        {
            //Arrange
            _filterContext.Result = null;
            _identity.IsAuthenticated.Returns(true);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(_user);
            _user.HasPlusAccess().Returns(false);
            _user.HasStarterAccess().Returns(true);

            //Act
            Action action = () => _attribute.OnAuthorization(_filterContext);

            //Assert
            action.ShouldThrow<ArgumentNullException>();
        }

        [TestMethod]
        public void OnAuthorization_ShouldSetForbiddenResult_WhenCourseIsNotFound()
        {
            //Arrange
            _filterContext.Result = null;
            _identity.IsAuthenticated.Returns(true);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(_user);
            _user.HasPlusAccess().Returns(false);
            _user.HasStarterAccess().Returns(true);
            _valueProvider.GetValue("courseId").Returns(new ValueProviderResult(new Guid(CourseId), CourseId, CultureInfo.InvariantCulture));

            //Act
            _attribute.OnAuthorization(_filterContext);

            //Assert
            _filterContext.Result.Should().BeForbiddenResult();
        }

        [TestMethod]
        public void OnAuthorization_ShouldSetForbiddenResult_WhenCollaborationIsDisabled()
        {
            //Arrange
            _filterContext.Result = null;
            _identity.IsAuthenticated.Returns(true);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(_user);
            _user.HasPlusAccess().Returns(false);
            _user.HasStarterAccess().Returns(true);
            _valueProvider.GetValue("courseId").Returns(new ValueProviderResult(new Guid(CourseId), CourseId, CultureInfo.InvariantCulture));
            var course = Substitute.For<Course>();
            _courseRepository.Get(Arg.Any<Guid>()).Returns(course);

            _featureAvailabilityChecker.CanAddCollaborator(Arg.Any<Course>()).Returns(false);

            //Act
            _attribute.OnAuthorization(_filterContext);

            //Assert
            _filterContext.Result.Should().BeForbiddenResult();
        }

        [TestMethod]
        public void OnAuthorization_ShouldNotSetResult_WhenCollaborationIsEnabled()
        {
            //Arrange
            _filterContext.Result = null;
            _identity.IsAuthenticated.Returns(true);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(_user);
            _user.HasPlusAccess().Returns(false);
            _user.HasStarterAccess().Returns(true);
            _valueProvider.GetValue("courseId").Returns(new ValueProviderResult(new Guid(CourseId), CourseId, CultureInfo.InvariantCulture));
            var course = Substitute.For<Course>();
            _courseRepository.Get(Arg.Any<Guid>()).Returns(course);

            _featureAvailabilityChecker.CanAddCollaborator(Arg.Any<Course>()).Returns(true);

            //Act
            _attribute.OnAuthorization(_filterContext);

            //Assert
            _filterContext.Result.Should().BeNull();
        }

        #endregion

    }
}
