using System;
using System.Linq;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using Newtonsoft.Json.Linq;

namespace easygenerator.Web.Import.PublishedCourse.EntityReaders
{
    public class ObjectiveEntityReader
    {
        public ObjectiveEntityReader(IEntityFactory entityFactory)
        {
            _entityFactory = entityFactory;
        }

        private readonly IEntityFactory _entityFactory;

        public virtual Objective ReadObjective(Guid objectiveId, string createdBy, JObject courseData)
        {
            var objectiveTitle = courseData["objectives"]
                .Single(o => o.Value<string>("id") == objectiveId.ToString("N").ToLower())
                .Value<string>("title");

            return _entityFactory.Objective(objectiveTitle, createdBy);
        }

    }
}