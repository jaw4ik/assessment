namespace easygenerator.Infrastructure
{
    public interface IReleaseNoteFileReader
    {
        string GetReleaseVersion();
        string Read();
    }
}
