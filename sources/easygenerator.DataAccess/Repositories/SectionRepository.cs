using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.DomainModel.Repositories;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using System;

namespace easygenerator.DataAccess.Repositories
{
    public class SectionRepository : Repository<Section>, ISectionRepository
    {
        public SectionRepository(IDataContext dataContext)
            : base(dataContext)
        {
        }

        public ICollection<Section> GetAvailableSectionsCollection(string username)
        {
            const string query = @"
	            SELECT * FROM Sections WHERE CreatedBy = @createdBy OR Id IN
	            (
		            SELECT co.Section_Id FROM CourseSections co WHERE Course_Id IN
		            (
			            SELECT c.Id FROM Courses c WHERE c.CreatedBy = @createdBy
			            UNION
			            SELECT cc.Course_Id FROM CourseCollaborators cc	WHERE cc.Email = @createdBy AND cc.IsAccepted = 1
                        UNION
                        SELECT course.Id FROM Courses course INNER JOIN OrganizationUsers organizationUser ON course.CreatedBy = organizationUser.Email
				            WHERE course.CreatedBy != @createdBy and organizationUser.Status = @status and Organization_Id IN 
				            (
					            SELECT Organization_Id from OrganizationUsers where Email = @createdBy and IsAdmin = 1 and Status = @status
				            )
		            )
	            )
            ";

            return ((DbSet<Section>)_dataContext.GetSet<Section>()).SqlQuery(query,
                new SqlParameter("@createdBy", username),
                new SqlParameter("@status", OrganizationUserStatus.Accepted)
                ).AsNoTracking().ToList();
        }

        public Section GetSectionRelatedToQuestion(Guid sectionId)
        {
            const string query = @"
                SELECT section.* FROM Sections section INNER JOIN Questions question ON question.Section_Id = section.Id
                WHERE question.Id = @questionId
            ";

            return ((DbSet<Section>)_dataContext.GetSet<Section>()).SqlQuery(query,
                new SqlParameter("@questionId", sectionId)).FirstOrDefault();
        }

        public Section GetSectionRelatedToAnswer(Guid contentId)
        {
            return GetSectionRelatedToQuestionBasedEntity(contentId, "Answers");
        }

        public Section GetSectionRelatedToLearningContent(Guid contentId)
        {
            return GetSectionRelatedToQuestionBasedEntity(contentId, "LearningContents");
        }

        public Section GetSectionRelatedToDropspot(Guid dropspotId)
        {
            return GetSectionRelatedToQuestionBasedEntity(dropspotId, "Dropspots");
        }

        public Section GetSectionRelatedToHotSpotPolygon(Guid hotspotPolygonId)
        {
            return GetSectionRelatedToQuestionBasedEntity(hotspotPolygonId, "HotSpotPolygons");
        }

        public Section GetSectionRelatedToTextMatchingAnswer(Guid answerId)
        {
            return GetSectionRelatedToQuestionBasedEntity(answerId, "TextMatchingAnswers");
        }

        public Section GetSectionRelatedToSingleSelectImageAnswer(Guid answerId)
        {
            return GetSectionRelatedToQuestionBasedEntity(answerId, "SingleSelectImageAnswers");
        }

        public Section GetSectionRelatedToRankingTextAnswer(Guid answerId)
        {
            return GetSectionRelatedToQuestionBasedEntity(answerId, "RankingTextAnswers");
        }

        private Section GetSectionRelatedToQuestionBasedEntity(Guid entityId, string entityTableName)
        {
            var query = String.Format(@"
                    SELECT section.* FROM Sections section inner join(
                        SELECT question.Section_Id FROM Questions question inner join {0} entity ON entity.Question_Id = question.Id
                        WHERE entity.Id = @entityId
                    ) quest ON section.Id = quest.Section_Id
            ", entityTableName);

            return ((DbSet<Section>)_dataContext.GetSet<Section>()).SqlQuery(query,
                new SqlParameter("@entityId", entityId)).FirstOrDefault();
        }
    }
}