using System;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Optimization;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.BundleTransforms;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Components.BundleTransforms
{
    [TestClass]
    public class ImageNoCacheParamTransformTests
    {
        private const String _testingText = "images/sprites.jpeg;images/sprites.jpeg;images/sprites.jpeg;images/sprites.jpeg;images/sprites.jpg;images/sprites.jpg;images/sprites.jpg;images/sprites.png;images/sprites.png;images/sprites.gif;";
        private const Int32 _testingNumberOfJpegs = 4;
        private const Int32 _testingNumberOfJpgs = 3;
        private const Int32 _testingNumberOfPngs = 2;
        private const Int32 _testingNumberOfGifs = 1;

        private String _addingVersion;
        private IBundleTransform _imageNoCacheParamTransform;

        private BundleContext _bundleContext;
        private BundleResponse _bundleResponse;

        HttpContextBase _context;

        [TestInitialize]
        public void InitializeContext()
        {
            _addingVersion = @"\?v=" + DateTimeWrapper.InstanceStartTime.Ticks;

            _context = Substitute.For<HttpContextBase>();

            _imageNoCacheParamTransform = new ImageNoCacheParamTransform();
            _bundleContext = Substitute.For<BundleContext>(_context, new BundleCollection(), String.Empty);
            _bundleResponse = Substitute.For<BundleResponse>();
            _bundleResponse.Content = _testingText;
        }

        #region Process

        [TestMethod]
        public void Process_ShouldThrowArgumentNullException_WhenBundleContextIsNull()
        {
            //Arrange

            //Act
            Action action = () => _imageNoCacheParamTransform.Process(null, _bundleResponse);

            //Assert
            action.ShouldThrow<ArgumentNullException>();
        }

        [TestMethod]
        public void Process_ShouldThrowArgumentNullException_WhenBundleResponseIsNull()
        {
            //Arrange

            //Act
            Action action = () => _imageNoCacheParamTransform.Process(_bundleContext, null);

            //Assert
            action.ShouldThrow<ArgumentNullException>();
        }

        [TestMethod]
        public void Process_ShouldNotChangeResponse_WhenBundleContextEnableInstrumentationIsTrue()
        {
            //Arrange
            _bundleContext.EnableInstrumentation = true;

            //Act
            _imageNoCacheParamTransform.Process(_bundleContext, _bundleResponse);

            //Assert
            _bundleResponse.Content.Should().Be(_testingText);
        }

        [TestMethod]
        public void Process_ShouldChangeContent_WhenBundleContextEnableInstrumentationIsFalse()
        {
            //Arrange

            //Act
            _imageNoCacheParamTransform.Process(_bundleContext, _bundleResponse);

            //Assert

            _bundleResponse.Content.Should().NotBe(_testingText);
        }

        [TestMethod]
        public void Process_ShouldAddVersionToEachJpegImage()
        {
            //Arrange

            //Act
            _imageNoCacheParamTransform.Process(_bundleContext, _bundleResponse);
            var result = _bundleResponse.Content;

            Int32 jpegsCount = Regex.Matches(result, ".jpeg" + _addingVersion).Count;

            //Assert

            jpegsCount.Should().Be(_testingNumberOfJpegs);
        }

        [TestMethod]
        public void Process_ShouldAddVersionToEachJpgImage()
        {
            //Arrange

            //Act
            _imageNoCacheParamTransform.Process(_bundleContext, _bundleResponse);
            var result = _bundleResponse.Content;

            Int32 jpgCount = Regex.Matches(result, ".jpg" + _addingVersion).Count;

            //Assert
            jpgCount.Should().Be(_testingNumberOfJpgs);
        }

        [TestMethod]
        public void Process_ShouldAddVersionToEachPngImage()
        {
            //Arrange

            //Act
            _imageNoCacheParamTransform.Process(_bundleContext, _bundleResponse);
            var result = _bundleResponse.Content;

            Int32 pngCount = Regex.Matches(result, ".png" + _addingVersion).Count;

            //Assert
            pngCount.Should().Be(_testingNumberOfPngs);
        }

        [TestMethod]
        public void Process_ShouldAddVersionToEachGifImage()
        {
            //Arrange

            //Act
            _imageNoCacheParamTransform.Process(_bundleContext, _bundleResponse);
            var result = _bundleResponse.Content;

            Int32 gifCount = Regex.Matches(result, ".gif" + _addingVersion).Count;

            //Assert
            gifCount.Should().Be(_testingNumberOfGifs);
        }


        #endregion

    }
}
