using System;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildLearningPath;
using easygenerator.Web.BuildLearningPath.PackageModel;
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

            DateTimeWrapper.Now = () => new DateTime(2013, 10, 12);
        }

        #region MapLearningPath

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
            result.Id.Should().Be(learningPath.Id.ToNString());
            result.CreatedOn.Should().Be(DateTimeWrapper.Now());
        }

        [TestMethod]
        public void MapLearningPath_ShouldMapEntities()
        {
            var learningPath = LearningPathObjectMother.Create();
            var course1 = CourseObjectMother.Create("1");
            var course2 = CourseObjectMother.Create("2");
            var document1 = DocumentObjectMother.Create("3");
            var document2 = DocumentObjectMother.Create("4");
            learningPath.AddEntity(course1, null, "author");
            learningPath.AddEntity(course2, null, "author");
            learningPath.AddEntity(document1, null, "author");
            learningPath.AddEntity(document2, null, "author");
            _contentPathProvider.GetEntityLink(course1.Id.ToNString()).Returns("link1");
            _contentPathProvider.GetEntityLink(course2.Id.ToNString()).Returns("link2");
            _contentPathProvider.GetEntityLink(document1.Id.ToNString()).Returns("link3");
            _contentPathProvider.GetEntityLink(document2.Id.ToNString()).Returns("link4");

            //Act
            var result = _modelMapper.MapLearningPath(learningPath);

            //Assert
            result.Entities.Count.Should().Be(4);
            result.Entities[0].Title.Should().Be("1");
            result.Entities[0].Link.Should().Be("link1");
            result.Entities[0].Type.Should().Be(LearningPathEntityType.Course);

            result.Entities[1].Title.Should().Be("2");
            result.Entities[1].Link.Should().Be("link2");
            result.Entities[1].Type.Should().Be(LearningPathEntityType.Course);

            result.Entities[2].Title.Should().Be("3");
            result.Entities[2].Link.Should().Be("link3");
            result.Entities[2].Type.Should().Be(LearningPathEntityType.Document);

            result.Entities[3].Title.Should().Be("4");
            result.Entities[3].Link.Should().Be("link4");
            result.Entities[3].Type.Should().Be(LearningPathEntityType.Document);
        }

        #endregion
    }
}
