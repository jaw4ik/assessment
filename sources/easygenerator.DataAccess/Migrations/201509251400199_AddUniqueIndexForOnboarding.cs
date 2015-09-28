namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class AddUniqueIndexForOnboarding : DbMigration
    {
        public override void Up()
        {
            DropIndex("dbo.Onboardings", "Onboardings_UserEmail");
            CreateIndex("dbo.Onboardings", "UserEmail", unique: true, name: "Onboardings_UserEmail");
        }

        public override void Down()
        {
            DropIndex("dbo.Onboardings", "Onboardings_UserEmail");
            CreateIndex("dbo.Onboardings", "UserEmail", name: "Onboardings_UserEmail");
        }
    }
}
