using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class DocumentTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        private readonly DateTime _currentDate = new DateTime(2014, 3, 19);

        [TestInitialize]
        public void InitializeContext()
        {
            DateTimeWrapper.Now = () => _currentDate;
        }

        #region Constructor

        [TestMethod]
        public void Document_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            Action action = () => DocumentObjectMother.CreateWithTitle(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Document_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            Action action = () => DocumentObjectMother.CreateWithTitle(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Document_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            Action action = () => DocumentObjectMother.CreateWithTitle(new string('*', 256));

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Document_ShouldThrowArgumentNullException_WhenEmbedCodeIsNull()
        {
            Action action = () => DocumentObjectMother.CreateWithEmbedCOde(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("embedCode");
        }

        [TestMethod]
        public void Document_ShouldThrowArgumentException_WhenEmbedCodeIsEmpty()
        {
            Action action = () => DocumentObjectMother.CreateWithEmbedCOde(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("embedCode");
        }

        [TestMethod]
        public void Document_ShouldThrowArgumentOutOfRangeException_WhenEmbedCodeIsLongerThan65535()
        {
            Action action = () => DocumentObjectMother.CreateWithEmbedCOde(new string('*', 65536));

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("embedCode");
        }

        [TestMethod]
        public void Document_ShouldCreateDocumentInstance()
        {
            const string title = "title";
            const string embedCode = "<iframe></iframe>";
            const DocumentType type = DocumentType.Office;
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var document = DocumentObjectMother.Create(title, embedCode, type, CreatedBy);

            document.Id.Should().NotBeEmpty();
            document.Title.Should().Be(title);
            document.EmbedCode.Should().Be(embedCode);
            document.DocumentType.Should().Be(type);
            document.CreatedOn.Should().Be(DateTime.MaxValue);
            document.ModifiedOn.Should().Be(DateTime.MaxValue);
            document.LearningPathCollection.Should().BeEmpty();
            document.CreatedBy.Should().Be(CreatedBy);
            document.ModifiedBy.Should().Be(CreatedBy);;
        }

        #endregion

        #region Update title

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            var document = DocumentObjectMother.Create();

            Action action = () => document.UpdateTitle(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            var document = DocumentObjectMother.Create();

            Action action = () => document.UpdateTitle(String.Empty, ModifiedBy);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            var document = DocumentObjectMother.Create();

            Action action = () => document.UpdateTitle(new string('*', 256), ModifiedBy);

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateTitle()
        {
            const string title = "title";
            var document = DocumentObjectMother.Create();

            document.UpdateTitle(title, ModifiedBy);

            document.Title.Should().Be(title);
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var document = DocumentObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            document.UpdateTitle("title", ModifiedBy);

            document.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var document = DocumentObjectMother.Create();

            Action action = () => document.UpdateTitle("Some title", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var document = DocumentObjectMother.Create();

            Action action = () => document.UpdateTitle("Some title", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateMoidifiedBy()
        {
            var document = DocumentObjectMother.Create();
            var user = "Some user";

            document.UpdateTitle("Some title", user);

            document.ModifiedBy.Should().Be(user);
        }

        #endregion

        #region Update embedCode

        [TestMethod]
        public void UpdateEmbedCode_ShouldThrowArgumentNullException_WhenEmbedCodeIsNull()
        {
            var document = DocumentObjectMother.Create();

            Action action = () => document.UpdateEmbedCode(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("embedCode");
        }

        [TestMethod]
        public void UpdateEmbedCode_ShouldThrowArgumentException_WhenEmbedCodeIsEmpty()
        {
            var document = DocumentObjectMother.Create();

            Action action = () => document.UpdateEmbedCode(String.Empty, ModifiedBy);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("embedCode");
        }

        [TestMethod]
        public void UpdateEmbedCode_ShouldThrowArgumentOutOfRangeException_WhenEmbedCodeIsLongerThan65535()
        {
            var document = DocumentObjectMother.Create();

            Action action = () => document.UpdateEmbedCode(new string('*', 65536), ModifiedBy);

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("embedCode");
        }

        [TestMethod]
        public void UpdateEmbedCode_ShouldUpdateEmbedCode()
        {
            const string embedCode = "<iframe></iframe>";
            var document = DocumentObjectMother.Create();

            document.UpdateEmbedCode(embedCode, ModifiedBy);

            document.EmbedCode.Should().Be(embedCode);
        }

        [TestMethod]
        public void UpdateEmbedCode_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var document = DocumentObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            document.UpdateEmbedCode("<iframe></iframe>", ModifiedBy);

            document.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateEmbedCode_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var document = DocumentObjectMother.Create();

            Action action = () => document.UpdateEmbedCode("<iframe></iframe>", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateEmbedCode_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var document = DocumentObjectMother.Create();

            Action action = () => document.UpdateEmbedCode("<iframe></iframe>", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateEmbedCode_ShouldUpdateMoidifiedBy()
        {
            var document = DocumentObjectMother.Create();
            var user = "Some user";

            document.UpdateEmbedCode("<iframe></iframe>", user);

            document.ModifiedBy.Should().Be(user);
        }

        #endregion

        #region Define createdBy

        [TestMethod]
        public void DefineCreatedBy_ShouldThrowArgumentNullException_WhenCreatedByIsNull()
        {
            var document = DocumentObjectMother.Create();

            Action action = () => document.DefineCreatedBy(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("createdBy");
        }

        [TestMethod]
        public void DefineCreatedBy_ShouldThrowArgumentException_WhenCreatedByIsEmpty()
        {
            var document = DocumentObjectMother.Create();

            Action action = () => document.DefineCreatedBy(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("createdBy");
        }


        [TestMethod]
        public void DefineCreatedBy_ShouldUpdateCreatedBy()
        {
            const string createdBy = "createdBy";
            const string updatedCreatedBy = "updatedCreatedBy";
            var document = DocumentObjectMother.CreateWithCreatedBy(createdBy);

            document.DefineCreatedBy(updatedCreatedBy);

            document.CreatedBy.Should().Be(updatedCreatedBy);
        }

        [TestMethod]
        public void DefineCreatedBy_ShouldUpdateModifiedBy()
        {
            const string createdBy = "createdBy";
            const string updatedCreatedBy = "updatedCreatedBy";
            var document = DocumentObjectMother.CreateWithCreatedBy(createdBy);

            document.DefineCreatedBy(updatedCreatedBy);

            document.ModifiedBy.Should().Be(updatedCreatedBy);
        }


        #endregion

        #region LearningPaths

        [TestMethod]
        public void LearningPaths_ShouldReturnLearningPaths()
        {
            //Arrange
            var document = DocumentObjectMother.Create();
            var learningPath = LearningPathObjectMother.Create();

            document.LearningPathCollection = new List<LearningPath>()
            {
                learningPath
            };

            //Act
            var result = document.LearningPaths;

            //Assert
            result.Should().Contain(learningPath);
        }

        #endregion
    }
}
