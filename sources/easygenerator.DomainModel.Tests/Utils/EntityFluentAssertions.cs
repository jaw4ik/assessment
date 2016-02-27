﻿using System.Collections.Generic;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using FluentAssertions;

namespace easygenerator.DomainModel.Tests.Utils
{
    public static class EntityFluentAssertions
    {
        public static void ShouldContainSingleEvent<T>(this Entity entity)
        {
            var raisedEvent = entity.DequeueEvent();
            raisedEvent.Should().NotBeNull();
            raisedEvent.GetType().Should().Be(typeof(T));

            var nextEvent = entity.DequeueEvent();
            nextEvent.Should().BeNull();
        }

        public static void ShouldContainSingleEventOfType<T>(this Entity entity)
        {
            GetEventsList(entity).Should().ContainSingle(e => e.GetType() == typeof(T));
        }

        public static T GetSingleEventOfType<T>(this Entity entity) where T: class
        {
            var entities = GetEventsList(entity);
            entities.Should().ContainSingle(e => e.GetType() == typeof(T));
            return entities.Single(_ => _.GetType() == typeof(T)) as T;
        }

        private static List<Event> GetEventsList(Entity entity)
        {
            var @event = entity.DequeueEvent();
            var events = new List<Event>();

            while (@event != null)
            {
                events.Add(@event);
                @event = entity.DequeueEvent();
            }

            return events;
        }
    }
}
