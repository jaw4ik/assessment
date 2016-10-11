using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Extensions;
using easygenerator.Web.Mail;
using Microsoft.Ajax.Utilities;
using System.Linq;

namespace easygenerator.Web.Domain.DomainOperations
{
    public interface IOrganizationOperations
    {
        void AutoincludeUser(User user, Organization organization);
        void ApplySettings(OrganizationUser user, OrganizationSettings settings);
        void DiscardSettings(OrganizationUser user);
        void DiscardSubscriptionSettings(OrganizationUser user);
        void ApplySubscriptionSettings(OrganizationUser user, OrganizationSettings settings);
        void GrantTemplateAccess(OrganizationUser user, Template template);
    }

    public class OrganizationOperations : IOrganizationOperations
    {
        private readonly IEntityFactory _entityFactory;
        private readonly IMailSenderWrapper _mailSenderWrapper;
        private readonly IUserOperations _userOperations;
        private readonly IUserRepository _userRepository;

        public OrganizationOperations(IEntityFactory entityFactory, IMailSenderWrapper mailSenderWrapper, IUserOperations userOperations, IUserRepository userRepository)
        {
            _entityFactory = entityFactory;
            _mailSenderWrapper = mailSenderWrapper;
            _userOperations = userOperations;
            _userRepository = userRepository;
        }

        public void AutoincludeUser(User user, Organization organization)
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

            organization.AddUser(user.Email, user.Email, user.IsEmailConfirmed
                   ? OrganizationUserStatus.Accepted
                   : OrganizationUserStatus.WaitingForEmailConfirmation);
        }

        public void ApplySettings(OrganizationUser user, OrganizationSettings settings)
        {
            ApplySubscriptionSettings(user, settings);
            settings.Templates.ForEach(template => GrantTemplateAccess(user, template));
        }

        public void DiscardSettings(OrganizationUser user)
        {
            DiscardSubscriptionSettings(user);
        }

        public void ApplySubscriptionSettings(OrganizationUser user, OrganizationSettings settings)
        {
            var subscription = settings.GetSubscription();
            if (subscription != null && !user.IsAdmin)
            {
                _userOperations.ApplyOrganizationSettingsSubscription(_userRepository.GetUserByEmail(user.Email), subscription);
            }
        }

        public void GrantTemplateAccess(OrganizationUser user, Template template)
        {
            template.GrantAccessTo(user.Email);
        }

        public void DiscardSubscriptionSettings(OrganizationUser user)
        {
            if (!user.IsAdmin)
            {
                _userOperations.DiscardOrganizationSettingsSubscription(_userRepository.GetUserByEmail(user.Email));
            }
        }
    }
}