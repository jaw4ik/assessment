using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.Web.Extensions;
using easygenerator.Web.Mail;
using System.Linq;

namespace easygenerator.Web.Components.DomainOperations.OrganizationOperations
{
    public class AutoincludeUserToOrganizationOperation
    {
        private readonly IEntityFactory _entityFactory;
        private readonly IMailSenderWrapper _mailSenderWrapper;

        public AutoincludeUserToOrganizationOperation(IEntityFactory entityFactory, IMailSenderWrapper mailSenderWrapper)
        {
            _entityFactory = entityFactory;
            _mailSenderWrapper = mailSenderWrapper;
        }

        public void Execute(User user, Organization organization)
        {
            if (organization.Users.SingleOrDefault(u => u.Email == user.Email) != null)
                return;

            if (!user.IsEmailConfirmed)
            {
                var ticket = user.GetEmailConfirmationTicket();
                if (ticket == null)
                {
                    ticket = _entityFactory.EmailConfirmationTicket();
                    user.AddEmailConfirmationTicket(ticket);
                    _mailSenderWrapper.SendConfirmEmailMessage(user.Email, user.FirstName, ticket.Id.ToNString());
                }
            }

            var status = user.IsEmailConfirmed
                   ? OrganizationUserStatus.Accepted
                   : OrganizationUserStatus.WaitingForEmailConfirmation;

            organization.AddUser(user.Email, user.Email, status);
        }
    }
}