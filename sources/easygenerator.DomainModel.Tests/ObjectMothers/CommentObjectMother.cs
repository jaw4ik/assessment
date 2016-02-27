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
        private const string DefaultName = "user";
        private const string DefaultCreatedBy = "user@user.user";

        public static Comment Create(string createdByName = DefaultName, string createdBy = DefaultCreatedBy, string text = DefaultText, string context = null)
        {
            return new Comment(createdByName, createdBy, text, context);
        }

        public static Comment CreateWithText(string text)
        {
            return Create(text: text);
        }

        public static Comment CreateWithContext(string context)
        {
            return Create(context: context);
        }

        public static Comment CreateWithCreatedBy(string createdBy)
        {
            return Create(createdBy: createdBy);
        }
    }
}
