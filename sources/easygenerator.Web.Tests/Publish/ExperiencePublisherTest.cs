using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildExperience;
using easygenerator.Web.Components;
using easygenerator.Web.Publish;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Publish
{
    [TestClass]
    public class ExperiencePublisherTest
    {
        private ExperiencePublisher _publisher;
        private HttpRuntimeWrapper _httpRuntimeWrapper;
        private PhysicalFileManager _fileManager;
        private BuildPathProvider _pathProvider;
        private IPublishDispatcher _publishDispatcher;
        private IUrlHelperWrapper _urlHelper;

        [TestInitialize]
        public void InitializePublisher()
        {
            _httpRuntimeWrapper = Substitute.For<HttpRuntimeWrapper>();
            _fileManager = Substitute.For<PhysicalFileManager>();
            _pathProvider = new BuildPathProvider(_httpRuntimeWrapper);
            _publishDispatcher = Substitute.For<IPublishDispatcher>();
            _urlHelper = Substitute.For<IUrlHelperWrapper>();
            _publisher = new ExperiencePublisher(_fileManager, _pathProvider, _publishDispatcher, _urlHelper);
        }

        [TestMethod]
        public void Publish_ShouldThrowArgumentNotSupportedExceptionIfExperienceBuildOnIsNull()
        {
            //Arrange
            var experience = ExperienceObjectMother.Create("ExperienceTitle");

            //Act
            Action action = () => _publisher.Publish(experience);

            //Assert
            action.ShouldThrow<NotSupportedException>();
        }

        [TestMethod]
        public void Publish_ShouldCallPublishDispatcherStartMethod()
        {
            //Arrange
            var experience = ExperienceObjectMother.Create("ExperienceTitle");
            experience.UpdatePackageUrl("url");
            //Act
            _publisher.Publish(experience);

            //Assert
            _publishDispatcher.Received().StartPublish(experience.Id.ToString());
        }

        [TestMethod]
        public void Publish_ShouldCallPublishDispatcherEndMethod()
        {
            //Arrange
            var experience = ExperienceObjectMother.Create("ExperienceTitle");
            experience.UpdatePackageUrl("url");
            //Act
            _publisher.Publish(experience);

            //Assert
            _publishDispatcher.Received().EndPublish(experience.Id.ToString());
        }

        [TestMethod]
        public void Publish_ShouldUpdateExperiecePublishedOnDate()
        {
            //Arrange
            DateTimeWrapper.Now = () => DateTime.MaxValue;
            var experience = ExperienceObjectMother.Create("ExperienceTitle");
            experience.UpdatePackageUrl("url");

            //Act
            _publisher.Publish(experience);

            //Assert
            experience.PublishedOn.Should().Be(DateTime.MaxValue);
        }
    }
}
