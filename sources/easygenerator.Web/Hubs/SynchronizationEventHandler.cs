using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Events;
using Microsoft.AspNet.SignalR;

namespace easygenerator.Web.Hubs
{
    public class SynchronizationEventHandler : IDomainEventHandler<UserSubscriptionPurchased>
    {
        public void Handle(UserSubscriptionPurchased args)
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<SyncHub>();
            hubContext.Clients.User(args.User.Email).subscriptionPurchased(new { type = args.User.Subscription.AccessType, expirationDate = args.User.Subscription.ExpirationDate });
        }
    }
}