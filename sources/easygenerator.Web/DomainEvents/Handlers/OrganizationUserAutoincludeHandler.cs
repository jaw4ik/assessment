using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.OrganizationEvents;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.DomainOperations.OrganizationOperations;
using System.Linq;
using System.Net.Mail;
using WebGrease.Css.Extensions;

namespace easygenerator.Web.DomainEvents.Handlers
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
        private readonly IOrganizationDomainOperationExecutor _organizationDomainOperationExecutor;

        public OrganizationUserAutoincludeHandler(IUserRepository userRepository, IOrganizationRepository organizationRepository, IUnitOfWork unitOfWork,
            IOrganizationUserRepository organizationUserRepository, IOrganizationDomainOperationExecutor organizationDomainOperationExecutor)
        {
            _userRepository = userRepository;
            _organizationRepository = organizationRepository;
            _unitOfWork = unitOfWork;
            _organizationUserRepository = organizationUserRepository;
            _organizationDomainOperationExecutor = organizationDomainOperationExecutor;
        }

        public void Handle(UserSignedUpEvent args)
        {
            var emailDomain = new MailAddress(args.User.Email).Host;
            _organizationRepository.GetCollection(organization => organization.EmailDomains.Contains(emailDomain))
                .Where(organization => organization.EmailDomainCollection.Contains(emailDomain))
                .ForEach(organization => _organizationDomainOperationExecutor.AutoincludeUserToOrganization(args.User, organization));

            _unitOfWork.Save();
        }

        public void Handle(OrganizationEmailDomainUpdatedEvent args)
        {
            _userRepository.GetCollection(user => args.Organization.EmailDomainCollection.Any(emailDomain => user.Email.EndsWith("@" + emailDomain)))
               .ForEach(user => _organizationDomainOperationExecutor.AutoincludeUserToOrganization(user, args.Organization));

            _unitOfWork.Save();
        }

        public void Handle(UserEmailConfirmedEvent args)
        {
            _organizationUserRepository.GetCollection(user => user.Email == args.User.Email && user.Status == OrganizationUserStatus.WaitingForEmailConfirmation)
                .ForEach(user => user.AcceptInvite());

            _unitOfWork.Save();
        }
    }
}