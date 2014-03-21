using System;
using System.Collections.Generic;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Tasks
{
    [TestClass]
    public class AccessTypeExpirationTaskTest
    {
        private AccessTypeExpirationTask _accessTypeExpirationTask;
        private IUnitOfWork _unitOfWork;
        private IUserRepository _userRepository;

        [TestInitialize]
        public void InitializePublisher()
        {
            _unitOfWork = Substitute.For<IUnitOfWork>();
            _userRepository = Substitute.For<IUserRepository>();

            _accessTypeExpirationTask = new AccessTypeExpirationTask(_unitOfWork, _userRepository);
        }

        #region Execute

        [TestMethod]
        public void Execute_ShouldDowngradeUserPlanToFree_WhenCurrentAccessTypeExpired()
        {
            //Arrange
            var user = Substitute.For<User>();

            _userRepository.GetCollection(Arg.Any<Func<User, bool>>()).Returns(new List<User>() { user });

            //Act
            _accessTypeExpirationTask.Execute();

            //Assert
            user.Received().DowngradePlanToFree();
        }

        [TestMethod]
        public void Execute_ShouldSaveUnitOfWork_WhenSomeUsersWereUpdated()
        {
            //Arrange
            var user = Substitute.For<User>();
            _userRepository.GetCollection(Arg.Any<Func<User, bool>>()).Returns(new List<User>() { user });

            //Act
            _accessTypeExpirationTask.Execute();

            //Assert
            _unitOfWork.Received().Save();
        }


        [TestMethod]
        public void Execute_ShouldNotSaveUnitOfWork_WhenNoSomeUsersWereUpdated()
        {
            //Arrange
            _userRepository.GetCollection(Arg.Any<Func<User, bool>>()).Returns(new List<User>());

            //Act
            _accessTypeExpirationTask.Execute();

            //Assert
            _unitOfWork.DidNotReceive().Save();
        }

        #endregion
    }
}
