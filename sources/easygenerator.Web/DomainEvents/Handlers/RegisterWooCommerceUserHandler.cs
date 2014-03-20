using easygenerator.DomainModel.Events;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.WooCommerce;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace easygenerator.Web.DomainEvents.Handlers
{
    public class RegisterWooCommerceUserHandler : IDomainEventHandler<UserSignedUpEvent>
    {
        private readonly IWooCommerceApiService _wooCommerceApiService;
        private readonly ConfigurationReader _configurationReader;
        public RegisterWooCommerceUserHandler(ConfigurationReader configurationReader, IWooCommerceApiService wooCommerceApiService)
        {
            _wooCommerceApiService = wooCommerceApiService;
            _configurationReader = configurationReader;
        }

        public void Handle(UserSignedUpEvent args)
        {
            if (_configurationReader.WooCommerceConfiguration.Enabled)
            {
                Task.Run(() => _wooCommerceApiService.RegisterUser(args.User, args.UserPassword));
            }
        }
    }
}