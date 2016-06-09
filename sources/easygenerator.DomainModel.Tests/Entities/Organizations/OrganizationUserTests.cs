using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.DomainModel.Events.OrganizationEvents;
using easygenerator.DomainModel.Tests.ObjectMothers.Organizations;
using easygenerator.DomainModel.Tests.Utils;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace easygenerator.DomainModel.Tests.Entities.Organizations
{
    [TestClass]
    public class OrganizationUserTests
    {
        #region Ctor

        [TestMethod]
        public void OrganizationUser_ShouldCreateInstance()
        {
            const string userEmail = "mail@mail.com";
            const string createdBy = "user";
            DateTimeWrapper.Now = () => DateTime.MaxValue;
            var organization = OrganizationObjectMother.Create();
            var user = OrganizationUserObjectMother.Create(organization, userEmail, false, OrganizationUserStatus.WaitingForAcceptance, createdBy);

            user.Id.Should().NotBeEmpty();
            user.CreatedBy.Should().Be(createdBy);
            user.CreatedOn.Should().Be(DateTime.MaxValue);
            user.ModifiedOn.Should().Be(DateTime.MaxValue);
            user.Status.Should().Be(OrganizationUserStatus.WaitingForAcceptance);
            user.IsAdmin.Should().Be(false);
            user.ModifiedBy.Should().Be(createdBy);
        }

        [TestMethod]
        public void OrganizationUser_ShouldThrowArgumentNullException_WhenOrganizationIsNull()
        {
            Action action = () => OrganizationUserObjectMother.CreateWithOrganization(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("organization");
        }

        [TestMethod]
        public void OrganizationUser_ShouldThrowArgumentNullException_WhenCreatedByIsNull()
        {
            Action action = () => OrganizationUserObjectMother.CreateWithCreatedBy(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("createdBy");
        }

        [TestMethod]
        public void OrganizationUser_ShouldThrowArgumentNullException_WhenUserEmailHasInvalidFormat()
        {
            Action action = () => OrganizationUserObjectMother.CreateWithUserEmail(null);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("userEmail");
        }

        #endregion

        #region Accept invite

        [TestMethod]
        public void AcceptInvite_ShouldSetUserStateToAccepted()
        {
            // Arrange
            var organizationUser = OrganizationUserObjectMother.CreateWithStatus(OrganizationUserStatus.Declined);

            // Act
            organizationUser.AcceptInvite();

            // Assert
            organizationUser.Status.Should().Be(OrganizationUserStatus.Accepted);
        }

        [TestMethod]
        public void AcceptInvite_ShouldTriggerEvent()
        {
            // Arrange
            var organizationUser = OrganizationUserObjectMother.CreateWithStatus(OrganizationUserStatus.WaitingForAcceptance);

            // Act
            organizationUser.AcceptInvite();

            // Assert
            organizationUser.ShouldContainSingleEvent<OrganizationInviteAcceptedEvent>();
        }

        [TestMethod]
        public void AcceptInvite_ShouldNotTriggerEvent_WhenStatusIsAlreadySet()
        {
            // Arrange
            var organizationUser = OrganizationUserObjectMother.CreateWithStatus(OrganizationUserStatus.Accepted);

            // Act
            organizationUser.AcceptInvite();

            // Assert
            organizationUser.ShouldNotContainSingleEvent<OrganizationInviteAcceptedEvent>();
        }

        #endregion

        #region Decline invite

        [TestMethod]
        public void DeclineInvite_ShouldSetUserStatusAsDeclined()
        {
            // Arrange
            var organizationUser = OrganizationUserObjectMother.CreateWithStatus(OrganizationUserStatus.WaitingForAcceptance);

            // Act
            organizationUser.DeclineInvite();

            // Assert
            organizationUser.Status.Should().Be(OrganizationUserStatus.Declined);
        }

        [TestMethod]
        public void DeclineInvite_ShouldTriggerEvent()
        {
            // Arrange
            var organizationUser = OrganizationUserObjectMother.Create();

            // Act
            organizationUser.DeclineInvite();

            // Assert
            organizationUser.ShouldContainSingleEvent<OrganizationInviteDeclinedEvent>();
        }

        [TestMethod]
        public void DeclineInvite_ShouldNotTriggerEvent_WhenStatusIsAlreadySet()
        {
            // Arrange
            var organizationUser = OrganizationUserObjectMother.CreateWithStatus(OrganizationUserStatus.Declined);

            // Act
            organizationUser.DeclineInvite();

            // Assert
            organizationUser.ShouldNotContainSingleEvent<OrganizationInviteDeclinedEvent>();
        }

        #endregion

        #region Reinvite user

        [TestMethod]
        public void ReinviteUser_ShouldSetUserStateToWaitingForAcceptance()
        {
            // Arrange
            var user = OrganizationUserObjectMother.CreateWithStatus(OrganizationUserStatus.Declined);

            // Act
            user.Reinvite();

            // Assert
            user.Status.Should().Be(OrganizationUserStatus.WaitingForAcceptance);
        }

        [TestMethod]
        public void ReinviteUser_ShouldTriggerEvent()
        {
            // Arrange
            var user = OrganizationUserObjectMother.CreateWithStatus(OrganizationUserStatus.Declined);

            // Act
            user.Reinvite();

            // Assert
            user.ShouldContainSingleEvent<OrganizationUserReinvitedEvent>();
        }

        [TestMethod]
        public void ReinviteUser_ShouldNotTriggerEvent_WhenStatusIsAlreadySet()
        {
            // Arrange
            var organizationUser = OrganizationUserObjectMother.CreateWithStatus(OrganizationUserStatus.WaitingForAcceptance);

            // Act
            organizationUser.Reinvite();

            // Assert
            organizationUser.ShouldNotContainSingleEvent<OrganizationUserReinvitedEvent>();
        }

        #endregion
    }
}
