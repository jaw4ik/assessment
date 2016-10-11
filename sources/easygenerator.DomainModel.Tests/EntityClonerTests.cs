using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Clonning;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace easygenerator.DomainModel.Tests
{
    [TestClass]
    public class EntityClonerTests
    {
        private ICloner _cloner;
        private readonly DateTime _currentDate = new DateTime(2014, 3, 19);

        [TestInitialize]
        public void Initialize()
        {
            DateTimeWrapper.Now = () => _currentDate;
            _cloner = new EntityCloner();
        }

        [TestMethod]
        public void Clone_ShouldUpdateClonedEntityWithNewId1()
        {
            var section = SectionObjectMother.Create();
            Action action = () => _cloner.Clone(section);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("args");
        }

        [TestMethod]
        public void Clone_ShouldUpdateClonedEntityWithNewId()
        {
            var section = SectionObjectMother.Create();
            var clonedSection = _cloner.Clone(section, "owner");

            clonedSection.Id.Should().NotBe(section.Id);
        }

        [TestMethod]
        public void Clone_ShouldUpdateClonedEntityWithNewCreatedByValue()
        {
            var section = SectionObjectMother.Create(createdBy: "creator");
            var clonedSection = _cloner.Clone(section, "owner");

            clonedSection.CreatedBy.Should().Be("owner");
        }


        [TestMethod]
        public void Clone_ShouldUpdateClonedEntityWithNewModifiedByValue()
        {
            var section = SectionObjectMother.Create(createdBy: "creator");
            var clonedSection = _cloner.Clone(section, "owner");

            clonedSection.ModifiedBy.Should().Be("owner");
        }

        [TestMethod]
        public void Clone_ShouldUpdateClonedEntityWithNewModifiedOnValue()
        {
            var section = SectionObjectMother.Create(createdBy: "creator");
            var clonedSection = _cloner.Clone(section, "owner");

            clonedSection.ModifiedOn.Should().Be(_currentDate);
        }

        [TestMethod]
        public void Clone_ShouldUpdateClonedEntityWithNewCreatedOnValue()
        {
            var section = SectionObjectMother.Create(createdBy: "creator");
            var clonedSection = _cloner.Clone(section, "owner");

            clonedSection.CreatedOn.Should().Be(_currentDate);
        }

        [TestMethod]
        public void Clone_ShouldClonePrivateFieldsOfParentEntities()
        {
            var question = SingleSelectTextObjectMother.CreateWithTitle("question title");
            var clonedQuestion = _cloner.Clone(question, "owner");
            clonedQuestion.Title.Should().Be("question title");
        }

        [TestMethod]
        public void Clone_ShouldUpdateQuestionOrderForSection()
        {
            var question = SingleSelectTextObjectMother.CreateWithTitle("question title 1");
            var question2 = SingleSelectTextObjectMother.CreateWithTitle("question title 2");
            var question3 = SingleSelectTextObjectMother.CreateWithTitle("question title 3");

            var section = SectionObjectMother.Create();
            section.AddQuestion(question2, "owner");
            section.AddQuestion(question, "owner");
            section.AddQuestion(question3, "owner");
            section.UpdateQuestionsOrder(new Collection<Question> { question3, question, question2 }, "owner");

            var clonedSection = _cloner.Clone(section, "owner");
            clonedSection.Questions.ElementAt(0).Title.Should().Be("question title 3");
            clonedSection.Questions.ElementAt(1).Title.Should().Be("question title 1");
            clonedSection.Questions.ElementAt(2).Title.Should().Be("question title 2");
        }

        [TestMethod]
        public void Clone_ShouldUpdateAnswersOrderForRankingTextQuestion()
        {
            var answer = RankingTextAnswerObjectMother.CreateWithText("answer 1");
            var answer2 = RankingTextAnswerObjectMother.CreateWithText("answer 2");
            var answer3 = RankingTextAnswerObjectMother.CreateWithText("answer 3");

            var question = RankingTextObjectMother.Create();
            question.AddAnswer(answer2, "owner");
            question.AddAnswer(answer, "owner");
            question.AddAnswer(answer3, "owner");
            question.UpdateAnswersOrder(new Collection<RankingTextAnswer> { answer3, answer, answer2 }, "owner");

            var clonedQuestion = _cloner.Clone(question, "owner");
            clonedQuestion.Answers.ElementAt(0).Text.Should().Be("answer 3");
            clonedQuestion.Answers.ElementAt(1).Text.Should().Be("answer 1");
            clonedQuestion.Answers.ElementAt(2).Text.Should().Be("answer 2");
        }

        [TestMethod]
        public void Clone_ShouldNotCloneCourseWhenCloneSection()
        {
            var course = CourseObjectMother.Create();
            var section = SectionObjectMother.Create();
            section.RelatedCoursesCollection.Add(course);

            var clonedSection = _cloner.Clone(section, "owner");
            clonedSection.RelatedCoursesCollection.Should().BeNull();
        }


        [TestMethod]
        public void Clone_ShouldUpdateSectionsOrderForCourse()
        {
            var section1 = SectionObjectMother.Create("section title 1");
            var section2 = SectionObjectMother.Create("section title 2");
            var section3 = SectionObjectMother.Create("section title 3");

            var course = CourseObjectMother.Create();
            course.RelateSection(section1, null, "owner");
            course.RelateSection(section2, null, "owner");
            course.RelateSection(section3, null, "owner");

            course.UpdateSectionsOrder(new Collection<Section> { section3, section1, section2 }, "owner");

            var clonedCourse = _cloner.Clone(course, "owner");
            clonedCourse.RelatedSections.ElementAt(0).Title.Should().Be("section title 3");
            clonedCourse.RelatedSections.ElementAt(1).Title.Should().Be("section title 1");
            clonedCourse.RelatedSections.ElementAt(2).Title.Should().Be("section title 2");
        }

        [TestMethod]
        public void Clone_ShouldSetBuildOnCoursePropertyToNull()
        {
            var course = CourseObjectMother.Create();
            course.UpdatePackageUrl("url");

            var clonedCourse = _cloner.Clone(course, "owner");

            clonedCourse.BuildOn.Should().Be(null);
        }

        [TestMethod]
        public void Clone_ShouldSetPackageUrlCoursePropertyToNull()
        {
            var course = CourseObjectMother.Create();
            course.UpdatePackageUrl("url");

            var clonedCourse = _cloner.Clone(course, "owner");
            clonedCourse.PackageUrl.Should().Be(null);
        }

        [TestMethod]
        public void Clone_ShouldSetPublishedOnCoursePropertyToNull()
        {
            var course = CourseObjectMother.Create();
            course.UpdatePublicationUrl("url");

            var clonedCourse = _cloner.Clone(course, "owner");
            clonedCourse.PublishedOn.Should().Be(null);
        }

        [TestMethod]
        public void Clone_ShouldSetPublicationUrlCoursePropertyToNull()
        {
            var course = CourseObjectMother.Create();
            course.UpdatePublicationUrl("url");

            var clonedCourse = _cloner.Clone(course, "owner");
            clonedCourse.PublicationUrl.Should().Be(null);
        }

        [TestMethod]
        public void Clone_ShouldSetScormPackageUrlCoursePropertyToNull()
        {
            var course = CourseObjectMother.Create();
            course.UpdateScormPackageUrl("url");

            var clonedCourse = _cloner.Clone(course, "owner");
            clonedCourse.ScormPackageUrl.Should().Be(null);
        }

        [TestMethod]
        public void Clone_ShouldUseSmaeTemplateForCourse_ButNotCreteNewOne()
        {
            var course = CourseObjectMother.Create();
            var template = TemplateObjectMother.Create();
            course.UpdateTemplate(template, "owner");
            var clonedCourse = _cloner.Clone(course, "owner");

            clonedCourse.Template.Should().Be(template);
        }

        [TestMethod]
        public void Clone_ShouldUseSmaeTemplateForCourseTemplateSettings_ButNotCreteNewOne()
        {
            var course = CourseObjectMother.Create();
            var template = TemplateObjectMother.Create();
            var courseTemplateSettings = CourseTemplateSettingsObjectMother.Create(course, template, "settings", "extra data");

            var clonedSettings = _cloner.Clone(courseTemplateSettings, "owner");

            clonedSettings.Template.Should().Be(template);
        }

        [TestMethod]
        public void Cloner_ShouldIgnoreCourseComments()
        {
            var course = CourseObjectMother.Create();

            course.AddComment(CommentObjectMother.Create());
            course.AddComment(CommentObjectMother.Create());

            var clonedCourse = _cloner.Clone(course, "owner");
            clonedCourse.Comments.Count().Should().Be(0);
        }

        [TestMethod]
        public void Cloner_ShouldIgnoreCourseCollaborators()
        {
            var course = CourseObjectMother.Create();

            course.Collaborate("collaborator1@example.com", "cratedBy");
            course.Collaborate("collaborator2@example.com", "cratedBy");

            var clonedCourse = _cloner.Clone(course, "owner");
            clonedCourse.Collaborators.Count().Should().Be(0);
        }

        [TestMethod]
        public void Cloner_ShouldIgnoreCourseTemplateSettingsIfNotSpecifiedInArgs()
        {
            var course = CourseObjectMother.Create();
            var template = TemplateObjectMother.Create();
            course.SaveTemplateSettings(template, "settings", null);

            var clonedCourse = _cloner.Clone(course, "owner");
            clonedCourse.GetTemplateSettings(template).Should().Be(null);
        }

        [TestMethod]
        public void Cloner_ShouldCloneCourseTemplateSettingsIfSpecifiedInArgs()
        {
            var course = CourseObjectMother.Create();
            var template = TemplateObjectMother.Create();
            course.SaveTemplateSettings(template, "settings", null);

            var clonedCourse = _cloner.Clone(course, "owner", true);
            clonedCourse.GetTemplateSettings(template).Should().Be("settings");
        }

        [TestMethod]
        public void Cloner_ShouldUpdateCreateOnWithCurrentDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var course = CourseObjectMother.Create();
            DateTimeWrapper.Now = () => DateTime.MaxValue;
            var clonedCourse = _cloner.Clone(course, "owner");
            clonedCourse.CreatedOn.Should().Be(DateTime.MaxValue);
        }
    }
}
