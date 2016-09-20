namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddAccessControlListToCourse : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.CourseAccessControlListEntries",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        UserInvited = c.Boolean(nullable: false),
                        UserIdentity = c.String(nullable: false, maxLength: 254),
                        CreatedBy = c.String(nullable: false, maxLength: 254),
                        CreatedOn = c.DateTime(nullable: false),
                        Course_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Courses", t => t.Course_Id, cascadeDelete: true)
                .Index(t => t.Course_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.CourseAccessControlListEntries", "Course_Id", "dbo.Courses");
            DropIndex("dbo.CourseAccessControlListEntries", new[] { "Course_Id" });
            DropTable("dbo.CourseAccessControlListEntries");
        }
    }
}
