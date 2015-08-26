﻿using easygenerator.DomainModel;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Extensions;
using easygenerator.Web.Mail;
using easygenerator.Web.ViewModels.Account;
using System;
using System.Web.Mvc;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
    public class UserController : DefaultController
    {
        private readonly IUserRepository _repository;
        private readonly IEntityFactory _entityFactory;
        private readonly IDomainEventPublisher _eventPublisher;
        private readonly IMailSenderWrapper _mailSenderWrapper;

        public UserController(IUserRepository repository, IEntityFactory entityFactory, IDomainEventPublisher eventPublisher, IMailSenderWrapper mailSenderWrapper)
        {
            _repository = repository;
            _entityFactory = entityFactory;
            _eventPublisher = eventPublisher;
            _mailSenderWrapper = mailSenderWrapper;
        }

        [HttpPost]
        [CustomRequireHttps]
        [AllowAnonymous]
        [ExternalApiAuthorize("wooCommerce")]
        [Route("api/user/update")]
        public ActionResult Update(string email,
            string password = "",
            string firstName = "",
            string lastName = "",
            string phone = "",
            string organization = "",
            string country = "")
        {
            var user = _repository.GetUserByEmail(email);
            if (user == null)
                throw new ArgumentException("User with specified email does not exist", "email");

            if (!string.IsNullOrEmpty(password))
                user.UpdatePassword(password, email);

            if (!string.IsNullOrEmpty(firstName))
                user.UpdateFirstName(firstName, email);

            if (!string.IsNullOrEmpty(lastName))
                user.UpdateLastName(lastName, email);

            if (!string.IsNullOrEmpty(phone))
                user.UpdatePhone(phone, email);

            if (!string.IsNullOrEmpty(organization))
                user.UpdateOrganization(organization, email);

            if (!string.IsNullOrEmpty(country))
            {
                var countryName = CountriesInfo.GetCountryName(country);
                if (countryName == null)
                    throw new ArgumentException("Not valid country code", "country");

                user.UpdateCountry(countryName, email);
            }

            return Success();
        }

        [HttpPost]
        [CustomRequireHttps]
        [AllowAnonymous]
        [ExternalApiAuthorize("wooCommerce")]
        [Route("api/user/downgrade")]
        public ActionResult Downgrade(string email)
        {
            var user = _repository.GetUserByEmail(email);
            if (user == null)
                throw new ArgumentException("User with specified email does not exist", "email");

            user.DowngradePlanToFree();

            return Success();
        }

        [HttpPost]
        [CustomRequireHttps]
        [AllowAnonymous]
        [ExternalApiAuthorize("wooCommerce")]
        [Route("api/user/subscription/starter")]
        public ActionResult UpgradeToStarter(string email, DateTime? expirationDate)
        {
            if (!expirationDate.HasValue)
                throw new ArgumentException("Expiration date is not specified or specified in wrong format", "expirationDate");

            var user = _repository.GetUserByEmail(email);
            if (user == null)
                throw new ArgumentException("User with specified email does not exist", "email");

            user.UpgradePlanToStarter(expirationDate.Value);

            return Success();
        }

        [HttpPost]
        [CustomRequireHttps]
        [AllowAnonymous]
        [ExternalApiAuthorize("wooCommerce")]
        [Route("api/user/subscription/plus")]
        public ActionResult UpgradeToPlus(string email, DateTime? expirationDate)
        {
            if (!expirationDate.HasValue)
                throw new ArgumentException("Expiration date is not specified or specified in wrong format", "expirationDate");

            var user = _repository.GetUserByEmail(email);
            if (user == null)
                throw new ArgumentException("User with specified email does not exist", "email");

            user.UpgradePlanToPlus(expirationDate.Value);

            return Success();
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult Signup(UserSignUpViewModel profile)
        {
            if (_repository.GetUserByEmail(profile.Email) != null)
            {
                return JsonError("Account with this email already exists");
            }

            var user = _entityFactory.User(profile.Email, profile.Password, profile.FirstName, profile.LastName, profile.Phone,
                profile.Country, profile.UserRole, profile.Email, "1.0.0");

            _repository.Add(user);

            _eventPublisher.Publish(new UserSignedUpEvent(user, profile.Password, profile.UserRole));
            _eventPublisher.Publish(new CreateUserInitialDataEvent(user));

            return JsonSuccess(profile.Email);
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult ForgotPassword(string email)
        {
            var user = _repository.GetUserByEmail(email);

            if (user != null)
            {
                var ticket = _entityFactory.PasswordRecoveryTicket(user);
                user.AddPasswordRecoveryTicket(ticket);

                _mailSenderWrapper.SendForgotPasswordMessage(email, ticket.Id.ToNString());
            }

            return JsonSuccess();
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult Exists(string email)
        {
            var exists = _repository.GetUserByEmail(email) != null;
            return JsonSuccess(exists);
        }

    }
}
