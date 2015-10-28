using System;
using System.Linq;
using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Extensions;
using easygenerator.Web.Mail;
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

        public DashboardController(IUserRepository repository, ICourseRepository courseRepository)
        {
            _repository = repository;
            _courseRepository = courseRepository;
        }

        [HttpGet]
        [Route("dashboard")]
        public ActionResult Index()
        {
            return View(new DashboardViewModel(UserConnectionTracker.Instance.GetConnectionsCount(), UserConnectionTracker.Instance.GetOnlineUsersCollection()));
        }


        [HttpGet]
        [Route("dashboard/userInfo")]
        public ActionResult UserInfo()
        {
            return View();
        }

        [HttpPost]
        [Route("dashboard/userInfo")]
        public PartialViewResult UserInfo(string userEmail)
        {
            if (string.IsNullOrEmpty(userEmail))
                return PartialView("_UserNotFoundResult");

            var user = _repository.GetUserByEmail(userEmail);
            if (user == null)
                return PartialView("_UserNotFoundResult");

            return PartialView("_UserInfoResult", new UserInfoViewModel()
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role,
                Country = user.Country,
                AccessType = Enum.GetName(typeof(AccessType), user.AccessType),
                ExpirationDate = user.ExpirationDate,
                Phone = user.Phone,
                CreatedOn = user.CreatedOn,
                Courses = _courseRepository.GetOwnedCourses(userEmail).OrderBy(e => e.CreatedOn).Select(e => new
                     CourseViewModel()
                {
                    Title = e.Title,
                    Template = e.Template?.Name,
                    CreatedOn = e.CreatedOn,
                    ModifiedOn = e.ModifiedOn,
                    PublishedOn = e.PublishedOn,
                    HasBeenPublishedToEgHosting = !string.IsNullOrEmpty(e.PublicationUrl),
                    HasBeenPublishedToScorm = !string.IsNullOrEmpty(e.ScormPackageUrl),
                    HasBeenPublishedToExternalLms = e.IsPublishedToExternalLms,
                    CourseLink = e.PublicationUrl,
                    PreviewLink = $"//{HttpContext.Request.Url?.Authority}/preview/{e.Id.ToNString()}"
                })
            });
        }

    }
}