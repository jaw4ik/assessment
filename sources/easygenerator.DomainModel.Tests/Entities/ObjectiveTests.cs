using System;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using easygenerator.DomainModel.Tests.ObjectMothers;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class ObjectiveTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";

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

            var objective = ObjectiveObjectMother.Create(title, CreatedBy);

            objective.Id.Should().NotBeEmpty();
            objective.Title.Should().Be(title);
            objective.Questions.Should().BeEmpty();
            objective.CreatedOn.Should().Be(DateTime.MaxValue);
            objective.ModifiedOn.Should().Be(DateTime.MaxValue);
            objective.CreatedBy.Should().Be(CreatedBy);
            objective.ModifiedBy.Should().Be(CreatedBy);
        }

        #endregion

        #region Update title

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.UpdateTitle(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.UpdateTitle(String.Empty, ModifiedBy);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.UpdateTitle(new string('*', 256), ModifiedBy);

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateTitle()
        {
            const string title = "title";
            var objective = ObjectiveObjectMother.Create();

            objective.UpdateTitle(title, ModifiedBy);

            objective.Title.Should().Be(title);
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var objective = ObjectiveObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            objective.UpdateTitle("title", ModifiedBy);

            objective.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.UpdateTitle("Some title", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.UpdateTitle("Some title", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateMoidifiedBy()
        {
            var objective = ObjectiveObjectMother.Create();
            var user = "Some user";

            objective.UpdateTitle("Some title", user);

            objective.ModifiedBy.Should().Be(user);
        }

        #endregion

        #region Add question

        [TestMethod]
        public void AddQuestion_ShouldThrowArgumentNullException_WhenQuestionIsNull()
        {
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.AddQuestion(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("question");
        }

        [TestMethod]
        public void AddQuestion_ShouldAddQuestion()
        {
            var objective = ObjectiveObjectMother.Create();
            var question = QuestionObjectMother.Create();

            objective.AddQuestion(question, ModifiedBy);

            objective.Questions.Should().NotBeEmpty().And.HaveCount(1).And.Contain(question);
        }

        [TestMethod]
        public void AddQuestion_ShouldSetObjectiveToQuestion()
        {
            var objective = ObjectiveObjectMother.Create();
            var question = QuestionObjectMother.Create();

            objective.AddQuestion(question, ModifiedBy);

            question.Objective.Should().Be(objective);
        }

        [TestMethod]
        public void AddQuestion_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var objective = ObjectiveObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            objective.AddQuestion(QuestionObjectMother.Create(), ModifiedBy);

            objective.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void AddQuestion_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = QuestionObjectMother.Create();
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.AddQuestion(question, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddQuestion_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = QuestionObjectMother.Create();
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.AddQuestion(question, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddQuestion_ShouldUpdateMoidifiedBy()
        {
            var question = QuestionObjectMother.Create();
            var objective = ObjectiveObjectMother.Create();
            var user = "Some user";

            objective.AddQuestion(question, user);

            objective.ModifiedBy.Should().Be(user);
        }

        #endregion

        #region Remove question

        [TestMethod]
        public void RemoveQuestion_ShouldThrowArgumentNullException_WhenQuestionIsNull()
        {
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.RemoveQuestion(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("question");
        }

        [TestMethod]
        public void RemoveQuestion_ShouldRemoveQuestion()
        {
            var objective = ObjectiveObjectMother.Create();
            var question = QuestionObjectMother.Create();

            objective.AddQuestion(question, ModifiedBy);

            objective.RemoveQuestion(question, ModifiedBy);
            objective.Questions.Should().BeEmpty();
        }

        [TestMethod]
        public void RemoveQuestion_ShouldUnsetObjectiveFromQuestion()
        {
            var objective = ObjectiveObjectMother.Create();
            var question = QuestionObjectMother.Create();
            question.Objective = objective;

            objective.RemoveQuestion(question, ModifiedBy);

            question.Objective.Should().BeNull();
        }

        [TestMethod]
        public void RemoveQuestion_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var objective = ObjectiveObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            objective.RemoveQuestion(QuestionObjectMother.Create(), ModifiedBy);

            objective.ModifiedOn.Should().Be(dateTime);
        }


        [TestMethod]
        public void RemoveQuestion_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = QuestionObjectMother.Create();
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.RemoveQuestion(question, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveQuestion_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = QuestionObjectMother.Create();
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.RemoveQuestion(question, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveQuestion_ShouldUpdateMoidifiedBy()
        {
            var question = QuestionObjectMother.Create();
            var objective = ObjectiveObjectMother.Create();
            var user = "Some user";

            objective.RemoveQuestion(question, user);

            objective.ModifiedBy.Should().Be(user);
        }

        #endregion
    }
}
