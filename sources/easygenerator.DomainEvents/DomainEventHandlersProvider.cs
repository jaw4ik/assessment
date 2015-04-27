using easygenerator.DomainEvents.Interfaces;
using System.Collections.Generic;

namespace easygenerator.DomainEvents
{
    public class DomainEventHandlersProvider<T> : IDomainEventHandlersProvider<T>
    {
        private readonly IEnumerable<IDomainEventHandler<T>> _handlers;

        public DomainEventHandlersProvider(IEnumerable<IDomainEventHandler<T>> handlers)
        {
            _handlers = handlers;
        }

        public IEnumerable<IDomainEventHandler<T>> GetHandlersForEvent()
        {
            return _handlers;
        }
    }
}
