using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public static class CourseCollaboratorObjectMother
    {
        private const string CreatedBy = "easygenerator@easygenerator.com";

        public static CourseCollaborator Create(Course course, string userEmail, string createdBy = CreatedBy)
        {
            return new CourseCollaborator(course, userEmail, createdBy);
        }
    }
}
