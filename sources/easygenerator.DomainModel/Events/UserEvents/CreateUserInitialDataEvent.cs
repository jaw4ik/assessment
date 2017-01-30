using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Users;

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
