using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.Infrastructure.DomainModel.Validation.Comments.Contexts;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace easygenerator.Infrastructure.DomainModel.Validation.Comments
{
    public static class CommentContextValidator
    {
        public static void ThrowIfInvalid(string contextString)
        {
            if (contextString == null)
                return;

            ICommentContext context;
            try
            {
                var root = JObject.Parse(contextString);
                var serializer = new JsonSerializer();
                string contextType = serializer.Deserialize<String>(root["type"].CreateReader());

                Type commentType;
                switch (contextType)
                {
                    case "course":
                        commentType = typeof(CourseCommentContext);
                        break;
                    case "question":
                        commentType = typeof(QuestionCommentContext);
                        break;
                    case "informationContent":
                        commentType = typeof(InformationContentCommentContext);
                        break;
                    case "objective":
                        commentType = typeof(ObjectiveCommentContext);
                        break;
                    default:
                        throw new ArgumentException("Context has unknown type", "context.type");
                }

                context = (ICommentContext)JsonConvert.DeserializeObject(contextString, commentType);
            }
            catch (JsonReaderException)
            {
                throw new ArgumentException("Context is not a valid json object", "context");
            }

            context.ThrowIfInvalid();
        }
    }
}
