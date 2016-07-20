using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.Web.WooCommerce;
using System.Threading.Tasks;

namespace easygenerator.Web.DomainEvents.Handlers
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
            if (args.User.Settings.IsCreatedThroughLti || args.User.Settings.IsCreatedThroughSamlIdP)
            {
                Task.Run(() => _wooCommerceApiService.RegisterUser(args.User.Email, args.User.FirstName, args.User.LastName, args.UserPassword));
            }
            else
            {
                Task.Run(() => _wooCommerceApiService.RegisterUser(args.User.Email, args.User.FirstName, args.User.LastName, args.UserPassword, args.User.Country, args.User.Phone));
            }
        }

        public void Handle(UserUpdateEvent args)
        {
            if (args.User.Settings.IsCreatedThroughLti || args.User.Settings.IsCreatedThroughSamlIdP)
            {
                Task.Run(() => _wooCommerceApiService.UpdateUser(args.User.Email, args.User.FirstName, args.User.LastName, args.UserPassword));
            }
            else
            {
                Task.Run(() => _wooCommerceApiService.UpdateUser(args.User.Email, args.User.FirstName, args.User.LastName, args.UserPassword, args.User.Country, args.User.Phone));
            }
        }
    }
}