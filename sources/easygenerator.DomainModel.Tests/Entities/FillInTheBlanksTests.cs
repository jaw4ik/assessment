using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class FillInTheBlanksTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";

        #region UpdateAnswers

        [TestMethod]
        public void UpdateAnswers_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = FillInTheBlanksObjectMother.Create();
            var answers = new Collection<BlankAnswer>();

            Action action = () => question.UpdateAnswers(answers, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateAnswers_ShouldUpdateReplaceAnswerCollection()
        {
            var question = FillInTheBlanksObjectMother.Create();
            var answers = new Collection<BlankAnswer>() { BlankAnswerObjectMother.Create(), BlankAnswerObjectMother.Create() };

            question.UpdateAnswers(answers, ModifiedBy);

            question.Answers.ToList().Count.Should().Be(2);
        }

        [TestMethod]
        public void UpdateAnswers_ShouldUpdateMoidifiedBy()
        {
            var question = FillInTheBlanksObjectMother.Create();
            var answers = new Collection<BlankAnswer>();

            question.UpdateAnswers(answers, ModifiedBy);

            question.ModifiedBy.Should().Be(ModifiedBy);
        }

        #endregion

        #region Add answer

        [TestMethod]
        public void AddAnswer_ShouldThrowArgumentNullException_WhenAnswerIsNull()
        {
            var question = FillInTheBlanksObjectMother.Create();

            Action action = () => question.AddAnswer(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("answer");
        }

        [TestMethod]
        public void AddAnswer_ShouldAddAnswer()
        {
            var question = FillInTheBlanksObjectMother.Create();
            var answer = BlankAnswerObjectMother.Create();

            question.AddAnswer(answer, ModifiedBy);

            question.Answers.Should().NotBeNull().And.HaveCount(1).And.Contain(answer);
        }

        [TestMethod]
        public void AddAnswer_ShouldSetQuestionToAnswer()
        {
            var question = FillInTheBlanksObjectMother.Create();
            var answer = BlankAnswerObjectMother.Create();

            question.AddAnswer(answer, ModifiedBy);

            answer.Question.Should().Be(question);
        }

        [TestMethod]
        public void AddAnswer_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = FillInTheBlanksObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.AddAnswer(BlankAnswerObjectMother.Create(), ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void AddAnswer_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = FillInTheBlanksObjectMother.Create();
            var answer = BlankAnswerObjectMother.Create();

            Action action = () => question.AddAnswer(answer, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddAnswer_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = FillInTheBlanksObjectMother.Create();
            var answer = BlankAnswerObjectMother.Create();

            Action action = () => question.AddAnswer(answer, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddAnswer_ShouldUpdateMoidifiedBy()
        {
            var question = FillInTheBlanksObjectMother.Create();
            var answer = BlankAnswerObjectMother.Create();
            var user = "Some user";

            question.AddAnswer(answer, user);

            question.ModifiedBy.Should().Be(user);
        }

        #endregion
    }
}
