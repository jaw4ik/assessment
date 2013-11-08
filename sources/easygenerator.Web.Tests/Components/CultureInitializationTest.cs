using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Components
{
    [TestClass]
    public class CultureInitializationTest
    {
        private readonly CultureInfo _defaultCulture = new CultureInfo(Constants.DefaultCulture);

        [TestMethod]
        public void Initialize_ShouldSetDefaultCulture_WhenUserLanguagesNull()
        {
            //Arrange //Act
            CultureInitialization.Initialize(null);

            //Assert
            Assert.AreEqual(_defaultCulture, Thread.CurrentThread.CurrentCulture);
        }

        [TestMethod]
        public void Initialize_ShouldSetDefaultCulture_WhenUserLanguagesEmpty()
        {
            //Arrange //Act
            CultureInitialization.Initialize(new string[0]);

            //Assert
            Assert.AreEqual(_defaultCulture, Thread.CurrentThread.CurrentCulture);
        }

        [TestMethod]
        public void Initialize_ShouldSetDefaultCulture_WhenUserLanguagesDoesNotHaveSupportedCulture()
        {
            //Arrange //Act
            CultureInitialization.Initialize(new[] { "es-419", "ru", "fr" });

            //Assert
            Assert.AreEqual(_defaultCulture, Thread.CurrentThread.CurrentCulture);
        }

        [TestMethod]
        public void Initialize_ShouldSetSupportedCulture_WhenCultureHasRelativeQualityFactor()
        {
            //Arrange


            //Act
            CultureInitialization.Initialize(new[] {"ru", "en-US;q=0.2"});

            //Assert
            Assert.AreEqual(_defaultCulture,Thread.CurrentThread.CurrentCulture);
        }

        [TestMethod]
        public void Initialize_ShouldSetSupportedCulture_WhenUserLanguageHaveSupportedCulture()
        {
            //Arrange //Act
            CultureInitialization.Initialize(new[] {"de-DE", "fr"});

            //Assert
            Assert.AreEqual(new CultureInfo("de-DE"), Thread.CurrentThread.CurrentCulture);
        }

        [TestMethod]
        public void Initialize_ShouldSetFirtsSupportedCulture_WhenUserLanguagesHaveSeveralSpoortedCultures()
        {
            //Arrange //Act
            CultureInitialization.Initialize(new[] {"ru", "nl-NL", "en", "de-DE"});

            //Assert
            Assert.AreEqual(new CultureInfo("nl-NL"), Thread.CurrentThread.CurrentCulture);
        }

        [TestMethod]
        public void Initialize_ShouldSetSupportedCulture_WhenCultureIsNumericFormat()
        {
            //Arrange //Act
            CultureInitialization.Initialize(new[] { "de-276" });

            //Assert
            Assert.AreEqual(new CultureInfo("de-DE"), Thread.CurrentThread.CurrentCulture);
        }
    }
}
