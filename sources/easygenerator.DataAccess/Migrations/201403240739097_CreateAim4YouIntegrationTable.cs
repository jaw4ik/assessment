namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateAim4YouIntegrationTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Aim4YouIntegration",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Aim4YouCourseId = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Courses", t => t.Id)
                .Index(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Aim4YouIntegration", "Id", "dbo.Courses");
            DropIndex("dbo.Aim4YouIntegration", new[] { "Id" });
            DropTable("dbo.Aim4YouIntegration");
        }
    }
}
