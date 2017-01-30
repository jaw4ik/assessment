using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.DomainModel.Events.OrganizationEvents;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.DomainModel.Tests.ObjectMothers.Organizations;
using easygenerator.Infrastructure;
using easygenerator.Web.Domain.DomainEvents.Handlers.Organizaions;
using easygenerator.Web.Domain.DomainOperations;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.ObjectModel;
using System.Linq.Expressions;
using easygenerator.DomainModel.Entities.Users;

namespace easygenerator.Web.Tests.Domain.DomainEvents.Handlers
{
    [TestClass]
    public class OrganizationUserAutoincludeHandlerTests
    {
        private OrganizationUserAutoincludeHandler _handler;

        private IUserRepository _userRepository;
        private IOrganizationRepository _organizationRepository;
        private IUnitOfWork _unitOfWork;
        private IOrganizationUserRepository _organizationUserRepository;
        private IOrganizationOperations _organizationOperations;

        private readonly string Password = "password";
        private readonly string EasygeneratorEmailDomain = "easygenerator.com";
        private readonly string IsmEmailDomain = "ism.com";
        private readonly string UserEmail = "user@easygenerator.com";

        [TestInitialize]
        public void Initialize()
        {
            _userRepository = Substitute.For<IUserRepository>();
            _organizationRepository = Substitute.For<IOrganizationRepository>();
            _unitOfWork = Substitute.For<IUnitOfWork>();
            _organizationUserRepository = Substitute.For<IOrganizationUserRepository>();
            _organizationOperations = Substitute.For<IOrganizationOperations>();

            _handler = new OrganizationUserAutoincludeHandler(_userRepository, _organizationRepository, _unitOfWork, _organizationUserRepository, _organizationOperations);
        }

        #region Handle UserSignedUpEvent

        [TestMethod]
        public void Handle_UserSignedUpEvent_ShouldAutoincludeUserToOrganizationWithUserEmailDomain()
        {
            //Arrange
            var user = UserObjectMother.CreateWithEmail(UserEmail);
            var e = new UserSignedUpEvent(user, Password);

            var easygenerator = OrganizationObjectMother.CreateWithEmailDomains(EasygeneratorEmailDomain);
            var ism = OrganizationObjectMother.CreateWithEmailDomains($"{EasygeneratorEmailDomain},{IsmEmailDomain}");
            var custom = OrganizationObjectMother.CreateWithEmailDomains("domain.com");

            _organizationRepository.GetCollection(Arg.Any<Expression<Func<Organization, bool>>>()).ReturnsForAnyArgs(new Collection<Organization>() { easygenerator, ism, custom });

            //Act
            _handler.Handle(e);

            //Assert
            _organizationOperations.Received().AutoincludeUser(user, easygenerator);
            _organizationOperations.Received().AutoincludeUser(user, ism);
            _organizationOperations.DidNotReceive().AutoincludeUser(user, custom);

        }

        [TestMethod]
        public void Handle_UserSignedUpEvent_ShouldSaveUnitOfWork()
        {
            //Arrange
            var e = new UserSignedUpEvent(UserObjectMother.Create(), Password);

            //Act
            _handler.Handle(e);

            //Assert
            _unitOfWork.Received().Save();
        }

        #endregion

        #region Handle OrganizationEmailDomainUpdatedEvent

        [TestMethod]
        public void Handle_OrganizationEmailDomainUpdatedEvent_ShouldAutoincludeUsersWithDomainToOrganization()
        {
            //Arrange
            var organization = OrganizationObjectMother.CreateWithEmailDomains($"{EasygeneratorEmailDomain},{IsmEmailDomain}");
            var e = new OrganizationEmailDomainUpdatedEvent(organization);

            var user1 = UserObjectMother.Create();
            var user2 = UserObjectMother.Create();

            _userRepository.GetCollection(Arg.Any<Expression<Func<User, bool>>>()).ReturnsForAnyArgs(new Collection<User>() { user1, user2 });

            //Act
            _handler.Handle(e);

            //Assert
            _organizationOperations.Received().AutoincludeUser(user1, organization);
            _organizationOperations.Received().AutoincludeUser(user2, organization);
        }

        [TestMethod]
        public void Handle_OrganizationEmailDomainUpdatedEvent_ShouldSaveUnitOfWork()
        {
            //Arrange
            var e = new OrganizationEmailDomainUpdatedEvent(OrganizationObjectMother.Create());

            //Act
            _handler.Handle(e);

            //Assert
            _unitOfWork.Received().Save();
        }

        #endregion

        #region Handle UserEmailConfirmedEmail

        [TestMethod]
        public void Handle_UserEmailConfirmedEmail_ShouldAcceptOrganizationInvite()
        {
            //Arrange
            var user = UserObjectMother.CreateWithEmail(UserEmail);
            var e = new UserEmailConfirmedEvent(user);

            var user1 = Substitute.For<OrganizationUser>();
            var user2 = Substitute.For<OrganizationUser>();

            _organizationUserRepository.GetCollection(Arg.Any<Expression<Func<OrganizationUser, bool>>>()).ReturnsForAnyArgs(new Collection<OrganizationUser>() { user1, user2 });

            //Act
            _handler.Handle(e);

            //Assert
            _organizationOperations.Received().AcceptInvite(user1);
            _organizationOperations.Received().AcceptInvite(user2);
        }

        [TestMethod]
        public void Handle_UserEmailConfirmedEmail_ShouldSaveUnitOfWork()
        {
            //Arrange
            var e = new UserEmailConfirmedEvent(UserObjectMother.Create());

            //Act
            _handler.Handle(e);

            //Assert
            _unitOfWork.Received().Save();
        }

        #endregion
    }
}
