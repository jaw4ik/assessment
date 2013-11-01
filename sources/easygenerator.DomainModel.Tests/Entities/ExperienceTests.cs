using System;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class ExperienceTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        #region Constructor

        [TestMethod]
        public void Experience_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            Action action = () => ExperienceObjectMother.CreateWithTitle(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Experience_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            Action action = () => ExperienceObjectMother.CreateWithTitle(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Experience_ShouldThrowArgumentException_WhenTemplateIsNull()
        {
            Action action = () => ExperienceObjectMother.CreateWithTemplate(null);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("template");
        }

        [TestMethod]
        public void Experience_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            Action action = () => ExperienceObjectMother.CreateWithTitle(new string('*', 256));

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Experience_ShouldCreateObjectiveInstance()
        {
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var experience = ExperienceObjectMother.Create(title, CreatedBy);

            experience.Id.Should().NotBeEmpty();
            experience.Title.Should().Be(title);
            experience.CreatedOn.Should().Be(DateTime.MaxValue);
            experience.ModifiedOn.Should().Be(DateTime.MaxValue);
            experience.RelatedObjectives.Should().BeEmpty();
            experience.CreatedBy.Should().Be(CreatedBy);
            experience.ModifiedBy.Should().Be(CreatedBy);
        }

        #endregion

        #region RelateObjective

        [TestMethod]
        public void RelateObjective_ShouldThrowNullArgumentException_WhenObjectiveIsNull()
        {
            //Arrange
            var experience = ExperienceObjectMother.Create();

            //Act
            Action action = () => experience.RelateObjective(null, ModifiedBy);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("objective");
        }

        [TestMethod]
        public void RelateObjective_ShouldUpdateModifiedOnDate()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();
            var experience = ExperienceObjectMother.Create();
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            //Act
            experience.RelateObjective(objective, ModifiedBy);

            //Assert
            experience.ModifiedOn.Should().Be(DateTime.MaxValue);
        }

        [TestMethod]
        public void RelateObjective_ShouldRelateObjectiveToExperience()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();
            var experience = ExperienceObjectMother.Create();

            //Act
            experience.RelateObjective(objective, ModifiedBy);

            //Assert
            experience.RelatedObjectives.Should().Contain(objective);
        }

        [TestMethod]
        public void RelateObjective_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var objective = ObjectiveObjectMother.Create();
            var experience = ExperienceObjectMother.Create();

            Action action = () => experience.RelateObjective(objective, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RelateObjective_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var objective = ObjectiveObjectMother.Create();
            var experience = ExperienceObjectMother.Create();

            Action action = () => experience.RelateObjective(objective, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RelateObjective_ShouldUpdateMoidifiedBy()
        {
            var objective = ObjectiveObjectMother.Create();
            var experience = ExperienceObjectMother.Create();
            var user = "Some user";

            experience.RelateObjective(objective, user);

            experience.ModifiedBy.Should().Be(user);
        }

        #endregion

        #region UnrelateObjective

        [TestMethod]
        public void UnrelateObjective_ShouldThrowNullArgumentException_WhenObjectiveIsNull()
        {
            //Arrange
            var experience = ExperienceObjectMother.Create();

            //Act
            Action action = () => experience.UnrelateObjective(null, ModifiedBy);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("objective");
        }

        [TestMethod]
        public void UnrelateObjective_ShouldUpdateModifiedOnDate()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();
            var experience = ExperienceObjectMother.Create();
            experience.RelateObjective(objective, ModifiedBy);
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            //Act
            experience.UnrelateObjective(objective, ModifiedBy);

            //Assert
            experience.ModifiedOn.Should().Be(DateTime.MaxValue);
        }

        [TestMethod]
        public void UnrelateObjective_ShouldUnrelateObjectiveFromExperience()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();
            var experience = ExperienceObjectMother.Create();
            experience.RelateObjective(objective, ModifiedBy);

            //Act
            experience.UnrelateObjective(objective, ModifiedBy);

            //Assert
            experience.RelatedObjectives.Should().NotContain(objective);
        }

        [TestMethod]
        public void UnrelateObjective_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var objective = ObjectiveObjectMother.Create();
            var experience = ExperienceObjectMother.Create();
            experience.RelateObjective(objective, ModifiedBy);

            Action action = () => experience.UnrelateObjective(objective, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UnrelateObjective_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var objective = ObjectiveObjectMother.Create();
            var experience = ExperienceObjectMother.Create();
            experience.RelateObjective(objective, ModifiedBy);

            Action action = () => experience.UnrelateObjective(objective, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UnrelateObjective_ShouldUpdateMoidifiedBy()
        {
            var objective = ObjectiveObjectMother.Create();
            var experience = ExperienceObjectMother.Create();
            experience.RelateObjective(objective, ModifiedBy);
            var user = "Some user";

            experience.UnrelateObjective(objective, user);

            experience.ModifiedBy.Should().Be(user);
        }

        #endregion

        #region Update title

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            var experience = ExperienceObjectMother.Create();

            Action action = () => experience.UpdateTitle(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            var experience = ExperienceObjectMother.Create();

            Action action = () => experience.UpdateTitle(String.Empty, ModifiedBy);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            var experience = ExperienceObjectMother.Create();

            Action action = () => experience.UpdateTitle(new string('*', 256), ModifiedBy);

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateTitle()
        {
            const string title = "title";
            var experience = ExperienceObjectMother.Create();

            experience.UpdateTitle(title, ModifiedBy);

            experience.Title.Should().Be(title);
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var experience = ExperienceObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            experience.UpdateTitle("title", ModifiedBy);

            experience.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var experience = ExperienceObjectMother.Create();

            Action action = () => experience.UpdateTitle("Some title", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var experience = ExperienceObjectMother.Create();

            Action action = () => experience.UpdateTitle("Some title", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateMoidifiedBy()
        {
            var experience = ExperienceObjectMother.Create();
            var user = "Some user";

            experience.UpdateTitle("Some title", user);

            experience.ModifiedBy.Should().Be(user);
        }

        #endregion

        #region UpdateTemplate

        [TestMethod]
        public void UpdateTemplate_ShouldThrowArgumentNullException_WhenTemplateIsNull()
        {
            //Arrange
            var experience = ExperienceObjectMother.Create();

            //Act
            Action action = () => experience.UpdateTemplate(null, ModifiedBy);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("template");
        }

        [TestMethod]
        public void UpdateTemplate_ShouldUpdateTemplate()
        {
            //Arrange
            var experience = ExperienceObjectMother.Create();
            var template = TemplateObjectMother.Create();

            //Act
            experience.UpdateTemplate(template, ModifiedBy);

            //Assert
            experience.Template.Should().Be(template);
        }

        [TestMethod]
        public void UpdateTemplate_ShouldUpdateModificationDate()
        {
            //Arrange
            DateTimeWrapper.Now = () => DateTime.Now;
            var experience = ExperienceObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            var template = TemplateObjectMother.Create();

            //Act
            experience.UpdateTemplate(template, ModifiedBy);

            //Assert
            experience.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateTemplate_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var template = TemplateObjectMother.Create();
            var experience = ExperienceObjectMother.Create();

            Action action = () => experience.UpdateTemplate(template, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateTemplate_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var template = TemplateObjectMother.Create();
            var experience = ExperienceObjectMother.Create();

            Action action = () => experience.UpdateTemplate(template, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateTemplate_ShouldUpdateMoidifiedBy()
        {
            var template = TemplateObjectMother.Create();
            var experience = ExperienceObjectMother.Create();
            var user = "Some user";

            experience.UpdateTemplate(template, user);

            experience.ModifiedBy.Should().Be(user);
        }

        #endregion

        #region UpdatePackageUrl

        [TestMethod]
        public void UpdatePackageUrl_ShouldThrowArgumentNullException_WhenPackageUrlIsNull()
        {
            //Arrange
            var experience = ExperienceObjectMother.Create();

            //Act
            Action action = () => experience.UpdatePackageUrl(null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("packageUrl");
        }

        [TestMethod]
        public void UpdatePackageUrl_ShouldThrowArgumentException_WhenPackageUrlIsEmpty()
        {
            //Arrange
            var experience = ExperienceObjectMother.Create();

            //Act
            Action action = () => experience.UpdatePackageUrl(string.Empty);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("packageUrl");
        }

        [TestMethod]
        public void UpdatePackageUrl_ShouldUpdatePackageUrlAndBuildOnDate()
        {
            //Arrange
            var experience = ExperienceObjectMother.Create();
            var packageUrl = "SomeUrl";

            DateTimeWrapper.Now = () => DateTime.MaxValue;

            //Act
            experience.UpdatePackageUrl(packageUrl);

            //Assert
            experience.PackageUrl.Should().Be(packageUrl);
            experience.BuildOn.Should().Be(DateTime.MaxValue);
        }

        #endregion

        #region Define createdBy

        [TestMethod]
        public void DefineCreatedBy_ShouldThrowArgumentNullException_WhenCreatedByIsNull()
        {
            var experience = ExperienceObjectMother.Create();

            Action action = () => experience.DefineCreatedBy(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("createdBy");
        }

        [TestMethod]
        public void DefineCreatedBy_ShouldThrowArgumentException_WhenCreatedByIsEmpty()
        {
            var experience = ExperienceObjectMother.Create();

            Action action = () => experience.DefineCreatedBy(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("createdBy");
        }


        [TestMethod]
        public void DefineCreatedBy_ShouldUpdateCreatedBy()
        {
            const string createdBy = "createdBy";
            const string updatedCreatedBy = "updatedCreatedBy";
            var experience = ExperienceObjectMother.CreateWithCreatedBy(createdBy);

            experience.DefineCreatedBy(updatedCreatedBy);

            experience.CreatedBy.Should().Be(updatedCreatedBy);
        }

        [TestMethod]
        public void DefineCreatedBy_ShouldUpdateModifiedBy()
        {
            const string createdBy = "createdBy";
            const string updatedCreatedBy = "updatedCreatedBy";
            var experience = ExperienceObjectMother.CreateWithCreatedBy(createdBy);

            experience.DefineCreatedBy(updatedCreatedBy);

            experience.ModifiedBy.Should().Be(updatedCreatedBy);
        }


        #endregion

        #region UpdatePublishedOnDate

        [TestMethod]
        public void UpdatePublishedOnDate_ShouldUpdatePublishedOn()
        {
            //Arrange
            var experience = ExperienceObjectMother.Create();
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            //Act
            experience.UpdatePublishedOnDate();

            //Assert
            experience.PublishedOn.Should().Be(DateTime.MaxValue);
        }

        #endregion
    }
}
