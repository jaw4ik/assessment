using easygenerator.DataAccess;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Tasks;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;

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
            DateTimeWrapper.Now = () => DateTime.MaxValue.AddYears(-1);
            var userSubscription = UserSubscriptionObjectMother.Create(AccessType.Starter, DateTime.MaxValue.AddYears(-1));
            var user = UserObjectMother.CreateWithSubscription(userSubscription);
            DateTimeWrapper.Now = () => DateTime.MaxValue.AddYears(-1).AddDays(31);

            _userRepository.GetCollection(Arg.Any<Func<User, bool>>()).Returns(new List<User>() { user });

            //Act
            _accessTypeExpirationTask.Execute();

            //Assert
            user.Subscription.AccessType.Should().Be(AccessType.Free);
            user.Subscription.ExpirationDate.Should().Be(null);
        }

        #endregion
    }
}
