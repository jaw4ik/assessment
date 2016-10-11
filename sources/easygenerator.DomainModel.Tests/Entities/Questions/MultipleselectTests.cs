using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events.AnswerEvents;
using easygenerator.DomainModel.Events.LearningContentEvents;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.DomainModel.Tests.Utils;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities.Questions
{
    [TestClass]
    public class MultipleselectTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        #region Constructor

        [TestMethod]
        public void Question_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            Action action = () => MultipleselectObjectMother.CreateWithTitle(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Question_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            Action action = () => MultipleselectObjectMother.CreateWithTitle(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Question_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            Action action = () => MultipleselectObjectMother.CreateWithTitle(new string('*', 256));

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Question_ShouldCreateQuestionInstance()
        {
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var question = MultipleselectObjectMother.Create(title, CreatedBy);

            question.Id.Should().NotBeEmpty();
            question.Title.Should().Be(title);
            question.Answers.Should().BeEmpty();
            question.CreatedOn.Should().Be(DateTime.MaxValue);
            question.ModifiedOn.Should().Be(DateTime.MaxValue);
            question.CreatedBy.Should().Be(CreatedBy);
            question.ModifiedBy.Should().Be(CreatedBy);
        }

        [TestMethod]
        public void Question_ShouldThrowExceptionIfAnswer1IsNull()
        {
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var answer = new Answer("text", true, CreatedBy, DateTimeWrapper.Now());

            Action action = () => new Multipleselect(title, CreatedBy, false, null, answer);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("answer");
        }

        [TestMethod]
        public void Question_ShouldThrowExceptionIfAnswer2IsNull()
        {
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var answer = new Answer("text", true, CreatedBy, DateTimeWrapper.Now());

            Action action = () => new Multipleselect(title, CreatedBy, false, answer, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("answer");
        }

        [TestMethod]
        public void Question_ShouldCreateQuestionInstanceWithAnswers()
        {
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var answer1 = new Answer("text", true, CreatedBy, DateTimeWrapper.Now());
            var answer2 = new Answer("text", false, CreatedBy, DateTimeWrapper.Now());

            var question = new Multipleselect(title, CreatedBy, false, answer1, answer2);
            question.Answers.Count().Should().Be(2);
            question.Answers.ElementAt(0).Should().Be(answer1);
            question.Answers.ElementAt(1).Should().Be(answer2);
        }

        #endregion

        #region Update title

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            var question = MultipleselectObjectMother.Create();

            Action action = () => question.UpdateTitle(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            var question = MultipleselectObjectMother.Create();

            Action action = () => question.UpdateTitle(String.Empty, ModifiedBy);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            var question = MultipleselectObjectMother.Create();

            Action action = () => question.UpdateTitle(new string('*', 256), ModifiedBy);

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateTitle()
        {
            const string title = "title";
            var question = MultipleselectObjectMother.Create();

            question.UpdateTitle(title, ModifiedBy);

            question.Title.Should().Be(title);
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = MultipleselectObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.UpdateTitle("title", ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = MultipleselectObjectMother.Create();

            Action action = () => question.UpdateTitle("Some title", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = MultipleselectObjectMother.Create();

            Action action = () => question.UpdateTitle("Some title", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateMoidifiedBy()
        {
            var question = MultipleselectObjectMother.Create();
            var user = "Some user";

            question.UpdateTitle("Some title", user);

            question.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void UpdateTitle_ShouldAddQuestionTitleUpdatedEvent()
        {
            var question = MultipleselectObjectMother.Create();

            question.UpdateTitle("title", "user");

            question.ShouldContainSingleEvent<QuestionTitleUpdatedEvent>();
        }

        #endregion

        #region Update voice-over

        [TestMethod]
        public void UpdateVoiceOver_ShouldUpdateVoiceOver()
        {
            const string voiceOver = "voiceOver";
            var question = MultipleselectObjectMother.Create();

            question.UpdateVoiceOver(voiceOver, ModifiedBy);

            question.VoiceOver.Should().Be(voiceOver);
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = MultipleselectObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.UpdateVoiceOver("voiceOver", ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = MultipleselectObjectMother.Create();

            Action action = () => question.UpdateVoiceOver("voice-over", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = MultipleselectObjectMother.Create();

            Action action = () => question.UpdateVoiceOver("voice-over", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldUpdateMoidifiedBy()
        {
            var question = MultipleselectObjectMother.Create();
            var user = "Some user";

            question.UpdateVoiceOver("voice-over", user);

            question.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void UpdateVoiceOver_ShouldAddQuestionVoiceOverUpdatedEvent()
        {
            var question = MultipleselectObjectMother.Create();

            question.UpdateVoiceOver("voice-over", "user");

            question.ShouldContainSingleEvent<QuestionVoiceOverUpdatedEvent>();
        }

        #endregion

        #region Update content

        [TestMethod]
        public void UpdateContent_ShouldUpdateContent()
        {
            const string content = "content";
            var question = MultipleselectObjectMother.Create();

            question.UpdateContent(content, ModifiedBy);

            question.Content.Should().Be(content);
        }

        [TestMethod]
        public void UpdateContent_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = MultipleselectObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.UpdateContent("content", ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateContent_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = MultipleselectObjectMother.Create();

            Action action = () => question.UpdateContent("Some content", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateContent_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = MultipleselectObjectMother.Create();

            Action action = () => question.UpdateContent("Some content", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateContent_ShouldUpdateMoidifiedBy()
        {
            var question = MultipleselectObjectMother.Create();
            var user = "Some user";

            question.UpdateContent("Some content", user);

            question.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void UpdateContent_ShouldAddQuestionContentUpdatedEvent()
        {
            var question = MultipleselectObjectMother.Create();

            question.UpdateContent("content", "user");

            question.ShouldContainSingleEvent<QuestionContentUpdatedEvent>();
        }

        #endregion

        #region Add answer

        [TestMethod]
        public void AddAnswer_ShouldThrowArgumentNullException_WhenAnswerIsNull()
        {
            var question = MultipleselectObjectMother.Create();

            Action action = () => question.AddAnswer(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("answer");
        }

        [TestMethod]
        public void AddAnswer_ShouldAddAnswer()
        {
            var question = MultipleselectObjectMother.Create();
            var answer = AnswerObjectMother.Create();

            question.AddAnswer(answer, ModifiedBy);

            question.Answers.Should().NotBeNull().And.HaveCount(1).And.Contain(answer);
        }

        [TestMethod]
        public void AddAnswer_ShouldSetQuestionToAnswer()
        {
            var question = MultipleselectObjectMother.Create();
            var answer = AnswerObjectMother.Create();

            question.AddAnswer(answer, ModifiedBy);

            answer.Question.Should().Be(question);
        }

        [TestMethod]
        public void AddAnswer_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = MultipleselectObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.AddAnswer(AnswerObjectMother.Create(), ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void AddAnswer_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = MultipleselectObjectMother.Create();
            var answer = AnswerObjectMother.Create();

            Action action = () => question.AddAnswer(answer, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddAnswer_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = MultipleselectObjectMother.Create();
            var answer = AnswerObjectMother.Create();

            Action action = () => question.AddAnswer(answer, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddAnswer_ShouldUpdateMoidifiedBy()
        {
            var question = MultipleselectObjectMother.Create();
            var answer = AnswerObjectMother.Create();
            var user = "Some user";

            question.AddAnswer(answer, user);

            question.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void AddAnswer_ShouldAddAnswerCreatedEvent()
        {
            var question = MultipleselectObjectMother.Create();
            var answer = AnswerObjectMother.Create();
            var user = "Some user";

            question.AddAnswer(answer, user);

            question.ShouldContainSingleEvent<AnswerCreatedEvent>();
        }

        #endregion

        #region Remove answer

        [TestMethod]
        public void RemoveAnswer_ShouldThrowArgumentNullException_WhenAnswerIsNull()
        {
            var question = MultipleselectObjectMother.Create();

            Action action = () => question.RemoveAnswer(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("answer");
        }

        [TestMethod]
        public void RemoveAnswer_ShouldRemoveAnswer()
        {
            var question = MultipleselectObjectMother.Create();
            var answer = AnswerObjectMother.Create();
            question.AddAnswer(answer, ModifiedBy);

            question.RemoveAnswer(answer, ModifiedBy);
            question.Answers.Should().BeEmpty();
        }

        [TestMethod]
        public void RemoveAnswer_ShouldUnsetQuestionFromAnswer()
        {
            var question = MultipleselectObjectMother.Create();
            var answer = AnswerObjectMother.Create();
            answer.Question = question;

            question.RemoveAnswer(answer, ModifiedBy);

            answer.Question.Should().BeNull();
        }

        [TestMethod]
        public void RemoveAnswer_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = MultipleselectObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.RemoveAnswer(AnswerObjectMother.Create(), ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void RemoveAnswer_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = MultipleselectObjectMother.Create();
            var answer = AnswerObjectMother.Create();

            Action action = () => question.RemoveAnswer(answer, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveAnswer_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = MultipleselectObjectMother.Create();
            var answer = AnswerObjectMother.Create();

            Action action = () => question.RemoveAnswer(answer, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveAnswer_ShouldUpdateMoidifiedBy()
        {
            var question = MultipleselectObjectMother.Create();
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

        #region Add learning content

        [TestMethod]
        public void AddLearningContent_ShouldThrowArgumentNullException_WhenLearningContentIsNull()
        {
            var question = MultipleselectObjectMother.Create();

            Action action = () => question.AddLearningContent(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("learningContent");
        }

        [TestMethod]
        public void AddExplanation_ShouldAddExplanation()
        {
            var question = MultipleselectObjectMother.Create();
            var explanation = LearningContentObjectMother.Create();

            question.AddLearningContent(explanation, ModifiedBy);

            question.LearningContents.Should().NotBeNull().And.HaveCount(1).And.Contain(explanation);
        }

        [TestMethod]
        public void AddExplanation_ShouldSetQuestionToExplanation()
        {
            var question = MultipleselectObjectMother.Create();
            var explanation = LearningContentObjectMother.Create();

            question.AddLearningContent(explanation, ModifiedBy);

            explanation.Question.Should().Be(question);
        }

        [TestMethod]
        public void AddExplanation_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = MultipleselectObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.AddLearningContent(LearningContentObjectMother.Create(), ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void AddExplanation_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = MultipleselectObjectMother.Create();
            var explanation = LearningContentObjectMother.Create();

            Action action = () => question.AddLearningContent(explanation, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddExplanation_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = MultipleselectObjectMother.Create();
            var explanation = LearningContentObjectMother.Create();

            Action action = () => question.AddLearningContent(explanation, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddExplanation_ShouldUpdateModifiedBy()
        {
            var question = MultipleselectObjectMother.Create();
            var explanation = LearningContentObjectMother.Create();
            var user = "Some user";

            question.AddLearningContent(explanation, user);

            question.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void AddExplanation_ShouldAddLearningContentCreatedEvent()
        {
            var question = MultipleselectObjectMother.Create();

            question.AddLearningContent(LearningContentObjectMother.Create(), "username");

            question.ShouldContainSingleEvent<LearningContentCreatedEvent>();
        }

        #endregion

        #region Remove explanation

        [TestMethod]
        public void RemoveExplanation_ShouldThrowArgumentNullException_WhenExplanationIsNull()
        {
            var question = MultipleselectObjectMother.Create();

            Action action = () => question.RemoveLearningContent(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("learningContent");
        }

        [TestMethod]
        public void RemoveExplanation_ShouldRemoveExplanation()
        {
            var question = MultipleselectObjectMother.Create();
            var explanation = LearningContentObjectMother.Create();
            question.AddLearningContent(explanation, ModifiedBy);

            question.RemoveLearningContent(explanation, ModifiedBy);
            question.LearningContents.Should().BeEmpty();
        }

        [TestMethod]
        public void RemoveExplanation_ShouldUnsetQuestionFromExplanation()
        {
            var question = MultipleselectObjectMother.Create();
            var explanation = LearningContentObjectMother.Create();
            explanation.Question = question;

            question.RemoveLearningContent(explanation, ModifiedBy);

            explanation.Question.Should().BeNull();
        }

        [TestMethod]
        public void RemoveExplanation_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = MultipleselectObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.RemoveLearningContent(LearningContentObjectMother.Create(), ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void RemoveExplanation_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = MultipleselectObjectMother.Create();
            var explanation = LearningContentObjectMother.Create();

            Action action = () => question.RemoveLearningContent(explanation, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveExplanation_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = MultipleselectObjectMother.Create();
            var explanation = LearningContentObjectMother.Create();

            Action action = () => question.RemoveLearningContent(explanation, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveExplanation_ShouldUpdateMoidifiedBy()
        {
            var question = MultipleselectObjectMother.Create();
            var explanation = LearningContentObjectMother.Create();
            var user = "Some user";

            question.RemoveLearningContent(explanation, user);

            question.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void RemoveExplanation_ShouldAddLearningContentDeletedEvent()
        {
            var question = MultipleselectObjectMother.Create();

            question.RemoveLearningContent(LearningContentObjectMother.Create(), "username");

            question.ShouldContainSingleEvent<LearningContentDeletedEvent>();
        }

        #endregion

        #region Define createdBy

        [TestMethod]
        public void DefineCreatedBy_ShouldThrowArgumentNullException_WhenCreatedByIsNull()
        {
            var question = MultipleselectObjectMother.Create();

            Action action = () => question.DefineCreatedBy(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("createdBy");
        }

        [TestMethod]
        public void DefineCreatedBy_ShouldThrowArgumentException_WhenCreatedByIsEmpty()
        {
            var question = MultipleselectObjectMother.Create();

            Action action = () => question.DefineCreatedBy(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("createdBy");
        }

        [TestMethod]
        public void DefineCreatedBy_ShouldDefineCreatedBy()
        {
            const string createdBy = "createdBy";
            const string updatedCreatedBy = "updatedCreatedBy";
            var question = MultipleselectObjectMother.CreateWithCreatedBy(createdBy);

            question.DefineCreatedBy(updatedCreatedBy);

            question.CreatedBy.Should().Be(updatedCreatedBy);
        }

        [TestMethod]
        public void DefineCreatedBy_ShouldUpdateModifiedBy()
        {
            const string createdBy = "createdBy";
            const string updatedCreatedBy = "updatedCreatedBy";
            var question = MultipleselectObjectMother.CreateWithCreatedBy(createdBy);

            question.DefineCreatedBy(updatedCreatedBy);

            question.ModifiedBy.Should().Be(updatedCreatedBy);
        }

        #endregion

        #region AddLearningContent

        [TestMethod]
        public void AddLearningContent_ShouldUpdateLearningContentsOrder()
        {
            var learningContent = LearningContentObjectMother.CreateWithPosition(1);
            var learningContent2 = LearningContentObjectMother.CreateWithPosition(2);
            var learningContent3 = LearningContentObjectMother.CreateWithPosition(3);

            var question = MultipleselectObjectMother.Create();
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

            var question = MultipleselectObjectMother.Create();
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
            var question = MultipleselectObjectMother.Create();
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
            var question = MultipleselectObjectMother.Create();
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