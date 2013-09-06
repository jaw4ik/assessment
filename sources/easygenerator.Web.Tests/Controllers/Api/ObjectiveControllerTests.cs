using System;
using System.Web.Razor.Parser.SyntaxTree;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Tests.Utils;
using easygenerator.Web.ViewModels.Objective;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace easygenerator.Web.Tests.Controllers.Api
{
    //[TestClass]
    public class ObjectiveControllerTests
    {
        private ObjectiveController _controller;

        private Mock<IObjectiveRepository> _repository;

        [TestInitialize]
        public void InitializeContext()
        {
            _repository = new Mock<IObjectiveRepository>();
            _controller = new ObjectiveController(_repository.Object);
        }

        #region Create objective

        [TestMethod]
        public void Create_ShouldReturnJsonSuccessResult()
        {
            //Arrange

            //Act
            var result = _controller.Create(String.Empty);

            //Assert
            ActionResultAssert.IsJsonSuccessResult(result);
        }

        #endregion

    }
}
