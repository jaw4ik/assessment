using easygenerator.DomainModel.Repositories;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using easygenerator.DomainModel.Entities.Users;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Tests.Utils;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class UserDomainControllerTests
    {
        private IUserDomainRepository _userDomainRepository;
        private UserDomainController _controller;

        [TestInitialize]
        public void InitializeContext()
        {
            _userDomainRepository = Substitute.For<IUserDomainRepository>();
            _controller = new UserDomainController(_userDomainRepository);
        }

        #region GetUserDomainInfo

        [TestMethod]
        public void GetUserDomainInfo_ShouldThrowArgumentException_WnenDomainNull()
        {
            //Act
            Action action = () => _controller.GetUserDomainInfo(null);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("domain");
        }

        [TestMethod]
        public void GetUserDomainInfo_ShouldThrowArgumentException_WnenDomainIsNotExist()
        {
            var userDomainName = "test.domain";
            
            //Act
            Action action = () => _controller.GetUserDomainInfo(userDomainName);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("domain");
        }

        [TestMethod]
        public void GetUserDomainInfo_ShouldReturnUserDomainInfo()
        {
            var userDomainName = "test.domain";
            var userDomain = new UserDomain(userDomainName, 0, false);
            _userDomainRepository.Get(userDomainName).Returns(userDomain);

            //Act
            var result = _controller.GetUserDomainInfo(userDomainName);

            //Assert
            result.Should().BeJsonDataResult().And.Data.ShouldBeEquivalentTo(new
            {
                Domain = userDomain.Domain,
                NumberOfUsers = userDomain.NumberOfUsers,
                Tracked = userDomain.Tracked
            });
        }

        #endregion

        #region AddUserDomain

        [TestMethod]
        public void AddUserDomain_ShouldThrowArgumentException_WnenDomainIsNull()
        {
            //Act
            Action action = () => _controller.AddUserDomain(null);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("domain");
        }

        [TestMethod]
        public void AddUserDomain_ShouldThrowArgumentException_WnenDomainExists()
        {
            var userDomainName = "test.domain";
            var userDomain = new UserDomain(userDomainName, 0, false);
            _userDomainRepository.Get(userDomainName).Returns(userDomain);

            //Act
            Action action = () => _controller.AddUserDomain(userDomainName);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("domain");
        }

        [TestMethod]
        public void AddUserDomain_WhenTrackedIsNotSet_ShouldAddNewDomainToRepositoryWithDefaultFalse()
        {
            var userDomainName = "test.domain";
            
            //Act
           _controller.AddUserDomain(userDomainName);

            //Assert
            _userDomainRepository.Received().Add(Arg.Is<UserDomain>((_) => _.IsObjectSimilarTo(new UserDomain(userDomainName, 0, false))));
        }

        [TestMethod]
        public void AddUserDomain_WhenTrackedIsSet_ShouldAddNewDomainToRepository()
        {
            var userDomainName = "test.domain";

            //Act
            _controller.AddUserDomain(userDomainName, true);

            //Assert
            _userDomainRepository.Received().Add(Arg.Is<UserDomain>((_) => _.IsObjectSimilarTo(new UserDomain(userDomainName, 0, true))));
        }

        [TestMethod]
        public void AddUserDomain_ShouldReturnSuccessResult()
        {
            var userDomainName = "test.domain";

            //Act
            var result = _controller.AddUserDomain(userDomainName);

            //Assert
            result.Should().BeSuccessResult();
        }

        #endregion

        #region UpdateUserDomain

        [TestMethod]
        public void UpdateUserDomain_ShouldThrowArgumentException_WnenDomainNull()
        {
            //Act
            Action action = () => _controller.UpdateUserDomain(null, false);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("domain");
        }

        [TestMethod]
        public void UpdateUserDomain_ShouldThrowArgumentException_WnenDomainIsNotExist()
        {
            var userDomainName = "test.domain";

            //Act
            Action action = () => _controller.UpdateUserDomain(userDomainName, false);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("domain");
        }

        [TestMethod]
        public void UpdateUserDomain_ShouldUpdateTrackedValue()
        {
            var userDomainName = "test.domain";
            var userDomain = new UserDomain(userDomainName, 0, false);
            _userDomainRepository.Get(userDomainName).Returns(userDomain);

            //Act
            _controller.UpdateUserDomain(userDomainName, true);

            //Assert
            userDomain.Tracked.Should().Be(true);

        }

        [TestMethod]
        public void UpdateUserDomain_ShouldReturnSuccessResult()
        {
            var userDomainName = "test.domain";
            var userDomain = new UserDomain(userDomainName, 0, false);
            _userDomainRepository.Get(userDomainName).Returns(userDomain);

            //Act
            var result = _controller.UpdateUserDomain(userDomainName, true);

            //Assert
            result.Should().BeSuccessResult();
        }
        #endregion
    }
}
