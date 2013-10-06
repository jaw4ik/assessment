using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DataAccess
{
    public class DatabaseContextInitializationStrategy : DropCreateDatabaseIfModelChanges<DatabaseContext>
    {
        protected override void Seed(DatabaseContext context)
        {
            context.Set<Template>().Add(new Template("Default", "/Content/images/defaultTemplate.png", "Some user"));
            context.Set<Template>().Add(new Template("Quiz", "/Content/images/quizTemplate.png", "Some user"));
            base.Seed(context);
        }
    }
}
