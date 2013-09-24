using System;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Tests;
using NSubstitute;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class ObjectiveTests
    {
        #region Constructor

        [TestMethod]
        public void Objective_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            Action action = () => ObjectiveObjectMother.CreateWithTitle(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Objective_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            Action action = () => ObjectiveObjectMother.CreateWithTitle(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Objective_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            Action action = () => ObjectiveObjectMother.CreateWithTitle(new string('*', 256));

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Objective_ShouldCreateObjectiveInstance()
        {
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var objective = ObjectiveObjectMother.Create(title);

            objective.Id.Should().NotBeEmpty();
            objective.Title.Should().Be(title);
            objective.Questions.Should().BeEmpty();
            objective.CreatedOn.Should().Be(DateTime.MaxValue);
            objective.ModifiedOn.Should().Be(DateTime.MaxValue);
        }

        #endregion

        #region Update title

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.UpdateTitle(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.UpdateTitle(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.UpdateTitle(new string('*', 256));

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateTitle()
        {
            const string title = "title";
            var objective = ObjectiveObjectMother.Create();

            objective.UpdateTitle(title);

            objective.Title.Should().Be(title);
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var objective = ObjectiveObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            objective.UpdateTitle("title");

            objective.ModifiedOn.Should().Be(dateTime);
        }

        #endregion

        #region Add question

        [TestMethod]
        public void AddQuestion_ShouldThrowArgumentNullException_WhenQuestionIsNull()
        {
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.AddQuestion(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("question");
        }

        [TestMethod]
        public void AddQuestion_ShouldAddQuestion()
        {
            var objective = ObjectiveObjectMother.Create();
            var question = QuestionObjectMother.Create();

            objective.AddQuestion(question);

            objective.Questions.Should().NotBeEmpty().And.HaveCount(1).And.Contain(question);
        }

        [TestMethod]
        public void AddQuestion_ShouldSetObjectiveToQuestion()
        {
            var objective = ObjectiveObjectMother.Create();
            var question = QuestionObjectMother.Create();

            objective.AddQuestion(question);

            question.Objective.Should().Be(objective);
        }

        [TestMethod]
        public void AddQuestion_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var objective = ObjectiveObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            objective.AddQuestion(QuestionObjectMother.Create());

            objective.ModifiedOn.Should().Be(dateTime);
        }

        #endregion

        #region Remove question

        [TestMethod]
        public void RemoveQuestion_ShouldThrowArgumentNullException_WhenQuestionIsNull()
        {
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.RemoveQuestion(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("question");
        }

        [TestMethod]
        public void RemoveQuestion_ShouldRemoveQuestion()
        {
            var objective = ObjectiveObjectMother.Create();
            var question = QuestionObjectMother.Create();

            objective.AddQuestion(question);

            objective.RemoveQuestion(question);
            objective.Questions.Should().BeEmpty();
        }

        [TestMethod]
        public void RemoveQuestion_ShouldUnsetObjectiveFromQuestion()
        {
            var objective = ObjectiveObjectMother.Create();
            var question = QuestionObjectMother.Create();
            question.Objective = objective;

            objective.RemoveQuestion(question);

            question.Objective.Should().BeNull();
        }

        [TestMethod]
        public void RemoveQuestion_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var objective = ObjectiveObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            objective.RemoveQuestion(QuestionObjectMother.Create());

            objective.ModifiedOn.Should().Be(dateTime);
        }

        #endregion
    }
}
