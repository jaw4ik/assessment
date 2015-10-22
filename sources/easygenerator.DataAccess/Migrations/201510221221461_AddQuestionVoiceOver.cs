namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddQuestionVoiceOver : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Questions", "VoiceOver", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Questions", "VoiceOver");
        }
    }
}
