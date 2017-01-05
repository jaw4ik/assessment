using System.Linq;
using System.Net.Mail;
using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.OrganizationEvents;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Domain.DomainOperations;
using WebGrease.Css.Extensions;

namespace easygenerator.Web.Domain.DomainEvents.Handlers.Organizaions
{
    public class OrganizationUserAutoincludeHandler :
        IDomainEventHandler<UserSignedUpEvent>,
        IDomainEventHandler<UserEmailConfirmedEvent>,
        IDomainEventHandler<OrganizationEmailDomainUpdatedEvent>
    {
        private readonly IUserRepository _userRepository;
        private readonly IOrganizationRepository _organizationRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOrganizationUserRepository _organizationUserRepository;
        private readonly IOrganizationOperations _organizationOperations;

        public OrganizationUserAutoincludeHandler(IUserRepository userRepository, IOrganizationRepository organizationRepository, IUnitOfWork unitOfWork,
            IOrganizationUserRepository organizationUserRepository, IOrganizationOperations organizationOperations)
        {
            _userRepository = userRepository;
            _organizationRepository = organizationRepository;
            _unitOfWork = unitOfWork;
            _organizationUserRepository = organizationUserRepository;
            _organizationOperations = organizationOperations;
        }

        public void Handle(UserSignedUpEvent args)
        {
            var emailDomain = new MailAddress(args.User.Email).Host;
            _organizationRepository.GetCollection(organization => organization.EmailDomains.Contains(emailDomain))
                .Where(organization => organization.EmailDomainCollection.Contains(emailDomain))
                .ForEach(organization => _organizationOperations.AutoincludeUser(args.User, organization));

            _unitOfWork.Save();
        }

        public void Handle(OrganizationEmailDomainUpdatedEvent args)
        {
            _userRepository.GetCollection(user => args.Organization.EmailDomainCollection.Any(emailDomain => user.Email.EndsWith("@" + emailDomain)))
               .ForEach(user => _organizationOperations.AutoincludeUser(user, args.Organization));

            _unitOfWork.Save();
        }

        public void Handle(UserEmailConfirmedEvent args)
        {
            _organizationUserRepository.GetCollection(user => user.Email == args.User.Email && user.Status == OrganizationUserStatus.WaitingForEmailConfirmation)
                .ForEach(user => _organizationOperations.AcceptInvite(user));

            _unitOfWork.Save();
        }
    }
}