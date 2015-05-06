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
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Components.ActionFilters.Permissions
{
    [TestClass]
    public class EntityOwnerAttributeTests
    {
        private EntityOwnerAttribute _attribute;

        private AuthorizationContext _filterContext;
        private IIdentity _identity;
        private User _user;
        private IUserRepository _userRepository;
        private ITypeMethodInvoker _typeMethodInvoker;

        private const string CourseId = "207DC508-2AC2-4F56-9A25-3FA063C4D66E";

        [TestInitialize]
        public void InitializeContext()
        {
            _typeMethodInvoker = Substitute.For<ITypeMethodInvoker>();
            _attribute = new EntityOwnerAttribute(typeof(Course), _typeMethodInvoker);

            _identity = Substitute.For<IIdentity>();
            _filterContext = Substitute.For<AuthorizationContext>();
            _filterContext.HttpContext = Substitute.For<HttpContextBase>();
            _userRepository = Substitute.For<IUserRepository>();
            _attribute.UserRepository = _userRepository;
            _user = Substitute.For<User>();

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
        public void OnAuthorization_ShouldThrowInvalidOperationException_WhenHttpContextUserIsNotAuthenticated()
        {
            //Arrange
            _identity.IsAuthenticated.Returns(false);

            //Act
            Action action = () => _attribute.OnAuthorization(_filterContext);

            //Assert
            action.ShouldThrow<InvalidOperationException>();
        }

        [TestMethod]
        public void OnAuthorization_ShouldSetNotFoundResult_WhenUserFromRepositoryIsNull()
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
        public void OnAuthorization_ShouldSetNotFoundResult_WhenCourseIdIsNotDefined()
        {
            //Arrange
            _filterContext.Result = null;
            _identity.IsAuthenticated.Returns(true);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(_user);
            var _valueProvider = Substitute.For<IValueProvider>();
            _filterContext.Controller = Substitute.For<ControllerBase>();
            ValueProviderFactories.Factories.PutValueProvider(_valueProvider);

            //Act
            _attribute.OnAuthorization(_filterContext);

            //Assert
            _filterContext.Result.Should().BeForbiddenResult();
        }

        [TestMethod]
        public void OnAuthorization_ShouldSetNotFoundResult_WhenUserIsNotCollaborator()
        {
            //Arrange
            _filterContext.Result = null;
            _identity.IsAuthenticated.Returns(true);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(_user);
            var _valueProvider = Substitute.For<IValueProvider>();

            _filterContext.Controller = Substitute.For<ControllerBase>();
            _valueProvider.GetValue("courseId").Returns(new ValueProviderResult(new Guid(CourseId), CourseId, CultureInfo.InvariantCulture));
            ValueProviderFactories.Factories.PutValueProvider(_valueProvider);

            var course = CourseObjectMother.Create();
            _typeMethodInvoker.CallGenericTypeMethod(Arg.Any<Type>(), Arg.Any<Type>(), "Get", Arg.Any<object[]>()).Returns(course);
            _typeMethodInvoker.CallGenericTypeMethod(Arg.Any<Type>(), Arg.Any<Type>(), "HasOwnerPermissions", Arg.Any<object[]>()).Returns(false);

            //Act
            _attribute.OnAuthorization(_filterContext);

            //Assert
            _filterContext.Result.Should().BeForbiddenResult();
        }

        [TestMethod]
        public void OnAuthorization_ShouldNotSetResult_WhenUserIsCollaborator()
        {
            //Arrange
            _filterContext.Result = null;
            _identity.IsAuthenticated.Returns(true);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(_user);
            var _valueProvider = Substitute.For<IValueProvider>();

            _filterContext.Controller = Substitute.For<ControllerBase>();
            _valueProvider.GetValue("courseId").Returns(new ValueProviderResult(new Guid(CourseId), CourseId, CultureInfo.InvariantCulture));
            ValueProviderFactories.Factories.PutValueProvider(_valueProvider);

            var course = CourseObjectMother.Create();
            _typeMethodInvoker.CallGenericTypeMethod(Arg.Any<Type>(), Arg.Any<Type>(), "Get", Arg.Any<object[]>()).Returns(course);
            _typeMethodInvoker.CallGenericTypeMethod(Arg.Any<Type>(), Arg.Any<Type>(), "HasOwnerPermissions", Arg.Any<object[]>()).Returns(true);

            //Act
            _attribute.OnAuthorization(_filterContext);

            //Assert
            _filterContext.Result.Should().BeNull();
        }

        #endregion
    }
}
