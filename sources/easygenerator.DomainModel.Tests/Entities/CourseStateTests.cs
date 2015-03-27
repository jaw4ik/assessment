using easygenerator.DomainModel.Entities;
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
            var courseState = CourseStateObjectMother.Create(course, CourseStateInfoObjectMother.Create(true));

            courseState.Id.Should().NotBeEmpty();
            courseState.Course.Should().Be(course);
            courseState.Info.Should().NotBeNull();
            courseState.Info.Should().BeOfType<CourseStateInfo>();
            courseState.Info.HasUnpublishedChanges.Should().BeTrue();
        }

        [TestMethod]
        public void CourseState_CreateCourseState_WithDefaultValue_When_NotSpecified()
        {
            var course = CourseObjectMother.Create();
            var courseState = CourseStateObjectMother.Create(course);

            courseState.Id.Should().NotBeEmpty();
            courseState.Course.Should().Be(course);
            courseState.Info.Should().NotBeNull();
            courseState.Info.Should().BeOfType<CourseStateInfo>();
            courseState.Info.HasUnpublishedChanges.Should().BeFalse();
        }

        [TestMethod]
        public void CourseState_UpdateInfo_Should_ThrowArgumentNullException_WhenCourseStateInfoIsNull()
        {
            var course = CourseObjectMother.Create();
            var courseState = CourseStateObjectMother.Create(course);
           // var newInfo = CourseStateInfoObjectMother.Create(true);

            Action action = () => courseState.UpdateInfo(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("info");
        }

        [TestMethod]
        public void CourseState_UpdateInfo_Should_UpdateStateInfo()
        {
            var course = CourseObjectMother.Create();
            var courseState = CourseStateObjectMother.Create(course);
            var newInfo = CourseStateInfoObjectMother.Create(true);

            courseState.UpdateInfo(newInfo);

            courseState.Info.Should().Be(newInfo);
        }

        #endregion

    }
}
