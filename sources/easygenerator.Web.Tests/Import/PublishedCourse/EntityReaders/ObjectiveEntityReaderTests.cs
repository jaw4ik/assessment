using System;
using System.Linq;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Import.PublishedCourse.EntityReaders;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json.Linq;
using NSubstitute;

namespace easygenerator.Web.Tests.Import.PublishedCourse.EntityReaders
{
    [TestClass]
    public class ObjectiveEntityReaderTest
    {
        private ObjectiveEntityReader _objectiveEntityReader;
        private IEntityFactory _entityFactory;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();

            _entityFactory.Objective(Arg.Any<string>(), Arg.Any<string>())
                .Returns(info => 
                    ObjectiveObjectMother.Create(info.Args().ElementAt(0).As<string>(),
                        info.Args().ElementAt(1).As<string>()));

            _objectiveEntityReader = new ObjectiveEntityReader(_entityFactory);
        }

        #region ReadObjective

        [TestMethod]
        public void ReadObjective_ShouldReadObjectiveFromPublishedPackage()
        {
            //Arrange
            Guid objectiveId = Guid.NewGuid();
            string objectiveTitle = "Some objective title";
            string createdBy = "test@easygenerator.com";

            var courseData = JObject.Parse( String.Format("{{ title: 'SomeCourseTitle', objectives: [ {{ id: '{0}', title: '{1}' }} ] }}",
                               objectiveId.ToString("N").ToLower(), objectiveTitle));

            //Act
            var objective = _objectiveEntityReader.ReadObjective(objectiveId, createdBy, courseData);

            //Assert
            objective.Title.Should().Be(objectiveTitle);
            objective.CreatedBy.Should().Be(createdBy);
        }

        #endregion

    }
}
