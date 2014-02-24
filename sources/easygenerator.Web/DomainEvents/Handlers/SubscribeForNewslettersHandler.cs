﻿using System.Threading.Tasks;
using easygenerator.DomainModel.Events;
using easygenerator.Infrastructure;
using easygenerator.Web.Mail;
using easygenerator.Web.Newsletter;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace easygenerator.Web.DomainEvents.Handlers
{
    public class SubscribeForNewslettersHandler : IDomainEventHandler<UserSignedUpEvent>
    {
        private readonly INewsletterSubscriptionManager _subscriptionManager;
        private readonly IMailNotificationManager _mailNotificationManager;

        public SubscribeForNewslettersHandler(INewsletterSubscriptionManager subscriptionManager, IMailNotificationManager mailNotificationManager)
        {
            _subscriptionManager = subscriptionManager;
            _mailNotificationManager = mailNotificationManager;
        }

        public void Handle(UserSignedUpEvent args)
        {
            Task.Run
                (() =>
                    {
                        if (!_subscriptionManager.SubscribeForNewsletters(args.User.Email, args.User.FirstName, args.User.LastName))
                        {
                            _mailNotificationManager.AddMailNotificationToQueue(
                                Constants.MailTemplates.NewsletterSubscriptionFailedTemplate,
                                new {Email = args.User.Email, FirstName = args.User.FirstName, LastName = args.User.LastName});
                        }
                    }
                );
        }
    }
}