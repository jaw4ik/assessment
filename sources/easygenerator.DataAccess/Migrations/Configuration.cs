using System.Data.Entity.Migrations;

namespace easygenerator.DataAccess.Migrations
{
    public class Configuration : DbMigrationsConfiguration<DatabaseContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
            CommandTimeout = 600;
        }

        protected override void Seed(DatabaseContext context)
        {
        }
    }
}
