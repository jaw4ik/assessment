using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web;
using easygenerator.DomainModel.Entities.Users;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Slack;

namespace easygenerator.Web.Domain.DomainEvents.Handlers.Slack
{
    public class UserEventsHandler : IDomainEventHandler<UserSignedUpEvent>
    {
        private readonly SlackClient _slackClient;
        private readonly IUserDomainRepository _userDomainRepository;

        public UserEventsHandler(SlackClient slackClient, IUserDomainRepository userDomainRepository)
        {
            _slackClient = slackClient;
            _userDomainRepository = userDomainRepository;
        }

        public void Handle(UserSignedUpEvent args)
        {
            if (!args.User.Settings.IsCreatedThroughLti && !args.User.Settings.IsCreatedThroughSamlIdP)
            {
                HandleUserDomain(args.User.Email);
            }
        }

        private void HandleUserDomain(string email)
        {
            var userDomainName = GetDomainNameFromEmail(email);
            var userDomain = _userDomainRepository.Get(userDomainName);

            if (userDomain == null)
            {
                _userDomainRepository.Add(new UserDomain(userDomainName, 1, true));
                return;
            } 
            
            userDomain.IncreaseUsersNumber();
            if (!userDomain.Tracked || userDomain.NumberOfUsers <= 1)
            {
                return;
            }

            SendMessageToSlack(email, userDomain);
        }

        public virtual void SendMessageToSlack(string email, UserDomain userDomain)
        {
            var currentDomain = GetCurrentDomain();
            Task.Run(() =>
            {
                var message =
                    $"The {GetNumberStr(userDomain.NumberOfUsers)} user from *@{userDomain.Domain}* just signed up: {email} (on <{currentDomain}>)";
                _slackClient.PostMessage(message, "Multiple signups");
            });
        }

        private static string GetCurrentDomain()
        {
            var request = HttpContext.Current.Request;
            return request.Url.Scheme + Uri.SchemeDelimiter + request.Url.Host +
                   (request.Url.IsDefaultPort ? "" : ":" + request.Url.Port);
        }

        private static string GetNumberStr(int number)
        {
            var numStr = number.ToString();
            switch (numStr[numStr.Length - 1])
            {
                case '1':
                    numStr += "st";
                    break;
                case '2':
                    numStr += "nd";
                    break;
                case '3':
                    numStr += "rd";
                    break;
                default:
                    numStr += "th";
                    break;
            }
            return numStr;
        }

        private static string GetDomainNameFromEmail(string email)
        {
            var address = new MailAddress(email);
            return address.Host;
        }
    }
}