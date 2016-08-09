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

        [TestInitialize]
        public void Initialize()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _mailSenderWrapper = Substitute.For<IMailSenderWrapper>();
            _userOperations = Substitute.For<IUserOperations>();
            _userRepository = Substitute.For<IUserRepository>();

            _organizationOperations = new OrganizationOperations(_entityFactory, _mailSenderWrapper, _userOperations, _userRepository);
        }

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

        #region GrantTemplateAccess

        [TestMethod]
        public void GrantTemplateAccess_ShouldGrantAccessToUser()
        {
            //Arrange
            var template = Substitute.For<Template>();
            var user = OrganizationUserObjectMother.Create();

            //Act
            _organizationOperations.GrantTemplateAccess(user, template);

            //Assert
            template.Received().GrantAccessTo(user.Email);
        }

        #endregion

        #region DiscardSubscriptionSettings

        [TestMethod]
        public void DiscardSubscriptionSettings_ShouldDiscardOrganizationSubscriptionSettingsForUser()
        {
            //Arrange
            var organizationUser = OrganizationUserObjectMother.Create();
            var user = UserObjectMother.Create();
            _userRepository.GetUserByEmail(organizationUser.Email).Returns(user);

            //Act
            _organizationOperations.DiscardSubscriptionSettings(organizationUser);

            //Assert
            _userOperations.Received().DiscardOrganizationSettingsSubscription(user);
        }

        [TestMethod]
        public void DiscardSubscriptionSettings_ShouldNotDiscardOrganizationSubscriptionSettingsForUser_WhenUserIsAdmin()
        {
            //Arrange
            var organizationUser = OrganizationUserObjectMother.CreateAdmin();
            var user = UserObjectMother.Create();
            _userRepository.GetUserByEmail(organizationUser.Email).Returns(user);

            //Act
            _organizationOperations.DiscardSubscriptionSettings(organizationUser);

            //Assert
            _userOperations.DidNotReceive().DiscardOrganizationSettingsSubscription(user);
        }

        #endregion

        #region ApplySubscriptionSetings

        [TestMethod]
        public void ApplySubscriptionSetings_ShouldNotApplySubscriptionSettingsToUser_WhenSubscriptionIsNull()
        {
            //Arrange
            var organizationUser = OrganizationUserObjectMother.Create();
            var user = UserObjectMother.Create();
            _userRepository.GetUserByEmail(organizationUser.Email).Returns(user);
            var settings = Substitute.For<OrganizationSettings>();

            //Act
            _organizationOperations.ApplySubscriptionSettings(organizationUser, settings);

            //Assert
            _userOperations.DidNotReceiveWithAnyArgs().ApplyOrganizationSettingsSubscription(user, Arg.Any<UserSubscription>());
        }


        [TestMethod]
        public void ApplySubscriptionSetings_ShouldNotApplySubscriptionSettingsToUser_WhenUserIsAdmin()
        {
            //Arrange
            var organizationUser = OrganizationUserObjectMother.CreateAdmin();
            var user = UserObjectMother.Create();
            _userRepository.GetUserByEmail(organizationUser.Email).Returns(user);
            var settings = Substitute.For<OrganizationSettings>();
            var subscription = new UserSubscription(AccessType.Academy, DateTime.MaxValue);
            settings.GetSubscription().Returns(subscription);

            //Act
            _organizationOperations.ApplySubscriptionSettings(organizationUser, settings);

            //Assert
            _userOperations.DidNotReceiveWithAnyArgs().ApplyOrganizationSettingsSubscription(user, Arg.Any<UserSubscription>());
        }

        [TestMethod]
        public void ApplySubscriptionSetings_ShouldApplySubscriptionSettingsToUser()
        {
            //Arrange
            var organizationUser = OrganizationUserObjectMother.Create();
            var user = UserObjectMother.Create();
            _userRepository.GetUserByEmail(organizationUser.Email).Returns(user);
            var settings = Substitute.For<OrganizationSettings>();
            var subscription = new UserSubscription(AccessType.Academy, DateTime.MaxValue);
            settings.GetSubscription().Returns(subscription);

            //Act
            _organizationOperations.ApplySubscriptionSettings(organizationUser, settings);

            //Assert
            _userOperations.Received().ApplyOrganizationSettingsSubscription(user, subscription);
        }

        #endregion

        #region DiscardSettings

        [TestMethod]
        public void DiscardSettings_ShouldDiscardOrganizationSubscriptionSettingsForUser()
        {
            //Arrange
            var organizationUser = OrganizationUserObjectMother.Create();
            var user = UserObjectMother.Create();
            _userRepository.GetUserByEmail(organizationUser.Email).Returns(user);

            //Act
            _organizationOperations.DiscardSettings(organizationUser);

            //Assert
            _userOperations.Received().DiscardOrganizationSettingsSubscription(user);
        }

        [TestMethod]
        public void DiscardSettings_ShouldNotDiscardOrganizationSubscriptionSettingsForUser_WhenUserIsAdmin()
        {
            //Arrange
            var organizationUser = OrganizationUserObjectMother.CreateAdmin();
            var user = UserObjectMother.Create();
            _userRepository.GetUserByEmail(organizationUser.Email).Returns(user);

            //Act
            _organizationOperations.DiscardSettings(organizationUser);

            //Assert
            _userOperations.DidNotReceive().DiscardOrganizationSettingsSubscription(user);
        }

        #endregion

        #region ApplySettings

        [TestMethod]
        public void ApplySetings_ShouldNotApplySubscriptionSettingsToUser_WhenSubscriptionIsNull()
        {
            //Arrange
            var organizationUser = OrganizationUserObjectMother.Create();
            var user = UserObjectMother.Create();
            _userRepository.GetUserByEmail(organizationUser.Email).Returns(user);
            var settings = Substitute.For<OrganizationSettings>();

            //Act
            _organizationOperations.ApplySettings(organizationUser, settings);

            //Assert
            _userOperations.DidNotReceiveWithAnyArgs().ApplyOrganizationSettingsSubscription(user, Arg.Any<UserSubscription>());
        }


        [TestMethod]
        public void ApplySetings_ShouldNotApplySubscriptionSettingsToUser_WhenUserIsAdmin()
        {
            //Arrange
            var organizationUser = OrganizationUserObjectMother.CreateAdmin();
            var user = UserObjectMother.Create();
            _userRepository.GetUserByEmail(organizationUser.Email).Returns(user);
            var settings = Substitute.For<OrganizationSettings>();
            settings.GetSubscription().Returns(new UserSubscription(AccessType.Academy, DateTime.MaxValue));

            //Act
            _organizationOperations.ApplySettings(organizationUser, settings);

            //Assert
            _userOperations.DidNotReceiveWithAnyArgs().ApplyOrganizationSettingsSubscription(user, Arg.Any<UserSubscription>());
        }

        [TestMethod]
        public void ApplySetings_ShouldApplySubscriptionSettingsToUser()
        {
            //Arrange
            var organizationUser = OrganizationUserObjectMother.Create();
            var user = UserObjectMother.Create();
            _userRepository.GetUserByEmail(organizationUser.Email).Returns(user);
            var settings = Substitute.For<OrganizationSettings>();
            var subscription = new UserSubscription(AccessType.Academy, DateTime.MaxValue);
            settings.GetSubscription().Returns(subscription);

            //Act
            _organizationOperations.ApplySettings(organizationUser, settings);

            //Assert
            _userOperations.Received().ApplyOrganizationSettingsSubscription(user, subscription);
        }

        [TestMethod]
        public void ApplySettings_ShouldGrantAccessToUser_ForEachOrganizationSettingsTemplate()
        {
            //Arrange
            var template1 = Substitute.For<Template>();
            var template2 = Substitute.For<Template>();
            var user = OrganizationUserObjectMother.Create();
            var settings = Substitute.For<OrganizationSettings>();
            settings.Templates.Returns(new List<Template>() { template1, template2 });

            //Act
            _organizationOperations.ApplySettings(user, settings);

            //Assert
            template1.Received().GrantAccessTo(user.Email);
            template2.Received().GrantAccessTo(user.Email);
        }

        #endregion
    }
}
