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
            Action action = () => OrganizationObjectMother.CreateWithTitle(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Organization_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            Action action = () => OrganizationObjectMother.CreateWithTitle(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Organization_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            Action action = () => OrganizationObjectMother.CreateWithTitle(new string('*', 256));

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Organization_ShouldAddUserWithCreatedByEmailAndAdminAccessToCollection()
        {
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var course = OrganizationObjectMother.Create(title, CreatedBy);
            course.Users.Should().NotBeEmpty().And.HaveCount(1);
            course.Users.First().Email.Should().Be(CreatedBy);
            course.Users.First().IsAdmin.Should().Be(true);
        }

        [TestMethod]
        public void Organization_ShouldCreateOrganizationInstance()
        {
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var course = OrganizationObjectMother.Create(title, CreatedBy);

            course.Id.Should().NotBeEmpty();
            course.Title.Should().Be(title);
            course.CreatedOn.Should().Be(DateTime.MaxValue);
            course.ModifiedOn.Should().Be(DateTime.MaxValue);
            course.Users.Should().NotBeEmpty();
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
            var organization = OrganizationObjectMother.Create();

            Action action = () => organization.AddUser(null, CreatedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("userEmail");
        }

        [TestMethod]
        public void AddUser_ShouldThrowArgumentNullException_WhenCreatedByIsNull()
        {
            var organization = OrganizationObjectMother.Create();

            Action action = () => organization.AddUser(UserEmail, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("createdBy");
        }

        [TestMethod]
        public void AddUser_ShouldThrowArgumentNullException_WhenUserEmailIsInvalid()
        {
            var organization = OrganizationObjectMother.Create();

            Action action = () => organization.AddUser("email", CreatedBy);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("userEmail");
        }

        [TestMethod]
        public void AddUser_ShouldAddUser()
        {
            const string owner = "owner@www.com";
            var organization = OrganizationObjectMother.Create(createdBy: owner);
            var userCount = organization.Users.Count();
            organization.AddUser(UserEmail, CreatedBy);

            organization.UserCollection.Should().NotBeEmpty().And.HaveCount(userCount + 1);
        }

        [TestMethod]
        public void AddUser_ShouldReturnOrganizationUser()
        {
            const string owner = "owner@www.com";
            var organization = OrganizationObjectMother.Create(createdBy: owner);

            var result = organization.AddUser(UserEmail, CreatedBy);

            result.Should().BeOfType<OrganizationUser>();
        }

        [TestMethod]
        public void AddUser_ShouldNotAddUser_WhenUserAlreadyExistsInCollection()
        {
            const string email = "owner@www.com";
            var organization = OrganizationObjectMother.Create(createdBy: email);
            organization.AddUser(email, CreatedBy);

            organization.AddUser(email, CreatedBy);

            organization.Users.Should().NotBeEmpty().And.HaveCount(1);
        }

        [TestMethod]
        public void AddUser_ShouldAddOrganizationUserAddedEvent()
        {
            const string email = "owner@www.com";
            var organization = OrganizationObjectMother.Create(createdBy: UserEmail);
            organization.AddUser(email, CreatedBy);

            organization.ShouldContainSingleEvent<OrganizationUserAddedEvent>();
        }

        #endregion

        #region Remove user

        [TestMethod]
        public void RemoveUser_ShouldReturnFalse_WhenUserDoesNotExist()
        {
            // Arrange
            var organization = OrganizationObjectMother.Create();

            // Act
            var result = organization.RemoveUser("some_email", ModifiedBy);

            // Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void RemoveUser_ShouldThrowInvalidOperationException_WhenRemoveLastAdminUser()
        {
            var organization = OrganizationObjectMother.Create();

            Action action = () => organization.RemoveUser(organization.CreatedBy, ModifiedBy);

            action.ShouldThrow<InvalidOperationException>();
        }

        [TestMethod]
        public void RemoveUser_ShouldReturnTrue_WhenUserExists()
        {
            // Arrange
            var organization = OrganizationObjectMother.Create();
            organization.AddUser(UserEmail, CreatedBy);

            // Act
            var result = organization.RemoveUser(UserEmail, ModifiedBy);

            // Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void RemoveUser_ShouldRemoveUserFromOrganization()
        {
            // Arrange
            var organization = OrganizationObjectMother.Create();
            organization.AddUser(UserEmail, CreatedBy);

            // Act
            organization.RemoveUser(UserEmail, ModifiedBy);

            // Assert
            organization.Users.Count().Should().Be(1);
        }

        [TestMethod]
        public void RemoveUser_ShouldAddOrganizationUserRemovedEvent()
        {
            // Arrange
            var organization = OrganizationObjectMother.Create();
            organization.AddUser(UserEmail, CreatedBy);

            // Act
            organization.RemoveUser(UserEmail, ModifiedBy);

            // Assert
            organization.ShouldContainSingleEventOfType<OrganizationUserRemovedEvent>();
        }

        [TestMethod]
        public void RemoveUser_ShouldMarkOrganizationAsModified()
        {
            // Arrange
            var organization = OrganizationObjectMother.Create();
            organization.AddUser(UserEmail, CreatedBy);

            // Act
            organization.RemoveUser(UserEmail, ModifiedBy);

            // Assert
            organization.ModifiedOn.Should().Be(_currentDate);
            organization.ModifiedBy.Should().Be(ModifiedBy);
        }

        #endregion
    }
}
