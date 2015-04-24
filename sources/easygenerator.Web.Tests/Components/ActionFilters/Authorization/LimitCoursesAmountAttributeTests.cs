using System.Linq.Expressions;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Net;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;

namespace easygenerator.Web.Tests.Components.ActionFilters.Authorization
{
    [TestClass]
    public class LimitCoursesAmountAttributeTests
    {
        private LimitCoursesAmountAttribute _attribute;

        private AuthorizationContext _filterContext;
        private IIdentity _identity;
        private User _user;
        private IUserRepository _userRepository;
        private ICourseRepository _courseRepository;


        [TestInitialize]
        public void InitializeContext()
        {
            _attribute = new LimitCoursesAmountAttribute();

            _courseRepository = Substitute.For<ICourseRepository>();
            _attribute.CourseRepository = _courseRepository;

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
        public void OnAuthorization_ShouldSetForbiddenResult_WhenCoursesAmountIsMoreOrEqualsToLimitForStarterPlan()
        {
            //Arrange
            _filterContext.Result = null;
            _identity.IsAuthenticated.Returns(true);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(_user);
            _user.HasPlusAccess().Returns(false);
            _user.HasStarterAccess().Returns(true);

            var courses = Substitute.For<ICollection<Course>>();
            courses.Count.Returns(50);
            _courseRepository.GetCollection(Arg.Any<Expression<Func<Course, bool>>>()).Returns(courses);

            //Act
            _attribute.OnAuthorization(_filterContext);

            //Assert
            _filterContext.Result.Should().BeForbiddenResult();
        }

        [TestMethod]
        public void OnAuthorization_ShouldNotSetResult_WhenUserHasPlusPlan()
        {
            //Arrange
            _filterContext.Result = null;
            _identity.IsAuthenticated.Returns(true);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(_user);
            _user.HasPlusAccess().Returns(true);

            //Act
            _attribute.OnAuthorization(_filterContext);

            //Assert
            _filterContext.Result.Should().BeNull();
        }

        [TestMethod]
        public void OnAuthorization_ShouldNotSetResult_WhenCoursesAmountIsLessThanLimitForStarterPlan()
        {
            //Arrange
            _filterContext.Result = null;
            _identity.IsAuthenticated.Returns(true);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(_user);
            _user.HasPlusAccess().Returns(false);
            _user.HasStarterAccess().Returns(true);

            var courses = Substitute.For<ICollection<Course>>();
            courses.Count.Returns(49);
            _courseRepository.GetCollection(Arg.Any<Expression<Func<Course, bool>>>()).Returns(courses);

            //Act
            _attribute.OnAuthorization(_filterContext);

            //Assert
            _filterContext.Result.Should().BeNull();
        }

        [TestMethod]
        public void OnAuthorization_ShouldSetForbiddenResult_WhenCoursesAmountIsMoreOrEqualsToLimitForFreePlan()
        {
            //Arrange
            _filterContext.Result = null;
            _identity.IsAuthenticated.Returns(true);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(_user);
            _user.HasPlusAccess().Returns(false);
            _user.HasStarterAccess().Returns(false);

            var courses = Substitute.For<ICollection<Course>>();
            courses.Count.Returns(10);
            _courseRepository.GetCollection(Arg.Any<Expression<Func<Course, bool>>>()).Returns(courses);

            //Act
            _attribute.OnAuthorization(_filterContext);

            //Assert
            _filterContext.Result.Should().BeForbiddenResult();
        }

        [TestMethod]
        public void OnAuthorization_ShouldNotSetResult_WhenCoursesAmountIsLessThanLimitForFreePlan()
        {
            //Arrange
            _filterContext.Result = null;
            _identity.IsAuthenticated.Returns(true);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(_user);
            _user.HasPlusAccess().Returns(false);
            _user.HasStarterAccess().Returns(false);

            var courses = Substitute.For<ICollection<Course>>();
            courses.Count.Returns(9);
            _courseRepository.GetCollection(Arg.Any<Expression<Func<Course, bool>>>()).Returns(courses);

            //Act
            _attribute.OnAuthorization(_filterContext);

            //Assert
            _filterContext.Result.Should().BeNull();
        }

        #endregion

    }
}
