using System.Linq;
using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.DomainModel.Events.OrganizationEvents;
using easygenerator.DomainModel.Tests.ObjectMothers.Organizations;
using easygenerator.Infrastructure;
using easygenerator.Web.Domain.DomainEvents.Handlers;
using easygenerator.Web.Domain.DomainOperations;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Domain.DomainEvents.Handlers
{
    [TestClass]
    public class OrganizationSettingsApplicationHandlerTests
    {
        private OrganizationSettingsApplicationHandler _handler;

        private IUnitOfWork _unitOfWork;
        private IOrganizationOperations _organizationOperations;

        [TestInitialize]
        public void Initialize()
        {
            _unitOfWork = Substitute.For<IUnitOfWork>();
            _organizationOperations = Substitute.For<IOrganizationOperations>();

            _handler = new OrganizationSettingsApplicationHandler(_organizationOperations, _unitOfWork);
        }

        #region Handle OrganizationInviteAcceptedEvent

        [TestMethod]
        public void Handle_OrganizationInviteAcceptedEvent_ShouldApplySettings()
        {
            //Arrange
            var args = new OrganizationInviteAcceptedEvent(OrganizationObjectMother.CreateWithSettings(OrganizationSettingsObjectMother.Create()),
                OrganizationUserObjectMother.Create());

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.Received().ApplySettings(args.Organization, args.User);
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

        [TestMethod]
        public void Handle_OrganizationInviteAcceptedEvent_ShouldNotApplySettings_WhenOrganizationSettingsAreNull()
        {
            //Arrange
            var args = new OrganizationInviteAcceptedEvent(OrganizationObjectMother.Create(),
                OrganizationUserObjectMother.Create());

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.DidNotReceiveWithAnyArgs().ApplySettings(args.Organization, args.User);
        }

        [TestMethod]
        public void Handle_OrganizationInviteAcceptedEvent_ShouldNotSaveData_WhenOrganizationSettingsAreNull()
        {
            //Arrange
            var args = new OrganizationInviteAcceptedEvent(OrganizationObjectMother.Create(),
                OrganizationUserObjectMother.Create());

            //Act
            _handler.Handle(args);

            //Assert
            _unitOfWork.DidNotReceiveWithAnyArgs().Save();
        }

        #endregion

        #region Handle OrganizationUserAddedEvent

        [TestMethod]
        public void Handle_OrganizationUserAddedEvent_ShouldApplySettings()
        {
            //Arrange
            var args = new OrganizationUserAddedEvent(OrganizationObjectMother.CreateWithSettings(OrganizationSettingsObjectMother.Create()),
                OrganizationUserObjectMother.Create());

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.Received().ApplySettings(args.Organization, args.User);
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

        [TestMethod]
        public void Handle_OrganizationUserAddedEvent_ShouldNotApplySettings_WhenOrganizationSettingsAreNull()
        {
            //Arrange
            var args = new OrganizationUserAddedEvent(OrganizationObjectMother.Create(),
                OrganizationUserObjectMother.Create());

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.DidNotReceiveWithAnyArgs().ApplySettings(args.Organization, args.User);
        }

        [TestMethod]
        public void Handle_OrganizationUserAddedEvent_ShouldNotSaveData_WhenOrganizationSettingsAreNull()
        {
            //Arrange
            var args = new OrganizationUserAddedEvent(OrganizationObjectMother.Create(),
                OrganizationUserObjectMother.Create());

            //Act
            _handler.Handle(args);

            //Assert
            _unitOfWork.DidNotReceiveWithAnyArgs().Save();
        }

        #endregion

        #region Handle OrganizationSettingsSubscriptionUpdated

        [TestMethod]
        public void Handle_OrganizationSettingsSubscriptionUpdated_ShouldApplySettingsForAllOrganizationUsers()
        {
            //Arrange
            var organization = OrganizationObjectMother.CreateWithSettings(OrganizationSettingsObjectMother.Create());
            organization.AddUser("someUser@hmail.com", "someUser@hmail.com");

            var args = new OrganizationSettingsSubscriptionUpdatedEvent(organization);

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.Received().ApplySettings(args.Organization, organization.Users.First());
            _organizationOperations.Received().ApplySettings(args.Organization, organization.Users.Last());
        }

        [TestMethod]
        public void Handle_OrganizationSettingsSubscriptionUpdated_ShouldSaveData()
        {
            //Arrange
            var args = new OrganizationSettingsSubscriptionUpdatedEvent(OrganizationObjectMother.CreateWithSettings(OrganizationSettingsObjectMother.Create()));

            //Act
            _handler.Handle(args);

            //Assert
            _unitOfWork.Received().Save();
        }

        [TestMethod]
        public void Handle_OrganizationSettingsSubscriptionUpdated_ShouldNotApplySettings_WhenOrganizationSettingsAreNull()
        {
            //Arrange
            var args = new OrganizationSettingsSubscriptionUpdatedEvent(OrganizationObjectMother.Create());

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.DidNotReceiveWithAnyArgs().ApplySettings(Arg.Any<Organization>(), Arg.Any<OrganizationUser>());
        }

        [TestMethod]
        public void Handle_OrganizationSettingsSubscriptionUpdated_ShouldNotSaveData_WhenOrganizationSettingsAreNull()
        {
            //Arrange
            var args = new OrganizationSettingsSubscriptionUpdatedEvent(OrganizationObjectMother.Create());

            //Act
            _handler.Handle(args);

            //Assert
            _unitOfWork.DidNotReceiveWithAnyArgs().Save();
        }

        #endregion

        #region Handle OrganizationUserRemovedEvent

        [TestMethod]
        public void Handle_OrganizationUserRemovedEvent_ShouldDiscardSettings()
        {
            //Arrange
            var args = new OrganizationUserRemovedEvent(OrganizationObjectMother.CreateWithSettings(OrganizationSettingsObjectMother.Create()),
                OrganizationUserObjectMother.Create());

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.Received().DiscardSettings(args.Organization, args.User);
        }

        [TestMethod]
        public void Handle_OrganizationUserRemovedEvent_ShouldSaveData()
        {
            //Arrange
            var args = new OrganizationUserRemovedEvent(OrganizationObjectMother.CreateWithSettings(OrganizationSettingsObjectMother.Create()),
                OrganizationUserObjectMother.Create());

            //Act
            _handler.Handle(args);

            //Assert
            _unitOfWork.Received().Save();
        }

        [TestMethod]
        public void Handle_OrganizationUserRemovedEvent_ShouldNotDiscardSettings_WhenOrganizationSettingsAreNull()
        {
            //Arrange
            var args = new OrganizationUserRemovedEvent(OrganizationObjectMother.Create(),
                OrganizationUserObjectMother.Create());

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.DidNotReceiveWithAnyArgs().DiscardSettings(args.Organization, args.User);
        }

        [TestMethod]
        public void Handle_OrganizationUserRemovedEvent_ShouldNotSaveData_WhenOrganizationSettingsAreNull()
        {
            //Arrange
            var args = new OrganizationUserRemovedEvent(OrganizationObjectMother.Create(),
                OrganizationUserObjectMother.Create());

            //Act
            _handler.Handle(args);

            //Assert
            _unitOfWork.DidNotReceiveWithAnyArgs().Save();
        }

        #endregion

        #region Handle OrganizationSettingsResetEvent

        [TestMethod]
        public void Handle_OrganizationSettingsResetEvent_ShouldDiscardSettingsForAllOrganizationUsers()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();
            organization.AddUser("someUser@hmail.com", "someUser@hmail.com");

            var args = new OrganizationSettingsResetEvent(organization);

            //Act
            _handler.Handle(args);

            //Assert
            _organizationOperations.Received().DiscardSettings(args.Organization, organization.Users.First());
            _organizationOperations.Received().DiscardSettings(args.Organization, organization.Users.Last());
        }

        [TestMethod]
        public void Handle_OrganizationSettingsResetEvent_ShouldSaveData()
        {
            //Arrange
            var args = new OrganizationSettingsResetEvent(OrganizationObjectMother.Create());

            //Act
            _handler.Handle(args);

            //Assert
            _unitOfWork.Received().Save();
        }

        #endregion
    }
}
