using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace easygenerator.Infrastructure.DomainModel.Validation.Comments.Contexts
{
    public class InformationContentCommentContext : ICommentContext
    {
        [JsonProperty("property")]
        public string Property { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("id")]
        public string Id { get; set; }

        public void ThrowIfInvalid()
        {
            if (!string.IsNullOrEmpty(Property) && Property != "voiceOver")
                throw new ArgumentException("Context property is not a valid", "context.property");

            if (string.IsNullOrEmpty(Title) || Title.Length > 256)
                throw new ArgumentException("Context title is not a valid", "context.title");

            if (string.IsNullOrEmpty(Id))
                throw new ArgumentException("Context id is not a valid", "context.id");
        }
    }
}
