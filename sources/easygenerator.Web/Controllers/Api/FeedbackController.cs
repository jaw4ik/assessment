using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.ActionResults;
using System.Web.Mvc;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
    public class FeedbackController : DefaultApiController
    {
        private readonly IDomainEventPublisher _publisher;

        public FeedbackController(IDomainEventPublisher publisher)
        {
            _publisher = publisher;
        }

        [HttpPost]
        public ActionResult SendFeedback(string email, string message)
        {
            _publisher.Publish(new UserFeedbackEvent(email, message));
            return new JsonSuccessResult();
        }

        [HttpPost]
        [Route("api/feedback/neweditor/send")]
        public ActionResult SendNewEditorFeedback(int rate, string message)
        {
            _publisher.Publish(new NewEditorUserFeedbackEvent(GetCurrentUsername(), rate, message));
            return new JsonSuccessResult();
        }
    }
}