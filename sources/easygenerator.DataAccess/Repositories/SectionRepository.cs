using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.DomainModel.Repositories;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;

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
    }
}