using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class DocumentControllerTests
    {
        private const string CreatedBy = "easygenerator@easygenerator.com";

        private DocumentController _controller;
        private IEntityFactory _entityFactory;
        private IDocumentRepository _documentRepository;
        private HttpContextBase _context;
        private IEntityMapper _entityMapper;
        private IPrincipal _user;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _documentRepository = Substitute.For<IDocumentRepository>();
            _entityMapper = Substitute.For<IEntityMapper>();
            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();

            _context.User.Returns(_user);

            _controller = new DocumentController(_documentRepository, _entityFactory, _entityMapper);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region Create

        [TestMethod]
        public void Create_ShouldAddDocument()
        {
            const string title = "Document title";
            _user.Identity.Name.Returns(CreatedBy);
            var document = DocumentObjectMother.CreateWithTitle(title);

            _entityFactory.Document(title, Arg.Any<string>(), Arg.Any<DocumentType>(), CreatedBy).Returns(document);

            _controller.Create(title, "<iframe></iframe>", DocumentType.PowerPoint);

            _documentRepository.Received().Add(Arg.Is<Document>(exp => exp.Title == title));
        }

        #endregion

        #region Delete document

        [TestMethod]
        public void Delete_ShouldReturnJsonSuccessResult()
        {
            var document = DocumentObjectMother.Create();

            var result = _controller.Delete(document);

            result.Should().BeJsonSuccessResult();
        }

        [TestMethod]
        public void Delete_ShouldRemoveDocument_WhenItNotNull()
        {
            var document = DocumentObjectMother.Create();

            _controller.Delete(document);

            _documentRepository.Received().Remove(document);
        }

        [TestMethod]
        public void Delete_ShouldDeleteDocumentFromLearningPath_WhenDocumentIsInLearningPath()
        {
            var document = Substitute.For<Document>();
            var documents = new Collection<Document>();
            documents.Add(document);

            var learningPath = Substitute.For<LearningPath>(); ;
            var learningPaths = new Collection<LearningPath>();
            learningPaths.Add(learningPath);

            learningPath.Entities.Returns(documents);
            document.LearningPaths.Returns(learningPaths);

            _controller.Delete(document);

            learningPath.Received().RemoveEntity(document, Arg.Any<string>());
        }

        [TestMethod]
        public void Delete_ReturnJsonSuccessResult_WhenDocumentIsNull()
        {
            var result = _controller.Delete(null);

            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region GetCollection

        [TestMethod]
        public void GetCollection_ShouldReturnJsonSuccessResult()
        {
            var collection = new Collection<Document>(new List<Document>() { DocumentObjectMother.Create() });

            _documentRepository.GetCollection().Returns(collection);

            var result = _controller.GetCollection();

            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region Update Title

        [TestMethod]
        public void UpdateTitle_ShouldReturnJsonErrorResult_WhenDocumentIsNull()
        {
            var result = _controller.UpdateTitle(null, String.Empty);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Document is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("documentNotFoundError");
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateDocumentTitle()
        {
            const string title = "updated title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var document = Substitute.For<Document>("Some title", "<iframe></iframe>", DocumentType.PowerPoint, CreatedBy);

            _controller.UpdateTitle(document, title);

            document.Received().UpdateTitle(title, user);
        }

        [TestMethod]
        public void UpdateTitle_ShouldReturnJsonSuccessResult()
        {
            var document = Substitute.For<Document>("Some title", "<iframe></iframe>", DocumentType.PowerPoint, CreatedBy);

            var result = _controller.UpdateTitle(document, String.Empty);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { document.ModifiedOn });
        }

        #endregion

        #region Update EmbedCode

        [TestMethod]
        public void UpdateEmbedCode_ShouldReturnJsonErrorResult_WhenDocumentIsNull()
        {
            var result = _controller.UpdateEmbedCode(null, String.Empty);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Document is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("documentNotFoundError");
        }

        [TestMethod]
        public void UpdateEmbedCode_ShouldUpdateDocumentEmbedCode()
        {
            const string embedCode = "<iframe></iframe>";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var document = Substitute.For<Document>("Some title", embedCode, DocumentType.PowerPoint, CreatedBy);

            _controller.UpdateEmbedCode(document, embedCode);

            document.Received().UpdateEmbedCode(embedCode, user);
        }

        [TestMethod]
        public void UpdateEmbedCode_ShouldReturnJsonSuccessResult()
        {
            var document = Substitute.For<Document>("Some title", "<iframe></iframe>", DocumentType.PowerPoint, CreatedBy);

            var result = _controller.UpdateEmbedCode(document, String.Empty);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { document.ModifiedOn });
        }

        #endregion

    }
}
