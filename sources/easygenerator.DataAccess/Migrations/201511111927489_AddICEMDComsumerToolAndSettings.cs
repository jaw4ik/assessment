namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddICEMDComsumerToolAndSettings : DbMigration
    {
        public override void Up()
        {
            Sql(@"                    
                  DECLARE @ICEMDId AS UNIQUEIDENTIFIER
                  SET @ICEMDId = NEWID()
                  INSERT INTO ConsumerTools SELECT @ICEMDId, 'ICEMD', null, '05FE3039AEC24255AE76CE023D34F845', 'B7696E74FCFC41408EE8BE1505604F66'
                  INSERT INTO ConsumerToolSettings SELECT @ICEMDId, NULL, NULL, Id FROM Companies WHERE Name = 'ICEMD'
                ");
        }
        
        public override void Down()
        {
            Sql("DELETE FROM ConsumerTools WHERE Title = 'ICEMD'");
        }
    }
}
