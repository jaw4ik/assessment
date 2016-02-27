namespace easygenerator.Auth.Security.Providers
{
    public interface ISecureTokenProvider<T>
    {
        string GenerateToken(T dataObject);
        T GetDataFromToken(string token);
    }
}