namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateIndexesForOnboarding : DbMigration
    {
        public override void Up()
        {
            CreateIndex("dbo.Onboardings", "UserEmail", false, "Onboardings_UserEmail");
        }
        
        public override void Down()
        {
            DropIndex("dbo.Onboardings", "Onboardings_UserEmail");
        }
    }
}
