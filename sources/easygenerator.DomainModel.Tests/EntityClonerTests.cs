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
            var objective = ObjectiveObjectMother.Create();
            Action action = () => _cloner.Clone(objective);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("args");
        }

        [TestMethod]
        public void Clone_ShouldUpdateClonedEntityWithNewId()
        {
            var objective = ObjectiveObjectMother.Create();
            var clonedObjective = _cloner.Clone(objective, "owner");

            clonedObjective.Id.Should().NotBe(objective.Id);
        }

        [TestMethod]
        public void Clone_ShouldUpdateClonedEntityWithNewCreatedByValue()
        {
            var objective = ObjectiveObjectMother.Create(createdBy: "creator");
            var clonedObjective = _cloner.Clone(objective, "owner");

            clonedObjective.CreatedBy.Should().Be("owner");
        }


        [TestMethod]
        public void Clone_ShouldUpdateClonedEntityWithNewModifiedByValue()
        {
            var objective = ObjectiveObjectMother.Create(createdBy: "creator");
            var clonedObjective = _cloner.Clone(objective, "owner");

            clonedObjective.ModifiedBy.Should().Be("owner");
        }

        [TestMethod]
        public void Clone_ShouldUpdateClonedEntityWithNewModifiedOnValue()
        {
            var objective = ObjectiveObjectMother.Create(createdBy: "creator");
            var clonedObjective = _cloner.Clone(objective, "owner");

            clonedObjective.ModifiedOn.Should().Be(_currentDate);
        }

        [TestMethod]
        public void Clone_ShouldUpdateClonedEntityWithNewCreatedOnValue()
        {
            var objective = ObjectiveObjectMother.Create(createdBy: "creator");
            var clonedObjective = _cloner.Clone(objective, "owner");

            clonedObjective.CreatedOn.Should().Be(_currentDate);
        }

        [TestMethod]
        public void Clone_ShouldClonePrivateFieldsOfParentEntities()
        {
            var question = SingleSelectTextObjectMother.CreateWithTitle("question title");
            var clonedQuestion = _cloner.Clone(question, "owner");
            clonedQuestion.Title.Should().Be("question title");
        }

        [TestMethod]
        public void Clone_ShouldUpdateQuestionOrderForObjective()
        {
            var question = SingleSelectTextObjectMother.CreateWithTitle("question title 1");
            var question2 = SingleSelectTextObjectMother.CreateWithTitle("question title 2");
            var question3 = SingleSelectTextObjectMother.CreateWithTitle("question title 3");

            var objective = ObjectiveObjectMother.Create();
            objective.AddQuestion(question2, "owner");
            objective.AddQuestion(question, "owner");
            objective.AddQuestion(question3, "owner");
            objective.UpdateQuestionsOrder(new Collection<Question> { question3, question, question2 }, "owner");

            var clonedObjective = _cloner.Clone(objective, "owner");
            clonedObjective.Questions.ElementAt(0).Title.Should().Be("question title 3");
            clonedObjective.Questions.ElementAt(1).Title.Should().Be("question title 1");
            clonedObjective.Questions.ElementAt(2).Title.Should().Be("question title 2");
        }

        [TestMethod]
        public void Clone_ShouldUpdateLearningContentsOrderForQyestion()
        {
            var learningContent = LearningContentObjectMother.CreateWithText("learning content 1");
            var learningContent2 = LearningContentObjectMother.CreateWithText("learning content 2");
            var learningContent3 = LearningContentObjectMother.CreateWithText("learning content 3");

            var question = SingleSelectImageObjectMother.Create();
            question.AddLearningContent(learningContent2, "owner");
            question.AddLearningContent(learningContent, "owner");
            question.AddLearningContent(learningContent3, "owner");
            question.UpdateLearningContentsOrder(new Collection<LearningContent> { learningContent3, learningContent, learningContent2 }, "owner");

            var clonedQuestion = _cloner.Clone(question, "owner");
            clonedQuestion.LearningContents.ElementAt(0).Text.Should().Be("learning content 3");
            clonedQuestion.LearningContents.ElementAt(1).Text.Should().Be("learning content 1");
            clonedQuestion.LearningContents.ElementAt(2).Text.Should().Be("learning content 2");
        }

        [TestMethod]
        public void Clone_ShouldNotCloneCourseWhenCloneObjective()
        {
            var course = CourseObjectMother.Create();
            var objective = ObjectiveObjectMother.Create();
            objective.RelatedCoursesCollection.Add(course);

            var clonedObjective = _cloner.Clone(objective, "owner");
            clonedObjective.RelatedCoursesCollection.Should().BeNull();
        }


        [TestMethod]
        public void Clone_ShouldUpdateObjectivesOrderForCourse()
        {
            var objective1 = ObjectiveObjectMother.Create("objective title 1");
            var objective2 = ObjectiveObjectMother.Create("objective title 2");
            var objective3 = ObjectiveObjectMother.Create("objective title 3");

            var course = CourseObjectMother.Create();
            course.RelateObjective(objective1, null, "owner");
            course.RelateObjective(objective2, null, "owner");
            course.RelateObjective(objective3, null, "owner");

            course.UpdateObjectivesOrder(new Collection<Objective> { objective3, objective1, objective2 }, "owner");

            var clonedCourse = _cloner.Clone(course, "owner");
            clonedCourse.RelatedObjectives.ElementAt(0).Title.Should().Be("objective title 3");
            clonedCourse.RelatedObjectives.ElementAt(1).Title.Should().Be("objective title 1");
            clonedCourse.RelatedObjectives.ElementAt(2).Title.Should().Be("objective title 2");
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


        [TestMethod]
        public void Cloner_ShouldCloneCourseWithoutAim4YouIntegation()
        {
            var course = CourseObjectMother.Create();
            course.RegisterOnAim4YOu(Guid.NewGuid());
            var clonedCourse = _cloner.Clone(course, "owner");
            clonedCourse.Aim4YouIntegration.Should().BeNull();
        }
    }
}
