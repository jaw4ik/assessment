namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class AddUserAccessType : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "AccessType", c => c.Int(nullable: false, defaultValue: 1));
        }

        public override void Down()
        {
            DropColumn("dbo.Users", "AccessType");
        }
    }
}
