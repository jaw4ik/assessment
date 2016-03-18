using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.SectionEvents;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.DomainModel.Tests.Utils;
using easygenerator.Infrastructure;
using FluentAssertions;
using FluentAssertions.Collections;
using FluentAssertions.Primitives;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class SectionTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        private readonly DateTime _currentDate = new DateTime(2014, 3, 19);

        [TestInitialize]
        public void InitializeContext()
        {
            DateTimeWrapper.Now = () => _currentDate;
        }

        #region Constructor

        [TestMethod]
        public void Section_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            Action action = () => SectionObjectMother.CreateWithTitle(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Section_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            Action action = () => SectionObjectMother.CreateWithTitle(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Section_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            Action action = () => SectionObjectMother.CreateWithTitle(new string('*', 256));

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Section_ShouldCreateSectionInstance()
        {
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var section = SectionObjectMother.Create(title, CreatedBy);

            section.Id.Should().NotBeEmpty();
            section.Title.Should().Be(title);
            section.ImageUrl.Should().BeNull();
            section.Questions.Should().BeEmpty();
            section.RelatedCoursesCollection.Should().BeEmpty();
            section.CreatedOn.Should().Be(DateTime.MaxValue);
            section.ModifiedOn.Should().Be(DateTime.MaxValue);
            section.CreatedBy.Should().Be(CreatedBy);
            section.ModifiedBy.Should().Be(CreatedBy);
        }

        #endregion

        #region Update title

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            var section = SectionObjectMother.Create();

            Action action = () => section.UpdateTitle(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            var section = SectionObjectMother.Create();

            Action action = () => section.UpdateTitle(String.Empty, ModifiedBy);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            var section = SectionObjectMother.Create();

            Action action = () => section.UpdateTitle(new string('*', 256), ModifiedBy);

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateTitle()
        {
            const string title = "title";
            var section = SectionObjectMother.Create();

            section.UpdateTitle(title, ModifiedBy);

            section.Title.Should().Be(title);
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var section = SectionObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            section.UpdateTitle("title", ModifiedBy);

            section.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var section = SectionObjectMother.Create();

            Action action = () => section.UpdateTitle("Some title", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var section = SectionObjectMother.Create();

            Action action = () => section.UpdateTitle("Some title", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateMoidifiedBy()
        {
            var section = SectionObjectMother.Create();
            var user = "Some user";

            section.UpdateTitle("Some title", user);

            section.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void UpdateTitle_ShouldAddSectionTitleUpdatedEvent()
        {
            var section = SectionObjectMother.Create();

            section.UpdateTitle("title", "user");

            section.ShouldContainSingleEvent<SectionTitleUpdatedEvent>();
        }

        #endregion

        #region Update image url

        [TestMethod]
        public void UpdateImageUrl_ShouldThrowArgumentNullException_WhenUrlIsNull()
        {
            var section = SectionObjectMother.Create();

            Action action = () => section.UpdateImageUrl(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("imageUrl");
        }

        [TestMethod]
        public void UpdateImageUrl_ShouldThrowArgumentException_WhenUrlIsEmpty()
        {
            var section = SectionObjectMother.Create();

            Action action = () => section.UpdateImageUrl(String.Empty, ModifiedBy);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("imageUrl");
        }

        [TestMethod]
        public void UpdateImageUrl_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var section = SectionObjectMother.Create();

            Action action = () => section.UpdateImageUrl("Some url", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateImageUrl_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var section = SectionObjectMother.Create();

            Action action = () => section.UpdateImageUrl("Some url", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateImageUrl_ShouldUpdateImageUrl()
        {
            const string imageUrl = "new/image/url";
            var section = SectionObjectMother.Create();

            section.UpdateImageUrl(imageUrl, ModifiedBy);

            section.ImageUrl.Should().Be(imageUrl);
        }

        [TestMethod]
        public void UpdateImageUrl_ShouldUpdateMoidifiedBy()
        {
            var section = SectionObjectMother.Create();
            var user = "Some user";

            section.UpdateImageUrl("Some url", user);

            section.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void UpdateImageUrl_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var section = SectionObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            section.UpdateImageUrl("url", ModifiedBy);

            section.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateImageUrl_ShouldAddSectionImageUrlUpdatedEvent()
        {
            var section = SectionObjectMother.Create();

            section.UpdateImageUrl("url", ModifiedBy);

            section.ShouldContainSingleEvent<SectionImageUrlUpdatedEvent>();
        }

        #endregion

        #region UpdateLearningObjective

        [TestMethod]
        public void UpdateLearningObjective_ShouldThrowArgumentOutOfRangeException_WhenLearningObjectiveIsLongerThan255()
        {
            var section = SectionObjectMother.Create();

            Action action = () => section.UpdateLearningObjective(new string('*', 256), ModifiedBy);

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("Learning objective");
        }

        [TestMethod]
        public void UpdateLearningObjective_ShouldUpdateLearningObjective()
        {
            const string learningObjective = "Learning section";
            var section = SectionObjectMother.Create();

            section.UpdateLearningObjective(learningObjective, ModifiedBy);

            section.LearningObjective.Should().Be(learningObjective);
        }

        [TestMethod]
        public void UpdateLearningObjective_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var section = SectionObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            section.UpdateLearningObjective("learningObjective", ModifiedBy);

            section.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateLearningObjective_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var section = SectionObjectMother.Create();

            Action action = () => section.UpdateLearningObjective("learningObjective", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateLearningObjective_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var section = SectionObjectMother.Create();

            Action action = () => section.UpdateLearningObjective("learningObjective", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateLearningObjective_ShouldUpdateMoidifiedBy()
        {
            var section = SectionObjectMother.Create();
            var user = "Some user";

            section.UpdateLearningObjective("learningObjective", user);

            section.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void UpdateLearningObjective_ShouldAddSectionLearningObjectiveUpdatedEvent()
        {
            var section = SectionObjectMother.Create();

            section.UpdateLearningObjective("title", "user");

            section.ShouldContainSingleEvent<SectionLearningObjectiveUpdatedEvent>();
        }

        #endregion

        #region Add question

        [TestMethod]
        public void AddQuestion_ShouldThrowArgumentNullException_WhenQuestionIsNull()
        {
            var section = SectionObjectMother.Create();

            Action action = () => section.AddQuestion(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("question");
        }

        [TestMethod]
        public void AddQuestion_ShouldAddQuestion()
        {
            var section = SectionObjectMother.Create();
            var question = SingleSelectTextObjectMother.Create();

            section.AddQuestion(question, ModifiedBy);

            section.Questions.Should().NotBeEmpty().And.HaveCount(1).And.Contain(question);
        }

        [TestMethod]
        public void AddQuestion_ShouldSetSectionToQuestion()
        {
            var section = SectionObjectMother.Create();
            var question = SingleSelectTextObjectMother.Create();

            section.AddQuestion(question, ModifiedBy);

            question.Section.Should().Be(section);
        }

        [TestMethod]
        public void AddQuestion_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var section = SectionObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            section.AddQuestion(SingleSelectTextObjectMother.Create(), ModifiedBy);

            section.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void AddQuestion_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = SingleSelectTextObjectMother.Create();
            var section = SectionObjectMother.Create();

            Action action = () => section.AddQuestion(question, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddQuestion_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = SingleSelectTextObjectMother.Create();
            var section = SectionObjectMother.Create();

            Action action = () => section.AddQuestion(question, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddQuestion_ShouldUpdateMoidifiedBy()
        {
            var question = SingleSelectTextObjectMother.Create();
            var section = SectionObjectMother.Create();

            section.AddQuestion(question, ModifiedBy);

            section.ModifiedBy.Should().Be(ModifiedBy);
        }

        [TestMethod]
        public void AddQuestion_ShouldUpdateQuestionsOrder()
        {
            //Arrange
            var question1 = SingleSelectTextObjectMother.Create();
            var question2 = SingleSelectTextObjectMother.Create();
            var question3 = SingleSelectTextObjectMother.Create();
            var section = SectionObjectMother.Create();
            section.QuestionsCollection = new Collection<Question>()
            {
                question3,
                question1
            };
            section.QuestionsOrder = String.Format("{0},{1}", question1.Id, question3.Id);
            //Act
            section.AddQuestion(question2, ModifiedBy);

            //Assert
            section.QuestionsOrder.Should().Be(String.Format("{0},{1},{2}", question1.Id, question3.Id, question2.Id));
        }

        [TestMethod]
        public void AddQuestion_ShouldNotAddQuestion_WhenQuestionHasBeenAlreadyAdded()
        {
            //Arrange
            var question = SingleSelectTextObjectMother.Create();
            var section = SectionObjectMother.Create();
            section.QuestionsCollection = new Collection<Question>()
            {
                question
            };

            //Act
            section.AddQuestion(question, ModifiedBy);

            //Assert
            section.QuestionsCollection.Count.Should().Be(1);
        }

        [TestMethod]
        public void AddQuestion_ShouldAddSectionTitleUpdatedEvent()
        {
            //Arrange
            var section = SectionObjectMother.Create();
            section.QuestionsCollection = new Collection<Question>();

            //Act
            section.AddQuestion(SingleSelectTextObjectMother.Create(), ModifiedBy);

            //Assert
            section.ShouldContainSingleEvent<QuestionCreatedEvent>();
        }

        #endregion

        #region Remove question

        [TestMethod]
        public void RemoveQuestion_ShouldThrowArgumentNullException_WhenQuestionIsNull()
        {
            var section = SectionObjectMother.Create();

            Action action = () => section.RemoveQuestion(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("question");
        }

        [TestMethod]
        public void RemoveQuestion_ShouldRemoveQuestion()
        {
            var section = SectionObjectMother.Create();
            var question = SingleSelectTextObjectMother.Create();

            section.QuestionsCollection.Add(question);

            section.RemoveQuestion(question, ModifiedBy);
            section.Questions.Should().BeEmpty();
        }

        [TestMethod]
        public void RemoveQuestion_ShouldUnsetSectionFromQuestion()
        {
            var section = SectionObjectMother.Create();
            var question = SingleSelectTextObjectMother.Create();
            question.Section = section;

            section.RemoveQuestion(question, ModifiedBy);

            question.Section.Should().BeNull();
        }

        [TestMethod]
        public void RemoveQuestion_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var section = SectionObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            section.RemoveQuestion(SingleSelectTextObjectMother.Create(), ModifiedBy);

            section.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void RemoveQuestion_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = SingleSelectTextObjectMother.Create();
            var section = SectionObjectMother.Create();

            Action action = () => section.RemoveQuestion(question, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveQuestion_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = SingleSelectTextObjectMother.Create();
            var section = SectionObjectMother.Create();

            Action action = () => section.RemoveQuestion(question, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveQuestion_ShouldUpdateModifiedBy()
        {
            var question = SingleSelectTextObjectMother.Create();
            var section = SectionObjectMother.Create();

            section.RemoveQuestion(question, ModifiedBy);

            section.ModifiedBy.Should().Be(ModifiedBy);
        }

        [TestMethod]
        public void RemoveQuestion_ShouldUpdateQuestionsOrder()
        {
            //Arrange
            var question1 = SingleSelectTextObjectMother.Create();
            var question2 = SingleSelectTextObjectMother.Create();
            var question3 = SingleSelectTextObjectMother.Create();
            var section = SectionObjectMother.Create();
            section.QuestionsCollection = new Collection<Question>()
            {
                question3,
                question1,
                question2
            };
            section.QuestionsOrder = String.Format("{0},{1},{2}", question1.Id, question3.Id, question2.Id);
            //Act
            section.RemoveQuestion(question2, ModifiedBy);

            //Assert
            section.QuestionsOrder.Should().Be(String.Format("{0},{1}", question1.Id, question3.Id));
        }

        [TestMethod]
        public void RemoveQuestion_ShouldAddQuestionsDeletedEvent()
        {
            var question = SingleSelectTextObjectMother.Create();
            var section = SectionObjectMother.Create();

            section.RemoveQuestion(question, ModifiedBy);

            section.ShouldContainSingleEvent<QuestionsDeletedEvent>();
        }

        #endregion

        #region Define createdBy

        [TestMethod]
        public void DefineCreatedBy_ShouldThrowArgumentNullException_WhenCreatedByIsNull()
        {
            var section = SectionObjectMother.Create();

            Action action = () => section.DefineCreatedBy(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("createdBy");
        }

        [TestMethod]
        public void DefineCreatedBy_ShouldThrowArgumentException_WhenCreatedByIsEmpty()
        {
            var section = SectionObjectMother.Create();

            Action action = () => section.DefineCreatedBy(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("createdBy");
        }


        [TestMethod]
        public void DefineCreatedBy_ShouldUpdateCreatedBy()
        {
            const string createdBy = "createdBy";
            const string updatedCreatedBy = "updatedCreatedBy";
            var section = SectionObjectMother.CreateWithCreatedBy(createdBy);

            section.DefineCreatedBy(updatedCreatedBy);

            section.CreatedBy.Should().Be(updatedCreatedBy);
        }

        [TestMethod]
        public void DefineCreatedBy_ShouldUpdateModifiedBy()
        {
            const string createdBy = "createdBy";
            const string updatedCreatedBy = "updatedCreatedBy";
            var section = SectionObjectMother.CreateWithCreatedBy(createdBy);

            section.DefineCreatedBy(updatedCreatedBy);

            section.ModifiedBy.Should().Be(updatedCreatedBy);
        }

        #endregion

        #region UpdateQuestionsOrder

        [TestMethod]
        public void UpdateQuestionsOrder_ShouldThrowArgumentNullException_WhenQuestionsIsNull()
        {
            //Arrange
            var section = SectionObjectMother.Create();

            //Act
            Action action = () => section.UpdateQuestionsOrder(null, ModifiedBy);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("questions");
        }

        [TestMethod]
        public void UpdateQuestionsOrder_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            //Arrange
            var section = SectionObjectMother.Create();

            //Act
            Action action = () => section.UpdateQuestionsOrder(new List<Question>(), null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateQuestionsOrder_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            //Arrange
            var section = SectionObjectMother.Create();

            //Act
            Action action = () => section.UpdateQuestionsOrder(new List<Question>(), "");

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateQuestionsOrder_ShouldSetQuestionsOrderToNull_WhenQuestionsIsEmpty()
        {
            //Arrange
            var section = SectionObjectMother.Create();

            //Act
            section.UpdateQuestionsOrder(new List<Question>(), ModifiedBy);

            //Assert
            section.QuestionsOrder.Should().BeNull();
        }

        [TestMethod]
        public void UpdateQuestionsOrder_ShouldSetQuestionsOrder()
        {
            //Arrange
            var section = SectionObjectMother.Create();
            var questions = new List<Question>()
            {
                SingleSelectTextObjectMother.Create(),
                SingleSelectTextObjectMother.Create()
            };

            section.QuestionsCollection = questions;

            //Act
            section.UpdateQuestionsOrder(questions, ModifiedBy);

            //Assert
            section.QuestionsOrder.Should().Be(String.Format("{0},{1}", questions[0].Id, questions[1].Id));
        }

        [TestMethod]
        public void UpdateQuestionsOrder_ShouldAddQuestionsReorderedEvent()
        {
            //Arrange
            var section = SectionObjectMother.Create();

            //Act
            section.UpdateQuestionsOrder(new List<Question>(), ModifiedBy);

            //Assert
            section.ShouldContainSingleEvent<QuestionsReorderedEvent>();
        }

        #endregion

        #region Questions

        [TestMethod]
        public void Questions_ShouldReturnListOfQuestionsInCorrectOrder()
        {
            //Arrange
            var section = SectionObjectMother.Create();
            var question1 = SingleSelectTextObjectMother.Create();
            var question2 = SingleSelectTextObjectMother.Create();

            section.QuestionsCollection = new List<Question>()
            {
                question1,
                question2
            };
            section.QuestionsOrder = String.Format("{0},{1}", question2.Id, question1.Id);

            //Act
            var result = section.Questions;

            //Assert
            result.First().Should().Be(question2);
        }

        [TestMethod]
        public void Questions_ShouldReturnAllQuestions_WhenOrderedCollectionIsNotFull()
        {
            //Arrange
            var section = SectionObjectMother.Create();
            var question1 = SingleSelectTextObjectMother.Create();
            var question2 = SingleSelectTextObjectMother.Create();

            section.QuestionsCollection = new List<Question>()
            {
                question1,
                question2
            };
            section.QuestionsOrder = question2.Id.ToString();

            //Act
            var result = section.Questions;

            //Assert
            result.Count().Should().Be(2);
            result.First().Should().Be(question2);
        }

        [TestMethod]
        public void Questions_ShouldReturnAllQuestions_WhenOrderedCollectionIsOverfull()
        {
            //Arrange
            var section = SectionObjectMother.Create();
            var question1 = SingleSelectTextObjectMother.Create();
            var question2 = SingleSelectTextObjectMother.Create();

            section.QuestionsCollection = new List<Question>()
            {
                question1
            };
            section.QuestionsOrder = String.Format("{0},{1}", question2.Id, question1.Id);
            ;

            //Act
            var result = section.Questions;

            //Assert
            result.Count().Should().Be(1);
            result.First().Should().Be(question1);
        }

        #endregion

        #region OrderClonedQuestions

        [TestMethod]
        public void OrderClonedQuestions_ShouldReturnNull_IfClonedQuestionsAreNull()
        {
            var section = SectionObjectMother.Create();

            var result = section.OrderClonedQuestions(null);
            result.Should().BeNull();
        }

        [TestMethod]
        public void OrderClonedQuestions_ShouldThrowArgumentException_IfLengthOfQuestionCollectionsAreDifferent()
        {
            var section = SectionObjectMother.Create();
            Action action = () => section.OrderClonedQuestions(new Collection<Question> { SingleSelectTextObjectMother.Create() });
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("clonedQuestions");
        }

        [TestMethod]
        public void OrderClonedQuestions_ShouldOrderClonedQuestionsAccordingToSectionQuestions()
        {
            var question1 = SingleSelectTextObjectMother.Create("question 1");
            var question2 = MultipleselectObjectMother.Create("question 2");
            var question3 = MultipleselectObjectMother.Create("question 3");

            var clonedQuestion1 = SingleSelectTextObjectMother.Create("cloned question 1");
            var clonedQuestion2 = MultipleselectObjectMother.Create("cloned question 2");
            var clonedQuestion3 = MultipleselectObjectMother.Create("cloned question 3");

            var section = SectionObjectMother.Create();
            section.AddQuestion(question1, "owner");
            section.AddQuestion(question2, "owner");
            section.AddQuestion(question3, "owner");

            section.UpdateQuestionsOrder(new Collection<Question> { question3, question1, question2 }, "owner");
            var result = section.OrderClonedQuestions(new Collection<Question> { clonedQuestion1, clonedQuestion2, clonedQuestion3 });

            result[0].Should().Be(clonedQuestion3);
            result[1].Should().Be(clonedQuestion1);
            result[2].Should().Be(clonedQuestion2);
        }
        #endregion
    }
}
