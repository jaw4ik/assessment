namespace easygenerator.DomainModel.Entities.Tickets
{
    public abstract class Ticket : Entity
    {
        public virtual User User { get; internal set; }

        protected Ticket()
        {
        }
    }
}
