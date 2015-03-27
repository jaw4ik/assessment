using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class CourseStateInfoObjectMother
    {
        public static CourseStateInfo Create(bool hasUnpublishedChanges)
        {
            return new CourseStateInfo(hasUnpublishedChanges);
        }

        public static CourseStateInfo Create()
        {
            return new CourseStateInfo();
        }
    }
}
