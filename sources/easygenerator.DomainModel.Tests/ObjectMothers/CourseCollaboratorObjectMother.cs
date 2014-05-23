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
        public static CourseCollabrator Create(Course course, User user, string createdBy)
        {
            return new CourseCollabrator(course, user, createdBy);
        }
    }
}
