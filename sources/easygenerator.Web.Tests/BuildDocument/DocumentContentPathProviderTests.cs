using easygenerator.Web.BuildDocument;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.Web.Tests.BuildDocument
{
    [TestClass]
    public class DocumentContentPathProviderTests
    {
        private const string BuildDirectory = "BuildDirectory";

        private DocumentContentPathProvider _documentContentPathProvider;

        [TestInitialize]
        public void InitializeContext()
        {
            _documentContentPathProvider = new DocumentContentPathProvider();
        }

        #region GetContentFileName

        [TestMethod]
        public void GetContentFileName_ShouldReturnDocumentContentFileName()
        {
            //Arrange
            var expectedPath = "BuildDirectory\\content.html";

            //Act
            var result = _documentContentPathProvider.GetContentFileName(BuildDirectory);

            //Assert
            result.Should().Be(expectedPath);
        }

        #endregion

        #region GetDataFileName

        [TestMethod]
        public void GetDataFileName_ShouldReturnJsonDataFileName()
        {
            //Arrange
            var expectedPath = "BuildDirectory\\data.js";

            //Act
            var result = _documentContentPathProvider.GetDataFileName(BuildDirectory);

            //Assert
            result.Should().Be(expectedPath);
        }

        #endregion
    }
}
