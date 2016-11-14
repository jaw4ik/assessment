using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Mvc;
using System.Web.WebPages;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Extensions;
using easygenerator.Web.Synchronization.Tracking;
using easygenerator.Web.ViewModels.Dashboard;

namespace easygenerator.Web.Controllers
{
    [NoCache]
    [AllowedUsers("dashboard.allowedUsers")]
    public class DashboardController : DefaultController
    {
        private readonly IUserRepository _repository;
        private readonly ICourseRepository _courseRepository;
        private readonly ConfigurationReader _configurationReader;
        private readonly UserController _userController;

        public DashboardController(IUserRepository repository, ICourseRepository courseRepository, ConfigurationReader configurationReader, UserController userController)
        {
            _repository = repository;
            _courseRepository = courseRepository;
            _configurationReader = configurationReader;
            _userController = userController;
        }

        [HttpGet]
        [Route("dashboard")]
        public ActionResult Index()
        {
            return
                View(new DashboardViewModel(UserConnectionTracker.Instance.GetConnectionsCount(),
                    UserConnectionTracker.Instance.GetOnlineUsersCollection()));
        }

        [HttpGet]
        [Route("dashboard/users")]
        public ActionResult UserSearch(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return View(new UserSearchViewModel());
            }

            var user = _repository.GetUserByEmail(email);
            var viewModel = new UserSearchViewModel
            {
                Email = email,
                User = user != null ? new UserInfoViewModel()
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Role = user.Role,
                    Country = user.Country,
                    AccessType = Enum.GetName(typeof(AccessType), user.AccessType),
                    ExpirationDate = user.ExpirationDate,
                    Phone = user.Phone,
                    CreatedOn = user.CreatedOn,
                    Courses = _courseRepository.GetOwnedCourses(email)
                            .OrderBy(e => e.CreatedOn)
                            .Select(e => new CourseViewModel()
                            {
                                Title = e.Title,
                                Template = e.Template?.Name,
                                CreatedOn = e.CreatedOn,
                                ModifiedOn = e.ModifiedOn,
                                PublishedOn = e.PublishedOn,
                                HasBeenPublishedToEgHosting = !string.IsNullOrEmpty(e.PublicationUrl),
                                HasBeenPublishedToScorm = !string.IsNullOrEmpty(e.ScormPackageUrl),
                                HasBeenPublishedToExternalLms = e.IsPublishedToAnyExternalLms(),
                                CourseLink = e.PublicationUrl,
                                PreviewLink = $"//{HttpContext.Request.Url?.Authority}/preview/{e.Id.ToNString()}"
                            }),
                    UpgradeUserViewModel = new UpgradeUserViewModel()
                    {
                        UserEmail = email,
                        ExpirationDate = user.ExpirationDate,
                        UserPlansList = Enum.GetNames(typeof(AccessType))
                            .Where(accessType => accessType != AccessType.Trial.ToString())
                            .Select(accessType => new SelectListItem()
                            {
                                Text = accessType,
                                Value = accessType,
                                Selected = accessType == user.AccessType.ToString()
                            })
                    }
                } : null
            };

            return View(viewModel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("dashboard/upgradeuser", Name = "UpgradeUser")]
        public ActionResult UpgradeUser(string email, AccessType selectedPlan, DateTime? expirationDate)
        {
            if (email.IsEmpty())
            {
                throw new ArgumentException("User email should not be empty");
            }

            if (!expirationDate.HasValue && selectedPlan != AccessType.Free)
            {
                throw new ArgumentException("Expiration date format is invalid. Please enter date in such format: 'MM/dd/yyyy'");
            }

            if (expirationDate.HasValue)
            {
                var localDateTime = expirationDate.Value.ToLocalTime();
                expirationDate = new DateTime(localDateTime.Year, localDateTime.Month, localDateTime.Day, 23, 59, 59, DateTimeKind.Local);
            }

            SendRequestToWebShop(email, selectedPlan == AccessType.AcademyBT ? AccessType.Academy : selectedPlan);

            switch (selectedPlan)
            {
                case AccessType.Free:
                    _userController.Downgrade(email);
                    break;
                case AccessType.Starter:
                    _userController.UpgradeToStarter(email, expirationDate);
                    break;
                case AccessType.Plus:
                    _userController.UpgradeToPlus(email, expirationDate);
                    break;
                case AccessType.Academy:
                    _userController.UpgradeToAcademy(email, expirationDate);
                    break;
                case AccessType.AcademyBT:
                    _userController.UpgradeToAcademyBT(email, expirationDate);
                    break;
            }

            return RedirectToAction("UserSearch", new { email = email });
        }

        private void SendRequestToWebShop(string email, AccessType accessType)
        {
            if (!_configurationReader.WooCommerceConfiguration.Enabled ||
                _configurationReader.WooCommerceConfiguration.ServiceUrl == null ||
                _configurationReader.ExternalApi.ApiKeys["wooCommerce"] == null)
            {
                return;
            }

            using (var httpClient = new HttpClient())
            {
                var response = httpClient.GetAsync($"{_configurationReader.WooCommerceConfiguration.ServiceUrl}?edd_override_plan={accessType.ToString().ToLower()}&email={email}&key={_configurationReader.ExternalApi.ApiKeys["wooCommerce"].Value}").Result;
                if (response.StatusCode != HttpStatusCode.OK && response.StatusCode != HttpStatusCode.NotModified)
                {
                    throw new ArgumentException($"Web shop server return an error. {(int)response.StatusCode} ({response.StatusCode}): {response.ReasonPhrase}");
                }
            }
        }
    }
}