using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.DomainModel.Events.OrganizationEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.DomainModel.Tests.ObjectMothers.Organizations;
using easygenerator.Infrastructure;
using easygenerator.Web.Domain.DomainEvents.Handlers.Organizaions;
using easygenerator.Web.Domain.DomainOperations;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.Collections.Generic;

namespace easygenerator.Web.Tests.Domain.DomainEvents.Handlers
{
    [TestClass]
    public class OrganizationSettingsApplicationHandlerTests
    {
        private OrganizationSettingsApplicationHandler _handler;

        private IUnitOfWork _unitOfWork;
        private IOrganizationOperations _organizationOperations;
        private IOrganizationUserRepository _organizationUserRepository;

        [TestInitialize]
        public void Initialize()
        {
            _unitOfWork = Substitute.For<IUnitOfWork>();
            _organizationOperations = Substitute.For<IOrganizationOperations>();
            _organizationUserRepository = Substitute.For<IOrganizationUserRepository>();

            _handler = new OrganizationSettingsApplicationHandler(_organizationOperations, _unitOfWork, _organizationUserRepository);
        }

        #region Handle OrganizationInviteAcceptedEvent

        [TestMethod]
        public void Handle_OrganizationInviteAcceptedEvent_ShouldApplyMainOrganizationSettings()
        {
            //Arrange
            var user = OrganizationUserObjectMother.CreateWithStatus(OrganizationUserStatus.Accepted);
            var settings = OrganizationSettingsObjectMother.Create();
            var organization = OrganizationObjectMother.CreateWithSettings(settings);
            var args = new OrganizationInviteAcceptedEvent(organization, user);

            _organizationUserRepository.GetUserMainOrganization(user.Email).Returns(user.Organization);

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.Received().ApplySettings(user, settings);
        }

        [TestMethod]
        public void Handle_OrganizationInviteAcceptedEvent_ShouldNotApplyMainOrganizationSettings_WhenUserIsNotAccepted()
        {
            //Arrange
            var user = OrganizationUserObjectMother.CreateWithStatus(OrganizationUserStatus.WaitingForAcceptance);
            var settings = OrganizationSettingsObjectMother.Create();
            var organization = OrganizationObjectMother.CreateWithSettings(settings);
            var args = new OrganizationInviteAcceptedEvent(organization, user);

            _organizationUserRepository.GetUserMainOrganization(user.Email).Returns(user.Organization);

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.DidNotReceive().ApplySettings(user, settings);
        }

        [TestMethod]
        public void Handle_OrganizationInviteAcceptedEvent_ShouldNotApplyMainOrganizationSettings_WhenOrganizationSettingsAreNotDefined()
        {
            //Arrange
            var user = OrganizationUserObjectMother.CreateWithStatus(OrganizationUserStatus.Accepted);
            var organization = OrganizationObjectMother.Create();
            var args = new OrganizationInviteAcceptedEvent(organization, user);

            _organizationUserRepository.GetUserMainOrganization(user.Email).Returns(user.Organization);

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.DidNotReceiveWithAnyArgs().ApplySettings(user, Arg.Any<OrganizationSettings>());
        }

        [TestMethod]
        public void Handle_OrganizationInviteAcceptedEvent_ShouldNotApplyMainOrganizationSettings_WhenOrganizationIsNotMain()
        {
            //Arrange
            var user = OrganizationUserObjectMother.CreateWithStatus(OrganizationUserStatus.Accepted);
            var settings = OrganizationSettingsObjectMother.Create();
            var organization = OrganizationObjectMother.CreateWithSettings(settings);
            var args = new OrganizationInviteAcceptedEvent(organization, user);

            _organizationUserRepository.GetUserMainOrganization(user.Email).Returns(OrganizationObjectMother.Create());

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.DidNotReceiveWithAnyArgs().ApplySettings(user, settings);
        }

        [TestMethod]
        public void Handle_OrganizationInviteAcceptedEvent_ShouldSaveData()
        {
            //Arrange
            var args = new OrganizationInviteAcceptedEvent(OrganizationObjectMother.CreateWithSettings(OrganizationSettingsObjectMother.Create()),
                OrganizationUserObjectMother.Create());

            //Act
            _handler.Handle(args);

            //Assert
            _unitOfWork.Received().Save();
        }

        #endregion

        #region Handle OrganizationUserAddedEvent

        [TestMethod]
        public void Handle_OrganizationUserAddedEvent_ShouldApplyMainOrganizationSettings()
        {
            //Arrange
            var user = OrganizationUserObjectMother.CreateWithStatus(OrganizationUserStatus.Accepted);
            var settings = OrganizationSettingsObjectMother.Create();
            var organization = OrganizationObjectMother.CreateWithSettings(settings);
            var args = new OrganizationUserAddedEvent(organization, user);

            _organizationUserRepository.GetUserMainOrganization(user.Email).Returns(user.Organization);

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.Received().ApplySettings(user, settings);
        }

        [TestMethod]
        public void Handle_OrganizationUserAddedEvent_ShouldNotApplyMainOrganizationSettings_WhenUserIsNotAccepted()
        {
            //Arrange
            var user = OrganizationUserObjectMother.CreateWithStatus(OrganizationUserStatus.WaitingForAcceptance);
            var settings = OrganizationSettingsObjectMother.Create();
            var organization = OrganizationObjectMother.CreateWithSettings(settings);
            var args = new OrganizationUserAddedEvent(organization, user);

            _organizationUserRepository.GetUserMainOrganization(user.Email).Returns(user.Organization);

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.DidNotReceive().ApplySettings(user, settings);
        }

        [TestMethod]
        public void Handle_OrganizationUserAddedEvent_ShouldNotApplyMainOrganizationSettings_WhenOrganizationSettingsAreNotDefined()
        {
            //Arrange
            var user = OrganizationUserObjectMother.CreateWithStatus(OrganizationUserStatus.Accepted);
            var organization = OrganizationObjectMother.Create();
            var args = new OrganizationUserAddedEvent(organization, user);

            _organizationUserRepository.GetUserMainOrganization(user.Email).Returns(user.Organization);

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.DidNotReceiveWithAnyArgs().ApplySettings(user, Arg.Any<OrganizationSettings>());
        }

        [TestMethod]
        public void Handle_OrganizationUserAddedEvent_ShouldNotApplyMainOrganizationSettings_WhenOrganizationIsNotMain()
        {
            //Arrange
            var user = OrganizationUserObjectMother.CreateWithStatus(OrganizationUserStatus.Accepted);
            var settings = OrganizationSettingsObjectMother.Create();
            var organization = OrganizationObjectMother.CreateWithSettings(settings);
            var args = new OrganizationUserAddedEvent(organization, user);

            _organizationUserRepository.GetUserMainOrganization(user.Email).Returns(OrganizationObjectMother.Create());

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.DidNotReceiveWithAnyArgs().ApplySettings(user, settings);
        }

        [TestMethod]
        public void Handle_OrganizationUserAddedEvent_ShouldSaveData()
        {
            //Arrange
            var args = new OrganizationUserAddedEvent(OrganizationObjectMother.CreateWithSettings(OrganizationSettingsObjectMother.Create()),
                OrganizationUserObjectMother.Create());

            //Act
            _handler.Handle(args);

            //Assert
            _unitOfWork.Received().Save();
        }

        #endregion

        #region Handle OrganizationSettingsResetEvent

        [TestMethod]
        public void Handle_OrganizationSettingsResetEvent_ShouldDiscardMainOrganizationSettings_ForAcceptedUsers()
        {
            //Arrange
            var settings = OrganizationSettingsObjectMother.Create();
            var organization = Substitute.For<Organization>();
            organization.Settings.Returns(settings);

            var acceptedUser = OrganizationUserObjectMother.Create(organization, userEmail: "user1@gmail.com", status: OrganizationUserStatus.Accepted);
            var declinedUser = OrganizationUserObjectMother.Create(organization, userEmail: "user2@gmail.com", status: OrganizationUserStatus.Declined);

            organization.Users.Returns(new List<OrganizationUser>() { acceptedUser, declinedUser });

            var args = new OrganizationSettingsResetEvent(organization);

            _organizationUserRepository.GetUserMainOrganization(acceptedUser.Email).Returns(acceptedUser.Organization);
            _organizationUserRepository.GetUserMainOrganization(declinedUser.Email).Returns(declinedUser.Organization);

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.Received().DiscardSettings(acceptedUser);
            _organizationOperations.DidNotReceive().DiscardSettings(declinedUser);
        }

        [TestMethod]
        public void Handle_OrganizationSettingsResetEvent_ShouldDiscardMainOrganizationSettings_ForUsersWhereOrganizationIsMain()
        {
            //Arrange
            var settings = OrganizationSettingsObjectMother.Create();
            var organization = Substitute.For<Organization>();
            organization.Settings.Returns(settings);

            var user1 = OrganizationUserObjectMother.Create(organization, userEmail: "user1@gmail.com", status: OrganizationUserStatus.Accepted);
            var user2 = OrganizationUserObjectMother.Create(organization, userEmail: "user2@gmail.com", status: OrganizationUserStatus.Accepted);

            organization.Users.Returns(new List<OrganizationUser>() { user1, user2 });

            var args = new OrganizationSettingsResetEvent(organization);

            _organizationUserRepository.GetUserMainOrganization(user1.Email).Returns(user1.Organization);
            _organizationUserRepository.GetUserMainOrganization(user2.Email).Returns(OrganizationObjectMother.Create());

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.Received().DiscardSettings(user1);
            _organizationOperations.DidNotReceive().DiscardSettings(user2);
        }

        [TestMethod]
        public void Handle_OrganizationSettingsResetEvent_ShouldSaveData()
        {
            //Arrange
            var args = new OrganizationSettingsResetEvent(OrganizationObjectMother.CreateWithSettings(OrganizationSettingsObjectMother.Create()));

            //Act
            _handler.Handle(args);

            //Assert
            _unitOfWork.Received().Save();
        }

        #endregion

        #region Handle OrganizationSettingsTemplateAddedEvent

        [TestMethod]
        public void Handle_OrganizationSettingsTemplateAddedEvent_ShouldGrantTemplateAccess_ForAcceptedUsers()
        {
            //Arrange
            var settings = OrganizationSettingsObjectMother.Create();
            var organization = Substitute.For<Organization>();
            organization.Settings.Returns(settings);
            var template = TemplateObjectMother.Create();

            var acceptedUser = OrganizationUserObjectMother.Create(organization, userEmail: "user1@gmail.com", status: OrganizationUserStatus.Accepted);
            var declinedUser = OrganizationUserObjectMother.Create(organization, userEmail: "user2@gmail.com", status: OrganizationUserStatus.Declined);

            organization.Users.Returns(new List<OrganizationUser>() { acceptedUser, declinedUser });

            var args = new OrganizationSettingsTemplateAddedEvent(organization, template);

            _organizationUserRepository.GetUserMainOrganization(acceptedUser.Email).Returns(acceptedUser.Organization);
            _organizationUserRepository.GetUserMainOrganization(declinedUser.Email).Returns(declinedUser.Organization);

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.Received().GrantTemplateAccess(acceptedUser, template);
            _organizationOperations.DidNotReceive().GrantTemplateAccess(declinedUser, template);
        }

        [TestMethod]
        public void Handle_OrganizationSettingsTemplateAddedEvent_ShouldNotGrantTemplateAccess_WhenOrganizationSettingsAreNull()
        {
            //Arrange
            var organization = Substitute.For<Organization>();
            var template = TemplateObjectMother.Create();

            var user = OrganizationUserObjectMother.Create(organization, userEmail: "user2@gmail.com", status: OrganizationUserStatus.Declined);

            organization.Users.Returns(new List<OrganizationUser>() { user });

            var args = new OrganizationSettingsTemplateAddedEvent(organization, template);
            _organizationUserRepository.GetUserMainOrganization(user.Email).Returns(user.Organization);

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.DidNotReceive().GrantTemplateAccess(user, template);
        }


        [TestMethod]
        public void Handle_OrganizationSettingsTemplateAddedEvent_ShouldGrantTemplateAccess_ForUsersWhereOrganizationIsMain()
        {
            //Arrange
            var settings = OrganizationSettingsObjectMother.Create();
            var organization = Substitute.For<Organization>();
            organization.Settings.Returns(settings);
            var template = TemplateObjectMother.Create();

            var user1 = OrganizationUserObjectMother.Create(organization, userEmail: "user1@gmail.com", status: OrganizationUserStatus.Accepted);
            var user2 = OrganizationUserObjectMother.Create(organization, userEmail: "user2@gmail.com", status: OrganizationUserStatus.Accepted);

            organization.Users.Returns(new List<OrganizationUser>() { user1, user2 });

            var args = new OrganizationSettingsTemplateAddedEvent(organization, template);

            _organizationUserRepository.GetUserMainOrganization(user1.Email).Returns(user1.Organization);
            _organizationUserRepository.GetUserMainOrganization(user2.Email).Returns(OrganizationObjectMother.Create());

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.Received().GrantTemplateAccess(user1, template);
            _organizationOperations.DidNotReceive().GrantTemplateAccess(user2, template);
        }

        [TestMethod]
        public void Handle_OrganizationSettingsTemplateAddedEvent_ShouldSaveData()
        {
            //Arrange
            var args = new OrganizationSettingsTemplateAddedEvent(OrganizationObjectMother.CreateWithSettings(OrganizationSettingsObjectMother.Create()), TemplateObjectMother.Create());

            //Act
            _handler.Handle(args);

            //Assert
            _unitOfWork.Received().Save();
        }

        #endregion

        #region Handle OrganizationSettingsSubscriptionUpdatedEvent

        [TestMethod]
        public void Handle_OrganizationSettingsSubscriptionUpdatedEvent_ShouldApplySubscriptionSettings_ForAcceptedUsers()
        {
            //Arrange
            var settings = OrganizationSettingsObjectMother.Create();
            var organization = Substitute.For<Organization>();
            organization.Settings.Returns(settings);

            var acceptedUser = OrganizationUserObjectMother.Create(organization, userEmail: "user1@gmail.com", status: OrganizationUserStatus.Accepted);
            var declinedUser = OrganizationUserObjectMother.Create(organization, userEmail: "user2@gmail.com", status: OrganizationUserStatus.Declined);

            organization.Users.Returns(new List<OrganizationUser>() { acceptedUser, declinedUser });

            var args = new OrganizationSettingsSubscriptionUpdatedEvent(organization);

            _organizationUserRepository.GetUserMainOrganization(acceptedUser.Email).Returns(acceptedUser.Organization);
            _organizationUserRepository.GetUserMainOrganization(declinedUser.Email).Returns(declinedUser.Organization);

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.Received().ApplySubscriptionSettings(acceptedUser, settings);
            _organizationOperations.DidNotReceive().ApplySubscriptionSettings(declinedUser, settings);
        }

        [TestMethod]
        public void Handle_OrganizationSettingsSubscriptionUpdatedEvent_ShouldNotApplySubscriptionSettings_WhenOrganizationSettingsAreNull()
        {
            //Arrange
            var organization = Substitute.For<Organization>();
            var user = OrganizationUserObjectMother.Create(organization, status: OrganizationUserStatus.Declined);

            organization.Users.Returns(new List<OrganizationUser>() { user });

            var args = new OrganizationSettingsSubscriptionUpdatedEvent(organization);
            _organizationUserRepository.GetUserMainOrganization(user.Email).Returns(user.Organization);

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.DidNotReceiveWithAnyArgs().ApplySubscriptionSettings(user, Arg.Any<OrganizationSettings>());
        }


        [TestMethod]
        public void Handle_OrganizationSettingsSubscriptionUpdatedEvent_ShouldApplySubscriptionSettings_ForUsersWhereOrganizationIsMain()
        {
            //Arrange
            var settings = OrganizationSettingsObjectMother.Create();
            var organization = Substitute.For<Organization>();
            organization.Settings.Returns(settings);

            var user1 = OrganizationUserObjectMother.Create(organization, userEmail: "user1@gmail.com", status: OrganizationUserStatus.Accepted);
            var user2 = OrganizationUserObjectMother.Create(organization, userEmail: "user2@gmail.com", status: OrganizationUserStatus.Accepted);

            organization.Users.Returns(new List<OrganizationUser>() { user1, user2 });

            var args = new OrganizationSettingsSubscriptionUpdatedEvent(organization);

            _organizationUserRepository.GetUserMainOrganization(user1.Email).Returns(user1.Organization);
            _organizationUserRepository.GetUserMainOrganization(user2.Email).Returns(OrganizationObjectMother.Create());

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.Received().ApplySubscriptionSettings(user1, settings);
            _organizationOperations.DidNotReceive().ApplySubscriptionSettings(user2, settings);
        }

        [TestMethod]
        public void Handle_OrganizationSettingsSubscriptionUpdatedEvent_ShouldSaveData()
        {
            //Arrange
            var args = new OrganizationSettingsSubscriptionUpdatedEvent(OrganizationObjectMother.CreateWithSettings(OrganizationSettingsObjectMother.Create()));

            //Act
            _handler.Handle(args);

            //Assert
            _unitOfWork.Received().Save();
        }

        #endregion

        #region Handle OrganizationSettingsSubscriptionResetEvent

        [TestMethod]
        public void Handle_OrganizationSettingsSubscriptionResetEvent_ShouldDiscardSubscriptionSettings_ForAcceptedUsers()
        {
            //Arrange
            var settings = OrganizationSettingsObjectMother.Create();
            var organization = Substitute.For<Organization>();
            organization.Settings.Returns(settings);

            var acceptedUser = OrganizationUserObjectMother.Create(organization, userEmail: "user1@gmail.com", status: OrganizationUserStatus.Accepted);
            var declinedUser = OrganizationUserObjectMother.Create(organization, userEmail: "user2@gmail.com", status: OrganizationUserStatus.Declined);

            organization.Users.Returns(new List<OrganizationUser>() { acceptedUser, declinedUser });

            var args = new OrganizationSettingsSubscriptionResetEvent(organization);

            _organizationUserRepository.GetUserMainOrganization(acceptedUser.Email).Returns(acceptedUser.Organization);
            _organizationUserRepository.GetUserMainOrganization(declinedUser.Email).Returns(declinedUser.Organization);

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.Received().DiscardSubscriptionSettings(acceptedUser);
            _organizationOperations.DidNotReceive().DiscardSubscriptionSettings(declinedUser);
        }

        [TestMethod]
        public void Handle_OrganizationSettingsSubscriptionResetEvent_ShouldNotDiscardSubscriptionSettings_WhenOrganizationSettingsAreNull()
        {
            //Arrange
            var organization = Substitute.For<Organization>();
            var user = OrganizationUserObjectMother.Create(organization, status: OrganizationUserStatus.Declined);

            organization.Users.Returns(new List<OrganizationUser>() { user });

            var args = new OrganizationSettingsSubscriptionResetEvent(organization);
            _organizationUserRepository.GetUserMainOrganization(user.Email).Returns(user.Organization);

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.DidNotReceiveWithAnyArgs().DiscardSettings(user);
        }


        [TestMethod]
        public void Handle_OrganizationSettingsSubscriptionResetEvent_ShouldDiscardSubscriptionSettings_ForUsersWhereOrganizationIsMain()
        {
            //Arrange
            var settings = OrganizationSettingsObjectMother.Create();
            var organization = Substitute.For<Organization>();
            organization.Settings.Returns(settings);

            var user1 = OrganizationUserObjectMother.Create(organization, userEmail: "user1@gmail.com", status: OrganizationUserStatus.Accepted);
            var user2 = OrganizationUserObjectMother.Create(organization, userEmail: "user2@gmail.com", status: OrganizationUserStatus.Accepted);

            organization.Users.Returns(new List<OrganizationUser>() { user1, user2 });

            var args = new OrganizationSettingsSubscriptionResetEvent(organization);

            _organizationUserRepository.GetUserMainOrganization(user1.Email).Returns(user1.Organization);
            _organizationUserRepository.GetUserMainOrganization(user2.Email).Returns(OrganizationObjectMother.Create());

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.Received().DiscardSubscriptionSettings(user1);
            _organizationOperations.DidNotReceive().DiscardSubscriptionSettings(user2);
        }

        [TestMethod]
        public void Handle_OrganizationSettingsSubscriptionResetEvent_ShouldSaveData()
        {
            //Arrange
            var args = new OrganizationSettingsSubscriptionResetEvent(OrganizationObjectMother.CreateWithSettings(OrganizationSettingsObjectMother.Create()));

            //Act
            _handler.Handle(args);

            //Assert
            _unitOfWork.Received().Save();
        }

        #endregion

        #region Handle OrganizationUserRemovedEvent

        [TestMethod]
        public void Handle_OrganizationUserRemovedEvent_ShouldNotApplySettings_WhenUserIsNotAccepted()
        {
            //Arrange
            var user = OrganizationUserObjectMother.CreateWithStatus(OrganizationUserStatus.Declined);
            var args = new OrganizationUserRemovedEvent(Substitute.For<Organization>(), user);

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.DidNotReceiveWithAnyArgs().ApplySettings(Arg.Any<OrganizationUser>(), Arg.Any<OrganizationSettings>());
        }

        [TestMethod]
        public void Handle_OrganizationUserRemovedEvent_ShouldNotDiscardSettings_WhenUserIsNotAccepted()
        {
            //Arrange
            var user = OrganizationUserObjectMother.CreateWithStatus(OrganizationUserStatus.Declined);
            var args = new OrganizationUserRemovedEvent(Substitute.For<Organization>(), user);

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.DidNotReceiveWithAnyArgs().DiscardSettings(Arg.Any<OrganizationUser>());
        }

        [TestMethod]
        public void Handle_OrganizationUserRemovedEvent_ShouldApplyMainSettings_WhenMainOrganizationIsNotCurrentOrganization()
        {
            //Arrange
            var user = OrganizationUserObjectMother.CreateWithStatus(OrganizationUserStatus.Accepted);
            var organization = Substitute.For<Organization>();
            organization.Settings.Returns(Substitute.For<OrganizationSettings>());
            var args = new OrganizationUserRemovedEvent(organization, user);
            var mainOrganization = Substitute.For<Organization>();
            var settings = Substitute.For<OrganizationSettings>();
            mainOrganization.Settings.Returns(settings);
            _organizationUserRepository.GetUserMainOrganization(user.Email).Returns(mainOrganization);

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.Received().ApplySettings(user, settings);
        }

        [TestMethod]
        public void Handle_OrganizationUserRemovedEvent_ShouldNotApplyMainSettings_WhenMainOrganizationIsCurrentOrganization()
        {
            //Arrange
            var user = OrganizationUserObjectMother.CreateWithStatus(OrganizationUserStatus.Accepted);
            var organization = Substitute.For<Organization>();
            organization.Settings.Returns(Substitute.For<OrganizationSettings>());
            var args = new OrganizationUserRemovedEvent(organization, user);
            var settings = Substitute.For<OrganizationSettings>();
            _organizationUserRepository.GetUserMainOrganization(user.Email).Returns(organization);

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.DidNotReceiveWithAnyArgs().ApplySettings(user, settings);
        }

        [TestMethod]
        public void Handle_OrganizationUserRemovedEvent_ShouldNotApplyMainSettings_WhenMainOrganizationIsNull()
        {
            //Arrange
            var user = OrganizationUserObjectMother.CreateWithStatus(OrganizationUserStatus.Accepted);
            var organization = Substitute.For<Organization>();
            organization.Settings.Returns(Substitute.For<OrganizationSettings>());
            var args = new OrganizationUserRemovedEvent(organization, user);
            _organizationUserRepository.GetUserMainOrganization(user.Email).Returns(null as Organization);

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.DidNotReceiveWithAnyArgs().ApplySettings(user, Arg.Any<OrganizationSettings>());
        }

        [TestMethod]
        public void Handle_OrganizationUserRemovedEvent_ShouldDiscardSettings_WhenUserMainOrganizationIsNotDefined()
        {
            //Arrange
            var user = OrganizationUserObjectMother.CreateWithStatus(OrganizationUserStatus.Accepted);
            var organization = Substitute.For<Organization>();
            organization.Settings.Returns(Substitute.For<OrganizationSettings>());
            var args = new OrganizationUserRemovedEvent(organization, user);

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.Received().DiscardSettings(user);
        }

        [TestMethod]
        public void Handle_OrganizationUserRemovedEvent_ShouldSaveData()
        {
            //Arrange
            var args = new OrganizationUserRemovedEvent(OrganizationObjectMother.CreateWithSettings(Substitute.For<OrganizationSettings>()), Substitute.For<OrganizationUser>());

            //Act
            _handler.Handle(args);

            //Assert
            _unitOfWork.Received().Save();
        }

        #endregion

    }
}
