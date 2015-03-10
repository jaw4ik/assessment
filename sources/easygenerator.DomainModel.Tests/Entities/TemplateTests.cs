using System.Linq;
using easygenerator.DomainModel.Entities;
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
        public void Ctor_ShouldCreateTemplateInstance()
        {
            const string name = "name";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var template = TemplateObjectMother.Create(name, CreatedBy);

            template.Id.Should().NotBeEmpty();
            template.Name.Should().Be(name);
            template.CreatedOn.Should().Be(DateTime.MaxValue);
            template.ModifiedOn.Should().Be(DateTime.MaxValue);
            template.CreatedBy.Should().Be(CreatedBy);
            template.ModifiedBy.Should().Be(CreatedBy);
        }

        [TestMethod]
        public void Ctor_ShouldCreateTemplateInstanceWithPreviewUrl()
        {
            const string previewUrl = "preview_url";

            var template = TemplateObjectMother.CreateWithPreviewUrl(previewUrl);

            template.PreviewUrl.Should().Be(previewUrl);
        }

        [TestMethod]
        public void Ctor_ShouldInitACL()
        {
            var template = TemplateObjectMother.CreateWithPreviewUrl("preview_url");
            var template2 = TemplateObjectMother.Create();

            template.AccessControlList.Should().NotBeNull();
            template.AccessControlList.Count.Should().Be(0);

            template2.AccessControlList.Should().NotBeNull();
            template2.AccessControlList.Count.Should().Be(0);
        }

        #endregion

        #region GrantAccessTo

        [TestMethod]
        public void GrantAccessTo_ShouldNotAddUsersToACL_IfNotCustom()
        {
            var template = TemplateObjectMother.Create();
            // mark template as custom
            template.GrantAccessTo("*");
            template.GrantAccessTo("aa@aa.aa");
            template.AccessControlList.Count.Should().Be(1);
        }

        [TestMethod]
        public void GrantAccessTo_ShouldAddUsersToACL_IfIsCustom()
        {
            var template = TemplateObjectMother.Create();
            // mark template as custom
            template.GrantAccessTo("*");
            template.GrantAccessTo("aa@aa.aa", "bb@bb.bb");
        }

        [TestMethod]
        public void GrantAccessTo_ShouldAddOnlyUniqueUsersToACL()
        {
            var template = TemplateObjectMother.Create();
            template.GrantAccessTo("aa@aa.aa", "bb@bb.bb", "bb@bb.bb", "aa@aa.aa");
            template.AccessControlList.Count.Should().Be(2);
            template.AccessControlList.ElementAt(0).UserIdentity.Should().Be("aa@aa.aa");
            template.AccessControlList.ElementAt(1).UserIdentity.Should().Be("bb@bb.bb");
        }
        #endregion
    }
}
