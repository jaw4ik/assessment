using System;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Storage;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.Tests.Components
{
    [TestClass]
    public class ReleaseNoteFileReaderTests
    {
        private PhysicalFileManager _physicalFileManager;
        private ConfigurationReader _configurationReader;
        private HttpRuntimeWrapper _httpRuntimeWrapper;

        private ReleaseNoteFileReader _releaseNoteFileReader;

        [TestInitialize]
        public void InitializeContext()
        {
            _physicalFileManager = Substitute.For<PhysicalFileManager>();
            _configurationReader = Substitute.For<ConfigurationReader>();
            _httpRuntimeWrapper = Substitute.For<HttpRuntimeWrapper>();

            _releaseNoteFileReader = new ReleaseNoteFileReader(_physicalFileManager, _configurationReader, _httpRuntimeWrapper);
        }

        #region Read

        [TestMethod]
        public void Read_ShouldReadReleaseNoteFile_WhenItIsNotExistsInCahce()
        {
            _physicalFileManager.ReadAllFromFile(Arg.Any<string>()).Returns("foo");
            _physicalFileManager.FileExists(Arg.Any<string>()).Returns(true);

            _releaseNoteFileReader.Read();

            _physicalFileManager.ReceivedWithAnyArgs().ReadAllFromFile(Arg.Any<string>());
        }

        [TestMethod]
        public void Read_ShouldReadManifestFromCache_WhenManifestLoadSecondTime()
        {
            _physicalFileManager.FileExists(Arg.Any<string>()).Returns(true);
            _physicalFileManager.ReadAllFromFile(Arg.Any<string>()).Returns("foo");
            _releaseNoteFileReader.Read();
            _releaseNoteFileReader.Read();

            _physicalFileManager.Received(1).ReadAllFromFile(Arg.Any<string>());
        }

        [TestMethod]
        public void Read_ShouldNotReadFile_WhenManifestFileDoesNotExist()
        {
            _releaseNoteFileReader.Read();

            _physicalFileManager.DidNotReceive().ReadAllFromFile(Arg.Any<string>());
        }

        [TestMethod]
        public void Read_ShouldReturnNull_WhenManifestFileDoesNotExist()
        {
            var result = _releaseNoteFileReader.Read();

            result.Should().BeNull();
        }

        [TestMethod]
        public void Read_ShouldReturnReleaseNoteFile()
        {
            var releaseNote = "notes";
            _physicalFileManager.FileExists(Arg.Any<string>()).Returns(true);
            _physicalFileManager.ReadAllFromFile(Arg.Any<string>()).Returns(releaseNote);

            var result = _releaseNoteFileReader.Read();

            result.Should().Be(releaseNote);
        }

        #endregion
    }
}