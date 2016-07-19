﻿using easygenerator.DomainModel;
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
using easygenerator.Web.Mail;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

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

        public OrganizationController(IOrganizationRepository organizationRepository, IOrganizationMapper organizationMapper, IEntityFactory entityFactory, IEntityMapper entityMapper,
            IUserRepository userRepository, IMailSenderWrapper mailSenderWrapper, IOrganizationInviteMapper organizationInviteMapper, IOrganizationUserRepository organizationUserRepository,
            ICourseRepository courseRepository, ICloner cloner)
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
        }

        [HttpPost]
        [AcademyAccess]
        [Route("api/organization/create")]
        public ActionResult CreateOrganization(string title)
        {
            var organization = _entityFactory.Organization(title, GetCurrentUsername());

            _organizationRepository.Add(organization);

            return JsonSuccess(_organizationMapper.Map(organization, GetCurrentUsername()));
        }

        [HttpPost]
        [AcademyAccess]
        [OrganizationAdmin]
        [Route("api/organization/users")]
        public ActionResult GetOrganizationUsers(Organization organization)
        {
            if (organization == null)
                return HttpNotFound(Errors.OrganizationNotFoundError);

            return JsonSuccess(organization.Users.Select(user => _entityMapper.Map(user)));

        }

        [HttpPost]
        [AcademyAccess]
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
        [AcademyAccess]
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
        [AcademyAccess]
        [OrganizationAdmin]
        [Route("api/organization/user/remove")]
        public ActionResult RemoveOrganizationUser(Organization organization, string userEmail)
        {
            if (organization == null)
            {
                return HttpNotFound(Errors.OrganizationNotFoundError);
            }

            organization.RemoveUser(userEmail, GetCurrentUsername());

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
        [AcademyAccess]
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

            organizationUser.AcceptInvite();

            foreach (var course in _courseRepository.GetOwnedCourses(organizationUser.Email))
            {
                foreach (var organizationAdmin in organizationUser.Organization.Users.Where(u => u.IsAdmin && u.Status == OrganizationUserStatus.Accepted))
                {
                    course.CollaborateAsAdmin(organizationAdmin.Email);
                }
            }

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
        [Route("api/organization/emaildomains/get")]
        public ActionResult GetOrganizationEmailDomains(Organization organization)
        {
            if (organization == null)
                throw new ArgumentException("Organization with specified id does not exist", nameof(organization));

            return JsonDataResult(organization.EmailDomains);
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

        #endregion
    }
}