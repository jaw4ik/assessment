using System.Collections.Generic;

namespace easygenerator.DomainEvents.Interfaces
{
    public interface IDomainEventHandlersProvider<T>
    {
        IEnumerable<IDomainEventHandler<T>> GetHandlersForEvent();
    }
}
