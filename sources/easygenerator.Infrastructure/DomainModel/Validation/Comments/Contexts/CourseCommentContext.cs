using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace easygenerator.Infrastructure.DomainModel.Validation.Comments.Contexts
{
    public class CourseCommentContext : ICommentContext
    {
        [JsonProperty("property")]
        public string Property { get; set; }

        public void ThrowIfInvalid()
        {
            if (string.IsNullOrEmpty(Property) || (Property != "title" && Property != "introduction"))
                throw new ArgumentException("Context property is not a valid", "context.property");
        }
    }
}
