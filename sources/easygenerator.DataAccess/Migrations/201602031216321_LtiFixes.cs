namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class LtiFixes : DbMigration
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
        }
    }
}
