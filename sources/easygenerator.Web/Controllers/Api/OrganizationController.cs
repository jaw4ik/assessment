using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Clonning;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Components.Mappers.Organizations;
using easygenerator.Web.Extensions;
using easygenerator.Web.Mail;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using DocumentFormat.OpenXml.Drawing.Diagrams;
using easygenerator.Web.Domain.DomainOperations;

namespace easygenerator.Web.Controllers.Api
{
    public class OrganizationController : DefaultApiController
    {
        private readonly IOrganizationRepository _organizationRepository;
        private readonly IOrganizationUserRepository _organizationUserRepository;
        private readonly IOrganizationMapper _organizationMapper;
        private readonly IEntityFactory _entityFactory;
        private readonly IEntityMapper _entityMapper;
        private readonly IUserRepository _userRepository;
        private readonly IMailSenderWrapper _mailSenderWrapper;
        private readonly IOrganizationInviteMapper _organizationInviteMapper;
        private readonly ICourseRepository _courseRepository;
        private readonly ICloner _cloner;
        private readonly IOrganizationOperations _organizationOperations;

        public OrganizationController(IOrganizationRepository organizationRepository, IOrganizationMapper organizationMapper, IEntityFactory entityFactory, IEntityMapper entityMapper,
            IUserRepository userRepository, IMailSenderWrapper mailSenderWrapper, IOrganizationInviteMapper organizationInviteMapper, IOrganizationUserRepository organizationUserRepository,
            ICourseRepository courseRepository, ICloner cloner, IOrganizationOperations organizationOperations)
        {
            _organizationRepository = organizationRepository;
            _organizationMapper = organizationMapper;
            _entityFactory = entityFactory;
            _entityMapper = entityMapper;
            _userRepository = userRepository;
            _mailSenderWrapper = mailSenderWrapper;
            _organizationInviteMapper = organizationInviteMapper;
            _organizationUserRepository = organizationUserRepository;
            _courseRepository = courseRepository;
            _cloner = cloner;
            _organizationOperations = organizationOperations;
        }

        [HttpPost]
        [AcademyAccess(ErrorMessageResourceKey = Errors.UpgradeAccountToManageOrganization)]
        [Route("api/organization/create")]
        public ActionResult CreateOrganization(string title)
        {
            var organization = _entityFactory.Organization(title, GetCurrentUsername());

            _organizationRepository.Add(organization);

            return JsonSuccess(_organizationMapper.Map(organization, GetCurrentUsername()));
        }

        [HttpPost]
        [AcademyAccess(ErrorMessageResourceKey = Errors.UpgradeAccountToManageOrganization)]
        [OrganizationAdmin]
        [Route("api/organization/users")]
        public ActionResult GetOrganizationUsers(Organization organization)
        {
            if (organization == null)
                return HttpNotFound(Errors.OrganizationNotFoundError);

            return JsonSuccess(organization.Users.Select(user => _entityMapper.Map(user)));

        }

        [HttpPost]
        [AcademyAccess(ErrorMessageResourceKey = Errors.UpgradeAccountToManageOrganization)]
        [OrganizationAdmin]
        [Route("api/organization/title/update")]
        public ActionResult UpdateOrganizationTitle(Organization organization, string title)
        {
            if (organization == null)
                return HttpNotFound(Errors.OrganizationNotFoundError);

            organization.UpdateTitle(title, GetCurrentUsername());
            return JsonSuccess();
        }

        [HttpPost]
        [AcademyAccess(ErrorMessageResourceKey = Errors.UpgradeAccountToManageOrganization)]
        [OrganizationAdmin]
        [Route("api/organization/users/add")]
        public ActionResult AddUsers(Organization organization, List<string> emails)
        {
            if (organization == null)
            {
                return HttpNotFound(Errors.OrganizationNotFoundError);
            }

            var userList = new List<OrganizationUser>();
            foreach (var email in emails)
            {
                var userEmail = email.Trim().ToLowerInvariant();
                var authorName = GetCurrentUsername();
                var organizationUser = organization.AddUser(userEmail, authorName);
                if (organizationUser == null)
                    continue;

                userList.Add(organizationUser);
                var user = _userRepository.GetUserByEmail(userEmail);
                if (user == null)
                {
                    var author = _userRepository.GetUserByEmail(authorName);
                    _mailSenderWrapper.SendInviteOrganizationUserMessage(userEmail, author.FullName, organization.Title);
                }
            }

            return JsonSuccess(userList.Select(user => _entityMapper.Map(user)));
        }

        [HttpPost]
        [AcademyAccess(ErrorMessageResourceKey = Errors.UpgradeAccountToManageOrganization)]
        [OrganizationAdmin]
        [Route("api/organization/user/remove")]
        public ActionResult RemoveOrganizationUser(Organization organization, string userEmail)
        {
            if (organization == null)
            {
                return HttpNotFound(Errors.OrganizationNotFoundError);
            }

            var organizationUser = organization.Users.FirstOrDefault(e => e.Email.Equals(userEmail, StringComparison.InvariantCultureIgnoreCase));
            if (organizationUser == null)
            {
                return JsonSuccess();
            }

            if (organizationUser.IsAdmin)
            {
                RemoveOrganizationAdminPermissions(organization, organizationUser);
            }
            
            organization.RemoveUser(organizationUser, GetCurrentUsername());
            foreach (var organizationAdmin in organization.Users.Where(u => u.IsAdmin && u.Status == OrganizationUserStatus.Accepted))
            {
                if (_organizationUserRepository.HasMultipleOrganizationAdminRelations(userEmail, organizationAdmin.Email))
                    continue;

                foreach (var course in _courseRepository.GetOwnedCourses(userEmail))
                {
                    course.RemoveCollaborator(_cloner, organizationAdmin.Email);
                }
            }
            
            return JsonSuccess();
        }

        [HttpPost]
        [AcademyAccess(ErrorMessageResourceKey = Errors.UpgradeAccountToManageOrganization)]
        [OrganizationAdmin]
        [Route("api/organization/user/reinvite")]
        public ActionResult ReinviteOrganizationUser(Organization organization, OrganizationUser organizationUser)
        {
            if (organizationUser == null)
            {
                return HttpNotFound(Errors.OrganizationUserNotFoundError);
            }

            organizationUser.Reinvite();
            return JsonSuccess();
        }

        [HttpPost]
        [Route("api/organization/invites")]
        public ActionResult GetInvites()
        {
            var invites = _organizationUserRepository.GetOrganizationInvites(GetCurrentUsername());
            return JsonSuccess(invites.Select(invite => _organizationInviteMapper.Map(invite)));
        }

        [HttpPost]
        [Route("api/organization/invite/accept")]
        public ActionResult AcceptOrganizationInvite(OrganizationUser organizationUser)
        {
            if (organizationUser == null)
            {
                return HttpNotFound(Errors.OrganizationUserNotFoundError);
            }
            _organizationOperations.AcceptInvite(organizationUser);

            return JsonSuccess();
        }

        [HttpPost]
        [Route("api/organization/invite/decline")]
        public ActionResult DeclineOrganizationInvite(OrganizationUser organizationUser)
        {
            if (organizationUser == null)
            {
                return HttpNotFound(Errors.OrganizationUserNotFoundError);
            }

            organizationUser.DeclineInvite();

            return JsonSuccess();
        }

        #region External api

        [HttpPost]
        [CustomRequireHttps]
        [AllowAnonymous]
        [ExternalApiAuthorize("easygenerator")]
        [Route("api/organization/info")]
        public ActionResult GetOrganizationInfo(Organization organization)
        {
            if (organization == null)
                throw new ArgumentException("Organization with specified id does not exist", nameof(organization));

            return JsonDataResult(new
            {
                Title = organization.Title,
                EmailDomains = organization.EmailDomains,
                Settings = organization.Settings == null ? null : new
                {
                    AccessType = organization.Settings?.AccessType == null ?
                    null :
                    $"{organization.Settings.AccessType.Value} ({(int)organization.Settings.AccessType.Value})",
                    ExpirationDate = organization.Settings?.ExpirationDate,
                    Templates = organization.Settings?.Templates.Select(template =>
                        new
                        {
                            Name = template.Name,
                            Id = template.Id.ToNString()
                        })
                },
                Admins = organization.Users.Where(u => u.IsAdmin).Select(u => u.Email)
            });
        }

        [HttpPost]
        [CustomRequireHttps]
        [AllowAnonymous]
        [ExternalApiAuthorize("easygenerator")]
        [Route("api/organization/emaildomains/update")]
        public ActionResult UpdateOrganizationEmailDomains(Organization organization, string emailDomains)
        {
            if (organization == null)
                throw new ArgumentException("Organization with specified id does not exist", nameof(organization));

            organization.UpdateEmailDomains(emailDomains);
            return Success();
        }

        [HttpPost]
        [CustomRequireHttps]
        [AllowAnonymous]
        [ExternalApiAuthorize("easygenerator")]
        [Route("api/organization/emaildomains/clear")]
        public ActionResult ClearOrganizationEmailDomains(Organization organization)
        {
            if (organization == null)
                throw new ArgumentException("Organization with specified id does not exist", nameof(organization));

            organization.ClearEmailDomains();
            return Success();
        }

        [HttpPost]
        [CustomRequireHttps]
        [AllowAnonymous]
        [ExternalApiAuthorize("easygenerator")]
        [Route("api/organization/settings/subscription/update")]
        public ActionResult UpdateOrganizationSettingsSubscription(Organization organization, AccessType? accessType, DateTime? expirationDate)
        {
            if (organization == null)
                throw new ArgumentException("Organization with specified id does not exist", nameof(organization));

            if (!accessType.HasValue)
                throw new ArgumentException("Access type is not specified or specified in wrong format", nameof(accessType));

            if (!expirationDate.HasValue)
                throw new ArgumentException("Expiration date is not specified or specified in wrong format", nameof(expirationDate));

            organization.GetOrCreateSettings().UpdateSubscription(accessType.Value, expirationDate.Value);

            return Success();
        }

        [HttpPost]
        [CustomRequireHttps]
        [AllowAnonymous]
        [ExternalApiAuthorize("easygenerator")]
        [Route("api/organization/settings/subscription/reset")]
        public ActionResult ResetOrganizationSettingsSubscription(Organization organization)
        {
            if (organization == null)
                throw new ArgumentException("Organization with specified id does not exist", nameof(organization));

            organization.Settings?.ResetSubscription();

            return Success();
        }

        [HttpPost]
        [CustomRequireHttps]
        [AllowAnonymous]
        [ExternalApiAuthorize("easygenerator")]
        [Route("api/organization/settings/template/add")]
        public ActionResult AddOrganizationSettingsTemplate(Organization organization, Template template)
        {
            if (organization == null)
                throw new ArgumentException("Organization with specified id does not exist", nameof(organization));

            if (template == null)
                throw new ArgumentException("Template with specified id does not exist", nameof(template));

            organization.GetOrCreateSettings().AddTemplate(template);

            return Success();
        }

        [HttpPost]
        [CustomRequireHttps]
        [AllowAnonymous]
        [ExternalApiAuthorize("easygenerator")]
        [Route("api/organization/settings/template/remove")]
        public ActionResult RemoveOrganizationSettingsTemplate(Organization organization, Template template)
        {
            if (organization == null)
                throw new ArgumentException("Organization with specified id does not exist", nameof(organization));

            if (template == null)
                throw new ArgumentException("Template with specified id does not exist", nameof(template));

            organization.Settings?.RemoveTemplate(template);

            return Success();
        }

        [HttpPost]
        [CustomRequireHttps]
        [AllowAnonymous]
        [ExternalApiAuthorize("easygenerator")]
        [Route("api/organization/settings/templates/clear")]
        public ActionResult ClearOrganizationSettingsTemplates(Organization organization)
        {
            if (organization == null)
                throw new ArgumentException("Organization with specified id does not exist", nameof(organization));

            organization.Settings?.ClearTemplates();

            return Success();
        }

        [HttpPost]
        [CustomRequireHttps]
        [AllowAnonymous]
        [ExternalApiAuthorize("easygenerator")]
        [Route("api/organization/settings/reset")]
        public ActionResult ResetOrganizationSettings(Organization organization)
        {
            if (organization == null)
                throw new ArgumentException("Organization with specified id does not exist", nameof(organization));

            organization.ResetSettings();

            return Success();
        }

        [HttpPost]
        [CustomRequireHttps]
        [AllowAnonymous]
        [ExternalApiAuthorize("easygenerator")]
        [Route("api/organization/admin/add")]
        public ActionResult AddOrganizationAdmin(Organization organization, string email)
        {
            if (organization == null)
                throw new ArgumentException(@"Organization with specified id does not exist", nameof(organization));

            if (_organizationUserRepository.IsAdminUser(email))
                throw new ArgumentException(@"The user is already admin of organization", nameof(email));

            var user = organization.Users.SingleOrDefault(u => u.Email == email && u.Status == OrganizationUserStatus.Accepted);
            if (user == null)
                throw new ArgumentException(@"There is no user with such e-mail in organization", nameof(email));
            
            user.SetAdminPermissions(true);
            foreach (var course in organization.Users
                .Where(member => member.Email != user.Email && member.Status == OrganizationUserStatus.Accepted)
                .SelectMany(member => _courseRepository.GetOwnedCourses(member.Email)))
            {
                course.CollaborateAsAdmin(user.Email);
            }

            return Success();
        }

        [HttpPost]
        [CustomRequireHttps]
        [AllowAnonymous]
        [ExternalApiAuthorize("easygenerator")]
        [Route("api/organization/admin/remove")]
        public ActionResult RemoveOrganizationAdmin(Organization organization, string email)
        {
            if (organization == null)
                throw new ArgumentException(@"Organization with specified id does not exist", nameof(organization));

            var admin = organization.Users.SingleOrDefault(u => u.Email == email && u.IsAdmin);
            if (admin == null)
                throw new ArgumentException(@"There is no admin with such e-mail in organization", nameof(email));

            RemoveOrganizationAdminPermissions(organization, admin);
            admin.SetAdminPermissions(false);

            return Success();
        }

        #endregion

        private void RemoveOrganizationAdminPermissions(Organization organization, OrganizationUser admin)
        {
            if (organization.Users.Count(e => e.IsAdmin) == 1)
            {
                throw new ArgumentException(@"Cannot remove last admin user from organization");
            }
            
            foreach (var user in organization.Users.Where(u => u.Email != admin.Email && u.Status == OrganizationUserStatus.Accepted))
            {
                if (_organizationUserRepository.HasMultipleOrganizationAdminRelations(user.Email, admin.Email))
                    continue;

                foreach (var course in _courseRepository.GetOwnedCourses(user.Email))
                {
                    course.RemoveCollaborator(_cloner, admin.Email);
                }
            }
        }
    }
}