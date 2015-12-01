using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Web;

namespace easygenerator.StorageServer.DataAccess.Migrations
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