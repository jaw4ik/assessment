using System.Collections.ObjectModel;
using System.Linq;
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
            var question = MultiplechoiceObjectMother.CreateWithTitle("question title");
            var clonedQuestion = _cloner.Clone(question, "owner");
            clonedQuestion.Title.Should().Be("question title");
        }

        [TestMethod]
        public void Clone_ShouldUpdateQuestionOrderForObjective()
        {
            var question = MultiplechoiceObjectMother.CreateWithTitle("question title 1");
            var question2 = MultiplechoiceObjectMother.CreateWithTitle("question title 2");

            var objective = ObjectiveObjectMother.Create();
            objective.AddQuestion(question2, "owner");
            objective.AddQuestion(question, "owner");
            objective.UpdateQuestionsOrder(new Collection<Question> {question2, question}, "owner");

            var clonedObjective = _cloner.Clone(objective, "owner");
            clonedObjective.Questions.ElementAt(0).Title.Should().Be("question title 2");
            clonedObjective.Questions.ElementAt(1).Title.Should().Be("question title 1");
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

    // RelatedCoursesCollection
    }
}
