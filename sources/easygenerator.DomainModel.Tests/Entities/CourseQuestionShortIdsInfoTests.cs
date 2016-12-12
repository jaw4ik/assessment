using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class CourseQuestionShortIdsInfoTests
    {
        [TestInitialize]
        public void InitializeContext()
        {
        }

        #region Constructor

        [TestMethod]
        public void CourseQuestionShortIdsInfo_ShouldThrowArgumentNullException_WhenCourseIsNull()
        {
            Action action = () => CourseQuestionShortIdsInfoObjectMother.Create(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("course");
        }

        [TestMethod]
        public void CourseQuestionShortIdsInfo_ShouldCreateCourseQuestionShortIdsInfoInstance()
        {
            const string shortIds = "shortIds";
            var course = CourseObjectMother.Create();
            var info = CourseQuestionShortIdsInfoObjectMother.Create(course, shortIds);

            info.Course.Should().Be(course);
            info.Course_Id.Should().Be(course.Id);
            info.QuestionShortIds.Should().Be(shortIds);
        }

        #endregion

        #region GetShortIds
        [TestMethod]
        public void GetShortIds_WhenQuestionShortIdsIsNull_ShouldReturnEmptyHashtable()
        {
            var course = CourseObjectMother.Create();
            var info = CourseQuestionShortIdsInfoObjectMother.Create(course);

            var result = info.GetShortIds();
            result.Count.Should().Be(0);
        }

        [TestMethod]
        public void GetShortIds_WhenQuestionShortIdsIsValidJsonString_ShouldReturnHashtable()
        {
            var course = CourseObjectMother.Create();
            var info = CourseQuestionShortIdsInfoObjectMother.Create(course, "{\"key\":2}");

            var result = info.GetShortIds();
            result.Count.Should().Be(1);
            result["key"].Should().Be(2);
        }

        [TestMethod]
        public void GetShortIds_WhenQuestionShortIdsIsNotValidJsonString_ShouldThrowException()
        {
            var course = CourseObjectMother.Create();
            var info = CourseQuestionShortIdsInfoObjectMother.Create(course, "some string");
            
            Action action = () => info.GetShortIds();

            action.ShouldThrow<Exception>();
        }

        #endregion

        #region Refresh
        [TestMethod]
        public void Refresh_WhenShortIdsAreNull_ShouldSaveQuestionShortIds()
        {
            var question = MultipleselectObjectMother.Create("QuestionTitle");

            var section = SectionObjectMother.Create("SectionTitle");
            section.AddQuestion(question, "SomeUser");

            var course = CourseObjectMother.Create("CourseTitle");
            course.RelateSection(section, null, "SomeUser");

            var info = CourseQuestionShortIdsInfoObjectMother.Create(course);

            info.Refresh();
            var results = info.GetShortIds();

            results.Count.Should().Be(2);
            results[question.Id.ToString("N")].Should().Be(0);
            results[CourseQuestionShortIdsInfo.NextAvailableIndex].Should().Be(1);
        }

        [TestMethod]
        public void Refresh_WhenShortIdsContainQuestionsAndNewQuestionIsAdded_ShouldUpdateQuestionShortIds()
        {
            var course = CourseObjectMother.Create("CourseTitle");
            var question1 = MultipleselectObjectMother.Create("QuestionTitle1");
            var section = SectionObjectMother.Create("SectionTitle");

            section.AddQuestion(question1, "SomeUser");
            course.RelateSection(section, null, "SomeUser");

            var shortIds = "{\"" + CourseQuestionShortIdsInfo.NextAvailableIndex + "\":5,\"" + question1.Id.ToString("N") + "\":2" + "}";
            var info = CourseQuestionShortIdsInfoObjectMother.Create(course, shortIds);
            
            var question2 = MultipleselectObjectMother.Create("QuestionTitle2");
            section.AddQuestion(question2, "SomeUser");
            
            info.Refresh();
            var results = info.GetShortIds();

            results.Count.Should().Be(3);
            results[question1.Id.ToString("N")].Should().Be(2);
            results[question2.Id.ToString("N")].Should().Be(5);
            results[CourseQuestionShortIdsInfo.NextAvailableIndex].Should().Be(6);
        }

        [TestMethod]
        public void Refresh_WhenShortIdsContainQuestionsAndQuestionIsRemoved_ShouldUpdateQuestionShortIds()
        {
            var course = CourseObjectMother.Create("CourseTitle");

            var shortIds = "{\"" + CourseQuestionShortIdsInfo.NextAvailableIndex + "\":5,\"testId\":2" + "}";
            var info = CourseQuestionShortIdsInfoObjectMother.Create(course, shortIds);
            
            info.Refresh();
            var results = info.GetShortIds();

            results.Count.Should().Be(1);
            results[CourseQuestionShortIdsInfo.NextAvailableIndex].Should().Be(5);
        }

        #endregion
    }
}
