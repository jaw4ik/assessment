﻿using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events.AnswerEvents;
using easygenerator.DomainModel.Events.LearningContentEvents;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Linq;

namespace easygenerator.DomainModel.Tests.Entities.Questions
{
    [TestClass]
    public class StatementTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";


        [TestInitialize]
        public void InitializeContext()
        {
            DateTimeWrapper.Now = () => DateTime.MinValue;
        }

        #region Constructor

        [TestMethod]
        public void Question_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            Action action = () => StatementObjectMother.CreateWithTitle(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Question_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            Action action = () => StatementObjectMother.CreateWithTitle(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Question_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            Action action = () => StatementObjectMother.CreateWithTitle(new string('*', 256));

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Question_ShouldCreateQuestionInstance()
        {
            const string title = "title";

            var question = StatementObjectMother.Create(title, CreatedBy);

            question.Id.Should().NotBeEmpty();
            question.Title.Should().Be(title);
            question.Answers.Count().Should().Be(2);
            question.CreatedOn.Should().Be(DateTime.MinValue);
            question.ModifiedOn.Should().Be(DateTime.MinValue);
            question.CreatedBy.Should().Be(CreatedBy);
            question.ModifiedBy.Should().Be(CreatedBy);
        }

        [TestMethod]
        public void Question_ShouldCreateQuestionInstanceWithAnswers()
        {
            const string title = "title";

            var question = new Statement(title, CreatedBy);
            question.Answers.Should().NotBeNull().And.HaveCount(2);
        }

        #endregion

        #region Update title

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            var question = StatementObjectMother.Create();

            Action action = () => question.UpdateTitle(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            var question = StatementObjectMother.Create();

            Action action = () => question.UpdateTitle(String.Empty, ModifiedBy);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            var question = StatementObjectMother.Create();

            Action action = () => question.UpdateTitle(new string('*', 256), ModifiedBy);

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateTitle()
        {
            const string title = "title";
            var question = StatementObjectMother.Create();

            question.UpdateTitle(title, ModifiedBy);

            question.Title.Should().Be(title);
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = StatementObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.UpdateTitle("title", ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = StatementObjectMother.Create();

            Action action = () => question.UpdateTitle("Some title", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = StatementObjectMother.Create();

            Action action = () => question.UpdateTitle("Some title", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateMoidifiedBy()
        {
            var question = StatementObjectMother.Create();
            var user = "Some user";

            question.UpdateTitle("Some title", user);

            question.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void UpdateTitle_ShouldAddQuestionTitleUpdatedEvent()
        {
            var question = StatementObjectMother.Create();

            question.UpdateTitle("title", "user");

            question.Events.Should().ContainSingle(e => e.GetType() == typeof(QuestionTitleUpdatedEvent));
        }

        #endregion

        #region Update content

        [TestMethod]
        public void UpdateContent_ShouldUpdateContent()
        {
            const string content = "content";
            var question = StatementObjectMother.Create();

            question.UpdateContent(content, ModifiedBy);

            question.Content.Should().Be(content);
        }

        [TestMethod]
        public void UpdateContent_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = StatementObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.UpdateContent("content", ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateContent_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = StatementObjectMother.Create();

            Action action = () => question.UpdateContent("Some content", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateContent_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = StatementObjectMother.Create();

            Action action = () => question.UpdateContent("Some content", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateContent_ShouldUpdateMoidifiedBy()
        {
            var question = StatementObjectMother.Create();

            question.UpdateContent("Some content", ModifiedBy);

            question.ModifiedBy.Should().Be(ModifiedBy);
        }

        [TestMethod]
        public void UpdateContent_ShouldAddQuestionContentUpdatedEvent()
        {
            var question = StatementObjectMother.Create();

            question.UpdateContent("content", "user");

            question.Events.Should().ContainSingle(e => e.GetType() == typeof(QuestionContentUpdatedEvent));
        }

        #endregion

        #region Add answer

        [TestMethod]
        public void AddAnswer_ShouldThrowArgumentNullException_WhenAnswerIsNull()
        {
            var question = StatementObjectMother.Create();

            Action action = () => question.AddAnswer(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("answer");
        }

        [TestMethod]
        public void AddAnswer_ShouldAddAnswer()
        {
            var question = StatementObjectMother.Create();
            var answer = AnswerObjectMother.Create();

            question.AddAnswer(answer, ModifiedBy);

            question.Answers.Should().NotBeNull().And.HaveCount(3).And.Contain(answer);
        }

        [TestMethod]
        public void AddAnswer_ShouldSetQuestionToAnswer()
        {
            var question = StatementObjectMother.Create();
            var answer = AnswerObjectMother.Create();

            question.AddAnswer(answer, ModifiedBy);

            answer.Question.Should().Be(question);
        }

        [TestMethod]
        public void AddAnswer_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = StatementObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.AddAnswer(AnswerObjectMother.Create(), ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void AddAnswer_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = StatementObjectMother.Create();
            var answer = AnswerObjectMother.Create();

            Action action = () => question.AddAnswer(answer, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddAnswer_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = StatementObjectMother.Create();
            var answer = AnswerObjectMother.Create();

            Action action = () => question.AddAnswer(answer, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddAnswer_ShouldUpdateMoidifiedBy()
        {
            var question = StatementObjectMother.Create();
            var answer = AnswerObjectMother.Create();

            question.AddAnswer(answer, ModifiedBy);

            question.ModifiedBy.Should().Be(ModifiedBy);
        }

        [TestMethod]
        public void AddAnswer_ShouldAddAnswerCreatedEvent()
        {
            var question = StatementObjectMother.Create();
            var answer = AnswerObjectMother.Create();

            question.AddAnswer(answer, ModifiedBy);

            question.Events.Should().HaveCount(1).And.OnlyContain(e => e.GetType() == typeof(AnswerCreatedEvent));
        }

        #endregion

        #region Remove answer

        [TestMethod]
        public void RemoveAnswer_ShouldThrowArgumentNullException_WhenAnswerIsNull()
        {
            var question = StatementObjectMother.Create();

            Action action = () => question.RemoveAnswer(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("answer");
        }

        [TestMethod]
        public void RemoveAnswer_ShouldThrowInvalidOperationException_WhenLastStatementIsDeleted()
        {
            var question = StatementObjectMother.Create();

            question.RemoveAnswer(question.Answers.First(), ModifiedBy);

            Action action = () => question.RemoveAnswer(question.Answers.First(), ModifiedBy);
            action.ShouldThrow<InvalidOperationException>().And.Message.ShouldBeEquivalentTo("Cannot remove the last statement");
        }

        [TestMethod]
        public void RemoveAnswer_ShouldUnsetQuestionFromAnswer()
        {
            var question = StatementObjectMother.Create();
            var answer = AnswerObjectMother.Create();
            answer.Question = question;

            question.RemoveAnswer(answer, ModifiedBy);

            answer.Question.Should().BeNull();
        }

        [TestMethod]
        public void RemoveAnswer_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = StatementObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.RemoveAnswer(AnswerObjectMother.Create(), ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void RemoveAnswer_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = StatementObjectMother.Create();
            var answer = AnswerObjectMother.Create();

            Action action = () => question.RemoveAnswer(answer, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveAnswer_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = StatementObjectMother.Create();
            var answer = AnswerObjectMother.Create();

            Action action = () => question.RemoveAnswer(answer, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveAnswer_ShouldUpdateMoidifiedBy()
        {
            var question = StatementObjectMother.Create();
            var answer = AnswerObjectMother.Create();

            question.RemoveAnswer(answer, ModifiedBy);

            question.ModifiedBy.Should().Be(ModifiedBy);
        }

        [TestMethod]
        public void RemoveAnswer_ShouldAddCourseTitleUpdatedEvent()
        {
            var question = SingleSelectTextObjectMother.Create();
            var answer = AnswerObjectMother.Create();

            question.RemoveAnswer(answer, ModifiedBy);

            question.Events.Should().HaveCount(1).And.OnlyContain(e => e.GetType() == typeof(AnswerDeletedEvent));
        }

        #endregion

        #region Add learning content

        [TestMethod]
        public void AddExplanation_ShouldThrowArgumentNullException_WhenExplanationIsNull()
        {
            var question = StatementObjectMother.Create();

            Action action = () => question.AddLearningContent(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("explanation");
        }

        [TestMethod]
        public void AddExplanation_ShouldAddExplanation()
        {
            var question = StatementObjectMother.Create();
            var explanation = LearningContentObjectMother.Create();

            question.AddLearningContent(explanation, ModifiedBy);

            question.LearningContents.Should().NotBeNull().And.HaveCount(1).And.Contain(explanation);
        }

        [TestMethod]
        public void AddExplanation_ShouldSetQuestionToExplanation()
        {
            var question = StatementObjectMother.Create();
            var explanation = LearningContentObjectMother.Create();

            question.AddLearningContent(explanation, ModifiedBy);

            explanation.Question.Should().Be(question);
        }

        [TestMethod]
        public void AddExplanation_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = StatementObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.AddLearningContent(LearningContentObjectMother.Create(), ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void AddExplanation_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = StatementObjectMother.Create();
            var explanation = LearningContentObjectMother.Create();

            Action action = () => question.AddLearningContent(explanation, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddExplanation_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = StatementObjectMother.Create();
            var explanation = LearningContentObjectMother.Create();

            Action action = () => question.AddLearningContent(explanation, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddExplanation_ShouldUpdateModifiedBy()
        {
            var question = StatementObjectMother.Create();
            var explanation = LearningContentObjectMother.Create();
            var user = "Some user";

            question.AddLearningContent(explanation, user);

            question.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void AddExplanation_ShouldAddLearningContentCreatedEvent()
        {
            var question = StatementObjectMother.Create();

            question.AddLearningContent(LearningContentObjectMother.Create(), "username");

            question.Events.Should().HaveCount(1).And.OnlyContain(e => e.GetType() == typeof(LearningContentCreatedEvent));
        }

        #endregion

        #region Remove explanation

        [TestMethod]
        public void RemoveExplanation_ShouldThrowArgumentNullException_WhenExplanationIsNull()
        {
            var question = StatementObjectMother.Create();

            Action action = () => question.RemoveLearningContent(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("explanation");
        }

        [TestMethod]
        public void RemoveExplanation_ShouldRemoveExplanation()
        {
            var question = StatementObjectMother.Create();
            var explanation = LearningContentObjectMother.Create();
            question.AddLearningContent(explanation, ModifiedBy);

            question.RemoveLearningContent(explanation, ModifiedBy);
            question.LearningContents.Should().BeEmpty();
        }

        [TestMethod]
        public void RemoveExplanation_ShouldUnsetQuestionFromExplanation()
        {
            var question = StatementObjectMother.Create();
            var explanation = LearningContentObjectMother.Create();
            explanation.Question = question;

            question.RemoveLearningContent(explanation, ModifiedBy);

            explanation.Question.Should().BeNull();
        }

        [TestMethod]
        public void RemoveExplanation_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = StatementObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.RemoveLearningContent(LearningContentObjectMother.Create(), ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void RemoveExplanation_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = StatementObjectMother.Create();
            var explanation = LearningContentObjectMother.Create();

            Action action = () => question.RemoveLearningContent(explanation, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveExplanation_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = StatementObjectMother.Create();
            var explanation = LearningContentObjectMother.Create();

            Action action = () => question.RemoveLearningContent(explanation, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveExplanation_ShouldUpdateMoidifiedBy()
        {
            var question = StatementObjectMother.Create();
            var explanation = LearningContentObjectMother.Create();
            var user = "Some user";

            question.RemoveLearningContent(explanation, user);

            question.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void RemoveExplanation_ShouldAddLearningContentDeletedEvent()
        {
            var question = StatementObjectMother.Create();

            question.RemoveLearningContent(LearningContentObjectMother.Create(), "username");

            question.Events.Should().HaveCount(1).And.OnlyContain(e => e.GetType() == typeof(LearningContentDeletedEvent));
        }

        #endregion

        #region Define createdBy

        [TestMethod]
        public void DefineCreatedBy_ShouldThrowArgumentNullException_WhenCreatedByIsNull()
        {
            var question = StatementObjectMother.Create();

            Action action = () => question.DefineCreatedBy(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("createdBy");
        }

        [TestMethod]
        public void DefineCreatedBy_ShouldThrowArgumentException_WhenCreatedByIsEmpty()
        {
            var question = StatementObjectMother.Create();

            Action action = () => question.DefineCreatedBy(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("createdBy");
        }

        [TestMethod]
        public void DefineCreatedBy_ShouldDefineCreatedBy()
        {
            const string createdBy = "createdBy";
            const string updatedCreatedBy = "updatedCreatedBy";
            var question = StatementObjectMother.CreateWithCreatedBy(createdBy);

            question.DefineCreatedBy(updatedCreatedBy);

            question.CreatedBy.Should().Be(updatedCreatedBy);
        }

        [TestMethod]
        public void DefineCreatedBy_ShouldUpdateModifiedBy()
        {
            const string createdBy = "createdBy";
            const string updatedCreatedBy = "updatedCreatedBy";
            var question = StatementObjectMother.CreateWithCreatedBy(createdBy);

            question.DefineCreatedBy(updatedCreatedBy);

            question.ModifiedBy.Should().Be(updatedCreatedBy);
        }

        #endregion
    }
}