namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateDemoCoursesTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.DemoCourseInfoes",
                c => new
                {
                    Id = c.Guid(nullable: false),
                    CreatedBy = c.String(nullable: false, maxLength: 254),
                    CreatedOn = c.DateTime(nullable: false),
                    ModifiedBy = c.String(nullable: false, maxLength: 254),
                    ModifiedOn = c.DateTime(nullable: false),
                    DemoCourse_Id = c.Guid(nullable: false),
                    SourceCourse_Id = c.Guid(),
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Courses", t => t.DemoCourse_Id, cascadeDelete: true)
                .Index(t => t.DemoCourse_Id);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.DemoCourseInfoes", "DemoCourse_Id", "dbo.Courses");
            DropIndex("dbo.DemoCourseInfoes", new[] { "DemoCourse_Id" });
            DropTable("dbo.DemoCourseInfoes");
        }
    }
}
