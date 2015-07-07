using easygenerator.Web.BuildCourse;
using easygenerator.Web.Components;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.IO;

namespace easygenerator.Web.Tests.BuildCourse
{
    [TestClass]
    public class BuildPathProviderTests
    {
        private HttpRuntimeWrapper _httpRuntimeWrapper;
        private BuildPathProvider _buildPathProvider;

        private string BuildPath { get; set; }
        private string WebsitePath { get; set; }
        private string DownloadPath { get; set; }

        [TestInitialize]
        public void InitializeContext()
        {
            _httpRuntimeWrapper = Substitute.For<HttpRuntimeWrapper>();
            _httpRuntimeWrapper.GetDomainAppPath().Returns("Some app path");

            _buildPathProvider = new BuildPathProvider(_httpRuntimeWrapper);

            BuildPath = Path.Combine(Path.GetTempPath(), "eg", "build");
            WebsitePath = _httpRuntimeWrapper.GetDomainAppPath();
            DownloadPath = Path.Combine(WebsitePath, "Download");
        }

        #region GetBuildDirectoryName

        [TestMethod]
        public void GetBuildDirectoryName_ShouldReturnBuildDirecory()
        {
            //Arrange
            var buildId = "BuildId";
            var expectedPath = Path.Combine(BuildPath, buildId);

            //Act
            var result = _buildPathProvider.GetBuildDirectoryName(buildId);

            //Assert
            result.Should().Be(expectedPath);
        }

        #endregion

        #region GetBuildPackageFileName

        [TestMethod]
        public void GetBuildPackageFileName_ShouldReturnPackageFileName()
        {
            //Arrange
            var buildId = "BuildId";
            var expectedPath = Path.Combine(DownloadPath, buildId + ".zip");

            //Act
            var result = _buildPathProvider.GetBuildPackageFileName(buildId);

            //Assert
            result.Should().Be(expectedPath);
        }

        #endregion

        #region GetDownloadPath

        [TestMethod]
        public void GetDownloadPath_ShouldReturnDownloadPath()
        {
            //Arrage
            var expectedPath = DownloadPath;

            //Act
            var result = _buildPathProvider.GetDownloadPath();

            //Assert
            result.Should().Be(expectedPath);
        }

        #endregion

        #region GetBuildedPackagePath

        [TestMethod]
        public void GetBuildedPackagePath_ReturnPackagePath()
        {
            //Arrange
            var packagePath = "packagePath";

            //Act
            var result = _buildPathProvider.GetBuildedPackagePath(packagePath);

            //Assert
            result.Should().Be(DownloadPath + "\\packagePath");
        }

        #endregion

    }
}
