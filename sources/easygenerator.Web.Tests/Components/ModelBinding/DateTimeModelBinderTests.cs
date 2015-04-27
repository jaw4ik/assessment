using easygenerator.Web.Components.ModelBinding;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Globalization;
using System.Web.Mvc;

namespace easygenerator.Web.Tests.Components.ModelBinding
{
    [TestClass]
    public class DateTimeModelBinderTests
    {
        private DateTimeModelBinder _binder;
        private IValueProvider _valueProvider;
        private ModelBindingContext _bindingContext;

        [TestInitialize]
        public void Initialize()
        {
            _binder = new DateTimeModelBinder();
            _valueProvider = Substitute.For<IValueProvider>();
            _bindingContext = new ModelBindingContext { ValueProvider = _valueProvider };
        }

        #region BindModel

        [TestMethod]
        public void BindModel_ShouldReturnNull_WhenAttemptedValueIsNull()
        {
            //Arrange
            SetAttemptedValue(null);

            //Act
            var result = _binder.BindModel(null, _bindingContext);

            //Assert
            result.Should().BeNull();
        }

        [TestMethod]
        public void BindModel_ShouldReturnNull_WhenAttemptedValueIsEmptyString()
        {
            //Arrange
            SetAttemptedValue("");

            //Act
            var result = _binder.BindModel(null, _bindingContext);

            //Assert
            result.Should().BeNull();
        }

        [TestMethod]
        public void BindModel_ShouldReturnDate_WhenAttemptedValueIsLong()
        {
            //Arrange
            SetAttemptedValue("100500");

            //Act
            var result = _binder.BindModel(null, _bindingContext);

            //Assert
            result.Should().BeOfType<DateTime>();
        }

        [TestMethod]
        public void BindModel_ShouldReturnDateTime_WhenAttemptedValueIsValidDateTimeString()
        {
            //Arrange
            SetAttemptedValue(DateTime.MinValue.ToString(CultureInfo.InvariantCulture));

            //Act
            var result = _binder.BindModel(null, _bindingContext);

            //Assert
            result.Should().BeOfType<DateTime>();
        }

        [TestMethod]
        public void BindModel_ShouldReturnNull_WhenAttemptedValueIsANotValidDateTimeString()
        {
            //Arrange
            SetAttemptedValue("value");

            //Act
            var result = _binder.BindModel(null, _bindingContext);

            //Assert
            result.Should().BeNull();
        }

        private void SetAttemptedValue(string value)
        {
            _valueProvider.GetValue(Arg.Any<string>())
                .Returns(new ValueProviderResult(null, value, CultureInfo.InvariantCulture));
        }

        #endregion
    }
}
