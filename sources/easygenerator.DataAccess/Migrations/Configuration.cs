using System.Data.Entity.Migrations;

namespace easygenerator.DataAccess.Migrations
{
    public class Configuration : DbMigrationsConfiguration<DatabaseContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(DatabaseContext context)
        {
        }
    }
}
