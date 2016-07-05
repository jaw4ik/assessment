namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddCourseSaleInfo : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.CourseSaleInfoes",
                c => new
                    {
                        Course_Id = c.Guid(nullable: false),
                        PublishedOn = c.DateTime(),
                        DocumentId = c.String(maxLength: 255),
                        IsProcessing = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Course_Id)
                .ForeignKey("dbo.Courses", t => t.Course_Id, cascadeDelete: true)
                .Index(t => t.Course_Id);
            
            AddColumn("dbo.CourseStates", "IsDirtyForSale", c => c.Boolean(nullable: false));
            Sql("UPDATE CourseStates SET [IsDirtyForSale]=0");
            Sql("INSERT INTO CourseSaleInfoes (Course_Id, PublishedOn, DocumentId, IsProcessing) SELECT Id, NULL, NULL, 0 FROM Courses ");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.CourseSaleInfoes", "Course_Id", "dbo.Courses");
            DropIndex("dbo.CourseSaleInfoes", new[] { "Course_Id" });
            DropColumn("dbo.CourseStates", "IsDirtyForSale");
            DropTable("dbo.CourseSaleInfoes");
        }
    }
}
