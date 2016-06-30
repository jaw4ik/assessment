using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Organizations;

namespace easygenerator.DomainModel.Tests.ObjectMothers.Organizations
{
    public class OrganizationObjectMother
    {
        private const string Title = "Organization title";
        private const string CreatedBy = "username@easygenerator.com";

        public static Organization CreateWithTitle(string title)
        {
            return Create(title: title);
        }

        public static Organization CreateWithCreatedBy(string createdBy)
        {
            return Create(createdBy: createdBy);
        }

        public static Organization Create(string title = Title, string createdBy = CreatedBy)
        {
            return new Organization(title, createdBy);
        }
    }
}
