using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Extensions;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Components.ActionFilters.Permissions
{
    [TestClass]
    public class PreviewAccessAttributeTests
    {
        private PreviewAccessAttribute _attribute;

        private AuthorizationContext _filterContext;
        private IIdentity _identity;
        private User _user;
        private IUserRepository _userRepository;

        [TestInitialize]
        public void InitializeContext()
        {
            _attribute = new PreviewAccessAttribute();

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
            _filterContext.Result.Should().BeHttpNotFoundResult();
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
            _filterContext.Result.Should().BeHttpNotFoundResult();
        }

        #endregion
    }
}
