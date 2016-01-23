using System;
using easygenerator.PublicationServer.Models;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.PublicationServer.Tests.Models
{
    [TestClass]
    public class PublicationTests
    {
        private string ownerEmail = "ownerEmail";

        [TestInitialize]
        public void Init()
        {
            DateTimeWrapper.Now = () => DateTime.MinValue;
        }

        [TestMethod]
        public void Ctor_ShouldThrowArgumentException_IfIdIsEmpty()
        {
            Action action = () => { new Publication(Guid.Empty, ownerEmail); };
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("id");
        }

        [TestMethod]
        public void Ctor_ShouldThrowArgumentException_IfEmailIsNull()
        {
            Action action = () => { new Publication(Guid.NewGuid(), null); };
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("ownerEmail");
        }

        [TestMethod]
        public void Ctor_ShouldThrowArgumentException_IfEmailIsEmpty()
        {
            Action action = () => { new Publication(Guid.NewGuid(), ""); };
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("ownerEmail");
        }

        [TestMethod]
        public void Ctor_ShouldThrowArgumentException_IfEmailIsWhitespace()
        {
            Action action = () => { new Publication(Guid.NewGuid(), "  "); };
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("ownerEmail");
        }

        [TestMethod]
        public void Ctor_ShouldInitInstanceWithCorrectValues()
        {
            var id = Guid.NewGuid();
            var publication = new Publication(id, ownerEmail);
            publication.CreatedOn.Should().Be(DateTimeWrapper.Now());
            publication.Id.Should().Be(id);
            publication.ModifiedOn.Should().Be(DateTimeWrapper.Now());
            publication.OwnerEmail.Should().Be(ownerEmail);
            publication.SearchId.Should().NotBe(Guid.Empty);
        }
    }
}
