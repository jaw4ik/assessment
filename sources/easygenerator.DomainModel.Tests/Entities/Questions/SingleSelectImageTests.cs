using System.Collections.Generic;
using System.Collections.ObjectModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.DomainModel.Events.QuestionEvents.SingleSelectImageEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Linq;
using easygenerator.DomainModel.Events.QuestionEvents.ScenarioEvents;
using easygenerator.DomainModel.Tests.Utils;

namespace easygenerator.DomainModel.Tests.Entities.Questions
{
    [TestClass]
    public class SingleSelectImageTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        #region Constructor

        [TestMethod]
        public void SingleSelectImage_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            Action action = () => SingleSelectImageObjectMother.CreateWithTitle(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void SingleSelectImage_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            Action action = () => SingleSelectImageObjectMother.CreateWithTitle(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void SingleSelectImage_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            Action action = () => SingleSelectImageObjectMother.CreateWithTitle(new string('*', 256));

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void SingleSelectImage_ShouldCreateQuestionInstance()
        {
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var question = SingleSelectImageObjectMother.Create(title, CreatedBy);

            question.Id.Should().NotBeEmpty();
            question.Title.Should().Be(title);
            question.Answers.Count().Should().Be(0);
            question.CorrectAnswer.Should().Be(null);
            question.LearningContents.Should().BeEmpty();
            question.CreatedOn.Should().Be(DateTime.MaxValue);
            question.ModifiedOn.Should().Be(DateTime.MaxValue);
            question.CreatedBy.Should().Be(CreatedBy);
            question.ModifiedBy.Should().Be(CreatedBy);
        }

        [TestMethod]
        public void SingleSelectImage_ShouldThrowExceptionIfAnswer1IsNull()
        {
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var answer = new SingleSelectImageAnswer(CreatedBy, DateTimeWrapper.Now());

            Action action = () => new SingleSelectImage(title, CreatedBy, null, answer);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("answer");
        }

        [TestMethod]
        public void SingleSelectImage_ShouldThrowExceptionIfAnswer2IsNull()
        {
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var answer = new SingleSelectImageAnswer(CreatedBy, DateTimeWrapper.Now());

            Action action = () => new SingleSelectImage(title, CreatedBy, answer, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("answer");
        }

        [TestMethod]
        public void SingleSelectImage_ShouldCreateQuestionInstanceWithAnswers()
        {
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var answer1 = new SingleSelectImageAnswer(CreatedBy, DateTimeWrapper.Now());
            var answer2 = new SingleSelectImageAnswer(CreatedBy, DateTimeWrapper.Now());

            var question = new SingleSelectImage(title, CreatedBy, answer1, answer2);
            question.Answers.Count().Should().Be(2);
            question.Answers.ElementAt(0).Should().Be(answer1);
            question.Answers.ElementAt(1).Should().Be(answer2);
        }

        #endregion

        #region Update voice-over

        [TestMethod]
        public void UpdateVoiceOver_ShouldUpdateVoiceOver()
        {
            const string voiceOver = "voiceOver";
            var question = SingleSelectImageObjectMother.Create();

            question.UpdateVoiceOver(voiceOver, ModifiedBy);

            question.VoiceOver.Should().Be(voiceOver);
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = SingleSelectImageObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.UpdateVoiceOver("voiceOver", ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = SingleSelectImageObjectMother.Create();

            Action action = () => question.UpdateVoiceOver("voice-over", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = SingleSelectImageObjectMother.Create();

            Action action = () => question.UpdateVoiceOver("voice-over", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldUpdateMoidifiedBy()
        {
            var question = SingleSelectImageObjectMother.Create();
            var user = "Some user";

            question.UpdateVoiceOver("voice-over", user);

            question.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldAddQuestionVoiceOverUpdatedEvent()
        {
            var question = SingleSelectImageObjectMother.Create();

            question.UpdateVoiceOver("voice-over", "user");

            question.ShouldContainSingleEvent<QuestionVoiceOverUpdatedEvent>();
        }

        #endregion

        #region SetCorrectAnswer

        [TestMethod]
        public void SetCorrectAnswer_ShouldThrowArgumentNullException_WhenAnswerIsNull()
        {
            var question = SingleSelectImageObjectMother.Create();

            Action action = () => question.SetCorrectAnswer(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("answer");
        }

        [TestMethod]
        public void SetCorrectAnswer_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = SingleSelectImageObjectMother.Create();

            Action action = () => question.SetCorrectAnswer(SingleSelectImageAnswerObjectMother.Create(), null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void SetCorrectAnswer_ShouldThrowArgumentNullException_WhenModifiedByIsEmpty()
        {
            var question = SingleSelectImageObjectMother.Create();

            Action action = () => question.SetCorrectAnswer(SingleSelectImageAnswerObjectMother.Create(), "");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void SetCorrectAnswer_ShouldChangeBackground()
        {
            var answer = SingleSelectImageAnswerObjectMother.Create();
            var question = SingleSelectImageObjectMother.Create();
            question.AddAnswer(answer, CreatedBy);

            question.SetCorrectAnswer(answer, ModifiedBy);

            question.CorrectAnswer.Should().Be(answer);
        }

        [TestMethod]
        public void SetCorrectAnswer_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = SingleSelectImageObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            var answer = SingleSelectImageAnswerObjectMother.Create();

            question.SetCorrectAnswer(answer, ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void SetCorrectAnswer_ShouldUpdateMoidifiedBy()
        {
            var question = SingleSelectImageObjectMother.Create();
            var answer = SingleSelectImageAnswerObjectMother.Create();

            question.SetCorrectAnswer(answer, ModifiedBy);

            question.ModifiedBy.Should().Be(ModifiedBy);
        }

        [TestMethod]
        public void SetCorrectAnswer_ShouldAddSingleSelectImageAnswerDeletedEvent()
        {
            var question = SingleSelectImageObjectMother.Create();
            var answer = SingleSelectImageAnswerObjectMother.Create();

            question.SetCorrectAnswer(answer, ModifiedBy);

            question.ShouldContainSingleEvent<SingleSelectImageCorrectAnswerChangedEvent>();
        }

        #endregion

        #region AddAnswer

        [TestMethod]
        public void AddAnswer_ShouldThrowArgumentNullException_WhenAnswerIsNull()
        {
            var question = SingleSelectImageObjectMother.Create();

            Action action = () => question.AddAnswer(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("answer");
        }

        [TestMethod]
        public void AddAnswer_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = SingleSelectImageObjectMother.Create();
            var answer = SingleSelectImageAnswerObjectMother.Create();

            Action action = () => question.AddAnswer(answer, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddAnswer_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = SingleSelectImageObjectMother.Create();
            var answer = SingleSelectImageAnswerObjectMother.Create();

            Action action = () => question.AddAnswer(answer, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddAnswer_ShouldAddAnswer()
        {
            var question = SingleSelectImageObjectMother.Create();
            var answer = SingleSelectImageAnswerObjectMother.Create();

            question.AddAnswer(answer, ModifiedBy);

            question.AnswerCollection.Should().NotBeNull().And.Contain(answer);
        }

        [TestMethod]
        public void AddAnswer_ShouldSetQuestionToAnswer()
        {
            var question = SingleSelectImageObjectMother.Create();
            var answer = SingleSelectImageAnswerObjectMother.Create();

            question.AddAnswer(answer, ModifiedBy);

            answer.Question.Should().Be(question);
        }

        [TestMethod]
        public void AddAnswer_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = SingleSelectImageObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.AddAnswer(SingleSelectImageAnswerObjectMother.Create(), ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void AddAnswer_ShouldUpdateMoidifiedBy()
        {
            var question = SingleSelectImageObjectMother.Create();
            var answer = SingleSelectImageAnswerObjectMother.Create();

            question.AddAnswer(answer, ModifiedBy);

            question.ModifiedBy.Should().Be(ModifiedBy);
        }

        [TestMethod]
        public void AddAnswer_ShouldAddSectionTitleUpdatedEvent()
        {
            var question = SingleSelectImageObjectMother.Create();

            question.AddAnswer(SingleSelectImageAnswerObjectMother.Create(), ModifiedBy);

            question.ShouldContainSingleEvent<SingleSelectImageAnswerCreatedEvent>();
        }

        #endregion

        #region RemoveAnswer

        [TestMethod]
        public void RemoveAnswer_ShouldThrowArgumentNullException_WhenAnswerIsNull()
        {
            var question = SingleSelectImageObjectMother.Create();

            Action action = () => question.RemoveAnswer(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("answer");
        }

        [TestMethod]
        public void RemoveAnswer_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = SingleSelectImageObjectMother.Create();
            var answer = SingleSelectImageAnswerObjectMother.Create();

            Action action = () => question.RemoveAnswer(answer, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveAnswer_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = SingleSelectImageObjectMother.Create();
            var answer = SingleSelectImageAnswerObjectMother.Create();

            Action action = () => question.RemoveAnswer(answer, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveAnswer_ShouldDoNothing_WhenAnswerIsNotAttachedToQuestion()
        {
            var question = SingleSelectImageObjectMother.Create();
            var answer = SingleSelectImageAnswerObjectMother.Create();

            question.RemoveAnswer(answer, ModifiedBy);
            question.AnswerCollection.Count.Should().Be(0);
        }

        [TestMethod]
        public void RemoveAnswer_ShouldRemoveAnswer()
        {
            var question = SingleSelectImageObjectMother.Create();
            var answer = SingleSelectImageAnswerObjectMother.Create();
            question.AddAnswer(answer, CreatedBy);

            question.RemoveAnswer(answer, ModifiedBy);
            question.AnswerCollection.Count.Should().Be(0);
        }

        [TestMethod]
        public void RemoveAnswer_ShouldUnsetQuestionFromAnswer()
        {
            var question = SingleSelectImageObjectMother.Create();
            question.AddAnswer(Substitute.For<SingleSelectImageAnswer>(), CreatedBy);
            var answer = question.AnswerCollection[0];

            question.RemoveAnswer(answer, ModifiedBy);

            answer.Question.Should().BeNull();
        }

        [TestMethod]
        public void RemoveAnswer_ShouldSetFirstAnswerToCorrect_WhenRemovedAnswerIsCorrect()
        {
            var question = SingleSelectImageObjectMother.Create();
            var answer = Substitute.For<SingleSelectImageAnswer>();
            var fisrtAnswer = Substitute.For<SingleSelectImageAnswer>();
            question.AddAnswer(answer, ModifiedBy);
            question.AddAnswer(fisrtAnswer, ModifiedBy);
            question.SetCorrectAnswer(answer, ModifiedBy);

            question.RemoveAnswer(answer, ModifiedBy);

            question.CorrectAnswer.Should().Be(question.AnswerCollection[0]);
        }

        [TestMethod]
        public void RemoveAnswer_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = SingleSelectImageObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;
            var answer = Substitute.For<SingleSelectImageAnswer>();
            question.AddAnswer(answer, CreatedBy);
            question.RemoveAnswer(answer, ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void RemoveAnswer_ShouldUpdateModifiedBy()
        {
            var question = SingleSelectImageObjectMother.Create();
            var answer = Substitute.For<SingleSelectImageAnswer>();
            question.AddAnswer(answer, CreatedBy);

            question.RemoveAnswer(answer, ModifiedBy);

            question.ModifiedBy.Should().Be(ModifiedBy);
        }

        [TestMethod]
        public void AddAnswer_ShouldAddSingleSelectImageAnswerDeletedEvent()
        {
            var question = SingleSelectImageObjectMother.Create();
            var answer = Substitute.For<SingleSelectImageAnswer>();
            question.AddAnswer(answer, CreatedBy);

            question.RemoveAnswer(answer, ModifiedBy);

            question.ShouldContainSingleEventOfType<SingleSelectImageAnswerDeletedEvent>();
        }

        #endregion

        #region AddLearningContent

        [TestMethod]
        public void AddLearningContent_ShouldUpdateLearningContentsOrder()
        {
            var learningContent = LearningContentObjectMother.CreateWithPosition(1);
            var learningContent2 = LearningContentObjectMother.CreateWithPosition(2);
            var learningContent3 = LearningContentObjectMother.CreateWithPosition(3);

            var question = SingleSelectImageObjectMother.Create();
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

            var question = SingleSelectImageObjectMother.Create();
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
            var question = SingleSelectImageObjectMother.Create();
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
            var question = SingleSelectImageObjectMother.Create();
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
