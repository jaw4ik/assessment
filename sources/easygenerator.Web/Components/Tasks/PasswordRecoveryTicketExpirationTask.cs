using System;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.Components.Tasks
{
    public class PasswordRecoveryTicketExpirationTask : ITask
    {
        private readonly ConfigurationReader _configurationReader;
        private readonly IPasswordRecoveryTicketRepository _passwordRecoveryTicketRepository;

        public PasswordRecoveryTicketExpirationTask(ConfigurationReader configurationReader, IPasswordRecoveryTicketRepository passwordRecoveryTicketRepository)
        {
            _configurationReader = configurationReader;
            _passwordRecoveryTicketRepository = passwordRecoveryTicketRepository;
        }

        public void Execute()
        {
            var expirationDate = DateTimeWrapper.Now().Subtract(new TimeSpan(0, 0, _configurationReader.PasswordRecoveryExpirationInterval, 0));

            var expiredTickets = _passwordRecoveryTicketRepository.GetCollection(t => t.CreatedOn < expirationDate);
            foreach (var expiredTicket in expiredTickets)
            {
                _passwordRecoveryTicketRepository.Remove(expiredTicket);
            }
        }
    }
}