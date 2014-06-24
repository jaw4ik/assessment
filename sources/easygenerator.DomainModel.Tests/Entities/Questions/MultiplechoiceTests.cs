using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities.Questions
{
    [TestClass]
    public class MultiplechoiceTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        #region RemoveAnswer

        [TestMethod]
        public void RemoveAnswer_ShouldThrowArgumentNullException_WhenAnswerIsNull()
        {
            var question = MultiplechoiceObjectMother.Create();

            Action action = () => question.RemoveAnswer(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("answer");
        }

        [TestMethod]
        public void RemoveAnswer_ShouldRemoveAnswer()
        {
            var question = MultiplechoiceObjectMother.Create();
            var answer = AnswerObjectMother.Create();
            question.AddAnswer(answer, ModifiedBy);

            question.RemoveAnswer(answer, ModifiedBy);
            question.Answers.Should().BeEmpty();
        }

        [TestMethod]
        public void RemoveAnswer_ShouldUnsetQuestionFromAnswer()
        {
            var question = MultiplechoiceObjectMother.Create();
            var answer = AnswerObjectMother.Create();
            answer.Question = question;

            question.RemoveAnswer(answer, ModifiedBy);

            answer.Question.Should().BeNull();
        }

        [TestMethod]
        public void RemoveAnswer_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = MultiplechoiceObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.RemoveAnswer(AnswerObjectMother.Create(), ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void RemoveAnswer_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = MultiplechoiceObjectMother.Create();
            var answer = AnswerObjectMother.Create();

            Action action = () => question.RemoveAnswer(answer, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveAnswer_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = MultiplechoiceObjectMother.Create();
            var answer = AnswerObjectMother.Create();

            Action action = () => question.RemoveAnswer(answer, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveAnswer_ShouldSetFirstAnswerOptionToCorrect_WhenCurrentAnswerIsCorrect()
        {
            var question = MultiplechoiceObjectMother.Create();
            var answer = AnswerObjectMother.CreateWithCorrectness(true);
            var answer1 = AnswerObjectMother.CreateWithCorrectness(false);
            var answer2 = AnswerObjectMother.CreateWithCorrectness(false);
            question.AddAnswer(answer, ModifiedBy);
            question.AddAnswer(answer1, ModifiedBy);
            question.AddAnswer(answer2, ModifiedBy);

            question.RemoveAnswer(answer, ModifiedBy);

            answer1.IsCorrect.Should().BeTrue();
            answer2.IsCorrect.Should().BeFalse();
        }

        [TestMethod]
        public void RemoveAnswer_ShouldUpdateMoidifiedBy()
        {
            var question = MultiplechoiceObjectMother.Create();
            var answer = AnswerObjectMother.Create();
            var user = "Some user";

            question.RemoveAnswer(answer, user);

            question.ModifiedBy.Should().Be(user);
        }

        #endregion

        #region SetCorrectAnswer

        [TestMethod]
        public void SetCorrectAnswer_ShouldThrowArgumentNullException_WhenAnswerIsNull()
        {
            var question = MultiplechoiceObjectMother.Create();

            Action action = () => question.SetCorrectAnswer(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("answer");
        }

        [TestMethod]
        public void SetCorrectAnswer_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = MultiplechoiceObjectMother.Create();
            var answer = AnswerObjectMother.Create();

            Action action = () => question.SetCorrectAnswer(answer, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void SetCorrectAnswer_ShouldSetAllAnswersToIncorrectWithoutCurrentAnswer()
        {
            var question = MultiplechoiceObjectMother.Create();
            var answer = AnswerObjectMother.CreateWithCorrectness(false);
            var answer1 = AnswerObjectMother.CreateWithCorrectness(true);
            var answer2 = AnswerObjectMother.CreateWithCorrectness(true);
            question.AddAnswer(answer, ModifiedBy);
            question.AddAnswer(answer1, ModifiedBy);
            question.AddAnswer(answer2, ModifiedBy);

            question.SetCorrectAnswer(answer, ModifiedBy);

            answer.IsCorrect.Should().BeTrue();
            answer1.IsCorrect.Should().BeFalse();
            answer2.IsCorrect.Should().BeFalse();
        }

        #endregion
    }
}
