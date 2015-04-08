using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents.HotSpotEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.DomainEvents.ChangeTracking.Events;
using easygenerator.Web.DomainEvents.ChangeTracking.Trackers;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.Linq;

namespace easygenerator.Web.Tests.DomainEvents.ChangeTracking.Trackers
{
    [TestClass]
    public class HotSpotPolygonChangeTrackerTests
    {
        private HotSpotPolygonChangeTracker _tracker;
        private IDomainEventPublisher _publisher;

        [TestInitialize]
        public void Initialize()
        {
            _publisher = Substitute.For<IDomainEventPublisher>();
            _tracker = new HotSpotPolygonChangeTracker(_publisher);
        }

        #region Handlers

        [TestMethod]
        public void Handler_HotSpotPolygonUpdatedEvent_Should_Publish_AnswerChangedEvent()
        {
            //Act
            _tracker.Handle(new HotSpotPolygonUpdatedEvent(HotSpotPolygonObjectMother.Create()));

            //Assert
            ShouldPublishPolygonChangedEvent();
        }

        [TestMethod]
        public void Handler_HotSpotPolygonCreatedEvent_Should_Publish_AnswerChangedEvent()
        {
            //Act
            _tracker.Handle(new HotSpotPolygonCreatedEvent(HotSpotPolygonObjectMother.Create()));

            //Assert
            ShouldPublishPolygonChangedEvent();
        }

        #endregion

        private void ShouldPublishPolygonChangedEvent()
        {
            var calls = _publisher.ReceivedCalls();
            calls.Count().Should().Be(1);
            calls.First().GetArguments()[0].Should().BeOfType<HotSpotPolygonChangedEvent>();
        }
    }
}
