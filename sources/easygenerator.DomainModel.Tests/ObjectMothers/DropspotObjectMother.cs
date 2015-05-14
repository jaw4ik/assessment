using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public static class DropspotObjectMother
    {
        private const string Text = "Dropspot text";
        private const int X = 10;
        private const int Y = 20;
        private const string CreatedBy = "username@easygenerator.com";

        public static Dropspot CreateWithText(string text)
        {
            return Create(text: text);
        }

        public static Dropspot CreateWithPosition(int x, int y)
        {
            return Create(x: x, y: y);
        }

        public static Dropspot CreateWithCreatedBy(string createdBy)
        {
            return Create(createdBy: createdBy);
        }

        public static Dropspot Create(string text = Text, int x = X, int y = Y, string createdBy = CreatedBy)
        {
            return new Dropspot(text, x, y, createdBy);
        }
    }
}
