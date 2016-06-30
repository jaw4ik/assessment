using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.DomainModel.Tests.ObjectMothers.Organizations;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Components.ActionFilters.Permissions
{
    [TestClass]
    public class OrganizationAdminAttributeTests
    {
        private OrganizationAdminAttribute _attribute;

        private AuthorizationContext _filterContext;
        private IIdentity _identity;
        private User _user;
        private IUserRepository _userRepository;
        private ITypeMethodInvoker _typeMethodInvoker;

        private const string OrganizationId = "207DC508-2AC2-4F56-9A25-3FA063C4D66E";

        [TestInitialize]
        public void InitializeContext()
        {
            _typeMethodInvoker = Substitute.For<ITypeMethodInvoker>();
            _attribute = new OrganizationAdminAttribute();
            _attribute.TypeMethodInvoker = _typeMethodInvoker;

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
        public void OnAuthorization_ShouldSetNotFoundResult_WhenOrganizationIdIsNotDefined()
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
        public void OnAuthorization_ShouldNotSetResult_WhenOrganizationEntityIsNull()
        {
            //Arrange
            _filterContext.Result = null;
            _identity.IsAuthenticated.Returns(true);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(_user);
            var _valueProvider = Substitute.For<IValueProvider>();

            _filterContext.Controller = Substitute.For<ControllerBase>();
            _valueProvider.GetValue("organizationId").Returns(new ValueProviderResult(new Guid(OrganizationId), OrganizationId, CultureInfo.InvariantCulture));
            ValueProviderFactories.Factories.PutValueProvider(_valueProvider);

            _typeMethodInvoker.CallGenericTypeMethod(Arg.Any<Type>(), Arg.Any<Type>(), "Get", Arg.Any<object[]>()).Returns(null);

            //Act
            _attribute.OnAuthorization(_filterContext);

            //Assert
            _filterContext.Result.Should().BeNull();
        }

        [TestMethod]
        public void OnAuthorization_ShouldSetNotFoundResult_WhenUserIsNotOrganizationAdmin()
        {
            //Arrange
            _filterContext.Result = null;
            _identity.IsAuthenticated.Returns(true);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(_user);
            var _valueProvider = Substitute.For<IValueProvider>();

            _filterContext.Controller = Substitute.For<ControllerBase>();
            _valueProvider.GetValue("organizationId").Returns(new ValueProviderResult(new Guid(OrganizationId), OrganizationId, CultureInfo.InvariantCulture));
            ValueProviderFactories.Factories.PutValueProvider(_valueProvider);

            var organization = OrganizationObjectMother.Create();
            _typeMethodInvoker.CallGenericTypeMethod(Arg.Any<Type>(), Arg.Any<Type>(), "Get", Arg.Any<object[]>()).Returns(organization);

            //Act
            _attribute.OnAuthorization(_filterContext);

            //Assert
            _filterContext.Result.Should().BeForbiddenResult();
        }

        [TestMethod]
        public void OnAuthorization_ShouldNotSetResult_WhenUserIsOrganizationAdmin()
        {
            //Arrange
            _filterContext.Result = null;
            _identity.IsAuthenticated.Returns(true);

            var organization = OrganizationObjectMother.Create();
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(UserObjectMother.CreateWithEmail(organization.Users.First().Email));
            var _valueProvider = Substitute.For<IValueProvider>();

            _filterContext.Controller = Substitute.For<ControllerBase>();
            _valueProvider.GetValue("organizationId").Returns(new ValueProviderResult(new Guid(OrganizationId), OrganizationId, CultureInfo.InvariantCulture));
            ValueProviderFactories.Factories.PutValueProvider(_valueProvider);

            _typeMethodInvoker.CallGenericTypeMethod(Arg.Any<Type>(), Arg.Any<Type>(), "Get", Arg.Any<object[]>()).Returns(organization);

            //Act
            _attribute.OnAuthorization(_filterContext);

            //Assert
            _filterContext.Result.Should().BeNull();
        }

        #endregion
    }
}
