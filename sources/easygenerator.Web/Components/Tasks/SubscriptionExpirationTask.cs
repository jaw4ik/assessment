using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using System;
using easygenerator.DomainModel.Entities.Users;

namespace easygenerator.Web.Components.Tasks
{
    public class SubscriptionExpirationTask : ITask
    {
        private readonly IUserRepository _userRepository;

        public SubscriptionExpirationTask(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public void Execute()
        {
            var currentDate = DateTimeWrapper.Now();
            var expiredUsers = _userRepository.GetCollection(u => u.ExpirationDate < currentDate, 10);
            foreach (User expiredUser in expiredUsers)
            {
                expiredUser.DowngradePlanToFree();
            }
        }
    }
}