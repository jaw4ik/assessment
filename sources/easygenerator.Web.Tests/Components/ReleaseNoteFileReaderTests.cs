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
    class ReleaseNoteFileReaderTests
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

        

        #endregion
    }
}