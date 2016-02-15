namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddRelationshipBetweenLearningPathAndCompany : DbMigration
    {
        public override void Up()
        {
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
            AddColumn("dbo.LearningPaths", "IsPublishedToExternalLms", c => c.Boolean(nullable: false));
            DropForeignKey("dbo.CompanyLearningPaths", "LearningPath_Id", "dbo.LearningPaths");
            DropForeignKey("dbo.CompanyLearningPaths", "Company_Id", "dbo.Companies");
            DropIndex("dbo.CompanyLearningPaths", new[] { "LearningPath_Id" });
            DropIndex("dbo.CompanyLearningPaths", new[] { "Company_Id" });
            DropTable("dbo.CompanyLearningPaths");
        }
    }
}
