using System;
using easygenerator.PublicationServer.Models;
using easygenerator.PublicationServer.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.PublicationServer.Tests.Models
{
    [TestClass]
    public class PublicationTests
    {
        private string ownerEmail = "ownerEmail";
        private string publicPath = "publicPath";

        [TestInitialize]
        public void Init()
        {
            DateTimeWrapper.Now = () => DateTime.MinValue;
        }

        [TestMethod]
        public void Ctor_ShouldThrowArgumentException_IfIdIsEmpty()
        {
            Action action = () => { new Publication(Guid.Empty, ownerEmail, publicPath); };
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("id");
        }

        [TestMethod]
        public void Ctor_ShouldThrowArgumentException_IfEmailIsNull()
        {
            Action action = () => { new Publication(Guid.NewGuid(), null, publicPath); };
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("ownerEmail");
        }

        [TestMethod]
        public void Ctor_ShouldThrowArgumentException_IfEmailIsEmpty()
        {
            Action action = () => { new Publication(Guid.NewGuid(), "", publicPath); };
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("ownerEmail");
        }

        [TestMethod]
        public void Ctor_ShouldThrowArgumentException_IfEmailIsWhitespace()
        {
            Action action = () => { new Publication(Guid.NewGuid(), "  ", publicPath); };
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("ownerEmail");
        }

        [TestMethod]
        public void Ctor_ShouldThrowArgumentException_IfTitleIsNull()
        {
            Action action = () => { new Publication(Guid.NewGuid(), ownerEmail, null); };
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("publicPath");
        }

        [TestMethod]
        public void Ctor_ShouldThrowArgumentException_IfTitleIsEmpty()
        {
            Action action = () => { new Publication(Guid.NewGuid(), ownerEmail, ""); };
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("publicPath");
        }

        [TestMethod]
        public void Ctor_ShouldThrowArgumentException_IfTitleIsWhitespace()
        {
            Action action = () => { new Publication(Guid.NewGuid(), ownerEmail, "   "); };
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("publicPath");
        }

        [TestMethod]
        public void Ctor_ShouldInitInstanceWithCorrectValues()
        {
            var id = Guid.NewGuid();
            var publication = new Publication(id, ownerEmail, publicPath);
            publication.CreatedOn.Should().Be(DateTimeWrapper.Now());
            publication.Id.Should().Be(id);
            publication.ModifiedOn.Should().Be(DateTimeWrapper.Now());
            publication.OwnerEmail.Should().Be(ownerEmail);
            publication.PublicPath.Should().Be(publicPath);
        }
    }
}
