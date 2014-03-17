using easygenerator.DataAccess;
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
            var users = _userRepository.GetCollection(user => user.Subscription.ExpirationDate.HasValue && user.Subscription.ExpirationDate < DateTimeWrapper.Now());
            if (users.Count == 0)
            {
                return;
            }

            foreach (var user in users)
            {
                user.Subscription.Downgrade();
            }

            _dataContext.Save();
        }
    }
}