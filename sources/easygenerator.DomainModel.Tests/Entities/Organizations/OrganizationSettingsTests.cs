using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events.OrganizationEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
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
    public class OrganizationSettingsTests
    {
        #region Ctor

        [TestMethod]
        public void OrganizationSettings_ShouldCreateInstance()
        {
            //Arrange
            var organization = OrganizationObjectMother.Create();
            var accessType = AccessType.Academy;
            var expirationDate = DateTime.Now;

            //Act
            var settings = OrganizationSettingsObjectMother.Create(organization, accessType, expirationDate);

            //Assert
            settings.Id.Should().NotBeEmpty();
            settings.Organization.Should().Be(organization);
            settings.AccessType.HasValue.Should().BeTrue();
            settings.AccessType.Value.Should().Be(accessType);
            settings.ExpirationDate.HasValue.Should().BeTrue();
            settings.ExpirationDate.Value.Should().Be(expirationDate);
            settings.Templates.Should().HaveCount(0);
        }

        [TestMethod]
        public void OrganizationSettings_ShouldThrowArgumentNullException_WhenOrganizationIsNull()
        {
            //Act
            Action action = () => OrganizationSettingsObjectMother.CreateWithOrganization(null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("organization");
        }

        [TestMethod]
        public void OrganizationSettings_ShouldThrowException_WhenExpirationDateIsLessThanMin()
        {
            //Act
            Action action = () => OrganizationSettingsObjectMother.CreateWithExpirationDate(DateTime.MinValue);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("expirationDate");
        }

        [TestMethod]
        public void OrganizationSettings_ShouldThrowException_WhenAccessTypeIsDefinedAndExpirationDateIsNull()
        {
            //Act
            Action action = () => OrganizationSettingsObjectMother.Create(OrganizationObjectMother.Create(), AccessType.Academy, expirationDate: null);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("expirationDate");
        }

        [TestMethod]
        public void OrganizationSettings_ShouldThrowException_WhenAccessTypeIsNullAndExpirationDateIsDefined()
        {
            //Act
            Action action = () => OrganizationSettingsObjectMother.Create(OrganizationObjectMother.Create(), accessType: null, expirationDate: DateTimeWrapper.MinValue());

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("accessType");
        }

        #endregion

        #region UpdateSubscription

        [TestMethod]
        public void UpdateSubscription_ShouldThrowException_WhenExpirationDateIsInvalid()
        {
            //Arrange
            var settings = OrganizationSettingsObjectMother.Create();

            //Act
            Action action = () => settings.UpdateSubscription(AccessType.Plus, DateTime.MinValue);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("expirationDate");
        }

        [TestMethod]
        public void UpdateSubscription_ShouldUpdateAccessType()
        {
            //Arrange
            var settings = OrganizationSettingsObjectMother.Create();
            var accessType = AccessType.Academy;

            //Act
            settings.UpdateSubscription(accessType, DateTime.MaxValue);

            //Assert
            settings.AccessType.HasValue.Should().BeTrue();
            settings.AccessType.Value.Should().Be(accessType);
        }

        [TestMethod]
        public void UpdateSubscription_ShouldUpdateExpirationDate()
        {
            //Arrange
            var settings = OrganizationSettingsObjectMother.Create();
            var expirationDate = DateTime.Now;

            //Act
            settings.UpdateSubscription(AccessType.Academy, expirationDate);

            //Assert
            settings.ExpirationDate.HasValue.Should().BeTrue();
            settings.ExpirationDate.Value.Should().Be(expirationDate);
        }

        [TestMethod]
        public void UpdateSubscription_ShouldRaiseOrganizationSettingsSubscriptionUpdated()
        {
            //Arrange
            var settings = OrganizationSettingsObjectMother.Create();
            var expirationDate = DateTime.Now;

            //Act
            settings.UpdateSubscription(AccessType.Academy, expirationDate);

            //Assert
            settings.ShouldContainSingleEvent<OrganizationSettingsSubscriptionUpdatedEvent>();
        }

        #endregion

        #region GetSubscription

        [TestMethod]
        public void GetSubscription_ShouldReturnNull_WhenAccessTypeOrExpirationDateIsNotSet()
        {
            //Arrange
            var settings = OrganizationSettingsObjectMother.Create();

            //Act
            var subscription = settings.GetSubscription();

            //Assert
            Assert.IsNull(subscription);
        }

        [TestMethod]
        public void GetSubscription_ShouldReturnUserSubscription()
        {
            //Arrange
            var settings = OrganizationSettingsObjectMother.Create(OrganizationObjectMother.Create(), AccessType.Academy, DateTimeWrapper.MinValue());

            //Act
            var subscription = settings.GetSubscription();

            //Assert
            Assert.IsNotNull(subscription);
            subscription.AccessType.Should().Be(AccessType.Academy);
            subscription.ExpirationDate.Should().Be(DateTimeWrapper.MinValue());
        }

        #endregion

        #region ResetSubscription

        [TestMethod]
        public void ResetSubscription_ShouldNotRaiseEvent_WhenSubscriptionIsNotDefined()
        {
            //Arrange
            var settings = OrganizationSettingsObjectMother.Create();

            //Act
            settings.ResetSubscription();

            //Assert
            settings.ShouldNotContainSingleEvent<OrganizationSettingsSubscriptionResetEvent>();
        }

        [TestMethod]
        public void ResetSubscription_ShouldResetSubscription()
        {
            //Arrange
            var settings = OrganizationSettingsObjectMother.Create(OrganizationObjectMother.Create(), AccessType.Academy, DateTimeWrapper.MinValue());

            //Act
            settings.ResetSubscription();

            //Assert
            settings.AccessType.HasValue.Should().BeFalse();
            settings.ExpirationDate.HasValue.Should().BeFalse();
        }

        [TestMethod]
        public void ResetSubscription_ShouldRaiseEvent()
        {
            //Arrange
            var settings = OrganizationSettingsObjectMother.Create(OrganizationObjectMother.Create(), AccessType.Academy, DateTimeWrapper.MinValue());

            //Act
            settings.ResetSubscription();

            //Assert
            settings.ShouldContainSingleEvent<OrganizationSettingsSubscriptionResetEvent>();
        }

        #endregion

        #region AddTemplate

        [TestMethod]
        public void AddTemplate_ShouldThrowException_WhenTemplateIsNull()
        {
            //Arrange
            var settings = OrganizationSettingsObjectMother.Create();

            //Act
            Action action = () => settings.AddTemplate(null);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("template");
        }

        [TestMethod]
        public void AddTemplate_ShouldAddTemplate()
        {
            //Arrange
            var settings = OrganizationSettingsObjectMother.Create();
            var template = TemplateObjectMother.Create();

            //Act
            settings.AddTemplate(template);

            //Assert
            settings.Templates.Count().Should().Be(1);
            settings.Templates.First().Should().Be(template);
        }

        [TestMethod]
        public void AddTemplate_ShouldTriggerEvent()
        {
            //Arrange
            var settings = OrganizationSettingsObjectMother.Create();
            var template = TemplateObjectMother.Create();

            //Act
            settings.AddTemplate(template);

            //Assert
            settings.ShouldContainSingleEventOfType<OrganizationSettingsTemplateAddedEvent>();
        }

        #endregion

        #region RemoveTemplate

        [TestMethod]
        public void RemoveTemplate_ShouldThrowException_WhenTemplateIsNull()
        {
            //Arrange
            var settings = OrganizationSettingsObjectMother.Create();

            //Act
            Action action = () => settings.RemoveTemplate(null);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("template");
        }

        [TestMethod]
        public void RemoveTemplate_ShouldRemoveTemplate()
        {
            //Arrange
            var settings = OrganizationSettingsObjectMother.Create();
            var template = TemplateObjectMother.Create();
            settings.AddTemplate(template);

            //Act
            settings.RemoveTemplate(template);

            //Assert
            settings.Templates.Count().Should().Be(0);
        }

        #endregion

        #region ClearTemplates

        [TestMethod]
        public void ClearTemplates_ShouldClearTemplates()
        {
            //Arrange
            var settings = OrganizationSettingsObjectMother.Create();
            settings.AddTemplate(TemplateObjectMother.Create());
            settings.AddTemplate(TemplateObjectMother.Create());

            //Act
            settings.ClearTemplates();

            //Assert
            settings.Templates.Count().Should().Be(0);
        }

        #endregion

    }
}
