using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.Web.WooCommerce;
using System.Threading.Tasks;

namespace easygenerator.Web.DomainEvents.Handlers
{
    public class UpdateWooCommerceUserHandler : IDomainEventHandler<UserUpdateEvent>
    {
        private readonly IWooCommerceApiService _wooCommerceApiService;

        public UpdateWooCommerceUserHandler(IWooCommerceApiService wooCommerceApiService)
        {
            _wooCommerceApiService = wooCommerceApiService;
        }

        public void Handle(UserUpdateEvent args)
        {
            Task.Run(() => _wooCommerceApiService.UpdateUser(args.User.Email, args.User.FirstName, args.User.LastName, args.User.Country, args.User.Phone, args.UserPassword));
        }
    }
}