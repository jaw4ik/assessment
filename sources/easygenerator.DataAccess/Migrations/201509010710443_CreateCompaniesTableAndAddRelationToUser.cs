namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateCompaniesTableAndAddRelationToUser : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Companies",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Name = c.String(nullable: false),
                        LogoUrl = c.String(nullable: false),
                        PublishCourseApiUrl = c.String(nullable: false),
                        SecretKey = c.String(nullable: false),
                        CreatedBy = c.String(nullable: false, maxLength: 254),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedBy = c.String(nullable: false, maxLength: 254),
                        ModifiedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.Courses", "IsPublishedToExternalLms", c => c.Boolean(nullable: false));
            AddColumn("dbo.Users", "Company_Id", c => c.Guid());
            CreateIndex("dbo.Users", "Company_Id");
            AddForeignKey("dbo.Users", "Company_Id", "dbo.Companies", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Users", "Company_Id", "dbo.Companies");
            DropIndex("dbo.Users", new[] { "Company_Id" });
            DropColumn("dbo.Users", "Company_Id");
            DropColumn("dbo.Courses", "IsPublishedToExternalLms");
            DropTable("dbo.Companies");
        }
    }
}
