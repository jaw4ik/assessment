using System.Collections.Generic;

namespace easygenerator.DomainModel.Events
{
    public interface IDomainEventHandlersProvider<T>
    {
        IEnumerable<IDomainEventHandler<T>> GetHandlersForEvent();
    }
}
