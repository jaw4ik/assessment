using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events.SectionEvents;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.DomainModel.Events.QuestionEvents.RankingTextEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.DomainModel.Tests.Utils;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities.Questions
{

    [TestClass]
    public class RankingTextTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        private readonly DateTime _currentDate = new DateTime(2014, 3, 19);

        [TestInitialize]
        public void InitializeContext()
        {
            DateTimeWrapper.Now = () => _currentDate;
        }

        #region Add answer

        [TestMethod]
        public void AddAnswer_ShouldThrowArgumentNullException_WhenAnswerIsNull()
        {
            var rankingText = RankingTextObjectMother.Create();

            Action action = () => rankingText.AddAnswer(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("answer");
        }

        [TestMethod]
        public void AddAnswer_ShouldAddAnswer()
        {
            var rankingText = RankingTextObjectMother.Create();
            var answer = RankingTextAnswerObjectMother.Create();

            rankingText.AddAnswer(answer, ModifiedBy);

            rankingText.Answers.Should().NotBeEmpty().And.HaveCount(1).And.Contain(answer);
        }

        [TestMethod]
        public void AddAnswer_ShouldSetQuestionToAnswer()
        {
            var rankingText = RankingTextObjectMother.Create();
            var answer = RankingTextAnswerObjectMother.Create();

            rankingText.AddAnswer(answer, ModifiedBy);

            answer.Question.Should().Be(rankingText);
        }

        [TestMethod]
        public void AddAnswer_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var rankingText = RankingTextObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            rankingText.AddAnswer(RankingTextAnswerObjectMother.Create(), ModifiedBy);

            rankingText.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void AddAnswer_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var rankingText = RankingTextObjectMother.Create();
            var answer = RankingTextAnswerObjectMother.Create();

            Action action = () => rankingText.AddAnswer(answer, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }


        [TestMethod]
        public void AddAnswer_ShouldUpdateAnswersOrder()
        {
            //Arrange
            var answer1 = RankingTextAnswerObjectMother.Create();
            var answer2 = RankingTextAnswerObjectMother.Create();
            var answer3 = RankingTextAnswerObjectMother.Create();
            var rankingText = RankingTextObjectMother.Create();
            rankingText.AnswersCollection = new Collection<RankingTextAnswer>()
            {
                answer3,
                answer1
            };
            rankingText.AnswersOrder = String.Format("{0},{1}", answer1.Id, answer3.Id);
            //Act
            rankingText.AddAnswer(answer2, ModifiedBy);

            //Assert
            rankingText.AnswersOrder.Should().Be(String.Format("{0},{1},{2}", answer1.Id, answer3.Id, answer2.Id));
        }

        [TestMethod]
        public void AddAnswer_ShouldNotAddAnswer_WhenAnswerHasBeenAlreadyAdded()
        {
            //Arrange
            var rankingText = RankingTextObjectMother.Create();
            var answer = RankingTextAnswerObjectMother.Create();
            rankingText.AnswersCollection = new Collection<RankingTextAnswer>()
            {
                answer
            };

            //Act
            rankingText.AddAnswer(answer, ModifiedBy);

            //Assert
            rankingText.AnswersCollection.Count.Should().Be(1);
        }

        [TestMethod]
        public void AddAnswer_ShouldRaiseRankingTextAnswerCreatedEvent()
        {
            //Arrange
            var rankingText = RankingTextObjectMother.Create();
            rankingText.AnswersCollection = new Collection<RankingTextAnswer>();

            //Act
            rankingText.AddAnswer(RankingTextAnswerObjectMother.Create(), ModifiedBy);

            //Assert
            rankingText.ShouldContainSingleEvent<RankingTextAnswerCreatedEvent>();
        }

        #endregion

        #region Delete answer

        [TestMethod]
        public void DeleteAnswer_ShouldThrowArgumentNullException_WhenAnswerIsNull()
        {
            var rankingText = RankingTextObjectMother.Create();

            Action action = () => rankingText.DeleteAnswer(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("answer");
        }

        [TestMethod]
        public void DeleteAnswer_ShouldDeleteAnswer()
        {
            var rankingText = RankingTextObjectMother.Create();
            var answer = RankingTextAnswerObjectMother.Create();

            rankingText.AnswersCollection.Add(answer);

            rankingText.DeleteAnswer(answer, ModifiedBy);
            rankingText.Answers.Should().BeEmpty();
        }

        [TestMethod]
        public void DeleteAnswer_ShouldUnsetQuestionFromAnswer()
        {
            var rankingText = RankingTextObjectMother.Create();
            var answer = RankingTextAnswerObjectMother.Create();
            answer.Question = rankingText;

            rankingText.DeleteAnswer(answer, ModifiedBy);

            answer.Question.Should().BeNull();
        }

        [TestMethod]
        public void DeleteAnswer_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var rankingText = RankingTextObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            rankingText.DeleteAnswer(RankingTextAnswerObjectMother.Create(), ModifiedBy);

            rankingText.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void DeleteAnswer_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var rankingText = RankingTextObjectMother.Create();
            var answer = RankingTextAnswerObjectMother.Create();

            Action action = () => rankingText.DeleteAnswer(answer, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void DeleteAnswer_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var rankingText = RankingTextObjectMother.Create();
            var answer = RankingTextAnswerObjectMother.Create();

            Action action = () => rankingText.DeleteAnswer(answer, String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void DeleteAnswer_ShouldUpdateModifiedBy()
        {
            var rankingText = RankingTextObjectMother.Create();
            var answer = RankingTextAnswerObjectMother.Create();

            rankingText.DeleteAnswer(answer, ModifiedBy);

            rankingText.ModifiedBy.Should().Be(ModifiedBy);
        }

        [TestMethod]
        public void DeleteAnswer_ShouldUpdateAnswersOrder()
        {
            //Arrange
            var answer1 = RankingTextAnswerObjectMother.Create();
            var answer2 = RankingTextAnswerObjectMother.Create();
            var answer3 = RankingTextAnswerObjectMother.Create();
            var rankingText = RankingTextObjectMother.Create();
            rankingText.AnswersCollection = new Collection<RankingTextAnswer>()
            {
                answer3,
                answer1,
                answer2
            };
            rankingText.AnswersOrder = String.Format("{0},{1},{2}", answer1.Id, answer3.Id, answer2.Id);
            //Act
            rankingText.DeleteAnswer(answer2, ModifiedBy);

            //Assert
            rankingText.AnswersOrder.Should().Be(string.Format("{0},{1}", answer1.Id, answer3.Id));
        }

        [TestMethod]
        public void DeleteAnswer_ShouldReiseRankingTextAnswerDeletedEvent()
        {
            var rankingText = RankingTextObjectMother.Create();
            var answer = RankingTextAnswerObjectMother.Create();

            rankingText.DeleteAnswer(answer, ModifiedBy);

            rankingText.ShouldContainSingleEvent<RankingTextAnswerDeletedEvent>();
        }

        #endregion

        #region UpdateAnswersOrder

        [TestMethod]
        public void UpdateAnswersOrder_ShouldThrowArgumentNullException_WhenAnswersIsNull()
        {
            //Arrange
            var rankingText = RankingTextObjectMother.Create();

            //Act
            Action action = () => rankingText.UpdateAnswersOrder(null, ModifiedBy);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("answers");
        }

        [TestMethod]
        public void UpdateAnswersOrder_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            //Arrange
            var rankingText = RankingTextObjectMother.Create();

            //Act
            Action action = () => rankingText.UpdateAnswersOrder(new List<RankingTextAnswer>(), null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateAnswersOrder_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            //Arrange
            var rankingText = RankingTextObjectMother.Create();

            //Act
            Action action = () => rankingText.UpdateAnswersOrder(new List<RankingTextAnswer>(), String.Empty);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateAnswersOrder_ShouldSetAnswersOrderToNull_WhenAnswersIsEmpty()
        {
            //Arrange
            var rankingText = RankingTextObjectMother.Create();

            //Act
            rankingText.UpdateAnswersOrder(new List<RankingTextAnswer>(), ModifiedBy);

            //Assert
            rankingText.AnswersOrder.Should().BeNull();
        }

        [TestMethod]
        public void UpdateAnswersOrder_ShouldSetAnswersOrder()
        {
            //Arrange
            var rankingText = RankingTextObjectMother.Create();
            var answers = new List<RankingTextAnswer>()
            {
                RankingTextAnswerObjectMother.Create(),
                RankingTextAnswerObjectMother.Create()
            };

            rankingText.AnswersCollection = answers;

            //Act
            rankingText.UpdateAnswersOrder(answers, ModifiedBy);

            //Assert
            rankingText.AnswersOrder.Should().Be(String.Format("{0},{1}", answers[0].Id, answers[1].Id));
        }

        [TestMethod]
        public void UpdateAnswersOrder_ShouldReiseAnswersReorderedEvent()
        {
            //Arrange
            var rankingText = RankingTextObjectMother.Create();

            //Act
            rankingText.UpdateAnswersOrder(new List<RankingTextAnswer>(), ModifiedBy);

            //Assert
            rankingText.ShouldContainSingleEvent<RankingTextAnswersReorderedEvent>();
        }

        #endregion

        #region OrderClonedAnswers

        [TestMethod]
        public void OrderClonedAnswers_ShouldReturnNull_IfClonedAnswersAreNull()
        {
            var question = RankingTextObjectMother.Create();

            var result = question.OrderClonedAnswers(null);
            result.Should().BeNull();
        }

        [TestMethod]
        public void OrderClonedAnswers_ShouldThrowArgumentException_IfLengthOfAnswersCollectionsAreDifferent()
        {
            var question = RankingTextObjectMother.Create();
            Action action = () => question.OrderClonedAnswers(new Collection<RankingTextAnswer> { RankingTextAnswerObjectMother.Create() });
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("clonedAnswers");
        }

        [TestMethod]
        public void OrderClonedAnswers_ShouldOrderClonedAnswersAccordingToQuestionAnswers()
        {
            var answer = RankingTextAnswerObjectMother.Create("answer 1");
            var answer2 = RankingTextAnswerObjectMother.Create("answer 2");
            var answer3 = RankingTextAnswerObjectMother.Create("answer 3");

            var clonedAnswer = RankingTextAnswerObjectMother.Create("cloned answer 1");
            var clonedAnswer2 = RankingTextAnswerObjectMother.Create("cloned answer 2");
            var clonedAnswer3 = RankingTextAnswerObjectMother.Create("cloned answer 3");

            var question = RankingTextObjectMother.Create();
            question.AddAnswer(answer, "owner");
            question.AddAnswer(answer2, "owner");
            question.AddAnswer(answer3, "owner");

            question.UpdateAnswersOrder(new Collection<RankingTextAnswer> { answer3, answer, answer2 }, "owner");
            var result = question.OrderClonedAnswers(new Collection<RankingTextAnswer> { clonedAnswer, clonedAnswer2, clonedAnswer3 });

            result[0].Should().Be(clonedAnswer3);
            result[1].Should().Be(clonedAnswer);
            result[2].Should().Be(clonedAnswer2);
        }
        #endregion 

        #region Answers

        [TestMethod]
        public void Answers_ShouldReturnListOfAnswersInCorrectOrder()
        {
            //Arrange
            var rankingText = RankingTextObjectMother.Create();
            var answer1 = RankingTextAnswerObjectMother.Create();
            var answer2 = RankingTextAnswerObjectMother.Create();

            rankingText.AnswersCollection = new List<RankingTextAnswer>()
            {
                answer1,
                answer2
            };
            rankingText.AnswersOrder = String.Format("{0},{1}", answer2.Id, answer1.Id);

            //Act
            var result = rankingText.Answers;

            //Assert
            result.First().Should().Be(answer2);
        }

        [TestMethod]
        public void Answers_ShouldReturnAllAnswers_WhenOrderedCollectionIsNotFull()
        {
            //Arrange
            var rankingText = RankingTextObjectMother.Create();
            var answer1 = RankingTextAnswerObjectMother.Create();
            var answer2 = RankingTextAnswerObjectMother.Create();

            rankingText.AnswersCollection = new List<RankingTextAnswer>()
            {
                answer1,
                answer2
            };
            rankingText.AnswersOrder = answer2.Id.ToString();

            //Act
            var result = rankingText.Answers;

            //Assert
            result.Count().Should().Be(2);
            result.First().Should().Be(answer2);
        }

        [TestMethod]
        public void Answers_ShouldReturnAllAnswers_WhenOrderedCollectionIsOverfull()
        {
            //Arrange
            var rankingText = RankingTextObjectMother.Create();
            var answer1 = RankingTextAnswerObjectMother.Create();
            var answer2 = RankingTextAnswerObjectMother.Create();

            rankingText.AnswersCollection = new List<RankingTextAnswer>()
            {
                answer1
            };
            rankingText.AnswersOrder = String.Format("{0},{1}", answer2.Id, answer1.Id);
            ;

            //Act
            var result = rankingText.Answers;

            //Assert
            result.Count().Should().Be(1);
            result.First().Should().Be(answer1);
        }

        #endregion
    }
}
