using System;
using System.Diagnostics;
using easygenerator.DataAccess;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.Components.Tasks
{
    public class PasswordRecoveryTicketExpirationTask : ITask
    {
        private readonly IUnitOfWork _dataContext;
        private readonly ConfigurationReader _configurationReader;
        private readonly IPasswordRecoveryTicketRepository _passwordRecoveryTicketRepository;

        public PasswordRecoveryTicketExpirationTask(IUnitOfWork unitOfWork, ConfigurationReader configurationReader, IPasswordRecoveryTicketRepository passwordRecoveryTicketRepository)
        {
            _dataContext = unitOfWork;
            _configurationReader = configurationReader;
            _passwordRecoveryTicketRepository = passwordRecoveryTicketRepository;
        }

        public void Execute()
        {
            var tickets = _passwordRecoveryTicketRepository.GetExpiredTickets(new TimeSpan(0, 0, _configurationReader.PasswordRecoveryExpirationInterval, 0));

            Debug.WriteLine(tickets.Count);

            if (tickets.Count == 0)
            {
                return;
            }

            foreach (var ticket in tickets)
            {
                _passwordRecoveryTicketRepository.Remove(ticket);
            }

            _dataContext.Save();
        }
    }
}