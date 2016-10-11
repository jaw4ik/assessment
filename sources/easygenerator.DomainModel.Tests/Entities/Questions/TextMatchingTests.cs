using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.DomainModel.Events.QuestionEvents.TextMatchingEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.DomainModel.Tests.Utils;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.DomainModel.Tests.Entities.Questions
{
    [TestClass]
    public class TextMatchingTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        #region Constructor

        [TestMethod]
        public void TextMatching_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            Action action = () => TextMatchingObjectMother.CreateWithTitle(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void TextMatching_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            Action action = () => TextMatchingObjectMother.CreateWithTitle(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void TextMatching_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            Action action = () => TextMatchingObjectMother.CreateWithTitle(new string('*', 256));

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void TextMatching_ShouldCreateQuestionInstance()
        {
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var question = TextMatchingObjectMother.Create(title, CreatedBy);

            question.Id.Should().NotBeEmpty();
            question.Title.Should().Be(title);
            question.Answers.Count().Should().Be(0);
            question.LearningContents.Should().BeEmpty();
            question.CreatedOn.Should().Be(DateTime.MaxValue);
            question.ModifiedOn.Should().Be(DateTime.MaxValue);
            question.CreatedBy.Should().Be(CreatedBy);
            question.ModifiedBy.Should().Be(CreatedBy);
        }

        [TestMethod]
        public void TextMatching_ShouldThrowExceptionIfAnswer1IsNull()
        {
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var answer = new TextMatchingAnswer("text", "text", CreatedBy, DateTimeWrapper.Now());

            Action action = () => new TextMatching(title, CreatedBy, null, answer);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("answer");
        }

        [TestMethod]
        public void TextMatching_ShouldThrowExceptionIfAnswer2IsNull()
        {
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var answer = new TextMatchingAnswer("text", "text", CreatedBy, DateTimeWrapper.Now());

            Action action = () => new TextMatching(title, CreatedBy, null, answer);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("answer");
        }

        [TestMethod]
        public void TextMatching_ShouldCreateQuestionInstanceWithAnswers()
        {
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var answer1 = new TextMatchingAnswer("text", "text", CreatedBy, DateTimeWrapper.Now());
            var answer2 = new TextMatchingAnswer("text", "text", CreatedBy, DateTimeWrapper.Now());

            var question = new TextMatching(title, CreatedBy, answer1, answer2);
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
            var question = TextMatchingObjectMother.Create();

            question.UpdateVoiceOver(voiceOver, ModifiedBy);

            question.VoiceOver.Should().Be(voiceOver);
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = TextMatchingObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.UpdateVoiceOver("voiceOver", ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = TextMatchingObjectMother.Create();

            Action action = () => question.UpdateVoiceOver("voice-over", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = TextMatchingObjectMother.Create();

            Action action = () => question.UpdateVoiceOver("voice-over", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldUpdateMoidifiedBy()
        {
            var question = TextMatchingObjectMother.Create();
            var user = "Some user";

            question.UpdateVoiceOver("voice-over", user);

            question.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldAddQuestionVoiceOverUpdatedEvent()
        {
            var question = TextMatchingObjectMother.Create();

            question.UpdateVoiceOver("voice-over", "user");

            question.ShouldContainSingleEvent<QuestionVoiceOverUpdatedEvent>();
        }

        #endregion

        #region AddAnswer

        [TestMethod]
        public void AddAnswer_ShouldThrowArgumentNullException_WhenAnswerIsNull()
        {
            var question = TextMatchingObjectMother.Create();

            Action action = () => question.AddAnswer(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("answer");
        }

        [TestMethod]
        public void AddAnswer_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = TextMatchingObjectMother.Create();
            var answer = TextMatchingAnswerObjectMother.Create();

            Action action = () => question.AddAnswer(answer, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddAnswer_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = TextMatchingObjectMother.Create();
            var answer = TextMatchingAnswerObjectMother.Create();

            Action action = () => question.AddAnswer(answer, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddAnswer_ShouldAddAnswer()
        {
            var question = TextMatchingObjectMother.Create();
            var answer = TextMatchingAnswerObjectMother.Create();

            question.AddAnswer(answer, ModifiedBy);

            question.AnswersCollection.Should().NotBeNull().And.Contain(answer);
        }

        [TestMethod]
        public void AddAnswer_ShouldSetQuestionToAnswer()
        {
            var question = TextMatchingObjectMother.Create();
            var answer = TextMatchingAnswerObjectMother.Create();

            question.AddAnswer(answer, ModifiedBy);

            answer.Question.Should().Be(question);
        }

        [TestMethod]
        public void AddAnswer_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = TextMatchingObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.AddAnswer(TextMatchingAnswerObjectMother.Create(), ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void AddAnswer_ShouldUpdateModifiedBy()
        {
            var question = TextMatchingObjectMother.Create();
            var answer = TextMatchingAnswerObjectMother.Create();

            question.AddAnswer(answer, ModifiedBy);

            question.ModifiedBy.Should().Be(ModifiedBy);
        }

        [TestMethod]
        public void AddAnswer_ShouldAddTextMatchingAnswerCreatedEvent()
        {
            var question = TextMatchingObjectMother.Create();

            question.AddAnswer(TextMatchingAnswerObjectMother.Create(), ModifiedBy);

            question.ShouldContainSingleEvent<TextMatchingAnswerCreatedEvent>();
        }

        #endregion

        #region RemoveAnswer

        [TestMethod]
        public void RemoveAnswer_ShouldThrowArgumentNullException_WhenAnswerIsNull()
        {
            var question = TextMatchingObjectMother.Create();

            Action action = () => question.RemoveAnswer(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("answer");
        }

        [TestMethod]
        public void RemoveAnswer_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = TextMatchingObjectMother.Create();
            var answer = TextMatchingAnswerObjectMother.Create();

            Action action = () => question.RemoveAnswer(answer, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveAnswer_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = TextMatchingObjectMother.Create();
            var answer = TextMatchingAnswerObjectMother.Create();

            Action action = () => question.RemoveAnswer(answer, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveAnswer_ShouldDoNothing_WhenAnswerIsNotAttachedToQuestion()
        {
            var question = TextMatchingObjectMother.Create();
            var answer = TextMatchingAnswerObjectMother.Create();

            question.RemoveAnswer(answer, ModifiedBy);
            question.AnswersCollection.Count.Should().Be(0);
        }

        [TestMethod]
        public void RemoveAnswer_ShouldRemoveAnswer()
        {
            var question = TextMatchingObjectMother.Create();
            var answer = TextMatchingAnswerObjectMother.Create();
            question.AddAnswer(answer, CreatedBy);

            question.RemoveAnswer(answer, ModifiedBy);
            question.AnswersCollection.Count.Should().Be(0);
        }



        [TestMethod]
        public void RemoveAnswer_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = TextMatchingObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;
            var answer = Substitute.For<TextMatchingAnswer>();
            question.AddAnswer(answer, CreatedBy);
            question.RemoveAnswer(answer, ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void RemoveAnswer_ShouldUpdateModifiedBy()
        {
            var question = TextMatchingObjectMother.Create();
            var answer = Substitute.For<TextMatchingAnswer>();
            question.AddAnswer(answer, CreatedBy);

            question.RemoveAnswer(answer, ModifiedBy);

            question.ModifiedBy.Should().Be(ModifiedBy);
        }

        [TestMethod]
        public void RemoveAnswer_ShouldAddTextMatchingAnswerDeletedEvent()
        {
            var question = TextMatchingObjectMother.Create();
            var answer = Substitute.For<TextMatchingAnswer>();
            question.AddAnswer(answer, CreatedBy);

            question.RemoveAnswer(answer, ModifiedBy);

            question.ShouldContainSingleEventOfType<TextMatchingAnswerDeletedEvent>();
        }

        #endregion

        #region AddLearningContent

        [TestMethod]
        public void AddLearningContent_ShouldUpdateLearningContentsOrder()
        {
            var learningContent = LearningContentObjectMother.CreateWithPosition(1);
            var learningContent2 = LearningContentObjectMother.CreateWithPosition(2);
            var learningContent3 = LearningContentObjectMother.CreateWithPosition(3);

            var question = TextMatchingObjectMother.Create();
            question.LearningContentsCollection = new Collection<LearningContent>()
            {
                learningContent,
                learningContent2
            };

            question.AddLearningContent(learningContent3, ModifiedBy);

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

            var question = TextMatchingObjectMother.Create();
            question.LearningContentsCollection = new Collection<LearningContent>()
            {
                learningContent3,
                learningContent,
                learningContent2
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
            var question = TextMatchingObjectMother.Create();
            var learningContent = LearningContentObjectMother.CreateWithPosition(1);
            var learningContent2 = LearningContentObjectMother.CreateWithPosition(2);

            question.LearningContentsCollection = new List<LearningContent>()
            {
                learningContent2,
                learningContent
                
            };
            //Act
            var result = question.LearningContents;

            //Assert
            result.First().Should().Be(learningContent);
        }


        [TestMethod]
        public void LearningContents_ShouldReturnAllLearningContents_WhenOrderedCollectionIsOverfull()
        {
            //Arrange
            var question = TextMatchingObjectMother.Create();
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
