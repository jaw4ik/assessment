using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Components.ActionResults;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Extensions;
using easygenerator.Web.Storage;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using FluentAssertions.Common;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class TemplateControllerTests
    {
        private ITemplateRepository _repository;
        private IEntityMapper _entityMapper;
        private TemplateController _controller;
        private IPrincipal _user;
        private HttpContextBase _context;
        private ITemplateStorage _templateStorage;

        [TestInitialize]
        public void InitializeContext()
        {
            _repository = Substitute.For<ITemplateRepository>();
            _entityMapper = Substitute.For<IEntityMapper>();

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);

            _templateStorage = Substitute.For<ITemplateStorage>();
            _controller = new TemplateController(_repository, _entityMapper, _templateStorage);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region GetCollection

        [TestMethod]
        public void GetCollection_ShouldReturnJsonSuccessResult()
        {
            _user.Identity.Name.Returns("user@template.com");
            var previewUrl = "url";

            var template = TemplateObjectMother.CreateWithPreviewUrl(previewUrl);
            var collection = new Collection<Template>() { template };

            var resultActual = collection.Select(tmpl => new
            {
                Id = tmpl.Id.ToNString(),
                Manifest = "string",
                PreviewDemoUrl = tmpl.PreviewUrl,
                Order = tmpl.Order,
                IsNew = tmpl.IsNew,
                IsCustom = tmpl.IsCustom
            });
            var actual = new JsonSuccessResult(resultActual);

            _repository.GetCollection("user@template.com").Returns(collection);
            _entityMapper.Map(template).Returns(resultActual);

            var result = _controller.GetCollection();

            result.Should().BeJsonSuccessResult().And.Data.IsSameOrEqualTo(actual.Data);
        }

        #endregion

        #region GetTemplateResource

        [TestMethod]
        public void GetTemplateResource_ShouldReturnHttpNotFoundResult_WhenTemplateDoesNotExist()
        {
            //Arrange
            var template = TemplateObjectMother.Create();
            _repository.GetByName(template.Name, Arg.Any<string>()).Returns((Template)null);

            //Act
            var result = _controller.GetTemplateResource(template.Name, "resource");

            //Assert
            result.Should().BeHttpNotFoundResult();
        }

        [TestMethod]
        public void GetTemplateResource_ShouldReturnHttpNotFoundResult_WhenResourceFileDoesNotExist()
        {
            //Arrange
            var resource = "resourceUrl";
            var template = TemplateObjectMother.Create();
            _repository.GetByName(template.Name, Arg.Any<string>()).Returns(template);
            _templateStorage.FileExists(template, resource).Returns(false);

            //Act
            var result = _controller.GetTemplateResource(template.Name, resource);

            //Assert
            result.Should().BeHttpNotFoundResult();
        }

        [TestMethod]
        public void GetTemplateResource_ShouldReturnFilePathResult()
        {
            //Arrange
            var resource = "resourceUrl";
            var template = TemplateObjectMother.Create();
            _repository.GetByName(template.Name, Arg.Any<string>()).Returns(template);
            _templateStorage.FileExists(template, resource).Returns(true);
            _templateStorage.GetAbsoluteFilePath(template, resource).Returns("absoluteFilePath");

            //Act
            var result = _controller.GetTemplateResource(template.Name, resource);

            //Assert
            result.Should().BeFilePathResult();
        }

        #endregion

        #region GetCustomTemplatesInfo

        [TestMethod]
        public void GetCustomTemplatesInfo_ShouldReturnInfo()
        {
            //Arrgange
            var template = TemplateObjectMother.Create();
            _templateStorage.TemplateDirectoryExist(template).Returns(true);
            _repository.GetCollection().Returns(new Collection<Template>() { template });

            //Act
            var result = _controller.GetCustomTemplatesInfo();

            //Assert
            result.Should().BeJsonDataResult().And.Data.ShouldBeEquivalentTo(new List<object>()
            {
                new
                {
                    template.Name,
                    Id = template.Id.ToNString()
                }
            });
        }

        #endregion
    }
}
