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
            var learningContent = LearningContentObjectMother.Create();
            var learningContent2 = LearningContentObjectMother.Create();
            var learningContent3 = LearningContentObjectMother.Create();

            var question = SingleSelectTextObjectMother.Create();
            question.LearningContentsCollection = new Collection<LearningContent>()
            {
                learningContent3,
                learningContent
            };
            question.LearningContentsOrder = String.Format("{0},{1}", learningContent.Id, learningContent3.Id);

            question.AddLearningContent(learningContent2, ModifiedBy);

            question.LearningContentsOrder.Should().Be(String.Format("{0},{1},{2}", learningContent.Id, learningContent3.Id, learningContent2.Id));
        }

        #endregion AddLearningContent

        #region RemoveLearningContent

        [TestMethod]
        public void RemoveLearningContent_ShouldUpdateLearningContentsOrder()
        {
            var learningContent = LearningContentObjectMother.Create();
            var learningContent2 = LearningContentObjectMother.Create();
            var learningContent3 = LearningContentObjectMother.Create();

            var question = SingleSelectTextObjectMother.Create();
            question.LearningContentsCollection = new Collection<LearningContent>()
            {
                learningContent3,
                learningContent,
                learningContent2
            };
            question.LearningContentsOrder = String.Format("{0},{1},{2}", learningContent.Id, learningContent3.Id, learningContent2);

            question.RemoveLearningContent(learningContent2, ModifiedBy);

            question.LearningContentsOrder.Should().Be(String.Format("{0},{1}", learningContent.Id, learningContent3.Id));
        }

        #endregion RemoveLearningContent

        #region UpdateLearningContentsOrder

        [TestMethod]
        public void UpdateLearningContentsOrder_ShouldThrowArgumentNullException_WhenLearningContentsIsNull()
        {
            //Arrange
            var question = SingleSelectTextObjectMother.Create();

            //Act
            Action action = () => question.UpdateLearningContentsOrder(null, ModifiedBy);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("learningContents");
        }

        [TestMethod]
        public void UpdateLearningContentsOrder_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            //Arrange
            var question = SingleSelectTextObjectMother.Create();

            //Act
            Action action = () => question.UpdateLearningContentsOrder(new List<LearningContent>(), null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateLearningContentsOrder_ShouldThrowArgumentNullException_WhenModifiedByIsEmpty()
        {
            //Arrange
            var question = SingleSelectTextObjectMother.Create();

            //Act
            Action action = () => question.UpdateLearningContentsOrder(new List<LearningContent>(), "");

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateLearningContentsOrder_ShouldSetLearningContentsOrderToNull_WhenLearningContentsIsEmpty()
        {
            //Arrange
            var question = SingleSelectTextObjectMother.Create();

            //Act
            question.UpdateLearningContentsOrder(new List<LearningContent>(), ModifiedBy);

            //Assert
            question.LearningContentsOrder.Should().BeNull();
        }

        [TestMethod]
        public void UpdateLearningContentsOrder_ShouldSetLearningContentsOrder()
        {
            //Arrange
            var question = SingleSelectTextObjectMother.Create();
            var learningContents = new List<LearningContent>()
            {
                LearningContentObjectMother.Create(),
                LearningContentObjectMother.Create()
            };

            question.LearningContentsCollection = learningContents;

            //Act
            question.UpdateLearningContentsOrder(learningContents, ModifiedBy);

            //Assert
            question.LearningContentsOrder.Should().Be(String.Format("{0},{1}", learningContents[0].Id, learningContents[1].Id));
        }

        [TestMethod]
        public void UpdateLearningContentsOrder_ShouldAddLearningContentsReorderedEvent()
        {
            //Arrange
            var question = SingleSelectTextObjectMother.Create();

            //Act
            question.UpdateLearningContentsOrder(new List<LearningContent>(), ModifiedBy);

            //Assert
            question.ShouldContainSingleEvent<LearningContentsReorderedEvent>();
        }

        #endregion UpdateLearningContentsOrder

        #region LearningContents

        [TestMethod]
        public void LearningContents_ShouldReturnListOfLearningContentsInCorrectOrder()
        {
            //Arrange
            var question = SingleSelectTextObjectMother.Create();
            var learningContent = LearningContentObjectMother.Create();
            var learningContent2 = LearningContentObjectMother.Create();

            question.LearningContentsCollection = new List<LearningContent>()
            {
                learningContent,
                learningContent2
            };
            question.LearningContentsOrder = String.Format("{0},{1}", learningContent2.Id, learningContent.Id);

            //Act
            var result = question.LearningContents;

            //Assert
            result.First().Should().Be(learningContent2);
        }

        [TestMethod]
        public void LearningContents_ShouldReturnAllLearningContents_WhenOrderedCollectionIsNotFull()
        {
            //Arrange
            var question = SingleSelectTextObjectMother.Create();
            var learningContent = LearningContentObjectMother.Create();
            var learningContent2 = LearningContentObjectMother.Create();

            question.LearningContentsCollection = new List<LearningContent>()
            {
                learningContent,
                learningContent2
            };
            question.LearningContentsOrder = learningContent2.Id.ToString();

            //Act
            var result = question.LearningContents;

            //Assert
            result.Count().Should().Be(2);
            result.First().Should().Be(learningContent2);
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

        #region OrderClonedLearningContents

        [TestMethod]
        public void OrderClonedLearningContents_ShouldReturnNull_IfClonedLearningContentsAreNull()
        {
            var question = SingleSelectTextObjectMother.Create();

            var result = question.OrderClonedLearningContents(null);
            result.Should().BeNull();
        }

        [TestMethod]
        public void OrderClonedLearningContents_ShouldThrowArgumentException_IfLengthOfLearningContentsCollectionsAreDifferent()
        {
            var question = SingleSelectTextObjectMother.Create();
            Action action = () => question.OrderClonedLearningContents(new Collection<LearningContent> { LearningContentObjectMother.Create() });
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("clonedLearningContents");
        }

        [TestMethod]
        public void OrderClonedLearningContents_ShouldOrderClonedLearningContentsAccordingToQuestionLearningContents()
        {
            var learningContent = LearningContentObjectMother.Create("learning content 1");
            var learningContent2 = LearningContentObjectMother.Create("learning content 2");
            var learningContent3 = LearningContentObjectMother.Create("learning content 3");

            var clonedLearningContent = LearningContentObjectMother.Create("cloned learning content 1");
            var clonedLearningContent2 = LearningContentObjectMother.Create("cloned learning content 2");
            var clonedLearningContent3 = LearningContentObjectMother.Create("cloned learning content 3");

            var question = SingleSelectTextObjectMother.Create();
            question.AddLearningContent(learningContent, "owner");
            question.AddLearningContent(learningContent2, "owner");
            question.AddLearningContent(learningContent3, "owner");

            question.UpdateLearningContentsOrder(new Collection<LearningContent> { learningContent3, learningContent, learningContent2 }, "owner");
            var result = question.OrderClonedLearningContents(new Collection<LearningContent> { clonedLearningContent, clonedLearningContent2, clonedLearningContent3 });

            result[0].Should().Be(clonedLearningContent3);
            result[1].Should().Be(clonedLearningContent);
            result[2].Should().Be(clonedLearningContent2);
        }
        #endregion 
    }
}
