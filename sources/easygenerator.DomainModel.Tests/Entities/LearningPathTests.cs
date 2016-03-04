using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class LearningPathTests
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
        public void LearningPath_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            Action action = () => LearningPathObjectMother.CreateWithTitle(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void LearningPath_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            Action action = () => LearningPathObjectMother.CreateWithTitle(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void LearningPath_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            Action action = () => LearningPathObjectMother.CreateWithTitle(new string('*', 256));

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void LearningPath_ShouldThrowArgumentNullException_WhenCreatedByIsNull()
        {
            Action action = () => LearningPathObjectMother.CreateWithCreatedBy(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("createdBy");
        }


        [TestMethod]
        public void LearningPath_ShouldThrowArgumentException_WhenCreatedByIsEmpty()
        {
            Action action = () => LearningPathObjectMother.CreateWithCreatedBy(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("createdBy");
        }

        [TestMethod]
        public void LearningPath_ShouldCreateLearningPathInstance()
        {
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var learningPath = LearningPathObjectMother.Create(title, CreatedBy);

            learningPath.Id.Should().NotBeEmpty();
            learningPath.Title.Should().Be(title);
            learningPath.CreatedOn.Should().Be(DateTime.MaxValue);
            learningPath.ModifiedOn.Should().Be(DateTime.MaxValue);
            learningPath.CreatedBy.Should().Be(CreatedBy);
            learningPath.ModifiedBy.Should().Be(CreatedBy);
            learningPath.LearningPathCompanies.Should().BeEmpty();
        }

        #endregion

        #region Update title

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            var learningPath = LearningPathObjectMother.Create();

            Action action = () => learningPath.UpdateTitle(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            var learningPath = LearningPathObjectMother.Create();

            Action action = () => learningPath.UpdateTitle(String.Empty, ModifiedBy);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            var learningPath = LearningPathObjectMother.Create();

            Action action = () => learningPath.UpdateTitle(new string('*', 256), ModifiedBy);

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateTitle()
        {
            const string title = "title";
            var learningPath = LearningPathObjectMother.Create();

            learningPath.UpdateTitle(title, ModifiedBy);

            learningPath.Title.Should().Be(title);
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var learningPath = LearningPathObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            learningPath.UpdateTitle("title", ModifiedBy);

            learningPath.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var learningPath = LearningPathObjectMother.Create();

            Action action = () => learningPath.UpdateTitle("Some title", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var learningPath = LearningPathObjectMother.Create();

            Action action = () => learningPath.UpdateTitle("Some title", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateMoidifiedBy()
        {
            var learningPath = LearningPathObjectMother.Create();
            var user = "Some user";

            learningPath.UpdateTitle("Some title", user);

            learningPath.ModifiedBy.Should().Be(user);
        }

        #endregion

        #region GetLearningPathSettings

        [TestMethod]
        public void GetLearningPathSettings_ShouldReturnDefaultSettingsWhenTheyNotExist()
        {
            var learningPath = LearningPathObjectMother.Create();
            var defaultSettings = "{\"xApi\":{\"enabled\":true,\"required\":false,\"selectedLrs\":\"default\",\"lrs\":{\"uri\":\"\",\"credentials\":{\"username\":\"\",\"password\":\"\"},\"authenticationRequired\":false},\"allowedVerbs\":[\"started\",\"stopped\",\"passed\",\"failed\",\"mastered\",\"answered\",\"experienced\"]}}";
            var result = learningPath.GetLearningPathSettings();
            
            result.Should().Be(defaultSettings);
        }
        
        [TestMethod]
        public void GetLearningPathSettings_ShouldReturnSettingsDataWhenTheyExist()
        {
            var learningPath = LearningPathObjectMother.Create();
            var settings = "some settings";
            learningPath.Settings = new LearningPathSettings()
            {
                Data = settings
            };

            var result = learningPath.GetLearningPathSettings();

            result.Should().Be(settings);
        }

        #endregion

        #region SaveLearningPathSettings

        [TestMethod]
        public void SaveLearningPathSettings_ShouldUpdateSettings_WhenTheyAlreadyExist()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            const string settings = "settings";
            learningPath.Settings = new LearningPathSettings();

            //Act
            learningPath.SaveLearningPathSettings(settings);

            //Assert
            learningPath.Settings.Data.Should().Be(settings);
        }

        [TestMethod]
        public void SaveLearningPathSettings_ShouldAddSettings_WhenTheyDoNotExistYet()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            const string settings = "settings";
            
            //Act
            learningPath.SaveLearningPathSettings(settings);

            //Assert
            learningPath.Settings.LearningPath.Should().Be(learningPath);
            learningPath.Settings.Data.Should().Be(settings);
        }

        #endregion

        #region UpdatePackageUrl

        [TestMethod]
        public void UpdatePackageUrl_ShouldThowArgumentNullException_WhenParameterIsNull()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();

            //Act
            Action action = ()=> learningPath.UpdatePackageUrl(null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("packageUrl");
        }

        [TestMethod]
        public void UpdatePackageUrl_ShouldThowArgumentException_WhenParameterIsEmptyString()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();

            //Act
            Action action = () => learningPath.UpdatePackageUrl("");

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("packageUrl");
        }

        [TestMethod]
        public void UpdatePackageUrl_ShouldUpdatePackageUrl()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();

            //Act
            learningPath.UpdatePackageUrl("packageUrl");

            //Assert
            learningPath.PackageUrl.Should().Be("packageUrl");
        }

        #endregion

        #region UpdatePublicationUrl

        [TestMethod]
        public void UpdatePublicationUrl_ShouldThowArgumentNullException_WhenParameterIsNull()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();

            //Act
            Action action = () => learningPath.UpdatePublicationUrl(null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("publicationUrl");
        }

        [TestMethod]
        public void UpdatePublicationUrl_ShouldThowArgumentException_WhenParameterIsEmptyString()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();

            //Act
            Action action = () => learningPath.UpdatePublicationUrl("");

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("publicationUrl");
        }

        [TestMethod]
        public void UpdatePublicationUrl_ShouldUpdatePackageUrl()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();

            //Act
            learningPath.UpdatePublicationUrl("publicationUrl");

            //Assert
            learningPath.PublicationUrl.Should().Be("publicationUrl");
        }

        #endregion

        #region ResetPublicationUrl

        [TestMethod]
        public void ResetPublicationUrl_ShouldSetNullToPublicationUrl()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            learningPath.UpdatePublicationUrl("publicationUrl");

            //Act
            learningPath.ResetPublicationUrl();

            //Assert
            learningPath.PublicationUrl.Should().Be(null);
        }

        #endregion

        #region External publish

        [TestMethod]
        public void Companies_ShouldReturnLearningPathCompanies()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var company = CompanyObjectMother.Create();

            learningPath.LearningPathCompanies = new List<Company>()
            {
                company
            };

            //Act
            var result = learningPath.Companies;

            //Assert
            result.Should().Contain(company);
        }

        [TestMethod]
        public void SetPublishedToExternalLms_ShouldAddCompanyToCollection_WhenLearningPathDoesNotContainThisCompany()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var company = CompanyObjectMother.Create();
            //Act
            learningPath.SetPublishedToExternalLms(company);

            //Assert
            learningPath.Companies.Should().Contain(company);
        }

        #endregion

        #region AddEntity

        [TestMethod]
        public void AddEntity_ShouldThrowNullArgumentException_WhenEntityIsNull()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();

            //Act
            Action action = () => learningPath.AddEntity(null, null, ModifiedBy);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("entity");
        }

        [TestMethod]
        public void AddEntity_ShouldUpdateModifiedOnDate()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course = CourseObjectMother.Create();
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            //Act
            learningPath.AddEntity(course, null, ModifiedBy);

            //Assert
            learningPath.ModifiedOn.Should().Be(DateTime.MaxValue);
        }

        [TestMethod]
        public void AddEntity_ShouldAddEntityToLearningPath()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course = CourseObjectMother.Create();
            var document = DocumentObjectMother.Create();

            //Act
            learningPath.AddEntity(course, null, ModifiedBy);
            learningPath.AddEntity(document, null, ModifiedBy);

            //Assert
            learningPath.Entities.Should().Contain(course);
            learningPath.Entities.Should().Contain(document);
        }


        [TestMethod]
        public void AddEntity_ShouldUpdateEntitiesOrderedListAndInsertToEnd_WhenIndexIsNotDefined()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course = CourseObjectMother.Create();
            var document = DocumentObjectMother.Create();
            learningPath.CoursesCollection = new Collection<Course>() { course };
            var entitiesCollection = new List<ILearningPathEntity>() { course };
            learningPath.UpdateEntitiesOrder(entitiesCollection, ModifiedBy);
            entitiesCollection.Add(document);
            var order = String.Join(",", entitiesCollection.ConvertAll(o => o.Id.ToString()).ToArray());
            //Act
            learningPath.AddEntity(document, null, ModifiedBy);

            //Assert
            learningPath.EntitiesOrder.Should().Be(order);
        }

        [TestMethod]
        public void AddEntity_ShouldUpdateEntitiesOrderedListAndInsertToPosition_WhenIndexIsDefined()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course = CourseObjectMother.Create();
            var document = DocumentObjectMother.Create();
            var course2 = CourseObjectMother.Create();
            const int position = 1;
            learningPath.CoursesCollection = new Collection<Course>() { course };
            learningPath.DocumentsCollection = new Collection<Document>() { document };
            var entitiesCollection = new List<ILearningPathEntity>() { course, document };
            learningPath.UpdateEntitiesOrder(entitiesCollection, ModifiedBy);
            entitiesCollection.Insert(position, course2);
            var order = String.Join(",", entitiesCollection.ConvertAll(o => o.Id.ToString()).ToArray());
            //Act
            learningPath.AddEntity(course2, 1, ModifiedBy);

            //Assert
            learningPath.EntitiesOrder.Should().Be(order);
        }

        [TestMethod]
        public void AddEntity_ShouldThrowNullArgumentException_WhenModifiedByIsNull()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course = CourseObjectMother.Create();

            //Act
            Action action = () => learningPath.AddEntity(course, null, null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddEntity_ShouldThrowNullArgumentException_WhenModifiedByIsEmpty()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course = CourseObjectMother.Create();

            //Act
            Action action = () => learningPath.AddEntity(course, null, null);

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddEntity_ShouldUpdateMoidifiedBy()
        {
            var learningPath = LearningPathObjectMother.Create();
            var course = CourseObjectMother.Create();
            var user = "Some user";

            learningPath.AddEntity(course, null, user);

            learningPath.ModifiedBy.Should().Be(user);
        }

        #endregion

        #region RemoveEntity

        [TestMethod]
        public void RemoveEntity_ShouldThrowNullArgumentException_WhenEntityIsNull()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();

            //Act
            Action action = () => learningPath.RemoveEntity(null, ModifiedBy);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("entity");
        }

        [TestMethod]
        public void RemoveEntity_ShouldUpdateModifiedOnDate()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course = CourseObjectMother.Create();
            learningPath.CoursesCollection = new Collection<Course>()
            {
                course
            };

            DateTimeWrapper.Now = () => DateTime.MaxValue;

            //Act
            learningPath.RemoveEntity(course, ModifiedBy);

            //Assert
            learningPath.ModifiedOn.Should().Be(DateTime.MaxValue);
        }

        [TestMethod]
        public void RemoveEntity_ShouldRemoveEntityFromLearningPath()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course = CourseObjectMother.Create();
            learningPath.CoursesCollection = new Collection<Course>()
            {
                course
            };

            //Act
            learningPath.RemoveEntity(course, ModifiedBy);

            //Assert
            learningPath.Entities.Should().NotContain(course);
        }

        [TestMethod]
        public void RemoveEntity_ShouldUpdateEntitiesOrderedList()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course = CourseObjectMother.Create();
            learningPath.CoursesCollection = new Collection<Course>()
            {
                course
            };

            var entitiesCollection = new List<ILearningPathEntity>() { course };
            learningPath.UpdateEntitiesOrder(entitiesCollection, ModifiedBy);
            //Act
            learningPath.RemoveEntity(course, ModifiedBy);

            //Assert
            learningPath.EntitiesOrder.Should().BeNull();
        }

        [TestMethod]
        public void RemoveEntity_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course = CourseObjectMother.Create();
            //Act
            Action action = () => learningPath.RemoveEntity(course, null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveEntity_ShouldThrowArgumentNullException_WhenModifiedByIsEmpty()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course = CourseObjectMother.Create();
            //Act
            Action action = () => learningPath.RemoveEntity(course, "");

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveEntity_ShouldUpdateMoidifiedBy()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course = CourseObjectMother.Create();
            learningPath.CoursesCollection = new Collection<Course>()
            {
                course
            };

            //Act
            learningPath.RemoveEntity(course, ModifiedBy);

            //Assert
            learningPath.ModifiedBy.Should().Be(ModifiedBy);
        }

        #endregion

        #region UpdateEntitiesOrder

        [TestMethod]
        public void UpdateEntitiesOrder_ShouldUpdateEntitiesOrderedList()
        {
            //Arrange
            var user = "some user";
            var learningPath = LearningPathObjectMother.Create();
            var course1 = CourseObjectMother.Create();
            var course2 = CourseObjectMother.Create();
            var document1 = DocumentObjectMother.Create();
            var entitiesCollection = new List<ILearningPathEntity>()
            {
                course2,
                course1,
                document1
            };
            var result = String.Join(",", entitiesCollection.ConvertAll(o => o.Id.ToString()).ToArray());
            //Act
            learningPath.UpdateEntitiesOrder(entitiesCollection, user);

            //Assert
            learningPath.EntitiesOrder.Should().Be(result);
        }

        [TestMethod]
        public void UpdateEntitiesOrder_ShouldUpdateModifiedOn()
        {
            //Arrange
            var user = "some user";
            var learningPath = LearningPathObjectMother.Create();
            DateTimeWrapper.Now = () => DateTime.Now;

            var dateTime = DateTime.Now.AddDays(1);
            DateTimeWrapper.Now = () => dateTime;

            var entitiesCollection = new List<ILearningPathEntity>()
            {
                CourseObjectMother.Create()
            };

            //Act
            learningPath.UpdateEntitiesOrder(entitiesCollection, user);

            //Assert
            learningPath.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateEntitiesOrder_ShouldUpdateModifiedBy()
        {
            //Arrange
            var user = "some user";
            var learningPath = LearningPathObjectMother.Create();
            var entitiesCollection = new List<ILearningPathEntity>()
            {
                CourseObjectMother.Create()
            };

            //Act
            learningPath.UpdateEntitiesOrder(entitiesCollection, user);

            //Assert
            learningPath.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void UpdateEntitiesOrder_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var entitiesCollection = new List<ILearningPathEntity>()
            {
                CourseObjectMother.Create()
            };

            //Act
            Action action = () => learningPath.UpdateEntitiesOrder(entitiesCollection, null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateEntitiesOrder_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var entitiesCollection = new List<ILearningPathEntity>()
            {
                CourseObjectMother.Create()
            };

            //Act
            Action action = () => learningPath.UpdateEntitiesOrder(entitiesCollection, "");

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        #endregion

        #region Entities

        [TestMethod]
        public void Entities_ShouldReturnOrderedEntitiesCollection_WhenEntitiesOrderedListNotNull()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course1 = CourseObjectMother.Create();
            var document1 = DocumentObjectMother.Create();
            var document2 = DocumentObjectMother.Create();
            var course2 = CourseObjectMother.Create();
            learningPath.CoursesCollection = new Collection<Course>()
            {
                course2,
                course1
            };
            learningPath.DocumentsCollection = new Collection<Document>()
            {
                document2,
                document1
            };
            learningPath.EntitiesOrder = String.Format("{0},{1},{2},{3}", course1.Id, document2.Id, course2.Id, document1.Id);

            //Act
            var result = learningPath.Entities;

            //Assert
            result.First().Id.Should().Be(course1.Id);
            result.ToList()[1].Id.Should().Be(document2.Id);
            result.ToList()[2].Id.Should().Be(course2.Id);
        }

        [TestMethod]
        public void Entities_ShouldReturnAllEntitiesInCorrectOrder_WhenEntitiesOrderedListIsNotFull()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course1 = CourseObjectMother.Create();
            var course2 = CourseObjectMother.Create();
            var document1 = DocumentObjectMother.Create();
            var document2 = DocumentObjectMother.Create();
            learningPath.CoursesCollection = new Collection<Course>()
            {
                course2,
                course1
            };
            learningPath.DocumentsCollection = new Collection<Document>()
            {
                document2,
                document1
            };
            learningPath.EntitiesOrder = String.Format("{0},{1}", course1.Id, document2.Id);

            //Act
            var result = learningPath.Entities;

            //Assert
            result.Count().Should().Be(4);
            result.First().Should().Be(course1);
            result.ToList()[1].Should().Be(document2);
        }

        [TestMethod]
        public void Entities_ShouldReturnAllEntitiesInCorrectOrder_WhenEntitiesOrderedListIsOverfull()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var course1 = CourseObjectMother.Create();
            var document1 = DocumentObjectMother.Create();
            learningPath.DocumentsCollection = new Collection<Document>()
            {
                document1
            };
            learningPath.EntitiesOrder = String.Format("{0},{1}", document1.Id, course1.Id);

            //Act
            var result = learningPath.Entities;

            //Assert
            result.Count().Should().Be(1);
            result.First().Should().Be(document1);
        }

        #endregion
    }
}
