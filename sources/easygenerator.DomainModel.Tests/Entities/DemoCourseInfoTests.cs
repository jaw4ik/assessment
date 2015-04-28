using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class DemoCourseInfoTests
    {
        [TestMethod]
        public void Ctor_Should_CreateNewInstanceOfDemoCourseInfo()
        {
            var demoCourse = CourseObjectMother.Create();
            var sourceCourse = CourseObjectMother.Create();
            DateTimeWrapper.Now = () => DateTime.MaxValue;
           
            var demoCourseInfo = new DemoCourseInfo(sourceCourse, demoCourse, "creator");

            demoCourseInfo.Should().NotBeNull();
            demoCourseInfo.DemoCourse.Should().Be(demoCourse);
            demoCourseInfo.SourceCourse.Should().Be(sourceCourse);
            demoCourseInfo.CreatedBy.Should().Be("creator");
            demoCourseInfo.ModifiedBy.Should().Be("creator");
            demoCourseInfo.ModifiedOn.Should().Be(DateTime.MaxValue);
            demoCourseInfo.CreatedOn.Should().Be(DateTime.MaxValue);
        }

        [TestMethod]
        public void Ctor_Should_ThrowArgumentNullException_WhenCreatedByIsNull()
        {
            Action action = () => new DemoCourseInfo(CourseObjectMother.Create(), CourseObjectMother.Create(), null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("createdBy");
        }

        [TestMethod]
        public void Ctor_Should_ThrowArgumentException_WhenCreatedByIsEmptyString()
        {
            Action action = () => new DemoCourseInfo(CourseObjectMother.Create(), CourseObjectMother.Create(), "");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("createdBy");
        }

        [TestMethod]
        public void Ctor_Should_ThrowArgumentNullException_WhenDemoCourseIsNull()
        {
            Action action = () => new DemoCourseInfo(CourseObjectMother.Create(), null, "creator");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("demoCourse");
        }

        [TestMethod]
        public void Ctor_Should_SetDemoCouse()
        {
            Action action = () => new DemoCourseInfo(CourseObjectMother.Create(), null, "creator");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("demoCourse");
        }

        [TestMethod]
        public void UpdateDemoCourse_Should_ThrowArgumentNullException_WhenDemoCourseIsNull()
        {
            var demoCourseInfo = new DemoCourseInfo(CourseObjectMother.Create(), CourseObjectMother.Create(), "creator");
            Action action = () => demoCourseInfo.UpdateDemoCourse(null, "creator");
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("demoCourse");
        }

        [TestMethod]
        public void UpdateDemoCourse_Should_ThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var demoCourseInfo = new DemoCourseInfo(CourseObjectMother.Create(), CourseObjectMother.Create(), "creator");
            Action action = () => demoCourseInfo.UpdateDemoCourse(CourseObjectMother.Create(), null);
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateDemoCourse_Should_ThrowArgumentException_WhenCreatedByIsEmptyString()
        {
            var demoCourseInfo = new DemoCourseInfo(CourseObjectMother.Create(), CourseObjectMother.Create(), "creator");
            Action action = () => demoCourseInfo.UpdateDemoCourse(CourseObjectMother.Create(), "");
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateDemoCourse_Should_UpdateDemoCourseAndModifiedValues()
        {
            DateTimeWrapper.Now = () => DateTime.MaxValue;
            var updatedCourse = CourseObjectMother.Create();

            var demoCourseInfo = new DemoCourseInfo(CourseObjectMother.Create(), CourseObjectMother.Create(), "creator");
            demoCourseInfo.UpdateDemoCourse(updatedCourse, "modified");

            demoCourseInfo.ModifiedBy.Should().Be("modified");
            demoCourseInfo.ModifiedOn.Should().Be(DateTime.MaxValue);
            demoCourseInfo.DemoCourse.Should().Be(updatedCourse);
        }
    }
}
