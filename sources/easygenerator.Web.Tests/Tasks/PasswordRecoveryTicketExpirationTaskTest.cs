using System;
using System.Collections.Generic;
using easygenerator.DataAccess;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Components.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Tasks
{
    [TestClass]
    public class PasswordRecoveryTicketExpirationTaskTest
    {
        private PasswordRecoveryTicketExpirationTask _passwordRecoveryTicketExpirationTask;
        private IUnitOfWork _unitOfWork;
        private ConfigurationReader _configurationReader;
        private IPasswordRecoveryTicketRepository _passwordRecoveryTicketRepository;
        private int _passwordRecoveryExpirationInterval;

        [TestInitialize]
        public void InitializePublisher()
        {
            _passwordRecoveryExpirationInterval = 1440;
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            _unitOfWork = Substitute.For<IUnitOfWork>();
            _configurationReader = Substitute.For<ConfigurationReader>();
            _configurationReader.PasswordRecoveryExpirationInterval.Returns(_passwordRecoveryExpirationInterval);

            _passwordRecoveryTicketRepository = Substitute.For<IPasswordRecoveryTicketRepository>();

            _passwordRecoveryTicketExpirationTask = new PasswordRecoveryTicketExpirationTask(_unitOfWork, _configurationReader, _passwordRecoveryTicketRepository);
        }

        #region Execute

        [TestMethod]
        public void Execute_ShouldNotSaveUnitOfWork_WhenNoExpiredTicketsFound()
        {
            //Arrange
            _passwordRecoveryTicketRepository.GetExpiredTickets(Arg.Any<DateTime>()).Returns(new List<PasswordRecoveryTicket>());

            //Act
            _passwordRecoveryTicketExpirationTask.Execute();

            //Assert
            _unitOfWork.DidNotReceive().Save();
        }

        [TestMethod]
        public void Execute_ShouldRemoveExpiredTickets()
        {
            //Arrange
            var ticket = PasswordRecoveryTicketObjectMother.Create();
            _passwordRecoveryTicketRepository.GetExpiredTickets(Arg.Any<DateTime>()).Returns(new List<PasswordRecoveryTicket>() { ticket });

            //Act
            _passwordRecoveryTicketExpirationTask.Execute();

            //Assert
            _passwordRecoveryTicketRepository.Received().Remove(ticket);
        }

        [TestMethod]
        public void Execute_ShouldSaveUnitOfWork()
        {
            //Arrange
            var ticket = PasswordRecoveryTicketObjectMother.Create();
            _passwordRecoveryTicketRepository.GetExpiredTickets(Arg.Any<DateTime>()).Returns(new List<PasswordRecoveryTicket>() { ticket });

            //Act
            _passwordRecoveryTicketExpirationTask.Execute();

            //Assert
            _unitOfWork.Received().Save();
        }

        #endregion
    }
}
