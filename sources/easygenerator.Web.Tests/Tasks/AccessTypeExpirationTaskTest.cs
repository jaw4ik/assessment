using System;
using System.Collections.Generic;
using easygenerator.DataAccess;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Tasks;
using FluentAssertions;
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
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            _unitOfWork = Substitute.For<IUnitOfWork>();
            _userRepository = Substitute.For<IUserRepository>();

            _accessTypeExpirationTask = new AccessTypeExpirationTask(_unitOfWork, _userRepository);
        }

        #region Execute

        [TestMethod]
        public void Execute_ShouldSaveUnitOfWork_WhenSomeUsersWereUpdated()
        {
            //Arrange
            var user = UserObjectMother.Create();
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

        [TestMethod]
        public void Execute_ShouldSetUserAccesTypeToFree_WhenCurrentAccessTypeExpired()
        {
            //Arrange
            DateTimeWrapper.Now = () => DateTime.MinValue;
            var user = UserObjectMother.Create();
            DateTimeWrapper.Now = () => DateTime.MinValue.AddDays(31);

            _userRepository.GetCollection(Arg.Any<Func<User, bool>>()).Returns(new List<User>() { user });

            //Act
            _accessTypeExpirationTask.Execute();

            //Assert
            user.AccessType.Should().Be(AccessType.Free);
            user.AccesTypeExpirationTime.Should().Be(null);
            user.ModifiedBy.Should().Be("AccessTypeExpirationTask");
        }

        #endregion
    }
}
