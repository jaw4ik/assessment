using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.DomainModel.Tests.ObjectMothers.Organizations;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Clonning;
using easygenerator.Infrastructure.DomainModel.Mappings;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Components.Mappers.Organizations;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Extensions;
using easygenerator.Web.Mail;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using easygenerator.DomainModel.Entities.Users;
using easygenerator.Web.Domain.DomainOperations;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class OrganizationControllerTests
    {
        private const string CurrentUserEmail = "user@easygenerator.com";
        private const string UserEmail = "useremail@easygenerator.com";
        private const string UserEmail2 = "useremail2@easygenerator.com";
        private const string Title = "title";
        private const string EmailDomains = "easygenerator.com";

        private OrganizationController _controller;

        private IPrincipal _user;
        private HttpContextBase _context;
        private IOrganizationRepository _organizationRepository;
        private IOrganizationMapper _organizationMapper;
        private IEntityFactory _entityFactory;
        private IEntityMapper _entityMapper;
        private IUserRepository _userRepository;
        private IMailSenderWrapper _mailSenderWrapper;
        private IOrganizationInviteMapper _inviteMapper;
        private IOrganizationUserRepository _organizationUserRepository;
        private ICourseRepository _courseRepository;
        private ICloner _cloner;
        private IOrganizationOperations _organizationOperations;


        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _organizationMapper = Substitute.For<IOrganizationMapper>();
            _user = Substitute.For<IPrincipal>();
            _entityMapper = Substitute.For<IEntityMapper>();
            _organizationRepository = Substitute.For<IOrganizationRepository>();
            _userRepository = Substitute.For<IUserRepository>();
            _mailSenderWrapper = Substitute.For<IMailSenderWrapper>();
            _inviteMapper = Substitute.For<IOrganizationInviteMapper>();
            _organizationUserRepository = Substitute.For<IOrganizationUserRepository>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);
            _user.Identity.Name.Returns(CurrentUserEmail);
            _courseRepository = Substitute.For<ICourseRepository>();
            _cloner = Substitute.For<ICloner>();
            _organizationOperations = Substitute.For<IOrganizationOperations>();
            _controller = new OrganizationController(_organizationRepository, _organizationMapper, _entityFactory, _entityMapper, _userRepository,
                _mailSenderWrapper, _inviteMapper, _organizationUserRepository, _courseRepository, _cloner, _organizationOperations);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region CreateOrganization

        [TestMethod]
        public void Create_ShouldCreateOrganization()
        {
            //Act
            _controller.CreateOrganization(Title);

            //Assert
            _entityFactory.Received().Organization(Title, CurrentUserEmail);
        }

        [TestMethod]
        public void Create_ShouldAddOrganization()
        {
            //Arrange
            var organization = OrganizationObjectMother.CreateWithTitle(Title);
            _entityFactory.Organization(Title, CurrentUserEmail).Returns(organization);
            _organizationMapper.Map(organization, CurrentUserEmail).Returns(organization);

            //Act
            _controller.CreateOrganization(Title);


            //Assert
            _organizationRepository.Received().Add(organization);
        }

        [TestMethod]
        public void Create_ShouldReturnJsonSuccessResult()
        {
            //Arrangge
            var organization = OrganizationObjectMother.CreateWithTitle(Title);
            _entityFactory.Organization(Title, CurrentUserEmail).Returns(organization);
            _organizationMapper.Map(organization, CurrentUserEmail).Returns(organization);

            //Act
            var result = _controller.CreateOrganization(Title);

            //Assert
            result.Should().BeJsonSuccessResult();
        }
        #endregion

        #region GetOrganizationUsers

        [TestMethod]
        public void GetOrganizationUsers_ShouldReturnJsonErrorResult_WnenOrganizationIsNull()
        {
            //Act
            var result = _controller.GetOrganizationUsers(null);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.OrganizationNotFoundError);
        }

        [TestMethod]
        public void GetOrganizationUsers_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();

            //Act
            var result = _controller.GetOrganizationUsers(organization);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region UpdateOrganizationTitle

        [TestMethod]
        public void UpdateOrganizationTitle_ShouldReturnJsonErrorResult_WnenOrganizationIsNull()
        {
            //Act
            var result = _controller.UpdateOrganizationTitle(null, "title");

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.OrganizationNotFoundError);
        }

        [TestMethod]
        public void UpdateOrganizationTitle_ShouldUpdateOrganizationTitle()
        {
            //Arrange
            var organization = Substitute.For<Organization>();
            var newTitle = "new title";

            //Act
            var result = _controller.UpdateOrganizationTitle(organization, newTitle);

            //Assert
            organization.Received().UpdateTitle(newTitle, CurrentUserEmail);
        }

        [TestMethod]
        public void UpdateOrganizationTitle_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();
            var newTitle = "new title";

            //Act
            var result = _controller.UpdateOrganizationTitle(organization, newTitle);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region RemoveOrganizationUser

        [TestMethod]
        public void RemoveOrganizationUser_ShouldReturnJsonErrorResult_WnenOrganizationIsNull()
        {
            //Act
            var result = _controller.RemoveOrganizationUser(null, UserEmail);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.OrganizationNotFoundError);
        }

        [TestMethod]
        public void RemoveOrganizationUser_ShouldThrowInvalidOperationException_WhenRemoveLastAdminUser()
        {
            // Arrange
            var organization = OrganizationObjectMother.Create();
            var admin = organization.Users.First();

            // Act
            Action action = () => _controller.RemoveOrganizationUser(organization, admin.Email);

            // Assert
            action.ShouldThrow<ArgumentException>();
        }

        [TestMethod]
        public void RemoveOrganizationUser_ShouldRemoveCollaborationWithOrganizationCourses_WhenUserIsAdmin()
        {
            //Arrange
            var course = Substitute.For<Course>();
            var organization = OrganizationObjectMother.Create();

            var adminUser = organization.Users.First();
            var user = organization.AddUser(CurrentUserEmail, CurrentUserEmail, OrganizationUserStatus.Accepted);
            user.SetAdminPermissions(true);

            _organizationUserRepository.HasMultipleOrganizationAdminRelations(user.Email, adminUser.Email).Returns(false);
            _courseRepository.GetOwnedCourses(CurrentUserEmail).Returns(new List<Course>() { course });

            //Act
            _controller.RemoveOrganizationUser(organization, adminUser.Email);

            //Assert
            course.Received().RemoveCollaborator(_cloner, adminUser.Email);
        }

        [TestMethod]
        public void RemoveOrganizationUser_ShouldNotRemoveCollaborationWithOrganizationCourses_WhenUserIsAdminAndHasMultipleAdminRelations()
        {
            //Arrange
            var course1 = Substitute.For<Course>();
            var course2 = Substitute.For<Course>();

            var organization = OrganizationObjectMother.Create();

            var adminUser = organization.Users.First();
            var user1 = organization.AddUser("user1@test.test", "user1@test.test", OrganizationUserStatus.Accepted);
            var user2 = organization.AddUser("user2@test.test", "user2@test.test", OrganizationUserStatus.Accepted);

            user1.SetAdminPermissions(true);

            _organizationUserRepository.HasMultipleOrganizationAdminRelations(user1.Email, adminUser.Email).Returns(true);
            _organizationUserRepository.HasMultipleOrganizationAdminRelations(user2.Email, adminUser.Email).Returns(false);

            _courseRepository.GetOwnedCourses(user1.Email).Returns(new List<Course>() { course1 });
            _courseRepository.GetOwnedCourses(user2.Email).Returns(new List<Course>() { course2 });

            //Act
            _controller.RemoveOrganizationUser(organization, adminUser.Email);

            //Assert
            course1.DidNotReceive().RemoveCollaborator(_cloner, adminUser.Email);
            course2.Received().RemoveCollaborator(_cloner, adminUser.Email);
        }

        [TestMethod]
        public void RemoveOrganizationUser_ShouldRemoveOrganizationUser()
        {
            //Arrange
            var organization = Substitute.For<Organization>();
            var user = OrganizationUserObjectMother.Create();

            organization.Users.Returns(new List<OrganizationUser>() { user });

            //Act
            _controller.RemoveOrganizationUser(organization, user.Email);

            //Assert
            organization.Received().RemoveUser(user, user.Email);
        }

        [TestMethod]
        public void RemoveOrganizationUser_ShouldRemovveAdminCollaboratorsForEachUserCourse()
        {
            //Arrange
            var course = Substitute.For<Course>();
            var organization = OrganizationObjectMother.Create();
            var adminUser = organization.Users.First();

            var user = organization.AddUser(CurrentUserEmail, CurrentUserEmail);

            _courseRepository.GetOwnedCourses(user.Email).Returns(new List<Course>() { course });

            //Act
            _controller.RemoveOrganizationUser(organization, user.Email);

            //Assert
            course.Received().RemoveCollaborator(_cloner, adminUser.Email);
        }

        [TestMethod]
        public void RemoveOrganizationUser_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();

            //Act
            var result = _controller.RemoveOrganizationUser(organization, UserEmail);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region ReinviteOrganizationUser

        [TestMethod]
        public void ReinviteOrganizationUser_ShouldReturnJsonErrorResult_WnenOrganizationUserIsNull()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();

            //Act
            var result = _controller.ReinviteOrganizationUser(organization, null);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.OrganizationUserNotFoundError);
        }

        [TestMethod]
        public void ReinviteOrganizationUser_ShouldReinviteOrganizationUser()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();
            var organizationUser = Substitute.For<OrganizationUser>();

            //Act
            _controller.ReinviteOrganizationUser(organization, organizationUser);

            //Assert
            organizationUser.Received().Reinvite();
        }

        [TestMethod]
        public void ReinviteOrganizationUser_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();
            var organizationUser = OrganizationUserObjectMother.Create();

            //Act
            var result = _controller.ReinviteOrganizationUser(organization, organizationUser);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region AddUsers

        [TestMethod]
        public void AddUsers_ShouldReturnJsonErrorResult_WnenOrganizationIsNull()
        {
            //Act
            var result = _controller.AddUsers(null, new List<string>());

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.OrganizationNotFoundError);
        }

        [TestMethod]
        public void AddUsers_ShouldTransformEmailsToLowerInvariantAndTrimSpaces()
        {
            //Arrange
            var organization = Substitute.For<Organization>();
            var email = "  SOme@email.com   ";
            var email2 = "  SOme2@email.com   ";

            //Act
            _controller.AddUsers(organization, new List<string>() { email, email2 });

            //Assert
            organization.Received().AddUser("some@email.com", CurrentUserEmail);
            organization.Received().AddUser("some2@email.com", CurrentUserEmail);
        }

        [TestMethod]
        public void AddUsers_ShouldSendInviteOrganizationUserMessage_WnenUserIsNotFound()
        {
            //Arrange
            var organization = Substitute.For<Organization>();
            _userRepository.GetUserByEmail(UserEmail).Returns(null as User);
            _userRepository.GetUserByEmail(UserEmail2).Returns(null as User);
            var author = UserObjectMother.Create();
            _userRepository.GetUserByEmail(CurrentUserEmail).Returns(author);
            var organizationUser = OrganizationUserObjectMother.Create();
            organization.AddUser(UserEmail, CurrentUserEmail).Returns(organizationUser);
            var organizationUser2 = OrganizationUserObjectMother.Create();
            organization.AddUser(UserEmail2, CurrentUserEmail).Returns(organizationUser2);

            //Act
            _controller.AddUsers(organization, new List<string>() { UserEmail, UserEmail2 });

            //Assert
            _mailSenderWrapper.Received().SendInviteOrganizationUserMessage(UserEmail, author.FullName, organization.Title);
            _mailSenderWrapper.Received().SendInviteOrganizationUserMessage(UserEmail2, author.FullName, organization.Title);
        }

        [TestMethod]
        public void AddUsers_ShouldAddUsersToOrganization()
        {
            //Arrange
            var organization = Substitute.For<Organization>();

            //Act
            _controller.AddUsers(organization, new List<string>() { UserEmail, UserEmail2 });

            //Assert
            organization.Received().AddUser(UserEmail, CurrentUserEmail);
            organization.Received().AddUser(UserEmail2, CurrentUserEmail);
        }


        [TestMethod]
        public void AddUsers_ShouldReturnJsonSuccessResultWithTrue_WhenUsersWereAdded()
        {
            //Arrange
            var organization = Substitute.For<Organization>();
            var organizationUser = OrganizationUserObjectMother.Create();
            organization.AddUser(UserEmail, CurrentUserEmail).Returns(organizationUser);
            var organizationUser2 = OrganizationUserObjectMother.Create();
            organization.AddUser(UserEmail2, CurrentUserEmail).Returns(organizationUser2);

            _userRepository.GetUserByEmail(UserEmail).Returns(UserObjectMother.Create());
            _userRepository.GetUserByEmail(UserEmail2).Returns(UserObjectMother.Create());

            //Act
            var result = _controller.AddUsers(organization, new List<string>() { UserEmail, UserEmail2 });

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        [TestMethod]
        public void AddUsers_ShouldReturnJsonSuccessResultWithTrue_WhenUsersWereNorAdded()
        {
            //Arrange
            var organization = Substitute.For<Organization>();
            organization.AddUser(UserEmail, CurrentUserEmail).Returns(null as OrganizationUser);
            organization.AddUser(UserEmail2, CurrentUserEmail).Returns(null as OrganizationUser);

            _userRepository.GetUserByEmail(UserEmail).Returns(UserObjectMother.Create());
            _userRepository.GetUserByEmail(UserEmail2).Returns(UserObjectMother.Create());

            //Act
            var result = _controller.AddUsers(organization, new List<string>() { UserEmail, UserEmail2 });

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region DeclineOrganizationInvite

        [TestMethod]
        public void DeclineOrganizationInvite_ShouldReturnJsonErrorResult_WnenOrganizationUserIsNull()
        {
            //Act
            var result = _controller.DeclineOrganizationInvite(null);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.OrganizationUserNotFoundError);
        }

        [TestMethod]
        public void DeclineOrganizationInvite_ShouldDeclineOrganizationInvite()
        {
            //Arrange
            var user = Substitute.For<OrganizationUser>();

            //Act
            _controller.DeclineOrganizationInvite(user);

            //Assert
            user.Received().DeclineInvite();
        }

        [TestMethod]
        public void DeclineOrganizationInvite_ShouldReturnJsonSuccess_WhenInviteDeclined()
        {
            //Arrange
            var user = OrganizationUserObjectMother.Create();

            //Act
            var result = _controller.DeclineOrganizationInvite(user);

            //Assert
            result.Should().BeJsonSuccessResult();
        }
        #endregion

        #region AcceptOrganizationInvite

        [TestMethod]
        public void AcceptOrganizationInvite_ShouldReturnJsonErrorResult_WnenOrganizationUserIsNull()
        {
            //Act
            var result = _controller.AcceptOrganizationInvite(null);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.OrganizationUserNotFoundError);
        }

        [TestMethod]
        public void AcceptOrganizationInvite_ShouldAcceptOrganizationInvite()
        {
            //Arrange
            var user = Substitute.For<OrganizationUser>();

            //Act
            _controller.AcceptOrganizationInvite(user);

            //Assert
            _organizationOperations.Received().AcceptInvite(user);
        }
        
        [TestMethod]
        public void AcceptOrganizationInvite_ShouldReturnJsonSuccess()
        {
            //Arrange
            var user = OrganizationUserObjectMother.Create();

            //Act
            var result = _controller.AcceptOrganizationInvite(user);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region GetInvites

        [TestMethod]
        public void GetInvites_ShouldReturnInvites()
        {
            //Arrange
            _user.Identity.Name.Returns(UserEmail);
            var invites = new List<OrganizationInvite>() { new OrganizationInvite() };
            _organizationUserRepository.GetOrganizationInvites(UserEmail).Returns(invites);

            //Act
            var result = _controller.GetInvites();

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region GetOrganizationInfo

        [TestMethod]
        public void GetOrganizationInfo_ShouldThrowArgumentException_WnenOrganizationsNull()
        {
            //Act
            Action action = () => _controller.GetOrganizationInfo(null);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("organization");
        }


        [TestMethod]
        public void GetOrganizationInfo_ShouldReturnInfo_WhenOrganizationSettingsAreNull()
        {
            //Arrgange
            var organization = OrganizationObjectMother.Create();

            //Act
            var result = _controller.GetOrganizationInfo(organization);

            //Assert
            result.Should().BeJsonDataResult().And.Data.ShouldBeEquivalentTo(new
            {
                Title = organization.Title,
                EmailDomains = null as object,
                Settings = null as object,
                Admins = organization.Users.Where(u => u.IsAdmin).Select(u => u.Email)
            });
        }

        [TestMethod]
        public void GetOrganizationInfo_ShouldReturnInfo_WhenEmailDomainsIsSet()
        {
            //Arrgange
            var organization = OrganizationObjectMother.CreateWithEmailDomains(EmailDomains);

            //Act
            var result = _controller.GetOrganizationInfo(organization);

            //Assert
            result.Should().BeJsonDataResult().And.Data.ShouldBeEquivalentTo(new
            {
                Title = organization.Title,
                EmailDomains = EmailDomains,
                Settings = null as object,
                Admins = organization.Users.Where(u => u.IsAdmin).Select(u => u.Email)
            });
        }

        [TestMethod]
        public void GetOrganizationInfo_ShouldReturnSettings_WhenSettingsIsDefined()
        {
            //Arrgange
            var organization = OrganizationObjectMother.Create();
            organization.GetOrCreateSettings();

            //Act
            var result = _controller.GetOrganizationInfo(organization);

            //Assert
            result.Should().BeJsonDataResult().And.Data.ShouldBeEquivalentTo(new
            {
                Title = organization.Title,
                EmailDomains = null as object,
                Settings = new
                {
                    AccessType = null as object,
                    ExpirationDate = null as object,
                    Templates = new List<Template>()
                },
                Admins = organization.Users.Where(u => u.IsAdmin).Select(u => u.Email)
            });
        }

        [TestMethod]
        public void GetOrganizationInfo_ShouldReturnSettings_WhenSettingsSubscriptionIsDefined()
        {
            //Arrgange
            var organization = OrganizationObjectMother.Create();
            var settings = organization.GetOrCreateSettings();
            var accessType = AccessType.Academy;
            var expirationDate = DateTime.Now;
            settings.UpdateSubscription(accessType, expirationDate);

            //Act
            var result = _controller.GetOrganizationInfo(organization);

            //Assert
            result.Should().BeJsonDataResult().And.Data.ShouldBeEquivalentTo(new
            {
                Title = organization.Title,
                EmailDomains = null as object,
                Settings = new
                {
                    AccessType = $"{accessType} ({(int)accessType})",
                    ExpirationDate = expirationDate,
                    Templates = new List<Template>()
                },
                Admins = organization.Users.Where(u => u.IsAdmin).Select(u => u.Email)
            });
        }

        [TestMethod]
        public void GetOrganizationInfo_ShouldReturnSettings_WhenSettingsTemplatesAreSet()
        {
            //Arrgange
            var organization = Substitute.For<Organization>();
            var settings = Substitute.For<OrganizationSettings>();
            organization.Settings.Returns(settings);

            var templates = new List<Template>() { TemplateObjectMother.Create(), TemplateObjectMother.Create() };
            settings.Templates.Returns(templates);

            //Act
            var result = _controller.GetOrganizationInfo(organization);

            //Assert
            result.Should().BeJsonDataResult().And.Data.ShouldBeEquivalentTo(new
            {
                Title = organization.Title,
                EmailDomains = null as object,
                Settings = new
                {
                    AccessType = null as object,
                    ExpirationDate = null as object,
                    Templates = templates.Select(template =>
                        new
                        {
                            Name = template.Name,
                            Id = template.Id.ToNString()
                        })
                },
                Admins = organization.Users.Where(u => u.IsAdmin).Select(u => u.Email)
            });
        }

        #endregion

        #region ClearOrganizationEmailDomains

        [TestMethod]
        public void ClearOrganizationEmailDomain_ShouldThrowArgumentException_WnenOrganizationsNull()
        {
            //Act
            Action action = () => _controller.ClearOrganizationEmailDomains(null);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("organization");
        }

        [TestMethod]
        public void ClearOrganizationEmailDomain_ShouldClearOrganizationEmailDomains()
        {
            //Arrgange
            var organization = Substitute.For<Organization>();

            //Act
            _controller.ClearOrganizationEmailDomains(organization);

            //Assert
            organization.Received().ClearEmailDomains();
        }

        [TestMethod]
        public void ClearOrganizationEmailDomain_ShouldReturnSuccessResult()
        {
            //Arrgange
            var organization = Substitute.For<Organization>();

            //Act
            var result = _controller.ClearOrganizationEmailDomains(organization);

            //Assert
            result.Should().BeSuccessResult();
        }

        #endregion

        #region UpdateOrganizationEmailDomains

        [TestMethod]
        public void UpdateOrganizationEmailDomains_ShouldThrowArgumentException_WnenOrganizationsNull()
        {
            //Act
            Action action = () => _controller.UpdateOrganizationEmailDomains(null, EmailDomains);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("organization");
        }

        [TestMethod]
        public void UpdateOrganizationEmailDomains_ShouldUpdateOrganizationEmailDomains()
        {
            //Arrgange
            var organization = Substitute.For<Organization>();

            //Act
            _controller.UpdateOrganizationEmailDomains(organization, EmailDomains);

            //Assert
            organization.Received().UpdateEmailDomains(EmailDomains);
        }

        [TestMethod]
        public void UpdateOrganizationEmailDomains_ShouldReturnSuccessResult()
        {
            //Arrgange
            var organization = Substitute.For<Organization>();

            //Act
            var result = _controller.UpdateOrganizationEmailDomains(organization, EmailDomains);

            //Assert
            result.Should().BeSuccessResult();
        }

        #endregion

        #region UpdateOrganizationSettingsSubscription

        [TestMethod]
        public void UpdateOrganizationSettingsSubscription_ShouldThrowArgumentException_WnenOrganizationsNull()
        {
            //Arrange
            var accessType = AccessType.Academy;
            var expirationDate = DateTime.Now;

            //Act
            Action action = () => _controller.UpdateOrganizationSettingsSubscription(null, accessType, expirationDate);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("organization");
        }

        [TestMethod]
        public void UpdateOrganizationSettingsSubscription_ShouldThrowArgumentException_WnenAccessTypeIsNull()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();
            var expirationDate = DateTime.Now;

            //Act
            Action action = () => _controller.UpdateOrganizationSettingsSubscription(organization, null, expirationDate);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("accessType");
        }

        [TestMethod]
        public void UpdateOrganizationSettingsSubscription_ShouldThrowArgumentException_WnenExpirationDateIsNull()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();
            var accessType = AccessType.Academy;

            //Act
            Action action = () => _controller.UpdateOrganizationSettingsSubscription(organization, accessType, null);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("expirationDate");
        }

        [TestMethod]
        public void UpdateOrganizationSettingsSubscription_ShouldCreateOrganizationSettings_WhenOrganizationSettingsAreNull()
        {
            //Arrgange
            var organization = Substitute.For<Organization>();
            organization.GetOrCreateSettings().Returns(OrganizationSettingsObjectMother.Create());
            var accessType = AccessType.Academy;
            var expirationDate = DateTime.Now;

            //Act
            _controller.UpdateOrganizationSettingsSubscription(organization, accessType, expirationDate);

            //Assert
            organization.Received().GetOrCreateSettings();
        }

        [TestMethod]
        public void UpdateOrganizationSettingsSubscription_ShouldUpdateOrganizationSettingsSubscription()
        {
            //Arrgange
            var settings = Substitute.For<OrganizationSettings>();
            var organization = OrganizationObjectMother.CreateWithSettings(settings);
            var accessType = AccessType.Academy;
            var expirationDate = DateTime.Now;

            //Act
            _controller.UpdateOrganizationSettingsSubscription(organization, accessType, expirationDate);

            //Assert
            settings.Received().UpdateSubscription(accessType, expirationDate);
        }

        [TestMethod]
        public void UpdateOrganizationSettingsSubscription_ShouldReturnSuccessResult()
        {
            //Arrgange
            var settings = Substitute.For<OrganizationSettings>();
            var organization = OrganizationObjectMother.CreateWithSettings(settings);
            var accessType = AccessType.Academy;
            var expirationDate = DateTime.Now;

            //Act
            var result = _controller.UpdateOrganizationSettingsSubscription(organization, accessType, expirationDate);

            //Assert
            result.Should().BeSuccessResult();
        }

        #endregion

        #region ResetOrganizationSettingsSubscription

        [TestMethod]
        public void ResetOrganizationSettingsSubscription_ShouldThrowArgumentException_WnenOrganizationsNull()
        {
            //Act
            Action action = () => _controller.ResetOrganizationSettingsSubscription(null);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("organization");
        }

        [TestMethod]
        public void ResetOrganizationSettingsSubscription_ShouldReturnJsonSuccess_WnenOrganizationSettingsAreNull()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();

            //Act
            var result = _controller.ResetOrganizationSettingsSubscription(organization);

            //Assert
            result.Should().BeSuccessResult();
        }

        [TestMethod]
        public void ResetOrganizationSettingsSubscription_ShouldResetOrganizationSubscriptionSettings_WnenOrganizationSettingsAreDefined()
        {
            //Arrange
            var organization = Substitute.For<Organization>();
            var settings = Substitute.For<OrganizationSettings>();
            organization.Settings.Returns(settings);

            //Act
            _controller.ResetOrganizationSettingsSubscription(organization);

            //Assert
            settings.Received().ResetSubscription();
        }

        [TestMethod]
        public void ResetOrganizationSettingsSubscription_ShouldReturnJsonSuccess_WnenOrganizationSettingsAreDefined()
        {
            //Arrange
            var organization = Substitute.For<Organization>();
            var settings = Substitute.For<OrganizationSettings>();
            organization.GetOrCreateSettings().Returns(settings);

            //Act
            var result = _controller.ResetOrganizationSettingsSubscription(organization);

            //Assert
            result.Should().BeSuccessResult();
        }

        #endregion

        #region AddOrganizationSettingsTemplate

        [TestMethod]
        public void AddOrganizationSettingsTemplate_ShouldThrowArgumentException_WnenOrganizationIsNull()
        {
            //Act
            Action action = () => _controller.AddOrganizationSettingsTemplate(null, TemplateObjectMother.Create());

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("organization");
        }

        [TestMethod]
        public void AddOrganizationSettingsTemplate_ShouldThrowArgumentException_WnenTemplateIsNull()
        {
            //Act
            Action action = () => _controller.AddOrganizationSettingsTemplate(OrganizationObjectMother.Create(), null);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("template");
        }

        [TestMethod]
        public void AddOrganizationSettingsTemplate_ShouldAddOrganizationSettingsTemplate()
        {
            //Arrange
            var organization = Substitute.For<Organization>();
            var template = Substitute.For<Template>();
            var settings = Substitute.For<OrganizationSettings>();
            organization.GetOrCreateSettings().Returns(settings);

            //Act
            _controller.AddOrganizationSettingsTemplate(organization, template);

            //Assert
            settings.Received().AddTemplate(template);
        }

        [TestMethod]
        public void AddOrganizationSettingsTemplate_ShouldReturnJsonSuccess()
        {
            //Arrange
            var organization = Substitute.For<Organization>();
            var template = Substitute.For<Template>();
            var settings = Substitute.For<OrganizationSettings>();
            organization.GetOrCreateSettings().Returns(settings);

            //Act
            var result = _controller.AddOrganizationSettingsTemplate(organization, template);

            //Assert
            result.Should().BeSuccessResult();
        }

        #endregion

        #region RemoveOrganizationSettingsTemplate

        [TestMethod]
        public void RemoveOrganizationSettingsTemplate_ShouldThrowArgumentException_WnenOrganizationIsNull()
        {
            //Act
            Action action = () => _controller.RemoveOrganizationSettingsTemplate(null, TemplateObjectMother.Create());

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("organization");
        }

        [TestMethod]
        public void RemoveOrganizationSettingsTemplate_ShouldThrowArgumentException_WnenTemplateIsNull()
        {
            //Act
            Action action = () => _controller.RemoveOrganizationSettingsTemplate(OrganizationObjectMother.Create(), null);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("template");
        }

        [TestMethod]
        public void AddOrganizationSettingsTemplate_ShouldRemoveOrganizationSettingsTemplate_WnenOrganizationSettingsAreDefined()
        {
            //Arrange
            var organization = Substitute.For<Organization>();
            var template = Substitute.For<Template>();
            var settings = Substitute.For<OrganizationSettings>();
            organization.Settings.Returns(settings);

            //Act
            _controller.RemoveOrganizationSettingsTemplate(organization, template);

            //Assert
            settings.Received().RemoveTemplate(template);
        }

        [TestMethod]
        public void AddOrganizationSettingsTemplate_ShouldReturnJsonSuccess_WnenOrganizationSettingsAreDefined()
        {
            //Arrange
            var organization = Substitute.For<Organization>();
            var template = Substitute.For<Template>();
            var settings = Substitute.For<OrganizationSettings>();
            organization.Settings.Returns(settings);

            //Act
            var result = _controller.RemoveOrganizationSettingsTemplate(organization, template);

            //Assert
            result.Should().BeSuccessResult();
        }

        [TestMethod]
        public void AddOrganizationSettingsTemplate_ShouldReturnJsonSuccess_WnenOrganizationSettingsAreNull()
        {
            //Arrange
            var organization = Substitute.For<Organization>();
            var template = Substitute.For<Template>();
            organization.Settings.Returns(null as OrganizationSettings);

            //Act
            var result = _controller.RemoveOrganizationSettingsTemplate(organization, template);

            //Assert
            result.Should().BeSuccessResult();
        }

        #endregion

        #region ClearOrganizationSettingsTemplates

        [TestMethod]
        public void ClearOrganizationSettingsTemplates_ShouldThrowArgumentException_WnenOrganizationsNull()
        {
            //Act
            Action action = () => _controller.ClearOrganizationSettingsTemplates(null);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("organization");
        }

        [TestMethod]
        public void ClearOrganizationSettingsTemplates_ShouldReturnJsonSuccess_WnenOrganizationSettingsAreNull()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();

            //Act
            var result = _controller.ResetOrganizationSettingsSubscription(organization);

            //Assert
            result.Should().BeSuccessResult();
        }

        [TestMethod]
        public void ClearOrganizationSettingsTemplates_ShouldClearOrganizationSettingsTemplates_WnenOrganizationSettingsAreDefined()
        {
            //Arrange
            var organization = Substitute.For<Organization>();
            var settings = Substitute.For<OrganizationSettings>();
            organization.Settings.Returns(settings);

            //Act
            _controller.ClearOrganizationSettingsTemplates(organization);

            //Assert
            settings.Received().ClearTemplates();
        }

        [TestMethod]
        public void ClearOrganizationSettingsTemplates_ShouldReturnJsonSuccess_WnenOrganizationSettingsAreDefined()
        {
            //Arrange
            var organization = Substitute.For<Organization>();
            var settings = Substitute.For<OrganizationSettings>();
            organization.GetOrCreateSettings().Returns(settings);

            //Act
            var result = _controller.ClearOrganizationSettingsTemplates(organization);

            //Assert
            result.Should().BeSuccessResult();
        }

        #endregion

        #region ResetOrganizationSettings

        [TestMethod]
        public void ResetOrganizationSettings_ShouldThrowArgumentException_WnenOrganizationsNull()
        {
            //Act
            Action action = () => _controller.ResetOrganizationSettings(null);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("organization");
        }

        [TestMethod]
        public void ResetOrganizationSettings_ShouldResetOrganizationSettings()
        {
            //Arrgange
            var organization = Substitute.For<Organization>();

            //Act
            _controller.ResetOrganizationSettings(organization);

            //Assert
            organization.Received().ResetSettings();
        }

        [TestMethod]
        public void ResetOrganizationSettings_ShouldReturnSuccessResult()
        {
            //Arrgange
            var organization = Substitute.For<Organization>();

            //Act
            var result = _controller.ResetOrganizationSettings(organization);

            //Assert
            result.Should().BeSuccessResult();
        }

        #endregion

        #region AddOrganizationAdmin

        [TestMethod]
        public void AddOrganizationAdmin_ShouldThrowArgumentException_WnenOrganizationsNull()
        {
            //Act
            Action action = () => _controller.AddOrganizationAdmin(null, "");

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("organization");
        }

        [TestMethod]
        public void AddOrganizationAdmin_ShouldThrowArgumentException_WnenNoUserWithDefinedEmailInOrganization()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();
            _organizationUserRepository.IsAdminUser(CurrentUserEmail).Returns(false);

            //Act
            Action action = () => _controller.AddOrganizationAdmin(organization, CurrentUserEmail);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("email");
        }

        [TestMethod]
        public void AddOrganizationAdmin_ShouldThrowArgumentException_WnenUserIsAlreadyAdmin()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();
            _organizationUserRepository.IsAdminUser(CurrentUserEmail).Returns(true);

            //Act
            Action action = () => _controller.AddOrganizationAdmin(organization, CurrentUserEmail);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("email");
        }

        [TestMethod]
        public void AddOrganizationAdmin_ShouldThrowArgumentException_WnenUserIsNotAcceptedInOrganization()
        {
            //Arrange
            const string usermail = "user@test.test";
            _organizationUserRepository.IsAdminUser(usermail).Returns(false);

            var organization = OrganizationObjectMother.Create();
            organization.AddUser(usermail, usermail);
            
            //Act
            Action action = () => _controller.AddOrganizationAdmin(organization, usermail);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("email");
        }

        [TestMethod]
        public void AddOrganizationAdmin_ShouldSetIsAdminTrue()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();
            var user = organization.AddUser(CurrentUserEmail, CurrentUserEmail, OrganizationUserStatus.Accepted);
            _organizationUserRepository.IsAdminUser(CurrentUserEmail).Returns(false);

            //Act
            _controller.AddOrganizationAdmin(organization, CurrentUserEmail);

            //Assert
            user.IsAdmin.Should().BeTrue();
        }

        [TestMethod]
        public void AddOrganizationAdmin_ShouldAddUserAsAdminCollaboratorForAllOrganizationCourses()
        {
            //Arrange
            var course = Substitute.For<Course>();
            var organization = OrganizationObjectMother.Create();
            
            var user1 = organization.AddUser("user1@test.test", "user1@test.test", OrganizationUserStatus.Accepted);
            var user2 = organization.AddUser("user2@test.test", "user2@test.test", OrganizationUserStatus.Accepted);

            _courseRepository.GetOwnedCourses(user2.Email).Returns(new List<Course>() { course });
            _organizationUserRepository.IsAdminUser(user1.Email).Returns(false);

            //Act
            _controller.AddOrganizationAdmin(organization, user1.Email);

            //Assert
            course.Received().CollaborateAsAdmin(user1.Email);
        }

        [TestMethod]
        public void AddOrganizationAdmin_ShouldReturnSuccessResult()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();
            organization.AddUser(CurrentUserEmail, CurrentUserEmail, OrganizationUserStatus.Accepted);
            _organizationUserRepository.IsAdminUser(CurrentUserEmail).Returns(false);

            //Act
            var result = _controller.AddOrganizationAdmin(organization, CurrentUserEmail);

            //Assert
            result.Should().BeSuccessResult();
        }

        #endregion

        #region RemoveOrganizationAdmin

        [TestMethod]
        public void RemoveOrganizationAdmin_ShouldThrowArgumentException_WnenOrganizationsNull()
        {
            //Act
            Action action = () => _controller.RemoveOrganizationAdmin(null, "");

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("organization");
        }

        [TestMethod]
        public void RemoveOrganizationAdmin_ShouldThrowArgumentException_WnenNoUserWithDefinedEmailInOrganization()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();

            //Act
            Action action = () => _controller.RemoveOrganizationAdmin(organization, "test@test.test");

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("email");
        }

        [TestMethod]
        public void RemoveOrganizationAdmin_ShouldThrowArgumentException_WnenNoAdminUserWithDefinedEmailInOrganization()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();
            organization.AddUser(CurrentUserEmail, CurrentUserEmail, OrganizationUserStatus.Accepted);

            //Act
            Action action = () => _controller.RemoveOrganizationAdmin(organization, CurrentUserEmail);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("email");
        }

        [TestMethod]
        public void RemoveOrganizationAdmin_ShouldThrowArgumentException_WnenNoOtherAdminInOrganization()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();
            var adminUser = organization.Users.First();

            //Act
            Action action = () => _controller.RemoveOrganizationAdmin(organization, adminUser.Email);

            //Assert
            action.ShouldThrow<ArgumentException>();
        }

        [TestMethod]
        public void RemoveOrganizationAdmin_ShouldSetIsAdminFalse()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();
            var user = organization.AddUser(CurrentUserEmail, CurrentUserEmail, OrganizationUserStatus.Accepted);
            user.SetAdminPermissions(true);

            //Act
             _controller.RemoveOrganizationAdmin(organization, CurrentUserEmail);

            //Assert
            user.IsAdmin.Should().BeFalse();
        }

        [TestMethod]
        public void RemoveOrganizationAdmin_ShouldRemoveCollaborationWithOrganizationCourses()
        {
            //Arrange
            var course = Substitute.For<Course>();
            var organization = OrganizationObjectMother.Create();

            var adminUser = organization.Users.First();
            var user = organization.AddUser(CurrentUserEmail, CurrentUserEmail, OrganizationUserStatus.Accepted);
            user.SetAdminPermissions(true);

            _organizationUserRepository.HasMultipleOrganizationAdminRelations(user.Email, adminUser.Email).Returns(false);
            _courseRepository.GetOwnedCourses(CurrentUserEmail).Returns(new List<Course>() { course });

            //Act
            _controller.RemoveOrganizationAdmin(organization, adminUser.Email);

            //Assert
            course.Received().RemoveCollaborator(_cloner, adminUser.Email);
        }

        [TestMethod]
        public void RemoveOrganizationAdmin_ShouldNotRemoveCollaborationWithOrganizationCourses_WhenMultipleAdminRelations()
        {
            //Arrange
            var course1 = Substitute.For<Course>();
            var course2 = Substitute.For<Course>();

            var organization = OrganizationObjectMother.Create();

            var adminUser = organization.Users.First();
            var user1 = organization.AddUser("user1@test.test", "user1@test.test", OrganizationUserStatus.Accepted);
            var user2 = organization.AddUser("user2@test.test", "user2@test.test", OrganizationUserStatus.Accepted);

            user1.SetAdminPermissions(true);

            _organizationUserRepository.HasMultipleOrganizationAdminRelations(user1.Email, adminUser.Email).Returns(true);
            _organizationUserRepository.HasMultipleOrganizationAdminRelations(user2.Email, adminUser.Email).Returns(false);

            _courseRepository.GetOwnedCourses(user1.Email).Returns(new List<Course>() { course1 });
            _courseRepository.GetOwnedCourses(user2.Email).Returns(new List<Course>() { course2 });

            //Act
            _controller.RemoveOrganizationAdmin(organization, adminUser.Email);

            //Assert
            course1.DidNotReceive().RemoveCollaborator(_cloner, adminUser.Email);
            course2.Received().RemoveCollaborator(_cloner, adminUser.Email);
        }

        [TestMethod]
        public void RemoveOrganizationAdmin_ShouldReturnSuccessResult()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();
            var adminUser = organization.Users.First();
            var user = organization.AddUser(CurrentUserEmail, CurrentUserEmail, OrganizationUserStatus.Accepted);

            user.SetAdminPermissions(true);
            _organizationUserRepository.HasMultipleOrganizationAdminRelations(user.Email, adminUser.Email).Returns(false);
            
            //Act
            var result = _controller.RemoveOrganizationAdmin(organization, adminUser.Email);

            //Assert
            result.Should().BeSuccessResult();
        }

        #endregion
    }
}
