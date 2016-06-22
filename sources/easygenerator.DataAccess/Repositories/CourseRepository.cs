using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;

namespace easygenerator.DataAccess.Repositories
{
    public class CourseRepository : Repository<Course>, ICourseRepository
    {
        public CourseRepository(IDataContext dataContext)
            : base(dataContext)
        {
        }

        public ICollection<Course> GetOwnedCourses(string email)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(email, "email");
            return GetCollection(course => course.CreatedBy == email);
        }

        public ICollection<Course> GetAvailableCoursesCollection(string username)
        {
            return _dataContext.GetSet<Course>().Where(course => course.CreatedBy == username ||
                   course.CollaboratorsCollection.Any(collaboration => collaboration.Email == username && collaboration.IsAccepted)
                   ).AsNoTracking().ToList();
        }

        public void RemoveCourseWithSections(Guid courseId)
        {
            var command = @"
							DELETE FROM Sections WHERE Id IN (SELECT Section_Id FROM CourseSections WHERE Course_Id = @courseId)
							DELETE FROM Courses WHERE ID = @courseId
						  ";

            ((DatabaseContext)_dataContext).Database.ExecuteSqlCommand(command, new SqlParameter("@courseId", courseId));
        }

        public ICollection<Course> GetCoursesRelatedToSection(Guid sectionId)
        {
            const string query = @"
				SELECT course.* FROM Courses course INNER JOIN CourseSections section ON section.Course_Id = course.Id 
				WHERE section.Section_Id = @sectionId
			";

            return ((DbSet<Course>)_dataContext.GetSet<Course>()).SqlQuery(query,
                new SqlParameter("@sectionId", sectionId)).ToList();
        }

        public ICollection<Course> GetCoursesRelatedToQuestion(Guid questionId)
        {
            const string query = @"
				SELECT course.* FROM Courses course INNER JOIN (
					SELECT section.Course_Id FROM CourseSections section INNER JOIN (
						SELECT question.Section_Id FROM Questions question WHERE question.Id = @questionId
					) quest ON section.Section_Id = quest.Section_Id
				) obj ON course.Id = obj.Course_Id
			";

            return ((DbSet<Course>)_dataContext.GetSet<Course>()).SqlQuery(query,
                new SqlParameter("@questionId", questionId)).ToList();
        }

        public IEnumerable<Course> GetCoursesRelatedToLearningContent(Guid contentId)
        {
            return GetCoursesRelatedToQuestionBasedEntity(contentId, "LearningContents");
        }

        public IEnumerable<Course> GetCoursesRelatedToAnswer(Guid answerId)
        {
            return GetCoursesRelatedToQuestionBasedEntity(answerId, "Answers");
        }

        public IEnumerable<Course> GetCoursesRelatedToDropspot(Guid dropspotId)
        {
            return GetCoursesRelatedToQuestionBasedEntity(dropspotId, "Dropspots");
        }

        public IEnumerable<Course> GetCoursesRelatedToHotSpotPolygon(Guid hotspotPolygonId)
        {
            return GetCoursesRelatedToQuestionBasedEntity(hotspotPolygonId, "HotSpotPolygons");
        }

        public IEnumerable<Course> GetCoursesRelatedToTextMatchingAnswer(Guid answerId)
        {
            return GetCoursesRelatedToQuestionBasedEntity(answerId, "TextMatchingAnswers");
        }

        public IEnumerable<Course> GetCoursesRelatedToSingleSelectImageAnswer(Guid answerId)
        {
            return GetCoursesRelatedToQuestionBasedEntity(answerId, "SingleSelectImageAnswers");
        }

        public IEnumerable<Course> GetCoursesRelatedToRankingTextAnswer(Guid answerId)
        {
            return GetCoursesRelatedToQuestionBasedEntity(answerId, "RankingTextAnswers");
        }

        private IEnumerable<Course> GetCoursesRelatedToQuestionBasedEntity(Guid entityId, string entityTableName)
        {
            var query = String.Format(@"
                SELECT course.* FROM Courses course inner join(
	                SELECT section.Course_Id FROM CourseSections section inner join(
		                SELECT question.Section_Id FROM Questions question inner join {0} entity ON entity.Question_Id = question.Id
		                WHERE entity.Id = @entityId
	                ) quest ON section.Section_Id = quest.Section_Id
                ) obj ON course.Id = obj.Course_Id
			", entityTableName);

            return ((DbSet<Course>)_dataContext.GetSet<Course>()).SqlQuery(query,
                new SqlParameter("@entityId", entityId)).ToList();
        }
    }
}