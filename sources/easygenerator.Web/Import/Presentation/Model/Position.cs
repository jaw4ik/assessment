using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace easygenerator.Web.Import.Presentation.Model
{
    public class Position
    {
        public Position(double x, double y)
        {
            X = x;
            Y = y;
        }

        public double X { get; private set; }
        public double Y { get; private set; }
    }
}