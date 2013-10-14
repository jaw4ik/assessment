using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DataAccess
{
    public class DatabaseContextInitializationStrategy : IDatabaseInitializer<DatabaseContext>
    {
        public void InitializeDatabase(DatabaseContext context)
        {
            if (context.Database.Exists())
            {
                if (context.Database.CompatibleWithModel(true))
                {
                    return;
                }

                context.Database.Delete();
            }

            context.Database.CreateIfNotExists();
            context.Database.ExecuteSqlCommand("ALTER TABLE Users ADD CONSTRAINT UQ_Email UNIQUE (Email)");

            context.Set<Template>().Add(new Template("Default", "/Content/images/defaultTemplate.png", "Some user"));
            context.Set<Template>().Add(new Template("Quiz", "/Content/images/quizTemplate.png", "Some user"));

            context.SaveChanges();
        }
    }
}
