using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public static class CommentObjectMother
    {
        private const string DefaultText = "comment text";
        private const string DefaultCreatedBy = "user";

        public static Comment Create(string createdBy = DefaultCreatedBy, string text = DefaultText)
        {
            return new Comment(createdBy, text);
        }

        public static Comment CreateWithText(string text)
        {
            return Create(text: text);
        }

        public static Comment CreateWithCreatedBy(string createdBy)
        {
            return Create(createdBy: createdBy);
        }
    }
}
