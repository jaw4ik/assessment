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
    }
}
