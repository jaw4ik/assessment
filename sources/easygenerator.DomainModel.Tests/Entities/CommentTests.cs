using System;
using easygenerator.DomainModel.Entities;
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

        #region Context

        [TestMethod]
        public void Comment_ShouldThrowArgumentException_WhenContextIsNotJson()
        {
            Action action = () => CommentObjectMother.CreateWithContext("string");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("context");
        }

        [TestMethod]
        public void Comment_ShouldThrowArgumentException_WhenContextHasInvalidType()
        {
            Action action = () => CommentObjectMother.CreateWithContext("{type:'ddd'}");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("context.type");
        }

        #region Course Context

        [TestMethod]
        public void Comment_ShouldThrowArgumentException_WhenContextTypeIsCourse_AndContextPropertyIsNotDefined()
        {
            Action action = () => CommentObjectMother.CreateWithContext("{type:'course'}");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("context.property");
        }

        [TestMethod]
        public void Comment_ShouldThrowArgumentException_WhenContextTypeIsCourse_AndContextPropertyIsNotTitleOrIntroduction()
        {
            Action action = () => CommentObjectMother.CreateWithContext("{type:'course', property:'some'}");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("context.property");
        }

        [TestMethod]
        public void Comment_ShouldCreateComment_WhenContextTypeIsCourse_AndContextPropertyIsTitle()
        {
            var comment = CommentObjectMother.CreateWithContext("{type:'course', property:'title'}");

            comment.Should().BeOfType<Comment>();
        }

        [TestMethod]
        public void Comment_ShouldCreateComment_WhenContextTypeIsCourse_AndContextPropertyIsIntroduction()
        {
            var comment = CommentObjectMother.CreateWithContext("{type:'course', property:'introduction'}");

            comment.Should().BeOfType<Comment>();
        }

        #endregion

        #region Section Context

        [TestMethod]
        public void Comment_ShouldThrowArgumentException_WhenContextTypeIsSection_AndContextPropertyIsNotDefined()
        {
            Action action = () => CommentObjectMother.CreateWithContext("{type:'section', property: '', id:'id', title:'title'}");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("context.property");
        }

        [TestMethod]
        public void Comment_ShouldThrowArgumentException_WhenContextTypeIsSection_AndContextPropertyIsNotTitle()
        {
            Action action = () => CommentObjectMother.CreateWithContext("{type:'section', property:'some', id:'id', title:'title'}");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("context.property");
        }

        [TestMethod]
        public void Comment_ShouldCreateComment_WhenContextTypeIsSection()
        {
            var comment = CommentObjectMother.CreateWithContext("{type:'section', property:'title', id:'id', title:'title'}");

            comment.Should().BeOfType<Comment>();
        }

        [TestMethod]
        public void Comment_ShouldThrowArgumentException_WhenContextTypeIsSection_AndTitleIsNotDefined()
        {
            Action action = () => CommentObjectMother.CreateWithContext("{type:'section', property:'title', id:'id', title:''}");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("context.title");
        }

        [TestMethod]
        public void Comment_ShouldThrowArgumentException_WhenContextTypeIsSection_AndIdIsNotDefined()
        {
            Action action = () => CommentObjectMother.CreateWithContext("{type:'section', property:'title', title:'title'}");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("context.id");
        }

        #endregion

        #region Question Context

        [TestMethod]
        public void Comment_ShouldCreateComment_WhenContextTypeIsQuestion_AndContextPropertyIsNotDefined()
        {
            var comment =CommentObjectMother.CreateWithContext("{type:'question', property: '', id:'id', title:'title'}");

            comment.Should().BeOfType<Comment>();
        }

        [TestMethod]
        public void Comment_ShouldCreateComment_WhenContextTypeIsQuestion_AndContextPropertyIsVoiceOver()
        {
            var comment = CommentObjectMother.CreateWithContext("{type:'question', property: 'voiceOver', id:'id', title:'title'}");

            comment.Should().BeOfType<Comment>();
        }

        [TestMethod]
        public void Comment_ShouldCreateComment_WhenContextTypeIsQuestion_AndContextPropertyIsLearningContent()
        {
            var comment = CommentObjectMother.CreateWithContext("{type:'question', property: 'learningContent', id:'id', title:'title'}");

            comment.Should().BeOfType<Comment>();
        }

        [TestMethod]
        public void Comment_ShouldThrowArgumentException_WhenContextTypeIsQuestion_AndContextPropertyIsNotLearningContentOrTitle()
        {
            Action action = () => CommentObjectMother.CreateWithContext("{type:'question', property:'some', id:'id', title:'title'}");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("context.property");
        }

        [TestMethod]
        public void Comment_ShouldThrowArgumentException_WhenContextTypeIsQuestion_AndTitleIsNotDefined()
        {
            Action action = () => CommentObjectMother.CreateWithContext("{type:'question', property:'voiceOver', id:'id', title:''}");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("context.title");
        }

        [TestMethod]
        public void Comment_ShouldThrowArgumentException_WhenContextTypeIsQuestion_AndIdIsNotDefined()
        {
            Action action = () => CommentObjectMother.CreateWithContext("{type:'question', property:'voiceOver', title:'title'}");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("context.id");
        }

        #endregion

        #region Information content Context

        [TestMethod]
        public void Comment_ShouldCreateComment_WhenContextTypeIsInformationContent_AndContextPropertyIsNotDefined()
        {
            var comment = CommentObjectMother.CreateWithContext("{type:'informationContent', property: '', id:'id', title:'title'}");

            comment.Should().BeOfType<Comment>();
        }

        [TestMethod]
        public void Comment_ShouldCreateComment_WhenContextTypeIsInformationContent_AndContextPropertyIsVoiceOver()
        {
            var comment = CommentObjectMother.CreateWithContext("{type:'informationContent', property: 'voiceOver', id:'id', title:'title'}");

            comment.Should().BeOfType<Comment>();
        }

        [TestMethod]
        public void Comment_ShouldThrowArgumentException_WhenContextTypeIsLearningContent_AndContextPropertyIsNotVoiceOver()
        {
            Action action = () => CommentObjectMother.CreateWithContext("{type:'informationContent', property:'some', id:'id', title:'title'}");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("context.property");
        }

        [TestMethod]
        public void Comment_ShouldThrowArgumentException_WhenContextTypeIsInformationContent_AndTitleIsNotDefined()
        {
            Action action = () => CommentObjectMother.CreateWithContext("{type:'informationContent', property:'voiceOver', id:'id', title:''}");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("context.title");
        }

        [TestMethod]
        public void Comment_ShouldThrowArgumentException_WhenContextTypeIsInformationContent_AndIdIsNotDefined()
        {
            Action action = () => CommentObjectMother.CreateWithContext("{type:'informationContent', property:'voiceOver', title:'title'}");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("context.id");
        }

        #endregion

        #endregion

        #endregion
    }
}
