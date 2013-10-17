using System.Runtime.Remoting.Channels;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using System;
using easygenerator.Web.Mail;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Events;

namespace easygenerator.Web.DomainEvents.Handlers
{
    public class SendMailAboutNewUserHandler : IDomainEventHandler<UserSignedUpEvent>
    {
        private readonly IMailNotificationRepository _mailNotificationRepository;
        private readonly MailNotificationManager _mailNotificationManager;

        public SendMailAboutNewUserHandler(IMailNotificationRepository mailNotificationRepository, MailNotificationManager mailNotificationManager)
        {
            _mailNotificationRepository = mailNotificationRepository;
            _mailNotificationManager = mailNotificationManager;
        }

        public void Handle(UserSignedUpEvent args)
        {
            var mailNotification = _mailNotificationManager.GetMailNotification(Constants.MailTemplates.SignedUpUserTemplate, args);
            _mailNotificationRepository.Add(mailNotification);
        }
    }
}