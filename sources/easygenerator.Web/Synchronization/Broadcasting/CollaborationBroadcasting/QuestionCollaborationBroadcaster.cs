using System.Collections.Generic;
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

            return Users(GetCollaborators(question));
        }

        public dynamic AllCollaboratorsExcept(Question question, params string[] excludeUsers)
        {
            ThrowIfQuestionNotValid(question);

            return Users(GetCollaboratorsExcept(question, new List<string>(excludeUsers)));
        }

        public dynamic OtherCollaborators(Question question)
        {
            ThrowIfQuestionNotValid(question);

            return Users(GetCollaboratorsExcept(question, new List<string>() { CurrentUsername }));
        }

        private void ThrowIfQuestionNotValid(Question question)
        {
            ArgumentValidation.ThrowIfNull(question, "question");
        }
        
        public IEnumerable<string> GetCollaborators(Question question)
        {
            return _objectiveBroadcaster.GetCollaborators(question.Objective);
        }

        public IEnumerable<string> GetCollaboratorsExcept(Question question, List<string> excludeUsers)
        {
            return _objectiveBroadcaster.GetCollaboratorsExcept(question.Objective, excludeUsers);
        }
    }
}