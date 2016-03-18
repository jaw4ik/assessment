using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using System.Collections.Generic;

namespace easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting.CollaboratorProviders
{
    public class QuestionCollaboratorProvider : IEntityCollaboratorProvider<Question>
    {
        private readonly IEntityCollaboratorProvider<Section> _sectionCollaboratorProvider;

        public QuestionCollaboratorProvider(IEntityCollaboratorProvider<Section> sectionCollaboratorProvider)
        {
            _sectionCollaboratorProvider = sectionCollaboratorProvider;
        }

        public IEnumerable<string> GetCollaborators(Question question)
        {
            return _sectionCollaboratorProvider.GetCollaborators(question.Section);
        }

        public IEnumerable<string> GetUsersInvitedToCollaboration(Question question)
        {
            return _sectionCollaboratorProvider.GetUsersInvitedToCollaboration(question.Section);
        }
    }
}