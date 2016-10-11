using easygenerator.DomainModel.Entities;
using System.Collections.Generic;
using System;

namespace easygenerator.DomainModel.Repositories
{
    public interface ISectionRepository : IRepository<Section>
    {
        ICollection<Section> GetAvailableSectionsCollection(string username);
        Section GetSectionRelatedToQuestion(Guid sectionId);

        Section GetSectionRelatedToLearningContent(Guid contentId);
        Section GetSectionRelatedToDropspot(Guid dropspotId);
        Section GetSectionRelatedToHotSpotPolygon(Guid hotspotPolygonId);
        Section GetSectionRelatedToTextMatchingAnswer(Guid answerId);
        Section GetSectionRelatedToSingleSelectImageAnswer(Guid answerId);
        Section GetSectionRelatedToRankingTextAnswer(Guid answerId);
        Section GetSectionRelatedToAnswer(Guid contentId);
    }
}
