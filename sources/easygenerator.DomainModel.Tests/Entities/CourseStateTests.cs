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
            var courseState = CourseStateObjectMother.Create(course, true, true);

            courseState.Id.Should().NotBeEmpty();
            courseState.Course.Should().Be(course);
            courseState.IsDirty.Should().BeTrue();
            courseState.IsDirtyForSale.Should().BeTrue();
        }

        #endregion

        #region MarkAsDirty

        [TestMethod]
        public void MarkAsDirty_Should_SetIsDirty_ToTrue()
        {
            var course = CourseObjectMother.Create();
            var courseState = CourseStateObjectMother.Create(course);

            courseState.MarkAsDirty();

            courseState.IsDirty.Should().BeTrue();
            courseState.IsDirtyForSale.Should().BeTrue();
        }

        #endregion

        #region MarkAsClean

        [TestMethod]
        public void MarkAsDirty_Should_SetIsDirty_ToFalse()
        {
            var course = CourseObjectMother.Create();
            var courseState = CourseStateObjectMother.Create(course, true);

            courseState.MarkAsClean();

            courseState.IsDirty.Should().BeFalse();
        }

        #endregion

        #region MarkAsCleanForSale

        [TestMethod]
        public void MarkAsCleanForSale_Should_SetIsDirtyForSale_ToFalse()
        {
            var course = CourseObjectMother.Create();
            var courseState = CourseStateObjectMother.Create(course, false, true);

            courseState.MarkAsCleanForSale();

            courseState.IsDirtyForSale.Should().BeFalse();
        }

        #endregion

    }
}
