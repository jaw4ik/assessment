using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public static class HotSpotPolygonObjectMother
    {
        private const string Points = "[{x:1,y:1},{x:5,y:1},{x:5,y:5},{x:1,y:5}]";
        private const string CreatedBy = "username@easygenerator.com";

        public static HotSpotPolygon CreateWithPoints(string points)
        {
            return Create(points: points);
        }

        public static HotSpotPolygon CreateWithCreatedBy(string createdBy)
        {
            return Create(createdBy: createdBy);
        }

        public static HotSpotPolygon Create(string points = Points, string createdBy = CreatedBy)
        {
            return new HotSpotPolygon(points, createdBy);
        }
    }
}
