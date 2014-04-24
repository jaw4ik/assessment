using System;
using System.IO;
using System.Linq;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Import.PublishedCourse.EntityReaders;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json.Linq;
using NSubstitute;

namespace easygenerator.Web.Tests.Import.PublishedCourse.EntityReaders
{
    [TestClass]
    public class CourseEntityReaderTests
    {
        private CourseEntityReader _courseEntityReader;
        private FileCache _fileCache;
        private PhysicalFileManager _physicalFileManager;
        private IEntityFactory _entityFactory;
        private ITemplateRepository _templateRepository;

        private Template DefaultTemplate;

        [TestInitialize]
        public void InitializeContext()
        {
            DefaultTemplate = TemplateObjectMother.Create();

            _templateRepository = Substitute.For<ITemplateRepository>();
            _templateRepository.GetDefaultTemplate().Returns(DefaultTemplate);

            _entityFactory = Substitute.For<IEntityFactory>();

            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>())
                .Returns(info =>
                    CourseObjectMother.CreateWithTemplate(info.Args().ElementAt(1).As<Template>(),
                        info.Args().ElementAt(0).As<string>(),
                        info.Args().ElementAt(2).As<string>()));

            _physicalFileManager = Substitute.For<PhysicalFileManager>();
            _fileCache = Substitute.For<FileCache>(_physicalFileManager);
            _courseEntityReader = new CourseEntityReader(_fileCache, _entityFactory, _templateRepository);
        }

        #region ReadCourse

        [TestMethod]
        public void ReadCourse_ShouldReadCourseWithIntroductionContent_WhenCourseHasIntroductionContent()
        {
            //Arrange
            var publicationPath = "SomePublicationPath";
            string courseTitle = "Some course title";
            string createdBy = "test@easygenerator.com";
            var courseContent = "asfshdkhjvbnmvmn,bnm,bnm,bnm,dfhfgh";

            var courseData =
                JObject.Parse(String.Format("{{ title: '{0}', hasIntroductionContent: true }}", courseTitle));

            var contentPath = Path.Combine(publicationPath, "content", "content.html");
            _fileCache.ReadFromCacheOrLoad(contentPath).Returns(courseContent);

            //Act
            var course = _courseEntityReader.ReadCourse(publicationPath, createdBy, courseData);

            //Assert
            course.Title.Should().Be(courseTitle);
            course.CreatedBy.Should().Be(createdBy);
            course.IntroductionContent.Should().Be(courseContent);
            course.Template.Should().Be(DefaultTemplate);

            _fileCache.Received().ReadFromCacheOrLoad(contentPath);
        }

        [TestMethod]
        public void ReadCourse_ShouldReadCourseWithoutIntroductionContent_WhenCourseHasNoIntroductionContent()
        {
            //Arrange
            var publicationPath = "SomePublicationPath";
            string courseTitle = "Some course title";
            string createdBy = "test@easygenerator.com";

            var courseData =
                JObject.Parse(String.Format("{{ title: '{0}', hasIntroductionContent: false }}", courseTitle));

            //Act
            var course = _courseEntityReader.ReadCourse(publicationPath, createdBy, courseData);

            //Assert
            course.Title.Should().Be(courseTitle);
            course.CreatedBy.Should().Be(createdBy);
            course.IntroductionContent.Should().Be(String.Empty);
            course.Template.Should().Be(DefaultTemplate);

            _fileCache.DidNotReceive().ReadFromCacheOrLoad(Arg.Any<string>());
        }

        #endregion

    }
}
