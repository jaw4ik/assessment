namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddRelationshipBetweenCourseAndCompany : DbMigration
    {
        public override void Up()
        {
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
        }
        
        public override void Down()
        {
            AddColumn("dbo.Courses", "IsPublishedToExternalLms", c => c.Boolean(nullable: false));
            DropForeignKey("dbo.CompanyCourses", "Course_Id", "dbo.Courses");
            DropForeignKey("dbo.CompanyCourses", "Company_Id", "dbo.Companies");
            DropIndex("dbo.CompanyCourses", new[] { "Course_Id" });
            DropIndex("dbo.CompanyCourses", new[] { "Company_Id" });
            DropTable("dbo.CompanyCourses");
        }
    }
}
