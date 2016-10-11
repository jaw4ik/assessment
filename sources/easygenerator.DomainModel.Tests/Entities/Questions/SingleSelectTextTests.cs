using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events.AnswerEvents;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.DomainModel.Tests.Utils;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities.Questions
{
    [TestClass]
    public class SingleSelectTextTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        #region Update voice-over      

        [TestMethod]
        public void UpdateVoiceOver_ShouldUpdateVoiceOver()
        {
            const string voiceOver = "voiceOver";
            var question = SingleSelectTextObjectMother.Create();

            question.UpdateVoiceOver(voiceOver, ModifiedBy);

            question.VoiceOver.Should().Be(voiceOver);
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = SingleSelectTextObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.UpdateVoiceOver("voiceOver", ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = SingleSelectTextObjectMother.Create();

            Action action = () => question.UpdateVoiceOver("voice-over", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = SingleSelectTextObjectMother.Create();

            Action action = () => question.UpdateVoiceOver("voice-over", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldUpdateMoidifiedBy()
        {
            var question = SingleSelectTextObjectMother.Create();
            var user = "Some user";

            question.UpdateVoiceOver("voice-over", user);

            question.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldAddQuestionVoiceOverUpdatedEvent()
        {
            var question = SingleSelectTextObjectMother.Create();

            question.UpdateVoiceOver("voice-over", "user");

            question.ShouldContainSingleEvent<QuestionVoiceOverUpdatedEvent>();
        }

        #endregion

        #region RemoveAnswer

        [TestMethod]
        public void RemoveAnswer_ShouldThrowArgumentNullException_WhenAnswerIsNull()
        {
            var question = SingleSelectTextObjectMother.Create();

            Action action = () => question.RemoveAnswer(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("answer");
        }

        [TestMethod]
        public void RemoveAnswer_ShouldRemoveAnswer()
        {
            var question = SingleSelectTextObjectMother.Create();
            var answer = AnswerObjectMother.Create();
            question.AddAnswer(answer, ModifiedBy);

            question.RemoveAnswer(answer, ModifiedBy);
            question.Answers.Should().BeEmpty();
        }

        [TestMethod]
        public void RemoveAnswer_ShouldUnsetQuestionFromAnswer()
        {
            var question = SingleSelectTextObjectMother.Create();
            var answer = AnswerObjectMother.Create();
            answer.Question = question;

            question.RemoveAnswer(answer, ModifiedBy);

            answer.Question.Should().BeNull();
        }

        [TestMethod]
        public void RemoveAnswer_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = SingleSelectTextObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.RemoveAnswer(AnswerObjectMother.Create(), ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void RemoveAnswer_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = SingleSelectTextObjectMother.Create();
            var answer = AnswerObjectMother.Create();

            Action action = () => question.RemoveAnswer(answer, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveAnswer_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = SingleSelectTextObjectMother.Create();
            var answer = AnswerObjectMother.Create();

            Action action = () => question.RemoveAnswer(answer, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveAnswer_ShouldSetFirstAnswerOptionToCorrect_WhenCurrentAnswerIsCorrect()
        {
            var question = SingleSelectTextObjectMother.Create();
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
            var question = SingleSelectTextObjectMother.Create();
            var answer = AnswerObjectMother.Create();
            var user = "Some user";

            question.RemoveAnswer(answer, user);

            question.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void RemoveAnswer_ShouldAddCourseTitleUpdatedEvent()
        {
            var question = SingleSelectTextObjectMother.Create();
            var answer = AnswerObjectMother.Create();
            var user = "Some user";

            question.RemoveAnswer(answer, user);

            question.ShouldContainSingleEvent<AnswerDeletedEvent>();
        }

        #endregion

        #region SetCorrectAnswer

        [TestMethod]
        public void SetCorrectAnswer_ShouldThrowArgumentNullException_WhenAnswerIsNull()
        {
            var question = SingleSelectTextObjectMother.Create();

            Action action = () => question.SetCorrectAnswer(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("answer");
        }

        [TestMethod]
        public void SetCorrectAnswer_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = SingleSelectTextObjectMother.Create();
            var answer = AnswerObjectMother.Create();

            Action action = () => question.SetCorrectAnswer(answer, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void SetCorrectAnswer_ShouldSetAllAnswersToIncorrectWithoutCurrentAnswer()
        {
            var question = SingleSelectTextObjectMother.Create();
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

        #region AddLearningContent

        [TestMethod]
        public void AddLearningContent_ShouldUpdateLearningContentsOrder()
        {
            var learningContent = LearningContentObjectMother.CreateWithPosition(1);
            var learningContent2 = LearningContentObjectMother.CreateWithPosition(2);
            var learningContent3 = LearningContentObjectMother.CreateWithPosition(3);

            var question = SingleSelectTextObjectMother.Create();
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

            var question = SingleSelectTextObjectMother.Create();
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
            var question = SingleSelectTextObjectMother.Create();
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
            var question = SingleSelectTextObjectMother.Create();
            var learningContent = LearningContentObjectMother.Create();
            var learningContent2 = LearningContentObjectMother.Create();

            question.LearningContentsCollection = new List<LearningContent>()
            {
                learningContent
            };
            question.LearningContentsOrder = String.Format("{0},{1}", learningContent2.Id, learningContent.Id);
            ;

            //Act
            var result = question.LearningContents;

            //Assert
            result.Count().Should().Be(1);
            result.First().Should().Be(learningContent);
        }

        #endregion
    }
}
