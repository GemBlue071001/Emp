using System.Security.Claims;

namespace ManagerStaff.Services
{
    public interface IJwtService
    {
        string GenerateAccessToken(Claim[] claims);
        string GenerateRefreshToken(Claim[] claims);
    }
}
