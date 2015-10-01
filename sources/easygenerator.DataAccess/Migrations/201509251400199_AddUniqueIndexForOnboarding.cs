namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class AddUniqueIndexForOnboarding : DbMigration
    {
        public override void Up()
        {
            Sql("WITH cte AS (SELECT ROW_NUMBER() OVER (PARTITION BY UserEmail ORDER BY (SELECT 0)) RN FROM dbo.Onboardings) DELETE FROM cte WHERE  RN > 1");
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
