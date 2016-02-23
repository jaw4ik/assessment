using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents.RankingTextEvents;
using easygenerator.DomainModel.Events.QuestionEvents.TextMatchingEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.DomainEvents.ChangeTracking.Events;
using easygenerator.Web.DomainEvents.ChangeTracking.Trackers;
using easygenerator.Web.Tests.Utils;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.DomainEvents.ChangeTracking.Trackers
{
    [TestClass]
    public class RankingTextAnswerChangeTrackerTests
    {
        private RankingTextAnswerChangeTracker _tracker;
        private IDomainEventPublisher _publisher;

        [TestInitialize]
        public void Initialize()
        {
            _publisher = Substitute.For<IDomainEventPublisher>();
            _tracker = new RankingTextAnswerChangeTracker(_publisher);
        }

        #region Handlers

        [TestMethod]
        public void Handler_RankingTextAnswerTextChangedEvent_Should_Publish_RankingTextAnswerChangedEvent()
        {
            //Act
            _tracker.Handle(new RankingTextAnswerTextChangedEvent(RankingTextAnswerObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<RankingTextAnswerChangedEvent>();
        }

       [TestMethod]
        public void Handler_RankingTextAnswerCreatedEvent_Should_Publish_RankingTextAnswerChangedEvent()
        {
            //Act
            _tracker.Handle(new RankingTextAnswerCreatedEvent(RankingTextAnswerObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<RankingTextAnswerChangedEvent>();
        }

        #endregion
    }
}
