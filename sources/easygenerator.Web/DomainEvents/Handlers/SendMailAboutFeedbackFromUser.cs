﻿using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Mail;
using System.Threading.Tasks;

namespace easygenerator.Web.DomainEvents.Handlers
{
    public class SendMailAboutFeedbackFromUser : IDomainEventHandler<UserFeedbackEvent>
    {
        private readonly IMailNotificationManager _mailNotificationManager;

        public SendMailAboutFeedbackFromUser(IMailNotificationManager mailNotificationManager)
        {
            _mailNotificationManager = mailNotificationManager;
        }

        public void Handle(UserFeedbackEvent args)
        {
            Task.Run(() => _mailNotificationManager.AddMailNotificationToQueue(Constants.MailTemplates.FeedbackTemplate, args));
        }
    }
}