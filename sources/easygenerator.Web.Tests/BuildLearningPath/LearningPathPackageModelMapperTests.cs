using System;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.BuildLearningPath;
using easygenerator.Web.Components;
using easygenerator.Web.Extensions;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.BuildLearningPath
{
    [TestClass]
    public class LearningPathPackageModelMapperTests
    {
        private LearningPathPackageModelMapper _modelMapper;
        private LearningPathContentPathProvider _contentPathProvider;

        [TestInitialize]
        public void InitializeContext()
        {
            _contentPathProvider = Substitute.For<LearningPathContentPathProvider>(Substitute.For<HttpRuntimeWrapper>());

            _modelMapper = new LearningPathPackageModelMapper(_contentPathProvider);
        }

        #region MyRegion

        [TestMethod]
        public void MapLearningPath_ShouldThrowArgumentNullException_WhenLearningPathIsNull()
        {
            //Arrange
            
            //Act
            Action action = () => _modelMapper.MapLearningPath(null);

            //Assert
            action.ShouldThrow<ArgumentNullException>();
        }

        [TestMethod]
        public void MapLearningPath_ShouldMapLearningPath()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create("Learning path title");

            //Act
            var result = _modelMapper.MapLearningPath(learningPath);

            //Assert
            result.Title.Should().Be("Learning path title");
        }

        [TestMethod]
        public void MapLearningPath_ShouldMapCourses()
        {
            var learningPath = LearningPathObjectMother.Create();
            var course1 = CourseObjectMother.Create("1");
            var course2 = CourseObjectMother.Create("2");
            learningPath.AddCourse(course1, null, "author");
            learningPath.AddCourse(course2, null, "author");
            _contentPathProvider.GetCourseLink(course1.Id.ToNString()).Returns("link1");
            _contentPathProvider.GetCourseLink(course2.Id.ToNString()).Returns("link2");

            //Act
            var result = _modelMapper.MapLearningPath(learningPath);

            //Assert
            result.Courses.Count.Should().Be(2);
            result.Courses[0].Title.Should().Be("1");
            result.Courses[0].Link.Should().Be("link1");
            result.Courses[1].Title.Should().Be("2");
            result.Courses[1].Link.Should().Be("link2");
        }

        #endregion
    }
}
