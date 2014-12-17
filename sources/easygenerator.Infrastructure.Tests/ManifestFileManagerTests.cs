using System;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Infrastructure.Tests
{
    [TestClass]
    public class ManifestFileManagerTests
    {
        private PhysicalFileManager _physicalFileManager;
        private ManifestFileManager _manifestFileManager;

        [TestInitialize]
        public void InitializeContext()
        {
            _physicalFileManager = Substitute.For<PhysicalFileManager>();
            _manifestFileManager = new ManifestFileManager(_physicalFileManager);
        }

        #region ReadManifest

        [TestMethod]
        public void ReadManifest_ShouldReadManifestFromFile_WhenManigestDoesNitExistInDictionary()
        {
            var path = "path";
            _physicalFileManager.ReadAllFromFile(Arg.Any<string>()).Returns("manifest");
            _manifestFileManager.ReadManifest(Guid.Empty, path);
            _physicalFileManager.Received().ReadAllFromFile(Arg.Any<string>());
        }

        [TestMethod]
        public void ReadManifest_ShouldReadManifestFromDictionary_WhenManifestExistsInDictionary()
        {
            var path = "path";
            _manifestFileManager.ManifestDictionary.Add(Guid.Empty, "manifest");
            _manifestFileManager.ReadManifest(Guid.Empty, path);
            _physicalFileManager.DidNotReceive().ReadAllFromFile(Arg.Any<string>());
        }

        [TestMethod]
        public void ReadManidest_ShouldReturnManifestFile()
        {
            var path = "path";
            var manifest = "manifest";
            _manifestFileManager.ManifestDictionary.Add(Guid.Empty, manifest);
            var result = _manifestFileManager.ReadManifest(Guid.Empty, path);
            result.Should().Be(manifest);
        }

        #endregion ReadManifest
    }
}
