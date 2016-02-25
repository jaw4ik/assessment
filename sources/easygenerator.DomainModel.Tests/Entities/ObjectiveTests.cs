using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.ObjectiveEvents;
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
    public class ObjectiveTests
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
        public void Objective_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            Action action = () => ObjectiveObjectMother.CreateWithTitle(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Objective_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            Action action = () => ObjectiveObjectMother.CreateWithTitle(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Objective_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            Action action = () => ObjectiveObjectMother.CreateWithTitle(new string('*', 256));

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Objective_ShouldCreateObjectiveInstance()
        {
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var objective = ObjectiveObjectMother.Create(title, CreatedBy);

            objective.Id.Should().NotBeEmpty();
            objective.Title.Should().Be(title);
            objective.ImageUrl.Should().BeNull();
            objective.Questions.Should().BeEmpty();
            objective.RelatedCoursesCollection.Should().BeEmpty();
            objective.CreatedOn.Should().Be(DateTime.MaxValue);
            objective.ModifiedOn.Should().Be(DateTime.MaxValue);
            objective.CreatedBy.Should().Be(CreatedBy);
            objective.ModifiedBy.Should().Be(CreatedBy);
        }

        #endregion

        #region Update title

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.UpdateTitle(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.UpdateTitle(String.Empty, ModifiedBy);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.UpdateTitle(new string('*', 256), ModifiedBy);

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateTitle()
        {
            const string title = "title";
            var objective = ObjectiveObjectMother.Create();

            objective.UpdateTitle(title, ModifiedBy);

            objective.Title.Should().Be(title);
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var objective = ObjectiveObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            objective.UpdateTitle("title", ModifiedBy);

            objective.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.UpdateTitle("Some title", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.UpdateTitle("Some title", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateMoidifiedBy()
        {
            var objective = ObjectiveObjectMother.Create();
            var user = "Some user";

            objective.UpdateTitle("Some title", user);

            objective.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void UpdateTitle_ShouldAddObjectiveTitleUpdatedEvent()
        {
            var objective = ObjectiveObjectMother.Create();

            objective.UpdateTitle("title", "user");

            objective.ShouldContainSingleEvent<ObjectiveTitleUpdatedEvent>();
        }

        #endregion

        #region Update image url

        [TestMethod]
        public void UpdateImageUrl_ShouldThrowArgumentNullException_WhenUrlIsNull()
        {
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.UpdateImageUrl(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("imageUrl");
        }

        [TestMethod]
        public void UpdateImageUrl_ShouldThrowArgumentException_WhenUrlIsEmpty()
        {
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.UpdateImageUrl(String.Empty, ModifiedBy);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("imageUrl");
        }

        [TestMethod]
        public void UpdateImageUrl_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.UpdateImageUrl("Some url", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateImageUrl_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.UpdateImageUrl("Some url", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateImageUrl_ShouldUpdateImageUrl()
        {
            const string imageUrl = "new/image/url";
            var objective = ObjectiveObjectMother.Create();

            objective.UpdateImageUrl(imageUrl, ModifiedBy);

            objective.ImageUrl.Should().Be(imageUrl);
        }

        [TestMethod]
        public void UpdateImageUrl_ShouldUpdateMoidifiedBy()
        {
            var objective = ObjectiveObjectMother.Create();
            var user = "Some user";

            objective.UpdateImageUrl("Some url", user);

            objective.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void UpdateImageUrl_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var objective = ObjectiveObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            objective.UpdateImageUrl("url", ModifiedBy);

            objective.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateImageUrl_ShouldAddObjectiveImageUrlUpdatedEvent()
        {
            var objective = ObjectiveObjectMother.Create();

            objective.UpdateImageUrl("url", ModifiedBy);

            objective.ShouldContainSingleEvent<ObjectiveImageUrlUpdatedEvent>();
        }

        #endregion

        #region UpdateLearningObjective

        [TestMethod]
        public void UpdateLearningObjective_ShouldThrowArgumentOutOfRangeException_WhenLearningObjectiveIsLongerThan255()
        {
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.UpdateLearningObjective(new string('*', 256), ModifiedBy);

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("Learning objective");
        }

        [TestMethod]
        public void UpdateLearningObjective_ShouldUpdateLearningObjective()
        {
            const string learningObjective = "Learning objective";
            var objective = ObjectiveObjectMother.Create();

            objective.UpdateLearningObjective(learningObjective, ModifiedBy);

            objective.LearningObjective.Should().Be(learningObjective);
        }

        [TestMethod]
        public void UpdateLearningObjective_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var objective = ObjectiveObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            objective.UpdateLearningObjective("learningObjective", ModifiedBy);

            objective.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateLearningObjective_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.UpdateLearningObjective("learningObjective", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateLearningObjective_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.UpdateLearningObjective("learningObjective", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateLearningObjective_ShouldUpdateMoidifiedBy()
        {
            var objective = ObjectiveObjectMother.Create();
            var user = "Some user";

            objective.UpdateLearningObjective("learningObjective", user);

            objective.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void UpdateLearningObjective_ShouldAddObjectiveLearningObjectiveUpdatedEvent()
        {
            var objective = ObjectiveObjectMother.Create();

            objective.UpdateLearningObjective("title", "user");

            objective.ShouldContainSingleEvent<ObjectiveLearningObjectiveUpdatedEvent>();
        }

        #endregion

        #region Add question

        [TestMethod]
        public void AddQuestion_ShouldThrowArgumentNullException_WhenQuestionIsNull()
        {
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.AddQuestion(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("question");
        }

        [TestMethod]
        public void AddQuestion_ShouldAddQuestion()
        {
            var objective = ObjectiveObjectMother.Create();
            var question = SingleSelectTextObjectMother.Create();

            objective.AddQuestion(question, ModifiedBy);

            objective.Questions.Should().NotBeEmpty().And.HaveCount(1).And.Contain(question);
        }

        [TestMethod]
        public void AddQuestion_ShouldSetObjectiveToQuestion()
        {
            var objective = ObjectiveObjectMother.Create();
            var question = SingleSelectTextObjectMother.Create();

            objective.AddQuestion(question, ModifiedBy);

            question.Objective.Should().Be(objective);
        }

        [TestMethod]
        public void AddQuestion_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var objective = ObjectiveObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            objective.AddQuestion(SingleSelectTextObjectMother.Create(), ModifiedBy);

            objective.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void AddQuestion_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = SingleSelectTextObjectMother.Create();
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.AddQuestion(question, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddQuestion_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = SingleSelectTextObjectMother.Create();
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.AddQuestion(question, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddQuestion_ShouldUpdateMoidifiedBy()
        {
            var question = SingleSelectTextObjectMother.Create();
            var objective = ObjectiveObjectMother.Create();

            objective.AddQuestion(question, ModifiedBy);

            objective.ModifiedBy.Should().Be(ModifiedBy);
        }

        [TestMethod]
        public void AddQuestion_ShouldUpdateQuestionsOrder()
        {
            //Arrange
            var question1 = SingleSelectTextObjectMother.Create();
            var question2 = SingleSelectTextObjectMother.Create();
            var question3 = SingleSelectTextObjectMother.Create();
            var objective = ObjectiveObjectMother.Create();
            objective.QuestionsCollection = new Collection<Question>()
            {
                question3,
                question1
            };
            objective.QuestionsOrder = String.Format("{0},{1}", question1.Id, question3.Id);
            //Act
            objective.AddQuestion(question2, ModifiedBy);

            //Assert
            objective.QuestionsOrder.Should().Be(String.Format("{0},{1},{2}", question1.Id, question3.Id, question2.Id));
        }

        [TestMethod]
        public void AddQuestion_ShouldNotAddQuestion_WhenQuestionHasBeenAlreadyAdded()
        {
            //Arrange
            var question = SingleSelectTextObjectMother.Create();
            var objective = ObjectiveObjectMother.Create();
            objective.QuestionsCollection = new Collection<Question>()
            {
                question
            };

            //Act
            objective.AddQuestion(question, ModifiedBy);

            //Assert
            objective.QuestionsCollection.Count.Should().Be(1);
        }

        [TestMethod]
        public void AddQuestion_ShouldAddObjectiveTitleUpdatedEvent()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();
            objective.QuestionsCollection = new Collection<Question>();

            //Act
            objective.AddQuestion(SingleSelectTextObjectMother.Create(), ModifiedBy);

            //Assert
            objective.ShouldContainSingleEvent<QuestionCreatedEvent>();
        }

        #endregion

        #region Remove question

        [TestMethod]
        public void RemoveQuestion_ShouldThrowArgumentNullException_WhenQuestionIsNull()
        {
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.RemoveQuestion(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("question");
        }

        [TestMethod]
        public void RemoveQuestion_ShouldRemoveQuestion()
        {
            var objective = ObjectiveObjectMother.Create();
            var question = SingleSelectTextObjectMother.Create();

            objective.QuestionsCollection.Add(question);

            objective.RemoveQuestion(question, ModifiedBy);
            objective.Questions.Should().BeEmpty();
        }

        [TestMethod]
        public void RemoveQuestion_ShouldUnsetObjectiveFromQuestion()
        {
            var objective = ObjectiveObjectMother.Create();
            var question = SingleSelectTextObjectMother.Create();
            question.Objective = objective;

            objective.RemoveQuestion(question, ModifiedBy);

            question.Objective.Should().BeNull();
        }

        [TestMethod]
        public void RemoveQuestion_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var objective = ObjectiveObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            objective.RemoveQuestion(SingleSelectTextObjectMother.Create(), ModifiedBy);

            objective.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void RemoveQuestion_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = SingleSelectTextObjectMother.Create();
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.RemoveQuestion(question, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveQuestion_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = SingleSelectTextObjectMother.Create();
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.RemoveQuestion(question, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveQuestion_ShouldUpdateModifiedBy()
        {
            var question = SingleSelectTextObjectMother.Create();
            var objective = ObjectiveObjectMother.Create();

            objective.RemoveQuestion(question, ModifiedBy);

            objective.ModifiedBy.Should().Be(ModifiedBy);
        }

        [TestMethod]
        public void RemoveQuestion_ShouldUpdateQuestionsOrder()
        {
            //Arrange
            var question1 = SingleSelectTextObjectMother.Create();
            var question2 = SingleSelectTextObjectMother.Create();
            var question3 = SingleSelectTextObjectMother.Create();
            var objective = ObjectiveObjectMother.Create();
            objective.QuestionsCollection = new Collection<Question>()
            {
                question3,
                question1,
                question2
            };
            objective.QuestionsOrder = String.Format("{0},{1},{2}", question1.Id, question3.Id, question2.Id);
            //Act
            objective.RemoveQuestion(question2, ModifiedBy);

            //Assert
            objective.QuestionsOrder.Should().Be(String.Format("{0},{1}", question1.Id, question3.Id));
        }

        [TestMethod]
        public void RemoveQuestion_ShouldAddQuestionsDeletedEvent()
        {
            var question = SingleSelectTextObjectMother.Create();
            var objective = ObjectiveObjectMother.Create();

            objective.RemoveQuestion(question, ModifiedBy);

            objective.ShouldContainSingleEvent<QuestionsDeletedEvent>();
        }

        #endregion

        #region Define createdBy

        [TestMethod]
        public void DefineCreatedBy_ShouldThrowArgumentNullException_WhenCreatedByIsNull()
        {
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.DefineCreatedBy(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("createdBy");
        }

        [TestMethod]
        public void DefineCreatedBy_ShouldThrowArgumentException_WhenCreatedByIsEmpty()
        {
            var objective = ObjectiveObjectMother.Create();

            Action action = () => objective.DefineCreatedBy(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("createdBy");
        }


        [TestMethod]
        public void DefineCreatedBy_ShouldUpdateCreatedBy()
        {
            const string createdBy = "createdBy";
            const string updatedCreatedBy = "updatedCreatedBy";
            var objective = ObjectiveObjectMother.CreateWithCreatedBy(createdBy);

            objective.DefineCreatedBy(updatedCreatedBy);

            objective.CreatedBy.Should().Be(updatedCreatedBy);
        }

        [TestMethod]
        public void DefineCreatedBy_ShouldUpdateModifiedBy()
        {
            const string createdBy = "createdBy";
            const string updatedCreatedBy = "updatedCreatedBy";
            var objective = ObjectiveObjectMother.CreateWithCreatedBy(createdBy);

            objective.DefineCreatedBy(updatedCreatedBy);

            objective.ModifiedBy.Should().Be(updatedCreatedBy);
        }

        #endregion

        #region UpdateQuestionsOrder

        [TestMethod]
        public void UpdateQuestionsOrder_ShouldThrowArgumentNullException_WhenQuestionsIsNull()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();

            //Act
            Action action = () => objective.UpdateQuestionsOrder(null, ModifiedBy);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("questions");
        }

        [TestMethod]
        public void UpdateQuestionsOrder_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();

            //Act
            Action action = () => objective.UpdateQuestionsOrder(new List<Question>(), null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateQuestionsOrder_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();

            //Act
            Action action = () => objective.UpdateQuestionsOrder(new List<Question>(), "");

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateQuestionsOrder_ShouldSetQuestionsOrderToNull_WhenQuestionsIsEmpty()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();

            //Act
            objective.UpdateQuestionsOrder(new List<Question>(), ModifiedBy);

            //Assert
            objective.QuestionsOrder.Should().BeNull();
        }

        [TestMethod]
        public void UpdateQuestionsOrder_ShouldSetQuestionsOrder()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();
            var questions = new List<Question>()
            {
                SingleSelectTextObjectMother.Create(),
                SingleSelectTextObjectMother.Create()
            };

            objective.QuestionsCollection = questions;

            //Act
            objective.UpdateQuestionsOrder(questions, ModifiedBy);

            //Assert
            objective.QuestionsOrder.Should().Be(String.Format("{0},{1}", questions[0].Id, questions[1].Id));
        }

        [TestMethod]
        public void UpdateQuestionsOrder_ShouldAddQuestionsReorderedEvent()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();

            //Act
            objective.UpdateQuestionsOrder(new List<Question>(), ModifiedBy);

            //Assert
            objective.ShouldContainSingleEvent<QuestionsReorderedEvent>();
        }

        #endregion

        #region Questions

        [TestMethod]
        public void Questions_ShouldReturnListOfQuestionsInCorrectOrder()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();
            var question1 = SingleSelectTextObjectMother.Create();
            var question2 = SingleSelectTextObjectMother.Create();

            objective.QuestionsCollection = new List<Question>()
            {
                question1,
                question2
            };
            objective.QuestionsOrder = String.Format("{0},{1}", question2.Id, question1.Id);

            //Act
            var result = objective.Questions;

            //Assert
            result.First().Should().Be(question2);
        }

        [TestMethod]
        public void Questions_ShouldReturnAllQuestions_WhenOrderedCollectionIsNotFull()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();
            var question1 = SingleSelectTextObjectMother.Create();
            var question2 = SingleSelectTextObjectMother.Create();

            objective.QuestionsCollection = new List<Question>()
            {
                question1,
                question2
            };
            objective.QuestionsOrder = question2.Id.ToString();

            //Act
            var result = objective.Questions;

            //Assert
            result.Count().Should().Be(2);
            result.First().Should().Be(question2);
        }

        [TestMethod]
        public void Questions_ShouldReturnAllQuestions_WhenOrderedCollectionIsOverfull()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();
            var question1 = SingleSelectTextObjectMother.Create();
            var question2 = SingleSelectTextObjectMother.Create();

            objective.QuestionsCollection = new List<Question>()
            {
                question1
            };
            objective.QuestionsOrder = String.Format("{0},{1}", question2.Id, question1.Id);
            ;

            //Act
            var result = objective.Questions;

            //Assert
            result.Count().Should().Be(1);
            result.First().Should().Be(question1);
        }

        #endregion

        #region OrderClonedQuestions

        [TestMethod]
        public void OrderClonedQuestions_ShouldReturnNull_IfClonedQuestionsAreNull()
        {
            var objective = ObjectiveObjectMother.Create();

            var result = objective.OrderClonedQuestions(null);
            result.Should().BeNull();
        }

        [TestMethod]
        public void OrderClonedQuestions_ShouldThrowArgumentException_IfLengthOfQuestionCollectionsAreDifferent()
        {
            var objective = ObjectiveObjectMother.Create();
            Action action = () => objective.OrderClonedQuestions(new Collection<Question> { SingleSelectTextObjectMother.Create() });
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("clonedQuestions");
        }

        [TestMethod]
        public void OrderClonedQuestions_ShouldOrderClonedQuestionsAccordingToObjectiveQuestions()
        {
            var question1 = SingleSelectTextObjectMother.Create("question 1");
            var question2 = MultipleselectObjectMother.Create("question 2");
            var question3 = MultipleselectObjectMother.Create("question 3");

            var clonedQuestion1 = SingleSelectTextObjectMother.Create("cloned question 1");
            var clonedQuestion2 = MultipleselectObjectMother.Create("cloned question 2");
            var clonedQuestion3 = MultipleselectObjectMother.Create("cloned question 3");

            var objective = ObjectiveObjectMother.Create();
            objective.AddQuestion(question1, "owner");
            objective.AddQuestion(question2, "owner");
            objective.AddQuestion(question3, "owner");

            objective.UpdateQuestionsOrder(new Collection<Question> { question3, question1, question2 }, "owner");
            var result = objective.OrderClonedQuestions(new Collection<Question> { clonedQuestion1, clonedQuestion2, clonedQuestion3 });

            result[0].Should().Be(clonedQuestion3);
            result[1].Should().Be(clonedQuestion1);
            result[2].Should().Be(clonedQuestion2);
        }
        #endregion
    }
}
