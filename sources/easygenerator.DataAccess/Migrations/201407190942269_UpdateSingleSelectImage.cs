namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdateSingleSelectImage : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.SingleSelectImageAnswers", "Image", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.SingleSelectImageAnswers", "Image", c => c.String(nullable: false));
        }
    }
}
