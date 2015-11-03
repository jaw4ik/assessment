using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Events.QuestionEvents.ScenarioEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.DomainModel.Tests.Entities.Questions
{
    [TestClass]
    public class ScenarioTests
    {
        private const string ModifiedBy = "easygenerator2@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        #region Constructor

        [TestMethod]
        public void Scenario_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            Action action = () => ScenarioObjectMother.CreateWithTitle(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Scenario_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            Action action = () => ScenarioObjectMother.CreateWithTitle(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Scenario_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            Action action = () => ScenarioObjectMother.CreateWithTitle(new string('*', 256));

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Scenario_ShouldCreateQuestionInstance()
        {
            const string title = "title";
            const int masteryScore = 65;
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var question = ScenarioObjectMother.Create(title, masteryScore, CreatedBy);

            question.Id.Should().NotBeEmpty();
            question.Title.Should().Be(title);
            question.ProjectId.Should().BeNull();
            question.EmbedCode.Should().BeNull();
            question.EmbedUrl.Should().BeNull();
            question.ProjectArchiveUrl.Should().BeNull();
            question.MasteryScore.Should().Be(masteryScore);
            question.LearningContents.Should().BeEmpty();
            question.CreatedOn.Should().Be(DateTime.MaxValue);
            question.ModifiedOn.Should().Be(DateTime.MaxValue);
            question.CreatedBy.Should().Be(CreatedBy);
            question.ModifiedBy.Should().Be(CreatedBy);
        }

        #endregion

        #region UpdateData

        [TestMethod]
        public void UpdateData_ShouldThrowExceprion_WhenModifiedByIsNull()
        {
            //Arrange
            var question = ScenarioObjectMother.Create();

            //Act
            Action action = () => question.UpdateData(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>(), null);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateData_ShouldThrowExceprion_WhenModifiedByIsEmpty()
        {
            //Arrange
            var question = ScenarioObjectMother.Create();

            //Act
            Action action = () => question.UpdateData(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>(), String.Empty);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateData_ShouldUpdateScenarioQuestionFields()
        {
            //Arrange
            var projectId = "project_id";
            var embedCode = "embed_code";
            var embedUrl = "embed_url";
            var archiveUrl = "archive_url";
            var question = ScenarioObjectMother.Create();

            //Act
            question.UpdateData(projectId, embedCode, embedUrl, archiveUrl, ModifiedBy);

            //Assert
            question.ProjectId.Should().Be(projectId);
            question.EmbedCode.Should().Be(embedCode);
            question.EmbedUrl.Should().Be(embedUrl);
            question.ProjectArchiveUrl.Should().Be(archiveUrl);
        }

        [TestMethod]
        public void UpdateData_ShouldUpdateMoidifiedBy()
        {
            //Arrange
            var question = ScenarioObjectMother.Create();

            //Act
            question.UpdateData(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>(), ModifiedBy);

            //Assert
            question.ModifiedBy.Should().Be(ModifiedBy);
        }

        [TestMethod]
        public void UpdateData_ShouldUpdateModificationDate()
        {
            //Arrange
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = ScenarioObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            //Act
            question.UpdateData(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>(), ModifiedBy);

            //Assert
            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateData_ShouldAddScenarioDataUpdatedEvent()
        {
            //Arrange
            var question = ScenarioObjectMother.Create();

            //Act
            question.UpdateData(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>(), ModifiedBy);

            //Assert
            question.Events.Should().HaveCount(1).And.OnlyContain(e => e.GetType() == typeof(ScenarioDataUpdatedEvent));
        }

        #endregion

        #region UpdateMasteryScore

        [TestMethod]
        public void UpdateMasteryScore_ShouldThrowExceprion_WhenModifiedByIsNull()
        {
            //Arrange
            var question = ScenarioObjectMother.Create();

            //Act
            Action action = () => question.UpdateMasteryScore(Arg.Any<int>(), null);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateMasteryScore_ShouldThrowExceprion_WhenModifiedByIsEmpty()
        {
            //Arrange
            var question = ScenarioObjectMother.Create();

            //Act
            Action action = () => question.UpdateMasteryScore(Arg.Any<int>(), String.Empty);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateMasteryScore_ShouldUpdateMoidifiedBy()
        {
            //Arrange
            var question = ScenarioObjectMother.Create();

            //Act
            question.UpdateMasteryScore(Arg.Any<int>(), ModifiedBy);

            //Assert
            question.ModifiedBy.Should().Be(ModifiedBy);
        }

        [TestMethod]
        public void UpdateMasteryScore_ShouldUpdateModificationDate()
        {
            //Arrange
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = ScenarioObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            //Act
            question.UpdateMasteryScore(Arg.Any<int>(), ModifiedBy);

            //Assert
            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateMasteryScore_ShouldUpdateMasteryScore()
        {
            //Arrange
            var newMasteryScore = 55;
            var question = ScenarioObjectMother.Create();

            //Act
            question.UpdateMasteryScore(newMasteryScore, ModifiedBy);

            //Assert
            question.MasteryScore.Should().Be(newMasteryScore);
        }

        [TestMethod]
        public void UpdateMasteryScore_ShouldAddScenarioMasteryScoreUpdatedEvent()
        {
            //Arrange
            var question = ScenarioObjectMother.Create();

            //Act
            question.UpdateMasteryScore(Arg.Any<int>(), ModifiedBy);

            //Assert
            question.Events.Should().HaveCount(1).And.OnlyContain(e => e.GetType() == typeof(ScenarioMasteryScoreUpdatedEvent));
        }

        #endregion

    }
}
