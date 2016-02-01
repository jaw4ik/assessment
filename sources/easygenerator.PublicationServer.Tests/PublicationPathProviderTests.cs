using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using easygenerator.PublicationServer.Utils;

namespace easygenerator.PublicationServer.Tests
{
    [TestClass]
    public class PublicationPathProviderTests
    {
        private PublicationPathProvider _pathProvider;

        [TestInitialize]
        public void Initialize()
        {
            _pathProvider = new PublicationPathProvider();
        }

        [TestMethod]
        public void GetPublicationSubDirectoryPath_ShouldReturnCorrectSubFolderPath()
        {
            string subFolderPath = _pathProvider.GetPublicationSubDirectoryPath("/033BBC6F-A662-4EF2-84A9-7C7FFFBC3717");
            subFolderPath.Should().Be("/0/033BBC6F-A662-4EF2-84A9-7C7FFFBC3717");
        }

        [TestMethod]
        public void GetPublicationSubDirectoryPath_ShouldReturnSamePathIfNotPackagePath()
        {
            string subFolderPath = _pathProvider.GetPublicationSubDirectoryPath("/favicon");
            subFolderPath.Should().Be("/favicon");
        }
    }
}
