namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddLPDocuments : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Documents",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Title = c.String(nullable: false, maxLength: 255),
                        EmbedCode = c.String(nullable: false),
                        DocumentType = c.Int(nullable: false),
                        CreatedBy = c.String(nullable: false, maxLength: 254),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedBy = c.String(nullable: false, maxLength: 254),
                        ModifiedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.LearningPathDocuments",
                c => new
                    {
                        Document_Id = c.Guid(nullable: false),
                        LearningPath_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => new { t.Document_Id, t.LearningPath_Id })
                .ForeignKey("dbo.Documents", t => t.Document_Id, cascadeDelete: true)
                .ForeignKey("dbo.LearningPaths", t => t.LearningPath_Id, cascadeDelete: true)
                .Index(t => t.Document_Id)
                .Index(t => t.LearningPath_Id);
            
            AddColumn("dbo.LearningPaths", "EntitiesOrder", c => c.String());
            DropColumn("dbo.LearningPaths", "CoursesOrder");
        }
        
        public override void Down()
        {
            AddColumn("dbo.LearningPaths", "CoursesOrder", c => c.String());
            DropForeignKey("dbo.LearningPathDocuments", "LearningPath_Id", "dbo.LearningPaths");
            DropForeignKey("dbo.LearningPathDocuments", "Document_Id", "dbo.Documents");
            DropIndex("dbo.LearningPathDocuments", new[] { "LearningPath_Id" });
            DropIndex("dbo.LearningPathDocuments", new[] { "Document_Id" });
            DropColumn("dbo.LearningPaths", "EntitiesOrder");
            DropTable("dbo.LearningPathDocuments");
            DropTable("dbo.Documents");
        }
    }
}
