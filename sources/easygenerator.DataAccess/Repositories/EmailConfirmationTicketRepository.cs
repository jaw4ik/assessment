using easygenerator.DomainModel.Entities.Tickets;

namespace easygenerator.DataAccess.Repositories
{
    public class EmailConfirmationTicketRepository : Repository<EmailConfirmationTicket>
    {
        public EmailConfirmationTicketRepository(IDataContext dataContext)
            : base(dataContext)
        {
        }
    }
}
