using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Clonning;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.BuildCourse.Scorm;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Components.Configuration.CourseExamples;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Controllers;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Domain.DomainOperations;
using easygenerator.Web.Publish;
using easygenerator.Web.Publish.Coggno;
using easygenerator.Web.Publish.External;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Controllers
{
    [TestClass]
    public class CourseExamplesControllerTests
    {
        private CourseExamplesController _controller;
        private ICourseRepository _courseRepository;
        private ConfigurationReader _configurationReader;

        [TestInitialize]
        public void InitializeContext()
        {
            _courseRepository = Substitute.For<ICourseRepository>();
            _configurationReader = Substitute.For<ConfigurationReader>();

            _controller = new CourseExamplesController(_configurationReader, _courseRepository);
        }

        #region GetCollection

        [TestMethod]
        public void GetCollection_ShouldReturnJsonSuccessResult()
        {
            _configurationReader.CourseExamplesConfiguration.Returns(new CourseExamplesConfigurationSection()
            {
                Courses = new CourseCollection()
            });
            
            var result = _controller.GetCollection();

            result.Should().BeJsonSuccessResult();
        }

        #endregion
    }
}
