using System;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class CommentTests
    {
        #region Ctor

        [TestMethod]
        public void Comment_ShouldCreateInstance()
        {
            const string text = "text";
            const string createdByName = "user";
            const string createdBy = "user@user.user";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var comment = CommentObjectMother.Create(createdByName, createdBy, text);

            comment.Id.Should().NotBeEmpty();
            comment.Text.Should().Be(text);
            comment.CreatedOn.Should().Be(DateTime.MaxValue);
            comment.ModifiedOn.Should().Be(DateTime.MaxValue);
            comment.CreatedByName.Should().Be(createdByName);
            comment.CreatedBy.Should().Be(createdBy);
            comment.ModifiedBy.Should().Be(createdBy);
        }

        [TestMethod]
        public void Comment_ShouldThrowArgumentNullException_WhenCreatedByIsNull()
        {
            Action action = () => CommentObjectMother.CreateWithCreatedBy(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("createdBy");
        }

        [TestMethod]
        public void Comment_ShouldThrowArgumentException_WhenCreatedByIsEmptyString()
        {
            Action action = () => CommentObjectMother.CreateWithCreatedBy(" ");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("createdBy");
        }

        [TestMethod]
        public void Comment_ShouldThrowArgumentNullException_WhenTextIsNull()
        {
            Action action = () => CommentObjectMother.CreateWithText(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("text");
        }

        [TestMethod]
        public void Comment_ShouldThrowArgumentException_WhenTextIsEmptyString()
        {
            Action action = () => CommentObjectMother.CreateWithText(" ");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("text");
        }

        #endregion
    }
}
