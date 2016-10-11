using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.DomainModel.Tests.Utils;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities.Questions
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
        public void UpdateAnswers_ShouldUpdateAnswersOrder()
        {
            var question = FillInTheBlanksObjectMother.Create();
            var a1 = BlankAnswerObjectMother.Create();
            var a2 = BlankAnswerObjectMother.Create();
            a1.Order = 4;
            a2.Order = 2;

            question.UpdateAnswers(new Collection<BlankAnswer>() { a1, a2 }, ModifiedBy);

            question.Answers.ToList()[0].Order.Should().Be(0);
            question.Answers.ToList()[1].Order.Should().Be(1);
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
        public void AddAnswer_ShouldSetAnswerOrder_WhenAnswerIsFirst()
        {
            var question = FillInTheBlanksObjectMother.Create();
            var answer = BlankAnswerObjectMother.Create();
            answer.Order = 5;

            question.AddAnswer(answer, ModifiedBy);

            answer.Order.Should().Be(0);
        }

        [TestMethod]
        public void AddAnswer_ShouldUpdateAnswerOrder()
        {
            var question = FillInTheBlanksObjectMother.Create();
            var answer = BlankAnswerObjectMother.Create();
            answer.Order = 5;

            var a = BlankAnswerObjectMother.Create();
            answer.Order = 2;

            question.AddAnswer(a, ModifiedBy);
            question.AddAnswer(answer, ModifiedBy);

            answer.Order.Should().Be(1);
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

        #region UpdateContent

        [TestMethod]
        public void UpdateContent_ShouldUpdateContent()
        {
            const string content = "content";
            var question = FillInTheBlanksObjectMother.Create();

            question.UpdateContent(content, ModifiedBy);

            question.Content.Should().Be(content);
        }

        [TestMethod]
        public void UpdateContent_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = FillInTheBlanksObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.UpdateContent("content", ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateContent_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = FillInTheBlanksObjectMother.Create();

            Action action = () => question.UpdateContent("Some content", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateContent_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = FillInTheBlanksObjectMother.Create();

            Action action = () => question.UpdateContent("Some content", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateContent_ShouldUpdateMoidifiedBy()
        {
            var question = FillInTheBlanksObjectMother.Create();
            var user = "Some user";

            question.UpdateContent("Some content", user);

            question.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void UpdateContent_ShouldAddFillInTheBlankUpdatedEvent()
        {
            var question = FillInTheBlanksObjectMother.Create();

            question.UpdateContent("content", "user");

            question.ShouldContainSingleEvent<FillInTheBlankUpdatedEvent>();
        }

        #endregion

        #region AddLearningContent

        [TestMethod]
        public void AddLearningContent_ShouldUpdateLearningContentsOrder()
        {
            var learningContent = LearningContentObjectMother.CreateWithPosition(1);
            var learningContent2 = LearningContentObjectMother.CreateWithPosition(2);
            var learningContent3 = LearningContentObjectMother.CreateWithPosition(3);

            var question = FillInTheBlanksObjectMother.Create();
            question.LearningContentsCollection = new Collection<LearningContent>()
            {
                learningContent3,
                learningContent
            };
            question.AddLearningContent(learningContent2, ModifiedBy);

            question.LearningContents.ElementAt(0).Should().Be(learningContent);
            question.LearningContents.ElementAt(1).Should().Be(learningContent2);
            question.LearningContents.ElementAt(2).Should().Be(learningContent3);
        }

        #endregion AddLearningContent

        #region RemoveLearningContent

        [TestMethod]
        public void RemoveLearningContent_ShouldUpdateLearningContentsOrder()
        {
            var learningContent = LearningContentObjectMother.CreateWithPosition(1);
            var learningContent2 = LearningContentObjectMother.CreateWithPosition(2);
            var learningContent3 = LearningContentObjectMother.CreateWithPosition(3);

            var question = FillInTheBlanksObjectMother.Create();
            question.LearningContentsCollection = new Collection<LearningContent>()
            {
                learningContent,
                learningContent2,
                learningContent3
            };

            question.RemoveLearningContent(learningContent2, ModifiedBy);
            question.LearningContents.ElementAt(0).Should().Be(learningContent);
            question.LearningContents.ElementAt(1).Should().Be(learningContent3);
        }

        #endregion RemoveLearningContent

        #region LearningContents

        [TestMethod]
        public void LearningContents_ShouldReturnListOfLearningContentsInCorrectOrder()
        {
            //Arrange
            var question = FillInTheBlanksObjectMother.Create();
            var learningContent = LearningContentObjectMother.CreateWithPosition(1);
            var learningContent2 = LearningContentObjectMother.CreateWithPosition(2);

            question.LearningContentsCollection = new List<LearningContent>()
            {
                learningContent2,
                learningContent
            };

            //Assert
            question.LearningContents.ElementAt(0).Should().Be(learningContent);
            question.LearningContents.ElementAt(1).Should().Be(learningContent2);
        }

        [TestMethod]
        public void LearningContents_ShouldReturnAllLearningContents_WhenOrderedCollectionIsOverfull()
        {
            //Arrange
            var question = FillInTheBlanksObjectMother.Create();
            var learningContent = LearningContentObjectMother.Create();
            var learningContent2 = LearningContentObjectMother.Create();

            question.LearningContentsCollection = new List<LearningContent>()
            {
                learningContent
            };
            question.LearningContentsOrder = String.Format("{0},{1}", learningContent2.Id, learningContent.Id);

            //Act
            var result = question.LearningContents;

            //Assert
            result.Count().Should().Be(1);
            result.First().Should().Be(learningContent);
        }

        #endregion
    }
}
