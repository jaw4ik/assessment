using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using easygenerator.DomainModel.Events;
using easygenerator.Web.WooCommerce;

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
            Task.Run(() => _wooCommerceApiService.UpdateUser(args.User, args.UserPassword));
        }
    }
}