namespace easygenerator.DomainEvents.Interfaces
{
    public interface IDomainEventHandler<T>
    {
        void Handle(T args);
    }
}
