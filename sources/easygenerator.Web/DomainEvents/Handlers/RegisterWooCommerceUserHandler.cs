using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.Web.WooCommerce;
using System.Threading.Tasks;

namespace easygenerator.Web.DomainEvents.Handlers
{
    public class RegisterWooCommerceUserHandler : IDomainEventHandler<UserSignedUpEvent>
    {
        private readonly IWooCommerceApiService _wooCommerceApiService;

        public RegisterWooCommerceUserHandler(IWooCommerceApiService wooCommerceApiService)
        {
            _wooCommerceApiService = wooCommerceApiService;
        }

        public void Handle(UserSignedUpEvent args)
        {
            Task.Run(() => _wooCommerceApiService.RegisterUser(args.User, args.UserPassword));
        }
    }
}