using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using System.Collections.Generic;

namespace easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting.CollaboratorProviders
{
    public class QuestionCollaboratorProvider : IEntityCollaboratorProvider<Question>
    {
        private readonly IEntityCollaboratorProvider<Objective> _objectiveCollaboratorProvider;

        public QuestionCollaboratorProvider(IEntityCollaboratorProvider<Objective> objectiveCollaboratorProvider)
        {
            _objectiveCollaboratorProvider = objectiveCollaboratorProvider;
        }

        public IEnumerable<string> GetCollaborators(Question question)
        {
            return _objectiveCollaboratorProvider.GetCollaborators(question.Objective);
        }

        public IEnumerable<string> GetUsersInvitedToCollaboration(Question question)
        {
            return _objectiveCollaboratorProvider.GetUsersInvitedToCollaboration(question.Objective);
        }
    }
}