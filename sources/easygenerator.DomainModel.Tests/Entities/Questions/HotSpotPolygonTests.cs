using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Events.QuestionEvents.HotSpotEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities.Questions
{
    [TestClass]
    public class HotSpotPolygonTests
    {
        private const string points = "[{x:1,y:1},{x:5,y:1},{x:5,y:5},{x:1,y:5}]";
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        #region Constructor

        [TestMethod]
        public void HotSpotPolygon_ShouldThrowArgumentNullException_WhenPointsIsNull()
        {
            Action action = () => HotSpotPolygonObjectMother.CreateWithPoints(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("points");
        }

        [TestMethod]
        public void HotSpotPolygon_ShouldThrowArgumentException_WhenPointsIsEmpty()
        {
            Action action = () => HotSpotPolygonObjectMother.CreateWithPoints(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("points");
        }

        [TestMethod]
        public void HotSpotPolygon_ShouldCreateHotSpotPolygon()
        {
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var polygon = HotSpotPolygonObjectMother.Create(points, CreatedBy);

            polygon.Id.Should().NotBeEmpty();
            polygon.Points.Should().Be(points);
            polygon.CreatedOn.Should().Be(DateTime.MaxValue);
            polygon.ModifiedOn.Should().Be(DateTime.MaxValue);
            polygon.CreatedBy.Should().Be(CreatedBy);
            polygon.ModifiedBy.Should().Be(CreatedBy);
        }

        #endregion

        #region Change Position

        [TestMethod]
        public void Update_ShouldThrowArgumentNullException_WhenPointsIsNull()
        {
            var polygon = HotSpotPolygonObjectMother.Create();

            Action action = () => polygon.Update(null, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("points");
        }

        [TestMethod]
        public void Update_ShouldThrowArgumentException_WhenPointsIsEmpty()
        {
            var polygon = HotSpotPolygonObjectMother.Create();

            Action action = () => polygon.Update(String.Empty, String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("points");
        }


        [TestMethod]
        public void Update_ShouldThrowArgumentException_WhenPointsIsInIncorrectFormat()
        {
            var polygon = HotSpotPolygonObjectMother.Create();

            Action action = () => polygon.Update("incorrectFormat", String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("points");
        }

        [TestMethod]
        public void Update_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var polygon = HotSpotPolygonObjectMother.Create();

            Action action = () => polygon.Update(points, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void Update_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var polygon = HotSpotPolygonObjectMother.Create();

            Action action = () => polygon.Update(points, String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void Update_ShouldUpdatePoints()
        {
            //Arrange

            var polygon = HotSpotPolygonObjectMother.CreateWithPoints(points);

            //Act
            polygon.Update(points, ModifiedBy);

            //Assert
            polygon.Points.Should().Be(points);
        }

        [TestMethod]
        public void ChangePosition_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var polygon = HotSpotPolygonObjectMother.Create(points);

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            polygon.Update(points, ModifiedBy);

            polygon.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void ChangePosition_ShouldUpdateModifiedBy()
        {
            var polygon = HotSpotPolygonObjectMother.Create();
            const string user = "user";

            polygon.Update(points, user);

            polygon.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void ChangePosition_ShouldAddHotSpotPolygonChangedEvent()
        {
            var polygon = HotSpotPolygonObjectMother.Create();

            polygon.Update(points, "username");

            polygon.Events.Should().HaveCount(1).And.OnlyContain(e => e.GetType() == typeof(HotSpotPolygonUpdatedEvent));
        }

        #endregion
    }
}
