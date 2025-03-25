using ManagerStaff.Dto.Request;
using ManagerStaff.Dto.Response;

namespace ManagerStaff.Services
{
    public interface IAuthenticationService
    {
        Task<SignInResponse> SignIn(SignInRequest request);
        Task<IntrospectResponse> VerifyToken(IntrospectRequest request);
    }
}
