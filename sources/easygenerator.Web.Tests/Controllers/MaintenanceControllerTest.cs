using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using easygenerator.Web.Controllers;

namespace easygenerator.Web.Tests.Controllers
{
    [TestClass]
    public class MaintenanceControllerTest
    {
        [TestMethod]
        public void PublishIsInProgress_ShouldReturnViewResult()
        {
            // Arrange
            var controller = new MaintenanceController();
            
            // Act
            var result = controller.PublishIsInProgress();

            // Assert
            result.Should().BeOfType<ViewResult>();
        }
    }
}
