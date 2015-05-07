namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RenameMultipleChoiceToSingleSelectText : DbMigration
    {
        public override void Up()
        {
            Sql("UPDATE dbo.Questions SET Discriminator = N'SingleSelectText' WHERE Discriminator = N'multiplechoice'");
        }
        
        public override void Down()
        {
            Sql("UPDATE dbo.Questions SET Discriminator = N'multiplechoice' WHERE Discriminator = N'SingleSelectText'");
        }
    }
}
