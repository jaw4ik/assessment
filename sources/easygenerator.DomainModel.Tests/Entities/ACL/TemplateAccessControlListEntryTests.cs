using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.ACL;
using easygenerator.DomainModel.Tests.ObjectMothers;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.DomainModel.Tests.Entities.ACL
{
    [TestClass]
    public class TemplateAccessControlListEntryTests
    {
        private TemplateAccessControlListEntry templateACLEntry;
        private Template template;

        [TestInitialize]
        public void Initialize()
        {
            templateACLEntry = null;
            template = TemplateObjectMother.Create();
        }

        [TestMethod]
        public void Ctor_ShouldThrowExceptionIfTemplateIsNull()
        {
            Action action = () => templateACLEntry = new TemplateAccessControlListEntry(null, "identity");
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("template");
        }

        [TestMethod]
        public void Ctor_ShouldInitTemplateWithProperValue()
        {
            templateACLEntry = new TemplateAccessControlListEntry(template, "identity");
            templateACLEntry.Template.Should().Be(template);
        }

        [TestMethod]
        public void Ctor_ShouldThrowExceptionIfIdentityIsNull()
        {
            Action action = () => templateACLEntry = new TemplateAccessControlListEntry(template, null);
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("userIdentity");
        }

        [TestMethod]
        public void Ctor_ShouldThrowExceptionIfIdentityIsEmpty()
        {
            Action action = () => templateACLEntry = new TemplateAccessControlListEntry(template, string.Empty);
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("userIdentity");
        }

        [TestMethod]
        public void Ctor_ShouldInitIdentityWithProperValue()
        {
            templateACLEntry = new TemplateAccessControlListEntry(template, "identity");
            templateACLEntry.UserIdentity.Should().Be("identity");
        }
    }
}
