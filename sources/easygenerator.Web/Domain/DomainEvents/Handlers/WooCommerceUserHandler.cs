using System.Threading.Tasks;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.Web.WooCommerce;

namespace easygenerator.Web.Domain.DomainEvents.Handlers
{
    public class WooCommerceUserHandler : IDomainEventHandler<UserSignedUpEvent>, IDomainEventHandler<UserUpdateEvent>
    {
        private readonly IWooCommerceApiService _wooCommerceApiService;

        public WooCommerceUserHandler(IWooCommerceApiService wooCommerceApiService)
        {
            _wooCommerceApiService = wooCommerceApiService;
        }

        public void Handle(UserSignedUpEvent args)
        {
            Task.Run(() => _wooCommerceApiService.RegisterUser(args.User.Email, args.User.FirstName, args.User.LastName, args.UserPassword));
        }

        public void Handle(UserUpdateEvent args)
        {
            Task.Run(() => _wooCommerceApiService.UpdateUser(args.User.Email, args.User.FirstName, args.User.LastName, args.UserPassword));
        }
    }
}