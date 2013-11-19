using System;
using System.Collections.Generic;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Repositories
{
    public interface IPasswordRecoveryTicketRepository : IQuerableRepository<PasswordRecoveryTicket>
    {
        ICollection<PasswordRecoveryTicket> GetExpiredTickets(DateTime expirationDate);

        void Remove(PasswordRecoveryTicket ticket);
    }
}
