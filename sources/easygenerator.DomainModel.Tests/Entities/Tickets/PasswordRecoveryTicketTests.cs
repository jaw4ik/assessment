using easygenerator.DomainModel.Tests.ObjectMothers.Tickets;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities.Tickets
{
    [TestClass]
    public class PasswordRecoveryTicketTests
    {
        #region Ctor

        [TestMethod]
        public void PasswordrecoveryTicket_ShouldCreateEmailConfirmationTicketInstance()
        {
            // Act
            var ticket = PasswordRecoveryTicketObjectMother.Create();

            // Assert
            ticket.Should().NotBeNull();
        }

        #endregion
    }
}
