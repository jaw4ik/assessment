﻿using FluentAssertions;
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
        public void Course_ShouldCreateTemplateInstance()
        {
            const string name = "name";
            const string image = "image";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var course = TemplateObjectMother.Create(name, image, CreatedBy);

            course.Id.Should().NotBeEmpty();
            course.Name.Should().Be(name);
            course.Image.Should().Be(image);
            course.CreatedOn.Should().Be(DateTime.MaxValue);
            course.ModifiedOn.Should().Be(DateTime.MaxValue);
            course.CreatedBy.Should().Be(CreatedBy);
            course.ModifiedBy.Should().Be(CreatedBy);
        }

        #endregion
    }
}
