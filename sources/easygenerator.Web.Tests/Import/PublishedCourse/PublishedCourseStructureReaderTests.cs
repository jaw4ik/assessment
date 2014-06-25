using System;
using easygenerator.Web.Import.PublishedCourse;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json.Linq;

namespace easygenerator.Web.Tests.Import.PublishedCourse
{
    [TestClass]
    public class PublishedCourseStructureReaderTests
    {
        private PublishedCourseStructureReader _courseStructure;

        [TestInitialize]
        public void InitializeContext()
        {
            _courseStructure = new PublishedCourseStructureReader();
        }

        #region GetObjectives

        [TestMethod]
        public void GetObjectives_ShouldReturnObjectiveIds()
        {
            //Arrange
            var objectiveId = Guid.NewGuid();

            var data = JObject.Parse(String.Format("{{ objectives: [ {{ id: '{0}' }} ] }}", objectiveId.ToString("N").ToLower()));

            //Act
            var objectiveIds = _courseStructure.GetObjectives(data);

            //Assert
            objectiveIds.Should().Contain(objectiveId);
        }

        #endregion

        #region GetQuestions

        [TestMethod]
        public void GetQuestions_ShouldReturnQuestionIds()
        {
            //Arrange
            var objectiveId = Guid.NewGuid();
            var questionId = Guid.NewGuid();

            var data = JObject.Parse(String.Format("{{ objectives: [ {{ id: '{0}', questions: [ {{ id: '{1}' }} ] }} ] }}",
                objectiveId.ToString("N").ToLower(),
                questionId.ToString("N").ToLower()));

            //Act
            var questionIds = _courseStructure.GetQuestions(objectiveId, data);

            //Assert
            questionIds.Should().Contain(questionId);
        }

        #endregion

        #region GetLearningContents

        [TestMethod]
        public void GetLearningContents_ShouldReturnLearningContentIds()
        {
            //Arrange
            var questionId = Guid.NewGuid();
            var learningContentId = Guid.NewGuid();

            var data = JObject.Parse(String.Format("{{ objectives: [ {{ questions: [ {{ id: '{0}' , learningContents: [ {{ id: '{1}' }} ] }} ] }} ] }}",
                questionId.ToString("N").ToLower(),
                learningContentId.ToString("N").ToLower()));

            //Act
            var learningContentIds = _courseStructure.GetLearningContents(questionId, data);

            //Assert
            learningContentIds.Should().Contain(learningContentId);
        }

        #endregion

        #region GetAnswers

        [TestMethod]
        public void GetAnswers_ShouldReturnAnswerIds()
        {
            //Arrange
            var questionId = Guid.NewGuid();
            var answerId = Guid.NewGuid();

            var data = JObject.Parse(String.Format("{{ objectives: [ {{ questions: [ {{ id: '{0}' , answers: [ {{ id: '{1}' }} ] }} ] }} ] }}",
                questionId.ToString("N").ToLower(),
                answerId.ToString("N").ToLower()));

            //Act
            var answerIds = _courseStructure.GetAnswers(questionId, data);

            //Assert
            answerIds.Should().Contain(answerId);
        }

        #endregion

    }
}
