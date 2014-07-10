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
using NSubstitute.Core;

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
            var question = MultiplechoiceObjectMother.CreateWithTitle("question title");
            var clonedQuestion = _cloner.Clone(question, "owner");
            clonedQuestion.Title.Should().Be("question title");
        }

        [TestMethod]
        public void Clone_ShouldUpdateQuestionOrderForObjective()
        {
            var question = MultiplechoiceObjectMother.CreateWithTitle("question title 1");
            var question2 = MultiplechoiceObjectMother.CreateWithTitle("question title 2");
            var question3 = MultiplechoiceObjectMother.CreateWithTitle("question title 3");

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
            var courseTemplateSettings = CourseTemplateSettingsObjectMother.Create(course, template, "settings");

            var clonedSettings = _cloner.Clone(courseTemplateSettings, "owner");

            clonedSettings.Template.Should().Be(template);
        }
    }
}
