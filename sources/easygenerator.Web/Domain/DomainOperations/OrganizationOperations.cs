using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Extensions;
using easygenerator.Web.Mail;
using System.Linq;

namespace easygenerator.Web.Domain.DomainOperations
{
    public interface IOrganizationOperations
    {
        void AutoincludeUser(User user, Organization organization);
        void ApplySettings(Organization organization, OrganizationUser user);
        void DiscardSettings(Organization organization, OrganizationUser user);
    }

    public class OrganizationOperations : IOrganizationOperations
    {
        private readonly IEntityFactory _entityFactory;
        private readonly IMailSenderWrapper _mailSenderWrapper;
        private readonly IUserOperations _userOperations;
        private readonly IUserRepository _userRepository;
        private readonly IOrganizationUserRepository _organizationUserRepository;

        public OrganizationOperations(IEntityFactory entityFactory, IMailSenderWrapper mailSenderWrapper, IUserOperations userOperations, IUserRepository userRepository, IOrganizationUserRepository organizationUserRepository)
        {
            _entityFactory = entityFactory;
            _mailSenderWrapper = mailSenderWrapper;
            _userOperations = userOperations;
            _userRepository = userRepository;
            _organizationUserRepository = organizationUserRepository;
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

        public void ApplySettings(Organization organization, OrganizationUser user)
        {
            if (user.IsAdmin || user.Status != OrganizationUserStatus.Accepted || organization.Settings == null)
                return;

            var mainOrganization = GetMainOrganization(user.Email);
            if (mainOrganization == null || mainOrganization.Id != organization.Id)
                return;

            _userOperations.ApplyOrganizationSettings(_userRepository.GetUserByEmail(user.Email), organization.Settings);
        }

        public void DiscardSettings(Organization organization, OrganizationUser user)
        {
            if (user.IsAdmin || user.Status != OrganizationUserStatus.Accepted)
                return;

            var mainOrganization = GetMainOrganization(user.Email);
            if (mainOrganization != null && mainOrganization.Id != organization.Id && mainOrganization.Settings != null)
            {
                _userOperations.ApplyOrganizationSettings(_userRepository.GetUserByEmail(user.Email), mainOrganization.Settings);
            }
            else
            {
                _userOperations.DiscardOrganizationSettings(_userRepository.GetUserByEmail(user.Email));
            }
        }

        private Organization GetMainOrganization(string email)
        {
            var user = _organizationUserRepository.GetCollection(u => u.Email == email).OrderBy(u => u.CreatedOn).FirstOrDefault();
            return user?.Organization;
        }
    }
}