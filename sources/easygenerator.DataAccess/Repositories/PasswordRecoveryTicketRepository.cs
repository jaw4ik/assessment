using System;
using System.Collections.Generic;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.DataAccess.Repositories
{
    public class PasswordRecoveryTicketRepository : Repository<PasswordRecoveryTicket>, IPasswordRecoveryTicketRepository
    {
        public PasswordRecoveryTicketRepository(IDataContext dataContext) 
            : base(dataContext)
        {
        }

        public ICollection<PasswordRecoveryTicket> GetExpiredTickets(DateTime expirationDate)
        {
            return _dataContext.GetSet<PasswordRecoveryTicket>().Where(ticket => ticket.CreatedOn < expirationDate).ToList();
        }
    }
}
