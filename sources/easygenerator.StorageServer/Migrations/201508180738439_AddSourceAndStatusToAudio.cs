namespace easygenerator.StorageServer.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class AddSourceAndStatusToAudio : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Audios", "Status", c => c.Int(nullable: false, defaultValue: 1));
            AddColumn("dbo.Audios", "Source", c => c.String());
        }

        public override void Down()
        {
            DropColumn("dbo.Audios", "Source");
            DropColumn("dbo.Audios", "Status");
        }
    }
}
