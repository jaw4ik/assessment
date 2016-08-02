using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.DomainModel.Entities.Tickets;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.DomainModel.Tests.ObjectMothers.Organizations;
using easygenerator.DomainModel.Tests.ObjectMothers.Tickets;
using easygenerator.Web.Domain.DomainOperations;
using easygenerator.Web.Extensions;
using easygenerator.Web.Mail;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq.Expressions;

namespace easygenerator.Web.Tests.Domain.DomainOperations
{
    [TestClass]
    public class OrganizationOperationsTests
    {
        private OrganizationOperations _organizationOperations;

        private IEntityFactory _entityFactory;
        private IMailSenderWrapper _mailSenderWrapper;
        private IUserOperations _userOperations;
        private IUserRepository _userRepository;
        private IOrganizationUserRepository _organizationUserRepository;

        [TestInitialize]
        public void Initialize()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _mailSenderWrapper = Substitute.For<IMailSenderWrapper>();
            _userOperations = Substitute.For<IUserOperations>();
            _userRepository = Substitute.For<IUserRepository>();
            _organizationUserRepository = Substitute.For<IOrganizationUserRepository>();

            _organizationOperations = new OrganizationOperations(_entityFactory, _mailSenderWrapper, _userOperations, _userRepository, _organizationUserRepository);
        }

        #region ApplySettings

        [TestMethod]
        public void ApplySettings_ShouldNotApplySettings_WhenUserIsAdmin()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();
            var user = OrganizationUserObjectMother.CreateAdmin();

            //Act
            _organizationOperations.ApplySettings(organization, user);

            //Assert
            _userOperations.DidNotReceiveWithAnyArgs().ApplyOrganizationSettings(Arg.Any<User>(), Arg.Any<OrganizationSettings>());
        }

        [TestMethod]
        public void ApplySettings_ShouldNotApplySettings_WhenUserIsNotAccepted()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();
            var user = OrganizationUserObjectMother.CreateWithStatus(OrganizationUserStatus.Declined);

            //Act
            _organizationOperations.ApplySettings(organization, user);

            //Assert
            _userOperations.DidNotReceiveWithAnyArgs().ApplyOrganizationSettings(Arg.Any<User>(), Arg.Any<OrganizationSettings>());
        }

        [TestMethod]
        public void ApplySettings_ShouldNotApplySettings_WhenOrganizationSettinsAreNull()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();
            var user = OrganizationUserObjectMother.CreateWithStatus(OrganizationUserStatus.Accepted);

            //Act
            _organizationOperations.ApplySettings(organization, user);

            //Assert
            _userOperations.DidNotReceiveWithAnyArgs().ApplyOrganizationSettings(Arg.Any<User>(), Arg.Any<OrganizationSettings>());
        }

        [TestMethod]
        public void ApplySettings_ShouldNotApplySettings_WhenUserMainOrganizationIsNull()
        {
            //Arrange
            var organization = OrganizationObjectMother.CreateWithSettings(OrganizationSettingsObjectMother.Create());
            var user = OrganizationUserObjectMother.CreateWithStatus(OrganizationUserStatus.Accepted);
            SetOrganizationRepositoryGetCollectionResult(new List<OrganizationUser>());

            //Act
            _organizationOperations.ApplySettings(organization, user);

            //Assert
            _userOperations.DidNotReceiveWithAnyArgs().ApplyOrganizationSettings(Arg.Any<User>(), Arg.Any<OrganizationSettings>());
        }

        [TestMethod]
        public void ApplySettings_ShouldNotApplySettings_WhenOrganizationIsNotUserMainOrganization()
        {
            //Arrange
            var organization = OrganizationObjectMother.CreateWithSettings(OrganizationSettingsObjectMother.Create());
            var user = OrganizationUserObjectMother.CreateWithStatus(OrganizationUserStatus.Accepted);

            var mainOrganization = OrganizationObjectMother.Create();
            var organizationUser = OrganizationUserObjectMother.CreateWithOrganization(mainOrganization);
            SetOrganizationRepositoryGetCollectionResult(new List<OrganizationUser>() { organizationUser });

            //Act
            _organizationOperations.ApplySettings(organization, user);

            //Assert
            _userOperations.DidNotReceiveWithAnyArgs().ApplyOrganizationSettings(Arg.Any<User>(), Arg.Any<OrganizationSettings>());
        }

        [TestMethod]
        public void ApplySettings_ShouldApplySettings()
        {
            //Arrange
            var organization = OrganizationObjectMother.CreateWithSettings(OrganizationSettingsObjectMother.Create());
            var organizationUser = OrganizationUserObjectMother.Create(organization, status: OrganizationUserStatus.Accepted);
            var user = UserObjectMother.Create();

            SetOrganizationRepositoryGetCollectionResult(new List<OrganizationUser>() { organizationUser });
            _userRepository.GetUserByEmail(organizationUser.Email).Returns(user);

            //Act
            _organizationOperations.ApplySettings(organization, organizationUser);

            //Assert
            _userOperations.Received().ApplyOrganizationSettings(user, organization.Settings);
        }

        #endregion

        #region DiscardSettings

        [TestMethod]
        public void DiscardSettings_ShouldNotDiscardSettings_WhenUserIsAdmin()
        {
            //Arrange
            var organization = OrganizationObjectMother.CreateWithSettings(OrganizationSettingsObjectMother.Create());
            var user = OrganizationUserObjectMother.CreateAdmin();

            //Act
            _organizationOperations.DiscardSettings(organization, user);

            //Assert
            _userOperations.DidNotReceive().DiscardOrganizationSettings(Arg.Any<User>());
        }

        [TestMethod]
        public void DiscardSettings_ShouldNotDiscardSettings_WhenUserIsNotAccepted()
        {
            //Arrange
            var organization = OrganizationObjectMother.CreateWithSettings(OrganizationSettingsObjectMother.Create());
            var user = OrganizationUserObjectMother.CreateWithStatus(OrganizationUserStatus.Declined);

            //Act
            _organizationOperations.DiscardSettings(organization, user);

            //Assert
            _userOperations.DidNotReceive().DiscardOrganizationSettings(Arg.Any<User>());
        }

        [TestMethod]
        public void DiscardSettings_ShouldDiscardSettings_WhenUserMainOrganizationIsNull()
        {
            //Arrange
            var organization = OrganizationObjectMother.CreateWithSettings(OrganizationSettingsObjectMother.Create());
            var organizationUser = OrganizationUserObjectMother.Create(organization, status: OrganizationUserStatus.Accepted);
            var user = UserObjectMother.CreateWithEmail(organizationUser.Email);

            SetOrganizationRepositoryGetCollectionResult(new List<OrganizationUser>());
            _userRepository.GetUserByEmail(organizationUser.Email).Returns(user);

            //Act
            _organizationOperations.DiscardSettings(organization, organizationUser);

            //Assert
            _userOperations.Received().DiscardOrganizationSettings(user);
        }

        [TestMethod]
        public void DiscardSettings_ShouldDiscardSettings_WhenCurrentUserOrganizationIsMainOrganization()
        {
            //Arrange
            var organization = OrganizationObjectMother.CreateWithSettings(OrganizationSettingsObjectMother.Create());
            var organizationUser = OrganizationUserObjectMother.Create(organization, status: OrganizationUserStatus.Accepted);
            var user = UserObjectMother.CreateWithEmail(organizationUser.Email);

            SetOrganizationRepositoryGetCollectionResult(new List<OrganizationUser>() { organizationUser });
            _userRepository.GetUserByEmail(organizationUser.Email).Returns(user);

            //Act
            _organizationOperations.DiscardSettings(organization, organizationUser);

            //Assert
            _userOperations.Received().DiscardOrganizationSettings(user);
        }

        [TestMethod]
        public void DiscardSettings_ShouldDiscardSettings_WhenUserMainOrganizationSettingsAreNull()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();
            var organizationUser = OrganizationUserObjectMother.Create(organization, status: OrganizationUserStatus.Accepted);
            var user = UserObjectMother.CreateWithEmail(organizationUser.Email);

            SetOrganizationRepositoryGetCollectionResult(new List<OrganizationUser>() { organizationUser });
            _userRepository.GetUserByEmail(organizationUser.Email).Returns(user);

            //Act
            _organizationOperations.DiscardSettings(organization, organizationUser);

            //Assert
            _userOperations.Received().DiscardOrganizationSettings(user);
        }

        [TestMethod]
        public void DiscardSettings_ShouldApplySettings_WhenUserMainOrganizationIsNotCurrentOrganization()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();
            var organizationUser = OrganizationUserObjectMother.Create(organization, status: OrganizationUserStatus.Accepted);
            var user = UserObjectMother.CreateWithEmail(organizationUser.Email);

            var mainOrganizationSettings = OrganizationSettingsObjectMother.Create();
            var mainOrganization = OrganizationObjectMother.CreateWithSettings(mainOrganizationSettings);

            SetOrganizationRepositoryGetCollectionResult(new List<OrganizationUser>() { OrganizationUserObjectMother.CreateWithOrganization(mainOrganization) });
            _userRepository.GetUserByEmail(organizationUser.Email).Returns(user);

            //Act
            _organizationOperations.DiscardSettings(organization, organizationUser);

            //Assert
            _userOperations.Received().ApplyOrganizationSettings(user, mainOrganizationSettings);
        }

        #endregion

        #region AutoincludeUser

        [TestMethod]
        public void AutoincludeUser_ShouldNotAddUser_WhenUserIsAlreadyInOrganization()
        {
            //Arrange
            var user = UserObjectMother.Create();
            var organization = Substitute.For<Organization>();
            var organizationUser = OrganizationUserObjectMother.CreateWithUserEmail(user.Email);
            organization.Users.Returns(new List<OrganizationUser> { organizationUser });

            //Act
            _organizationOperations.AutoincludeUser(user, organization);

            //Assert
            organization.DidNotReceive()
                .AddUser(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<OrganizationUserStatus>());
        }

        [TestMethod]
        public void AutoincludeUser_ShouldAddUserWithAcceptedStatus_WhenUserHasAlreadyConfirmedTheEmail()
        {
            //Arrange
            var user = UserObjectMother.Create(isEmailConfirmed: true);
            var organization = Substitute.For<Organization>();
            organization.Users.Returns(new List<OrganizationUser>());
            _entityFactory.EmailConfirmationTicket().Returns(EmailConfirmationTicketObjectMother.Create());

            //Act
            _organizationOperations.AutoincludeUser(user, organization);

            //Assert
            organization.Received()
                .AddUser(user.Email, user.Email, OrganizationUserStatus.Accepted);
        }

        [TestMethod]
        public void AutoincludeUser_ShouldAddUserWithWaitingForEmailConformationStatus_WhenUserHasNotConfirmedTheEmail()
        {
            //Arrange
            var user = UserObjectMother.Create();
            var organization = Substitute.For<Organization>();
            organization.Users.Returns(new List<OrganizationUser>());
            _entityFactory.EmailConfirmationTicket().Returns(EmailConfirmationTicketObjectMother.Create());

            //Act
            _organizationOperations.AutoincludeUser(user, organization);

            //Assert
            organization.Received()
                .AddUser(user.Email, user.Email, OrganizationUserStatus.WaitingForEmailConfirmation);
        }

        [TestMethod]
        public void AutoincludeUser_ShouldAddEmailConfirmationTicketToUser_WhenUserHasNotConfirmedTheEmail_AndUserDoesntHaveEmailConfirmationTicket()
        {
            //Arrange
            var user = Substitute.For<User>();
            var organization = Substitute.For<Organization>();
            organization.Users.Returns(new List<OrganizationUser>());
            var ticket = EmailConfirmationTicketObjectMother.Create();
            _entityFactory.EmailConfirmationTicket().Returns(ticket);
            user.GetEmailConfirmationTicket().Returns(null as EmailConfirmationTicket);

            //Act
            _organizationOperations.AutoincludeUser(user, organization);

            //Assert
            user.AddEmailConfirmationTicket(ticket);
        }

        [TestMethod]
        public void AutoincludeUser_ShouldSendEmailConfirmationEmail_WhenUserHasNotConfirmedTheEmail_AndUserDoesntHaveEmailConfirmationTicket()
        {
            //Arrange
            var user = Substitute.For<User>();
            var organization = Substitute.For<Organization>();
            organization.Users.Returns(new List<OrganizationUser>());
            var ticket = EmailConfirmationTicketObjectMother.Create();
            _entityFactory.EmailConfirmationTicket().Returns(ticket);
            user.GetEmailConfirmationTicket().Returns(null as EmailConfirmationTicket);

            //Act
            _organizationOperations.AutoincludeUser(user, organization);

            //Assert
            _mailSenderWrapper.Received().SendConfirmEmailMessage(Arg.Any<string>(), Arg.Any<string>(), ticket.Id.ToNString());
        }

        [TestMethod]
        public void AutoincludeUser_ShouldNotAddEmailConfirmationTicketToUser_WhenUserHasNotConfirmedTheEmail_AndUserHasEmailConfirmationTicket()
        {
            //Arrange
            var user = Substitute.For<User>();
            var organization = Substitute.For<Organization>();
            organization.Users.Returns(new List<OrganizationUser>());
            var ticket = EmailConfirmationTicketObjectMother.Create();
            user.GetEmailConfirmationTicket().Returns(ticket);

            //Act
            _organizationOperations.AutoincludeUser(user, organization);

            //Assert
            user.DidNotReceive().AddEmailConfirmationTicket(Arg.Any<EmailConfirmationTicket>());
        }

        [TestMethod]
        public void AutoincludeUser_ShouldNotSendEmailConformationMail_WhenUserHasNotConfirmedTheEmail_AndUserHasEmailConfirmationTicket()
        {
            //Arrange
            var user = Substitute.For<User>();
            var organization = Substitute.For<Organization>();
            organization.Users.Returns(new List<OrganizationUser>());
            var ticket = EmailConfirmationTicketObjectMother.Create();
            user.GetEmailConfirmationTicket().Returns(ticket);

            //Act
            _organizationOperations.AutoincludeUser(user, organization);

            //Assert
            _mailSenderWrapper.DidNotReceive().SendConfirmEmailMessage(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>());
        }

        #endregion

        #region Helper methods

        private void SetOrganizationRepositoryGetCollectionResult(IList<OrganizationUser> list)
        {
            _organizationUserRepository.GetCollection(Arg.Any<Expression<Func<OrganizationUser, bool>>>())
              .Returns(new Collection<OrganizationUser>(list));
        }

        #endregion
    }
}
