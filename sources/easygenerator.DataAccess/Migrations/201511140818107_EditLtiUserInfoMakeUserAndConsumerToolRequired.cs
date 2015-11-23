namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class EditLtiUserInfoMakeUserAndConsumerToolRequired : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.LtiUserInfoes", "ConsumerTool_Id", "dbo.ConsumerTools");
            DropIndex("dbo.LtiUserInfoes", new[] { "ConsumerTool_Id" });
            DropIndex("dbo.LtiUserInfoes", new[] { "User_Id" });
            AlterColumn("dbo.LtiUserInfoes", "ConsumerTool_Id", c => c.Guid(nullable: false));
            AlterColumn("dbo.LtiUserInfoes", "User_Id", c => c.Guid(nullable: false));
            CreateIndex("dbo.LtiUserInfoes", "ConsumerTool_Id");
            CreateIndex("dbo.LtiUserInfoes", "User_Id");
            AddForeignKey("dbo.LtiUserInfoes", "ConsumerTool_Id", "dbo.ConsumerTools", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.LtiUserInfoes", "ConsumerTool_Id", "dbo.ConsumerTools");
            DropIndex("dbo.LtiUserInfoes", new[] { "User_Id" });
            DropIndex("dbo.LtiUserInfoes", new[] { "ConsumerTool_Id" });
            AlterColumn("dbo.LtiUserInfoes", "User_Id", c => c.Guid());
            AlterColumn("dbo.LtiUserInfoes", "ConsumerTool_Id", c => c.Guid());
            CreateIndex("dbo.LtiUserInfoes", "User_Id");
            CreateIndex("dbo.LtiUserInfoes", "ConsumerTool_Id");
            AddForeignKey("dbo.LtiUserInfoes", "ConsumerTool_Id", "dbo.ConsumerTools", "Id");
        }
    }
}
