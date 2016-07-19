using easygenerator.DomainModel.Tests.ObjectMothers.Tickets;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities.Tickets
{
    [TestClass]
    public class EmailConfirmationTicketTests
    {
        #region Ctor

        [TestMethod]
        public void EmailConfirmationTicket_ShouldCreateEmailConfirmationTicketInstance()
        {
            // Act
            var ticket = EmailConfirmationTicketObjectMother.Create();

            // Assert
            ticket.Should().NotBeNull();
        }

        #endregion
    }
}
