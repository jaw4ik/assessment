namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddConsumerToolToLtiUserInfo : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.LtiUserInfoes", "Id", "dbo.Users");
            DropIndex("dbo.LtiUserInfoes", new[] { "Id" });
            AddColumn("dbo.LtiUserInfoes", "ConsumerTool_Id", c => c.Guid());
            AddColumn("dbo.LtiUserInfoes", "User_Id", c => c.Guid());
            CreateIndex("dbo.LtiUserInfoes", "ConsumerTool_Id");
            CreateIndex("dbo.LtiUserInfoes", "User_Id");
            AddForeignKey("dbo.LtiUserInfoes", "ConsumerTool_Id", "dbo.ConsumerTools", "Id");
            AddForeignKey("dbo.LtiUserInfoes", "User_Id", "dbo.Users", "Id", cascadeDelete: true);

            Sql(@"
                  DECLARE @consumerToolId AS UNIQUEIDENTIFIER
                  SELECT @consumerToolId = Id FROM [dbo].[ConsumerTools] WHERE Title <> 'ICEMD'
                  UPDATE [dbo].[LtiUserInfoes] SET User_Id = Id, ConsumerTool_Id = @consumerToolId
                  UPDATE [dbo].[LtiUserInfoes] SET Id = NEWID()
            ");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.LtiUserInfoes", "User_Id", "dbo.Users");
            DropForeignKey("dbo.LtiUserInfoes", "ConsumerTool_Id", "dbo.ConsumerTools");
            DropIndex("dbo.LtiUserInfoes", new[] { "User_Id" });
            DropIndex("dbo.LtiUserInfoes", new[] { "ConsumerTool_Id" });
            DropColumn("dbo.LtiUserInfoes", "User_Id");
            DropColumn("dbo.LtiUserInfoes", "ConsumerTool_Id");
            CreateIndex("dbo.LtiUserInfoes", "Id");
            AddForeignKey("dbo.LtiUserInfoes", "Id", "dbo.Users", "Id", cascadeDelete: true);
        }
    }
}
