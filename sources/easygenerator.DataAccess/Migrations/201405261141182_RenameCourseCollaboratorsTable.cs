namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class RenameCourseCollaboratorsTable : DbMigration
    {
        public override void Up()
        {
            Sql("truncate table dbo.CourseCollabrators");

            DropForeignKey("dbo.CourseCollabrators", "User_Id", "dbo.Users");
            DropIndex("dbo.CourseCollabrators", new[] { "User_Id" });
            RenameTable(name: "dbo.CourseCollabrators", newName: "CourseCollaborators");

            AddColumn("dbo.CourseCollaborators", "Email", c => c.String(nullable: false, maxLength: 254));
            DropColumn("dbo.CourseCollaborators", "User_Id");
        }

        public override void Down()
        {
            AddColumn("dbo.CourseCollaborators", "User_Id", c => c.Guid(nullable: false));
            DropColumn("dbo.CourseCollaborators", "Email");
            CreateIndex("dbo.CourseCollaborators", "User_Id");
            AddForeignKey("dbo.CourseCollabrators", "User_Id", "dbo.Users", "Id", cascadeDelete: true);
            RenameTable(name: "dbo.CourseCollaborators", newName: "CourseCollabrators");
        }
    }
}
