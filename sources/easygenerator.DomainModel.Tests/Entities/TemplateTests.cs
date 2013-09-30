using FluentAssertions;
using easygenerator.DomainModel.Tests.ObjectMothers;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class TemplateTests
    {
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        #region Constructor

        [TestMethod]
        public void Template_ShouldThrowArgumentNullException_WhenNameIsNull()
        {
            Action action = () => TemplateObjectMother.Create(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("name");
        }

        [TestMethod]
        public void Template_ShouldThrowArgumentNullException_WhenImageIsNull()
        {
            Action action = () => TemplateObjectMother.CreateWithImage(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("image");
        }

        [TestMethod]
        public void Experience_ShouldCreateTemplateInstance()
        {
            const string name = "name";
            const string image = "image";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var experience = TemplateObjectMother.Create(name, image, CreatedBy);

            experience.Id.Should().NotBeEmpty();
            experience.Name.Should().Be(name);
            experience.Image.Should().Be(image);
            experience.CreatedOn.Should().Be(DateTime.MaxValue);
            experience.ModifiedOn.Should().Be(DateTime.MaxValue);
            experience.CreatedBy.Should().Be(CreatedBy);
            experience.ModifiedBy.Should().Be(CreatedBy);
        }

        #endregion
    }
}
