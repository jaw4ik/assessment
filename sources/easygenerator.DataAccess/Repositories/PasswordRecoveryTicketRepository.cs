using easygenerator.DomainModel.Entities;

namespace easygenerator.DataAccess.Repositories
{
    public class PasswordRecoveryTicketRepository : Repository<PasswordRecoveryTicket>
    {
        public PasswordRecoveryTicketRepository(IDataContext dataContext) 
            : base(dataContext)
        {
        }
    }
}
