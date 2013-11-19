using easygenerator.Web.Components;
using FluentAssertions;
using NSubstitute;
using easygenerator.DomainModel.Repositories;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using easygenerator.Web.Controllers.Api;
using easygenerator.DomainModel.Entities;
using System.Collections.ObjectModel;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Tests.Utils;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class TemplateControllerTests
    {
        private ITemplateRepository _repository;
        private TemplateController _controller;

        [TestInitialize]
        public void InitializeContext()
        {
            _repository = Substitute.For<ITemplateRepository>();
            _controller = new TemplateController(_repository);
        }

        #region GetCollection

        [TestMethod]
        public void GetCollection_ShouldReturnJsonSuccessResult()
        {
            var collection = new Collection<Template>() { TemplateObjectMother.Create() };

            _repository.GetCollection().Returns(collection);

            var result = _controller.GetCollection();

            result.Should().BeJsonSuccessResult();
        }

        #endregion
    }
}
