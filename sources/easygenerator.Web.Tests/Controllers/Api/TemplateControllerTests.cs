using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.ActionResults;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Extensions;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using FluentAssertions.Common;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.Collections.ObjectModel;
using System.Linq;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class TemplateControllerTests
    {
        private ITemplateRepository _repository;
        private ManifestFileManager _manifestFileManager;
        private TemplateController _controller;

        [TestInitialize]
        public void InitializeContext()
        {
            _repository = Substitute.For<ITemplateRepository>();
            _manifestFileManager = Substitute.For<ManifestFileManager>(Arg.Any<PhysicalFileManager>());
            _controller = new TemplateController(_repository, _manifestFileManager);
        }

        #region GetCollection

        [TestMethod]
        public void GetCollection_ShouldReturnJsonSuccessResult()
        {
            var previewUrl = "url";

            var template = TemplateObjectMother.CreateWithPreviewUrl(previewUrl);
            var collection = new Collection<Template>() { template };

            var resultActual = collection.Select(tmpl => new
            {
                Id = tmpl.Id.ToNString(),
                Manifest = "string",
                PreviewDemoUrl = tmpl.PreviewUrl,
                Order = tmpl.Order,
                IsNew = tmpl.IsNew
            });
            var actual = new JsonSuccessResult(resultActual);

            _repository.GetCollection().Returns(collection);

            var result = _controller.GetCollection();

            result.Should().BeJsonSuccessResult().And.Data.IsSameOrEqualTo(actual.Data);
        }

        #endregion
    }
}
