namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class LtiAndCustomPublishImprovements : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Users", "Company_Id", "dbo.Companies");
            DropIndex("dbo.Users", new[] { "Company_Id" });
            DropIndex("dbo.LtiUserInfoes", new[] { "ConsumerTool_Id" });
            DropIndex("dbo.LtiUserInfoes", new[] { "User_Id" });
            CreateTable(
               "dbo.CompanyUsers",
               c => new
               {
                   Company_Id = c.Guid(nullable: false),
                   User_Id = c.Guid(nullable: false),
               })
               .PrimaryKey(t => new { t.Company_Id, t.User_Id })
               .ForeignKey("dbo.Companies", t => t.Company_Id, cascadeDelete: true)
               .ForeignKey("dbo.Users", t => t.User_Id, cascadeDelete: true)
               .Index(t => t.Company_Id)
               .Index(t => t.User_Id);

            Sql("INSERT INTO CompanyUsers (Company_Id, User_Id) SELECT Company_Id, Id FROM Users WHERE Users.Id IS NOT null AND Users.Company_Id IS NOT null");

            AddColumn("dbo.Companies", "Priority", c => c.Short(nullable: false));
            AlterColumn("dbo.LtiUserInfoes", "LtiUserId", c => c.String(maxLength: 255));
            CreateIndex("dbo.LtiUserInfoes", "LtiUserId");
            CreateIndex("dbo.LtiUserInfoes", new[] { "LtiUserId", "User_Id", "ConsumerTool_Id" }, unique: true, name: "UI_LtiUserInfo_LtiUserId_User_Id_ConsumerTool_Id");
            CreateIndex("dbo.LtiUserInfoes", "User_Id");
            CreateIndex("dbo.LtiUserInfoes", "ConsumerTool_Id");
            DropColumn("dbo.Users", "Company_Id");

            AddColumn("dbo.Users", "IsCreatedThroughLti", c => c.Boolean(nullable: false));
            Sql("UPDATE Users SET [IsCreatedThroughLti]=0");
            Sql("UPDATE Users SET [IsCreatedThroughLti]=1 where Users.Id in (SELECT User_Id from LtiUserInfoes)");

            CreateTable(
                "dbo.CompanyCourses",
                c => new
                    {
                        Company_Id = c.Guid(nullable: false),
                        Course_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => new { t.Company_Id, t.Course_Id })
                .ForeignKey("dbo.Companies", t => t.Company_Id, cascadeDelete: true)
                .ForeignKey("dbo.Courses", t => t.Course_Id, cascadeDelete: true)
                .Index(t => t.Company_Id)
                .Index(t => t.Course_Id);

            Sql("INSERT INTO CompanyCourses (Company_Id, Course_Id) SELECT CompanyUsers.Company_Id, Courses.Id FROM Courses INNER JOIN Users ON Courses.CreatedBy = Users.Email INNER JOIN CompanyUsers ON Users.Id = CompanyUsers.User_Id WHERE Courses.IsPublishedToExternalLms = 1");

            DropColumn("dbo.Courses", "IsPublishedToExternalLms");

            CreateTable(
                "dbo.CompanyLearningPaths",
                c => new
                    {
                        Company_Id = c.Guid(nullable: false),
                        LearningPath_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => new { t.Company_Id, t.LearningPath_Id })
                .ForeignKey("dbo.Companies", t => t.Company_Id, cascadeDelete: true)
                .ForeignKey("dbo.LearningPaths", t => t.LearningPath_Id, cascadeDelete: true)
                .Index(t => t.Company_Id)
                .Index(t => t.LearningPath_Id);

            Sql("INSERT INTO CompanyLearningPaths (Company_Id, LearningPath_Id) SELECT CompanyUsers.Company_Id, LearningPaths.Id FROM LearningPaths INNER JOIN Users ON LearningPaths.CreatedBy = Users.Email INNER JOIN CompanyUsers ON Users.Id = CompanyUsers.User_Id WHERE LearningPaths.IsPublishedToExternalLms = 1");

            DropColumn("dbo.LearningPaths", "IsPublishedToExternalLms");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Users", "Company_Id", c => c.Guid());
            DropForeignKey("dbo.CompanyUsers", "User_Id", "dbo.Users");
            DropForeignKey("dbo.CompanyUsers", "Company_Id", "dbo.Companies");
            DropIndex("dbo.CompanyUsers", new[] { "User_Id" });
            DropIndex("dbo.CompanyUsers", new[] { "Company_Id" });
            DropIndex("dbo.LtiUserInfoes", new[] { "ConsumerTool_Id" });
            DropIndex("dbo.LtiUserInfoes", new[] { "User_Id" });
            DropIndex("dbo.LtiUserInfoes", "UI_LtiUserInfo_LtiUserId_User_Id_ConsumerTool_Id");
            DropIndex("dbo.LtiUserInfoes", new[] { "LtiUserId" });
            AlterColumn("dbo.LtiUserInfoes", "LtiUserId", c => c.String(nullable: false));
            DropColumn("dbo.Companies", "Priority");
            DropTable("dbo.CompanyUsers");
            CreateIndex("dbo.LtiUserInfoes", "User_Id");
            CreateIndex("dbo.LtiUserInfoes", "ConsumerTool_Id");
            CreateIndex("dbo.Users", "Company_Id");
            AddForeignKey("dbo.Users", "Company_Id", "dbo.Companies", "Id");
            DropColumn("dbo.Users", "IsCreatedThroughLti");
            AddColumn("dbo.Courses", "IsPublishedToExternalLms", c => c.Boolean(nullable: false));
            DropForeignKey("dbo.CompanyCourses", "Course_Id", "dbo.Courses");
            DropForeignKey("dbo.CompanyCourses", "Company_Id", "dbo.Companies");
            DropIndex("dbo.CompanyCourses", new[] { "Course_Id" });
            DropIndex("dbo.CompanyCourses", new[] { "Company_Id" });
            DropTable("dbo.CompanyCourses");
            AddColumn("dbo.LearningPaths", "IsPublishedToExternalLms", c => c.Boolean(nullable: false));
            DropForeignKey("dbo.CompanyLearningPaths", "LearningPath_Id", "dbo.LearningPaths");
            DropForeignKey("dbo.CompanyLearningPaths", "Company_Id", "dbo.Companies");
            DropIndex("dbo.CompanyLearningPaths", new[] { "LearningPath_Id" });
            DropIndex("dbo.CompanyLearningPaths", new[] { "Company_Id" });
            DropTable("dbo.CompanyLearningPaths");
        }
    }
}
