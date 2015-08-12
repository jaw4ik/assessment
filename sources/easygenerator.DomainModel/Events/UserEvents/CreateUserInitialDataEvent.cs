using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.UserEvents
{
    public class CreateUserInitialDataEvent : UserEvent
    {
        public CreateUserInitialDataEvent(User user)
            :base(user)
        {
        }
    }
}
