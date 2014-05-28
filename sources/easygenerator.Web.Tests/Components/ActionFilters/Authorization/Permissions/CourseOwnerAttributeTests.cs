using System;
using System.Globalization;
using System.Net;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Components.ActionFilters.Authorization.Permissions;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Components.ActionFilters.Authorization.Permissions
{
    [TestClass]
    public class CourseOwnerAttributeTests
    {
        private const string CourseId = "8D092820-C67E-4AE6-BACB-1ECBE078689C";
        private const string Username = "user@www.www";

        private CourseOwnerAccessAttribute _accessAttribute;

        private AuthorizationContext _filterContext;
        private IIdentity _identity;
        private IUserRepository _userRepository;
        private ICourseRepository _courseRepository;
        private IValueProvider _valueProvider;

        private readonly DateTime _currentDate = new DateTime(2014, 3, 19);

        [TestInitialize]
        public void InitializeContext()
        {
            _accessAttribute = new CourseOwnerAccessAttribute();

            _courseRepository = Substitute.For<ICourseRepository>();
            _accessAttribute.CourseRepository = _courseRepository;

            _identity = Substitute.For<IIdentity>();
            _filterContext = Substitute.For<AuthorizationContext>();
            _filterContext.HttpContext = Substitute.For<HttpContextBase>();
            _userRepository = Substitute.For<IUserRepository>();
            _accessAttribute.UserRepository = _userRepository;

            _valueProvider = Substitute.For<IValueProvider>();
            _filterContext.Controller = Substitute.For<ControllerBase>();
            ValueProviderFactories.Factories.Clear();
            var factory = Substitute.For<ValueProviderFactory>();
            factory.GetValueProvider(Arg.Any<ControllerContext>()).Returns(_valueProvider);
            ValueProviderFactories.Factories.Add(factory);

            var principal = Substitute.For<IPrincipal>();
            _filterContext.HttpContext.User.Returns(principal);
            principal.Identity.Returns(_identity);

            DateTimeWrapper.Now = () => _currentDate;
        }

        #region OnAuthorization

        #region Base class logic

        [TestMethod]
        public void OnAuthorization_ShouldThrowArgumentNullException_WhenFilterContextIsNull()
        {
            //Arrange

            //Act
            Action action = () => _accessAttribute.OnAuthorization(null);

            //Assert
            action.ShouldThrow<ArgumentNullException>();
        }

        [TestMethod]
        public void OnAuthorization_ShouldNotSetResult_WhenResultIsAlreadySet()
        {
            //Arrange
            _filterContext.Result = new HttpStatusCodeResult(HttpStatusCode.OK);

            //Act
            _accessAttribute.OnAuthorization(_filterContext);

            //Assert
            _filterContext.Result.Should().BeHttpStatusCodeResultWithStatus((int)HttpStatusCode.OK);
        }

        [TestMethod]
        public void OnAuthorization_ShouldThrowInvalidOperationException_WhenHttpContextIsNull()
        {
            //Arrange
            _filterContext.HttpContext.Returns(null as HttpContextBase);

            //Act
            Action action = () => _accessAttribute.OnAuthorization(_filterContext);

            //Assert
            action.ShouldThrow<InvalidOperationException>();
        }

        [TestMethod]
        public void OnAuthorization_ShouldThrowInvalidOperationException_WhenHttpContextUserIsNull()
        {
            //Arrange
            _filterContext.HttpContext.User.Returns(null as IPrincipal);

            //Act
            Action action = () => _accessAttribute.OnAuthorization(_filterContext);

            //Assert
            action.ShouldThrow<InvalidOperationException>();
        }

        [TestMethod]
        public void OnAuthorization_ShouldThrowInvalidOperationException_WhenHttpContextUserIsNouAuthenticated()
        {
            //Arrange
            _identity.IsAuthenticated.Returns(false);

            //Act
            Action action = () => _accessAttribute.OnAuthorization(_filterContext);

            //Assert
            action.ShouldThrow<InvalidOperationException>();
        }

        [TestMethod]
        public void OnAuthorization_ShouldGetUserFromRepository()
        {
            //Arrange
            const string userName = "name";
            _identity.Name.Returns(userName);
            _identity.IsAuthenticated.Returns(true);

            //Act
            _accessAttribute.OnAuthorization(_filterContext);

            //Assert
            _userRepository.Received().GetUserByEmail(userName);
        }


        #endregion

        [TestMethod]
        public void OnAuthorization_ShouldSetForbiddenResult_WhenUserFromRepositoryIsNull()
        {
            //Arrange
            _filterContext.Result = null;
            _identity.IsAuthenticated.Returns(true);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(null as User);

            //Act
            _accessAttribute.OnAuthorization(_filterContext);

            //Assert
            _filterContext.Result.Should().BeForbiddenResult();
        }

        [TestMethod]
        public void OnAuthorization_ShouldThrowArgumentNullException_WhenCourseIdIsNotDefined()
        {
            //Arrange
            _filterContext.Result = null;
            _identity.IsAuthenticated.Returns(true);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(UserObjectMother.Create());
            var value = new ValueProviderResult(null, null, CultureInfo.InvariantCulture);
            _valueProvider.GetValue("courseId").Returns(value);

            //Arrange

            //Act
            Action action = () => _accessAttribute.OnAuthorization(_filterContext);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("courseId");
        }

        [TestMethod]
        public void OnAuthorization_ShouldNotSetResult_WhenCourseNotFound()
        {
            //Arrange
            _filterContext.Result = null;
            _identity.IsAuthenticated.Returns(true);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(UserObjectMother.Create());
            _courseRepository.Get(new Guid(CourseId)).Returns(null as Course);

            var value = new ValueProviderResult(null, CourseId, CultureInfo.InvariantCulture);
            _valueProvider.GetValue("courseId").Returns(value);

            //Arrange

            //Act
            _accessAttribute.OnAuthorization(_filterContext);

            //Assert
            _filterContext.Result.Should().BeNull();
        }

        [TestMethod]
        public void OnAuthorization_ShouldSetForbiddenResult_WhenNotCourseOwner()
        {
            //Arrange
            _filterContext.Result = null;
            _identity.IsAuthenticated.Returns(true);
            var user = UserObjectMother.CreateWithEmail(Username);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(user);

            var course = CourseObjectMother.CreateWithCreatedBy("some user");
            _courseRepository.Get(new Guid(CourseId)).Returns(course);

            var value = new ValueProviderResult(null, CourseId, CultureInfo.InvariantCulture);
            _valueProvider.GetValue("courseId").Returns(value);

            //Arrange

            //Act
            _accessAttribute.OnAuthorization(_filterContext);

            //Assert
            _filterContext.Result.Should().BeForbiddenResult();
        }

        [TestMethod]
        public void OnAuthorization_ShouldNotSetResult_WhenCourseOwner()
        {
            //Arrange
            _filterContext.Result = null;
            _identity.IsAuthenticated.Returns(true);
            var user = UserObjectMother.CreateWithEmail(Username);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(user);

            var course = CourseObjectMother.CreateWithCreatedBy(Username);
            _courseRepository.Get(new Guid(CourseId)).Returns(course);

            var value = new ValueProviderResult(null, CourseId, CultureInfo.InvariantCulture);
            _valueProvider.GetValue("courseId").Returns(value);

            //Arrange

            //Act
            _accessAttribute.OnAuthorization(_filterContext);

            //Assert
            _filterContext.Result.Should().BeNull();
        }


        #endregion
    }
}
