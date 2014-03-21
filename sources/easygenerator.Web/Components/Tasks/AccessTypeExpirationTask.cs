using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;

namespace easygenerator.Web.Components.Tasks
{
    public class AccessTypeExpirationTask : ITask
    {
        private readonly IUnitOfWork _dataContext;
        private readonly IUserRepository _userRepository;

        public AccessTypeExpirationTask(IUnitOfWork unitOfWork, IUserRepository userRepository)
        {
            _dataContext = unitOfWork;
            _userRepository = userRepository;
        }

        public void Execute()
        {
            var users = _userRepository.GetCollection(IsUserSubscriptionExpired);
            if (users.Count == 0)
            {
                return;
            }

            foreach (var user in users)
            {
                user.DowngradePlanToFree();
            }

            _dataContext.Save();
        }

        private static bool IsUserSubscriptionExpired(User user)
        {
            return user.ExpirationDate.HasValue && user.ExpirationDate < DateTimeWrapper.Now();
        }
    }
}