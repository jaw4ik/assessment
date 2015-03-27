using easygenerator.DomainModel.Tests.ObjectMothers;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class CourseStateTests
    {
        #region Constructor

        [TestMethod]
        public void CourseState_ShouldThrowArgumentNullException_WhenCourseIdIsNull()
        {
            Action action = () => CourseStateObjectMother.Create(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("course");
        }

        [TestMethod]
        public void CourseState_CreateCourseState()
        {
            var course = CourseObjectMother.Create();
            var courseState = CourseStateObjectMother.Create(course, true);

            courseState.Id.Should().NotBeEmpty();
            courseState.Course.Should().Be(course);
            courseState.HasUnpublishedChanges.Should().BeTrue();
        }

        [TestMethod]
        public void CourseState_CreateCourseState_WithDefaultValue_When_NotSpecified()
        {
            var course = CourseObjectMother.Create();
            var courseState = CourseStateObjectMother.Create(course);

            courseState.Id.Should().NotBeEmpty();
            courseState.Course.Should().Be(course);
            courseState.HasUnpublishedChanges.Should().BeFalse();
        }

        #endregion

    }
}
