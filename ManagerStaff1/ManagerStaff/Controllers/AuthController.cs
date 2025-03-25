using ManagerStaff.Dto.Request;
using ManagerStaff.Dto.Response;
using ManagerStaff.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ManagerStaff.Controllers
{
    // Định nghĩa route chung cho controller là "api/auth"
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private readonly IAuthenticationService authenticationService;  // Khai báo dependency cho xác thực

        public AuthController(IAuthenticationService authenticationService) // Constructor để inject service vào controller
        {
            this.authenticationService = authenticationService;
        }

        //API Đăng Nhập
        [HttpPost("sign-in")]
        [AllowAnonymous]    //Cho phép truy cập mà không cần xác thực
        public async Task<ApiResponse<SignInResponse>> SigIn([FromBody] SignInRequest request)
        {
            var result = await authenticationService.SignIn(request);   // Gọi service để thực hiện đăng nhập

            return new ApiResponse<SignInResponse>  // Trả về phản hồi với mã 200 (OK) và thông tin đăng nhập
            {
                code = 200,
                message = "Đăng nhập thành công",
                result = result
            };
        }

        // API kiểm tra token hợp lệ (Introspect) token hợp lệ mới truy cập được hệ thống
        [HttpPost("introspect")]
        [AllowAnonymous]    // Cho phép truy cập mà không cần xác thực
        public async Task<ApiResponse<IntrospectResponse>> Introspect([FromBody] IntrospectRequest request)
        {
            var result = await authenticationService.VerifyToken(request);  // Gọi service để xác minh token
            return new ApiResponse<IntrospectResponse>  // Trả về phản hồi với mã 200 (OK) và kết quả xác minh token
            {
                code = 200,
                message = "API hợp lệ",
                result = result
            };
        }

    }
}
