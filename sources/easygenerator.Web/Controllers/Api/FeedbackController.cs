using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Handlers;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionResults;
using easygenerator.Web.Mail;
using easygenerator.Web.ViewModels.Account;
using System.Web.Mvc;
using easygenerator.Web.Components.ActionFilters;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
    public class FeedbackController : DefaultController
    {
        private readonly IDomainEventPublisher<UserFeedbackEvent> _publisher;

        public FeedbackController(IDomainEventPublisher<UserFeedbackEvent> publisher)
        {
            _publisher = publisher;
        }

        [HttpPost]
        public ActionResult SendFeedback(string email, string message)
        {
            _publisher.Publish(new UserFeedbackEvent(email, message));
            return new JsonSuccessResult();
        }
    }
}