using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;
using Microsoft.AspNet.SignalR;

namespace easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting
{
    public class QuestionCollaborationBroadcaster : Broadcaster, ICollaborationBroadcaster<Question>
    {
        private readonly ICollaborationBroadcaster<Objective> _objectiveBroadcaster;

        public QuestionCollaborationBroadcaster(IHubContext hubContext, ICollaborationBroadcaster<Objective> objectiveBroadcaster)
            : base(hubContext)
        {
            _objectiveBroadcaster = objectiveBroadcaster;
        }

        public QuestionCollaborationBroadcaster(ICollaborationBroadcaster<Objective> objectiveBroadcaster)
        {
            _objectiveBroadcaster = objectiveBroadcaster;
        }

        public dynamic AllCollaborators(Question question)
        {
            ThrowIfQuestionNotValid(question);

            return MultipleClients(new[] { _objectiveBroadcaster.AllCollaborators(question.Objective) });
        }

        public dynamic AllCollaboratorsExcept(Question question, params string[] excludeUsers)
        {
            ThrowIfQuestionNotValid(question);

            return MultipleClients(new[] { _objectiveBroadcaster.AllCollaboratorsExcept(question.Objective, excludeUsers) });
        }

        public dynamic OtherCollaborators(Question question)
        {
            ThrowIfQuestionNotValid(question);

            return MultipleClients(new[] { _objectiveBroadcaster.OtherCollaborators(question.Objective) });
        }

        private void ThrowIfQuestionNotValid(Question question)
        {
            ArgumentValidation.ThrowIfNull(question, "question");
        }
    }
}