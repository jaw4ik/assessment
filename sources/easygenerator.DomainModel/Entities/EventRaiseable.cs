using easygenerator.DomainModel.Events;
using System.Collections.Generic;

namespace easygenerator.DomainModel.Entities
{
    public class EventRaiseable : Identifiable
    {
        private readonly Queue<Event> _events;

        protected internal EventRaiseable()
        {
            _events = new Queue<Event>();
        }

        protected void RaiseEvent(Event @event)
        {
            _events.Enqueue(@event);
        }

        internal Event DequeueEvent()
        {
            return _events.Count > 0 ? _events.Dequeue() : null;
        }
    }
}
