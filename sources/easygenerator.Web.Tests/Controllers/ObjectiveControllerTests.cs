using System;
using System.Collections.ObjectModel;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Controllers;
using easygenerator.Web.Tests.Utils;
using easygenerator.Web.ViewModels.Objective;

namespace easygenerator.Web.Tests.Controllers
{
    [TestClass]
    public class ObjectiveControllerTests
    {
        private ObjectiveController controller;
        private Mock<IObjectiveRepository> objectiveRepository;

        [TestInitialize]
        public void InitializeContext()
        {
            objectiveRepository = new Mock<IObjectiveRepository>();
            controller = new ObjectiveController(objectiveRepository.Object);
        }

        #region Index

        [TestMethod]
        public void Index_ShouldReturnViewResult()
        {
            //Arrange

            objectiveRepository.Setup(r => r.GetCollection()).Returns(new Collection<Objective>());

            //Act
            var result = controller.Index();

            //Assert
            ActionResultAssert.IsViewResult(result);
        }

        #endregion

        #region Create

        [TestMethod]
        public void Create_ShouldReturnViewResult_WhenGet()
        {
            //Arrange


            //Act
            var result = controller.Create();

            //Assert
            ActionResultAssert.IsViewResult(result);
        }

        [TestMethod]
        public void Create_ShouldReturnViewResultWithCreateView_WhenModelStateIsNotValid()
        {
            //Arrange
            var viewModel = new CreateObjectiveViewModel();
            const string viewName = "Create";

            controller.AddRandomModelStateError();

            //Act
            var result = controller.Create(viewModel);

            //Assert
            ActionResultAssert.IsViewResult(result, viewName, viewModel);
        }

        [TestMethod]
        public void Create_ShouldAddObjective()
        {
            //Arrange
            var viewModel = new CreateObjectiveViewModel() { Title = "Objective" };

            objectiveRepository.Setup(r => r.Add(It.Is<Objective>(objective => objective.Title == viewModel.Title)));

            //Act
            controller.Create(viewModel);

            //Assert
            objectiveRepository.VerifyAll();
        }

        [TestMethod]
        public void Create_ShouldReturnRedirectToIndexActionResult()
        {
            //Arrange
            var viewModel = new CreateObjectiveViewModel() { Title = "Objective" };

            //Act
            var result = controller.Create(viewModel);

            //Assert
            ActionResultAssert.IsRedirectToActionResult(result, "Index");
        }


        #endregion
    }
}
