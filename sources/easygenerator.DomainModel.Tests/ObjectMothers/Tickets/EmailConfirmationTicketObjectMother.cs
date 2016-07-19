using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Tickets;

namespace easygenerator.DomainModel.Tests.ObjectMothers.Tickets
{
    public static class EmailConfirmationTicketObjectMother
    {
        public static EmailConfirmationTicket Create()
        {
            return new EmailConfirmationTicket();
        }

        public static EmailConfirmationTicket CreateWithUser(User user)
        {
            var ticket = Create();
            ticket.User = user;
            return ticket;
        }
    }
}
