using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;

namespace easygenerator.Web.Components.Tasks
{
    public class SubscriptionExpirationTask : ITask
    {
        private readonly IUserRepository _userRepository;
        private readonly IDomainEventPublisher _eventPublisher;

        public SubscriptionExpirationTask(IUserRepository userRepository, IDomainEventPublisher eventPublisher)
        {
            _userRepository = userRepository;
            _eventPublisher = eventPublisher;
        }

        public void Execute()
        {
            var expiredUsers = _userRepository.GetCollection(u => u.ExpirationDate < DateTimeWrapper.Now());
            foreach (User expiredUser in expiredUsers)
            {
                expiredUser.DowngradePlanToFree();
                _eventPublisher.Publish(new UserDonwgraded(expiredUser));
            }
        }
    }
}