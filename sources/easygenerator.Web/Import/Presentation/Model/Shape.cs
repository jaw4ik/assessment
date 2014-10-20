using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace easygenerator.Web.Import.Presentation.Model
{
    public class Shape
    {
        public Shape(string text, Position position)
        {
            Text = text;
            Position = position;
        }

        public string Text { get; private set; }
        public Position Position { get; private set; }
    }
}