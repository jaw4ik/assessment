namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Aim4YouIntegrationCascadeDelete : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Aim4YouIntegration", "Id", "dbo.Courses");
            AddForeignKey("dbo.Aim4YouIntegration", "Id", "dbo.Courses", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Aim4YouIntegration", "Id", "dbo.Courses");
            AddForeignKey("dbo.Aim4YouIntegration", "Id", "dbo.Courses", "Id");
        }
    }
}
