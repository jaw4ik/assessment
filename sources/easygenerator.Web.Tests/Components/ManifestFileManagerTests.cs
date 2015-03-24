using System;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Storage;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Components
{
    [TestClass]
    public class ManifestFileManagerTests
    {
        private PhysicalFileManager _physicalFileManager;
        private ITemplateStorage _templateStorage;

        private ManifestFileManager _manifestFileManager;

        [TestInitialize]
        public void InitializeContext()
        {
            _physicalFileManager = Substitute.For<PhysicalFileManager>();
            _templateStorage = Substitute.For<ITemplateStorage>();

            _manifestFileManager = new ManifestFileManager(_physicalFileManager, _templateStorage);
        }

        #region ReadManifest

        [TestMethod]
        public void ReadManifest_ShouldReadManifestFromFile_WhenManifestDoesNotExistInDictionary()
        {
            var template = TemplateObjectMother.Create();
            _physicalFileManager.ReadAllFromFile(Arg.Any<string>()).Returns("manifest");
            _templateStorage.FileExists(template, Arg.Any<string>()).Returns(true);

            _manifestFileManager.ReadManifest(template);

            _physicalFileManager.ReceivedWithAnyArgs().ReadAllFromFile(Arg.Any<string>());
        }

        [TestMethod]
        public void ReadManifest_ShouldReadManifestFromCache_WhenManifestLoadSecondTime()
        {
            var template = TemplateObjectMother.Create();
            _templateStorage.FileExists(template, Arg.Any<string>()).Returns(true);

            _manifestFileManager.ReadManifest(template);
            _manifestFileManager.ReadManifest(template);

            _physicalFileManager.Received(1).ReadAllFromFile(Arg.Any<string>());
        }

        [TestMethod]
        public void ReadManifest_ShouldNotReadFile_WhenManifestFileDoesNotExist()
        {
            var template = TemplateObjectMother.Create();
            _templateStorage.FileExists(template, Arg.Any<string>()).Returns(false);

            _manifestFileManager.ReadManifest(template);

            _physicalFileManager.DidNotReceive().ReadAllFromFile(Arg.Any<string>());
        }

        [TestMethod]
        public void ReadManifest_ShouldReturnNull_WhenManifestFileDoesNotExist()
        {
            var template = TemplateObjectMother.Create();
            _templateStorage.FileExists(template, Arg.Any<string>()).Returns(false);

            var result = _manifestFileManager.ReadManifest(template);

            result.Should().BeNull();
        }

        [TestMethod]
        public void ReadManidest_ShouldReturnManifestFile()
        {
            var manifest = "manifest";
            var template = TemplateObjectMother.Create();
            _physicalFileManager.ReadAllFromFile(Arg.Any<string>()).Returns(manifest);
            _templateStorage.FileExists(template, Arg.Any<string>()).Returns(true);

            var result = _manifestFileManager.ReadManifest(template);

            result.Should().Be(manifest);
        }

        #endregion ReadManifest
    }
}
