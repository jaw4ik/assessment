using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.DomainModel.Events.OrganizationEvents;
using easygenerator.DomainModel.Tests.ObjectMothers.Organizations;
using easygenerator.DomainModel.Tests.Utils;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Linq;

namespace easygenerator.DomainModel.Tests.Entities.Organizations
{
    [TestClass]
    public class OrganizationTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";
        private const string UserEmail = "user@easygenerator.com";

        private readonly DateTime _currentDate = new DateTime(2014, 3, 19);

        [TestInitialize]
        public void InitializeContext()
        {
            DateTimeWrapper.Now = () => _currentDate;
        }

        #region Constructor

        [TestMethod]
        public void Organization_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            // Act
            Action action = () => OrganizationObjectMother.CreateWithTitle(null);

            // Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Organization_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            // Act
            Action action = () => OrganizationObjectMother.CreateWithTitle(String.Empty);

            // Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Organization_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            // Act
            Action action = () => OrganizationObjectMother.CreateWithTitle(new string('*', 256));

            // Assert
            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Organization_ShouldAddUserWithCreatedByEmailAndAdminAccessToCollection()
        {
            // Arrange
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            // Act
            var organization = OrganizationObjectMother.Create(title, CreatedBy);

            // Assert
            organization.Users.Should().NotBeEmpty().And.HaveCount(1);
            organization.Users.First().Email.Should().Be(CreatedBy);
            organization.Users.First().IsAdmin.Should().Be(true);
        }

        [TestMethod]
        public void Organization_ShouldThrowArgumentException_WhenEmailDomainIsEmptyString()
        {
            // Act
            Action action = () => OrganizationObjectMother.CreateWithEmailDomains(String.Empty);

            // Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("emailDomain");
        }

        [TestMethod]
        public void Organization_ShouldThrowArgumentException_WhenEmailDomainIsLongerThan255()
        {
            // Act
            Action action = () => OrganizationObjectMother.CreateWithEmailDomains(new string('*', 256));

            // Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("emailDomain");
        }

        [TestMethod]
        public void Organization_ShouldThrowArgumentException_WhenOneEmailDomainIsInvalid()
        {
            // Arrange
            const string domainEmail = "easygenerator.com,ism@ecompany";

            // Act
            Action action = () => OrganizationObjectMother.CreateWithEmailDomains(domainEmail);


            // Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("emailDomain");
        }


        [TestMethod]
        public void Organization_ShouldSetEmailDomains()
        {
            // Arrange
            const string emailDomains = "easygenerator.com";

            // Act
            var organization = OrganizationObjectMother.CreateWithEmailDomains(emailDomains);

            // Arrange
            organization.EmailDomains.Should().Be(emailDomains);
        }

        [TestMethod]
        public void Organization_ShouldCreateOrganizationInstance()
        {
            // Arrange
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            // Act
            var organization = OrganizationObjectMother.Create(title, CreatedBy);

            // Arrange
            organization.Id.Should().NotBeEmpty();
            organization.Title.Should().Be(title);
            organization.CreatedOn.Should().Be(DateTime.MaxValue);
            organization.ModifiedOn.Should().Be(DateTime.MaxValue);
            organization.Users.Should().NotBeEmpty();
            organization.Settings.Should().BeNull();
            organization.EmailDomains.Should().BeNull();
            organization.EmailDomainCollection.Count().Should().Be(0);
        }

        #endregion

        #region Update email domains

        [TestMethod]
        public void UpdateEmailDomains_ShouldThrowArgumentNullException_WhenEmailDomainIsNull()
        {
            var organization = OrganizationObjectMother.Create();

            Action action = () => organization.UpdateEmailDomains(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("emailDomain");
        }

        [TestMethod]
        public void UpdateEmailDomains_ShouldThrowArgumentException_WhenEmailDomainIsEmpty()
        {
            var organization = OrganizationObjectMother.Create();

            Action action = () => organization.UpdateEmailDomains(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("emailDomain");
        }

        [TestMethod]
        public void UpdateEmailDomains_ShouldThrowArgumentException_WhenEmailDomainIsLongerThan255()
        {
            var organization = OrganizationObjectMother.Create();

            Action action = () => organization.UpdateEmailDomains(new string('*', 256));

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("emailDomain");
        }

        [TestMethod]
        public void UpdateEmailDomains_ShouldThrowArgumentException_WhenOneEmailDomainIsInvalid()
        {
            const string domainEmail = "easygenerator.com,ism-ecompanyc}om";
            var organization = OrganizationObjectMother.Create();

            Action action = () => organization.UpdateEmailDomains(domainEmail);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("emailDomain");
        }

        [TestMethod]
        public void UpdateEmailDomains_ShouldThrowArgumentException_WhenEmailDomainIsInvalid_HasOnlyOneSymbol()
        {
            const string domainEmail = "c";
            var organization = OrganizationObjectMother.Create();

            Action action = () => organization.UpdateEmailDomains(domainEmail);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("emailDomain");
        }

        [TestMethod]
        public void UpdateEmailDomains_ShouldThrowArgumentException_WhenEmailDomainIsInvalid_HasTwoSymbols()
        {
            const string domainEmail = "co";
            var organization = OrganizationObjectMother.Create();

            Action action = () => organization.UpdateEmailDomains(domainEmail);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("emailDomain");
        }

        [TestMethod]
        public void UpdateEmailDomains_ShouldThrowArgumentException_WhenEmailDomainIsInvalid_HasTwoDots()
        {
            const string domainEmail = "example..com";
            var organization = OrganizationObjectMother.Create();

            Action action = () => organization.UpdateEmailDomains(domainEmail);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("emailDomain");
        }

        [TestMethod]
        public void UpdateEmailDomains_ShouldThrowArgumentException_WhenOneEmailDomainDelimiterIsNotComma()
        {
            const string domainEmail = "easygenerator.com;ism-ecompany.com";
            var organization = OrganizationObjectMother.Create();

            Action action = () => organization.UpdateEmailDomains(domainEmail);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("emailDomain");
        }

        [TestMethod]
        public void UpdateEmailDomain_ShouldUpdateEmailDomain()
        {
            const string domainEmail = "easygenerator.com";
            var organization = OrganizationObjectMother.Create();

            organization.UpdateEmailDomains(domainEmail);

            organization.EmailDomainCollection.Count().Should().Be(1);
            organization.EmailDomainCollection.First().Should().Be(domainEmail);
        }

        [TestMethod]
        public void UpdateEmailDomain_ShouldUpdateEmailDomain_WhenOrganizationDomainHasSlashAndUnderscore()
        {
            const string domainEmail = "easygenerator_live.ism-com";
            var organization = OrganizationObjectMother.Create();

            organization.UpdateEmailDomains(domainEmail);

            organization.EmailDomainCollection.Count().Should().Be(1);
            organization.EmailDomainCollection.First().Should().Be(domainEmail);
        }

        [TestMethod]
        public void UpdateEmailDomain_ShouldUpdateEmailDomain_WhenOrganizationDomainHasThreeSymbols()
        {
            const string domainEmail = "com";
            var organization = OrganizationObjectMother.Create();

            organization.UpdateEmailDomains(domainEmail);

            organization.EmailDomainCollection.Count().Should().Be(1);
            organization.EmailDomainCollection.First().Should().Be(domainEmail);
        }

        [TestMethod]
        public void UpdateEmailDomain_ShouldUpdateEmailDomain_WhenOrganizationDomainIsLong()
        {
            string domainEmail = new string('c', 50);
            var organization = OrganizationObjectMother.Create();

            organization.UpdateEmailDomains(domainEmail);

            organization.EmailDomainCollection.Count().Should().Be(1);
            organization.EmailDomainCollection.First().Should().Be(domainEmail);
        }

        [TestMethod]
        public void UpdateEmailDomain_ShouldUpdateEmailDomainForTwoDomainsSeparatedWithComma()
        {
            const string domainEmail = "easygenerator.com,ism-ecompany.com";
            var organization = OrganizationObjectMother.Create();

            organization.UpdateEmailDomains(domainEmail);

            organization.EmailDomainCollection.Count().Should().Be(2);
            organization.EmailDomainCollection.ElementAt(0).Should().Be("easygenerator.com");
            organization.EmailDomainCollection.ElementAt(1).Should().Be("ism-ecompany.com");
        }

        [TestMethod]
        public void UpdateEmailDomain_ShouldUpdateEmailDomainForMultipleDomainsSeparatedWithComma()
        {
            const string domainEmail = "easygenerator.com,ism-ecompany.com,customer.asd";
            var organization = OrganizationObjectMother.Create();

            organization.UpdateEmailDomains(domainEmail);

            organization.EmailDomainCollection.Count().Should().Be(3);
            organization.EmailDomainCollection.ElementAt(0).Should().Be("easygenerator.com");
            organization.EmailDomainCollection.ElementAt(1).Should().Be("ism-ecompany.com");
            organization.EmailDomainCollection.ElementAt(2).Should().Be("customer.asd");
        }

        [TestMethod]
        public void UpdateEmailDomain_ShouldUpdateEmailDomainForTwoDomainsSeparatedWithCommaAndSpaces()
        {
            const string domainEmail = "easygenerator.com ,   ism-ecompany.com";
            var organization = OrganizationObjectMother.Create();

            organization.UpdateEmailDomains(domainEmail);

            organization.EmailDomainCollection.Count().Should().Be(2);
            organization.EmailDomainCollection.ElementAt(0).Should().Be("easygenerator.com");
            organization.EmailDomainCollection.ElementAt(1).Should().Be("ism-ecompany.com");
        }

        [TestMethod]
        public void UpdateEmailDomain_ShouldUpdateEmailDomainForMultipleDomainsSeparatedWithCommaAndSpaces()
        {
            const string domainEmail = "easygenerator.com ,ism-ecompany.com , some.com";
            var organization = OrganizationObjectMother.Create();

            organization.UpdateEmailDomains(domainEmail);

            organization.EmailDomainCollection.Count().Should().Be(3);
            organization.EmailDomainCollection.ElementAt(0).Should().Be("easygenerator.com");
            organization.EmailDomainCollection.ElementAt(1).Should().Be("ism-ecompany.com");
            organization.EmailDomainCollection.ElementAt(2).Should().Be("some.com");
        }

        [TestMethod]
        public void UpdateEmailDomain_ShouldAdd_OrganizationEmailDomainUpdatedEvent()
        {
            const string domainEmail = "domain.com";
            var organization = OrganizationObjectMother.Create();

            organization.UpdateEmailDomains(domainEmail);

            organization.ShouldContainSingleEvent<OrganizationEmailDomainUpdatedEvent>();
        }

        #endregion

        #region Clear email domain

        [TestMethod]
        public void ClearEmailDomains_ShouldSetEmailDomainToNull()
        {
            var organization = OrganizationObjectMother.Create();

            organization.UpdateEmailDomains("easygenerator.com");

            organization.ClearEmailDomains();
            organization.EmailDomainCollection.Count().Should().Be(0);
            organization.EmailDomains.Should().BeNull();
        }

        [TestMethod]
        public void ClearEmailDomains_ShouldAdd_OrganizationEmailDomainUpdatedEvent()
        {
            var organization = OrganizationObjectMother.Create();

            organization.ClearEmailDomains();

            organization.ShouldContainSingleEvent<OrganizationEmailDomainUpdatedEvent>();
        }

        #endregion

        #region Update title

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            var organization = OrganizationObjectMother.Create();

            Action action = () => organization.UpdateTitle(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            var organization = OrganizationObjectMother.Create();

            Action action = () => organization.UpdateTitle(String.Empty, ModifiedBy);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            var organization = OrganizationObjectMother.Create();

            Action action = () => organization.UpdateTitle(new string('*', 256), ModifiedBy);

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateTitle()
        {
            const string title = "title";
            var organization = OrganizationObjectMother.Create();

            organization.UpdateTitle(title, ModifiedBy);

            organization.Title.Should().Be(title);
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var organization = OrganizationObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            organization.UpdateTitle("title", ModifiedBy);

            organization.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var organization = OrganizationObjectMother.Create();

            Action action = () => organization.UpdateTitle("Some title", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var organization = OrganizationObjectMother.Create();

            Action action = () => organization.UpdateTitle("Some title", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateMoidifiedBy()
        {
            var organization = OrganizationObjectMother.Create();
            var user = "Some user";

            organization.UpdateTitle("Some title", user);

            organization.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void UpdateTitle_ShouldAddOrganizationTitleUpdatedEvent()
        {
            var course = OrganizationObjectMother.Create();

            course.UpdateTitle("updated title", "user");

            course.ShouldContainSingleEvent<OrganizationTitleUpdatedEvent>();
        }

        #endregion

        #region Add user

        [TestMethod]
        public void AddUser_ShouldThrowArgumentNullException_WhenUserEmailIsNull()
        {
            // Arrange
            var organization = OrganizationObjectMother.Create();

            // Act
            Action action = () => organization.AddUser(null, CreatedBy);

            // Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("userEmail");
        }

        [TestMethod]
        public void AddUser_ShouldThrowArgumentNullException_WhenCreatedByIsNull()
        {
            // Arrange
            var organization = OrganizationObjectMother.Create();

            // Act
            Action action = () => organization.AddUser(UserEmail, null);

            // Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("createdBy");
        }

        [TestMethod]
        public void AddUser_ShouldThrowArgumentNullException_WhenUserEmailIsInvalid()
        {
            // Arrange
            var organization = OrganizationObjectMother.Create();

            // Act
            Action action = () => organization.AddUser("email", CreatedBy);

            // Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("userEmail");
        }

        [TestMethod]
        public void AddUser_ShouldAddUser()
        {
            // Arrange
            const string owner = "owner@www.com";
            var organization = OrganizationObjectMother.Create(createdBy: owner);
            var userCount = organization.Users.Count();

            // Act
            organization.AddUser(UserEmail, CreatedBy);

            // Assert
            organization.UserCollection.Should().NotBeEmpty().And.HaveCount(userCount + 1);
        }

        [TestMethod]
        public void AddUser_WhenStatusIsNotSpecified_ShouldAddUserWithWaitingForAcceptanceStatus()
        {
            // Arrange
            const string owner = "owner@www.com";
            var organization = OrganizationObjectMother.Create(createdBy: owner);
            var userCount = organization.Users.Count();

            // Act
            var user = organization.AddUser(UserEmail, CreatedBy);

            // Assert
            organization.UserCollection.Should().NotBeEmpty().And.HaveCount(userCount + 1);
            user.Status.Should().Be(OrganizationUserStatus.WaitingForAcceptance);
        }

        [TestMethod]
        public void AddUser_WhenStatusSpecified_ShouldAddUserWithSpecifiedStatus()
        {
            // Arrange
            const string owner = "owner@www.com";
            var organization = OrganizationObjectMother.Create(createdBy: owner);
            var userCount = organization.Users.Count();

            // Act
            var user = organization.AddUser(UserEmail, CreatedBy, OrganizationUserStatus.WaitingForEmailConfirmation);

            // Assert
            organization.UserCollection.Should().NotBeEmpty().And.HaveCount(userCount + 1);
            user.Status.Should().Be(OrganizationUserStatus.WaitingForEmailConfirmation);
        }

        [TestMethod]
        public void AddUser_ShouldReturnOrganizationUser()
        {
            // Arrange
            const string owner = "owner@www.com";
            var organization = OrganizationObjectMother.Create(createdBy: owner);

            // Act
            var result = organization.AddUser(UserEmail, CreatedBy);

            // Assert
            result.Should().BeOfType<OrganizationUser>();
        }

        [TestMethod]
        public void AddUser_ShouldNotAddUser_WhenUserAlreadyExistsInCollection()
        {
            // Arrange
            const string email = "owner@www.com";
            var organization = OrganizationObjectMother.Create(createdBy: email);
            organization.AddUser(email, CreatedBy);

            // Act
            organization.AddUser(email, CreatedBy);

            // Assert
            organization.Users.Should().NotBeEmpty().And.HaveCount(1);
        }

        [TestMethod]
        public void AddUser_ShouldAddOrganizationUserAddedEvent()
        {
            // Arrange
            const string email = "owner@www.com";
            var organization = OrganizationObjectMother.Create(createdBy: UserEmail);

            // Act
            organization.AddUser(email, CreatedBy);

            // Assert
            organization.ShouldContainSingleEvent<OrganizationUserAddedEvent>();
        }

        #endregion

        #region Remove user

        [TestMethod]
        public void RemoveUser_ShouldReturnTrue_WhenUserExists()
        {
            // Arrange
            var organization = OrganizationObjectMother.Create();
            var user = organization.AddUser(UserEmail, CreatedBy);

            // Act
            var result = organization.RemoveUser(user, ModifiedBy);

            // Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void RemoveUser_ShouldRemoveUserFromOrganization()
        {
            // Arrange
            var organization = OrganizationObjectMother.Create();
            var user = organization.AddUser(UserEmail, CreatedBy);

            // Act
            organization.RemoveUser(user, ModifiedBy);

            // Assert
            organization.Users.Count().Should().Be(1);
        }

        [TestMethod]
        public void RemoveUser_ShouldAddOrganizationUserRemovedEvent()
        {
            // Arrange
            var organization = OrganizationObjectMother.Create();
            var user = organization.AddUser(UserEmail, CreatedBy);

            // Act
            organization.RemoveUser(user, ModifiedBy);

            // Assert
            organization.ShouldContainSingleEventOfType<OrganizationUserRemovedEvent>();
        }

        [TestMethod]
        public void RemoveUser_ShouldMarkOrganizationAsModified()
        {
            // Arrange
            var organization = OrganizationObjectMother.Create();
            var user = organization.AddUser(UserEmail, CreatedBy);

            // Act
            organization.RemoveUser(user, ModifiedBy);

            // Assert
            organization.ModifiedOn.Should().Be(_currentDate);
            organization.ModifiedBy.Should().Be(ModifiedBy);
        }

        #endregion

        #region GetOrCreateSettings

        [TestMethod]
        public void GetOrCreateSettings_ShouldCreateSettings_WhenSettingsAreNull()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();

            //Act
            organization.GetOrCreateSettings();

            //Assert
            Assert.IsNotNull(organization.Settings);
        }

        [TestMethod]
        public void GetOrCreateSettings_ShouldReturnSettings_WhenSettingsAreNull()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();

            //Act
            var settings = organization.GetOrCreateSettings();

            //Assert
            Assert.IsNotNull(settings);
        }

        [TestMethod]
        public void GetOrCreateSettings_ShouldReturnSettings_WhenSettingsAreDefined()
        {
            //Arrange
            var settings = OrganizationSettingsObjectMother.Create();
            var organization = OrganizationObjectMother.CreateWithSettings(settings);

            //Act
            var result = organization.GetOrCreateSettings();

            //Assert
            result.ShouldBeEquivalentTo(settings);
        }

        #endregion

        #region ResetSettings

        [TestMethod]
        public void ResetSettings_ShouldSetSettingsToNull()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();
            organization.GetOrCreateSettings();

            //Act
            organization.ResetSettings();

            //Assert
            Assert.IsNull(organization.Settings);
        }

        [TestMethod]
        public void ResetSettings_ShouldRaiseOrganizationSettingsResetEvent_WhenSettingsAreDefined()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();
            organization.GetOrCreateSettings();

            //Act
            organization.ResetSettings();

            //Assert
           organization.ShouldContainSingleEvent<OrganizationSettingsResetEvent>();
        }

        [TestMethod]
        public void ResetSettings_ShouldNotRaiseOrganizationSettingsResetEvent_WhenSettingsAreNull()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();

            //Act
            organization.ResetSettings();

            //Assert
            organization.ShouldNotContainSingleEvent<OrganizationSettingsResetEvent>();
        }

        #endregion
    }
}
