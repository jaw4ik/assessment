namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RemoveAim4YouIntegrationTable : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Aim4YouIntegration", "Id", "dbo.Courses");
            DropIndex("dbo.Aim4YouIntegration", new[] { "Id" });
            DropTable("dbo.Aim4YouIntegration");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.Aim4YouIntegration",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Aim4YouCourseId = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateIndex("dbo.Aim4YouIntegration", "Id");
            AddForeignKey("dbo.Aim4YouIntegration", "Id", "dbo.Courses", "Id", cascadeDelete: true);
        }
    }
}
