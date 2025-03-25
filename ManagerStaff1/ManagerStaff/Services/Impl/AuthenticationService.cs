using ManagerStaff.DbConnection;
using ManagerStaff.Dto.Request;
using ManagerStaff.Dto.Response;
using ManagerStaff.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace ManagerStaff.Services.Impl
{
    public class AuthenticationService : IAuthenticationService
    {

        private readonly ApplicationDbContext context;
        private readonly IConfiguration configuration;
        private readonly ILogger<AuthenticationService> logger;
        private readonly IJwtService jwtService;
        private readonly IPasswordHasher<Employee> passwordHasher;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthenticationService(ApplicationDbContext context, IConfiguration configuration, ILogger<AuthenticationService> logger, IJwtService jwtService, IPasswordHasher<Employee> passwordHasher, IHttpContextAccessor httpContextAccessor)
        {
            this.context = context;
            this.configuration = configuration;
            this.logger = logger;
            this.jwtService = jwtService;
            this.passwordHasher = passwordHasher;
            _httpContextAccessor = httpContextAccessor;
        }

        //Xử lí đăng nhập,sau đó tạo token
        public async Task<SignInResponse> SignIn(SignInRequest request)
        {
            logger.LogInformation("SignIn start ...");

            var user = await context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
            {
                logger.LogError("SignIn Failed: User not found.");
                throw new Exception("User not found.");
            }

            //Kiểm tra mật khẩu. So sánh với mật khẩu đã lưu trong DB
            var passwordVerificationResult = passwordHasher.VerifyHashedPassword(user, user.Password, request.Password);

            if (passwordVerificationResult != PasswordVerificationResult.Success)
            {
                logger.LogError("SignIn Failed: Invalid password.");
                throw new Exception("Invalid password.");
            }

            //Tạo Token
            var claims = new[]
                 {
                    new Claim("userId", user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim("Authorities", user.Role.Name)
                };

            var accessToken = jwtService.GenerateAccessToken(claims);
            var refreshToken = jwtService.GenerateRefreshToken(claims);

            //Lưu refreshtoken vào cookie
            var httpContext = _httpContextAccessor?.HttpContext;
            if (httpContext != null)
            {
                httpContext.Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = false,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTimeOffset.UtcNow.AddDays(14)
                });
            }

            await context.SaveChangesAsync();

            logger.LogInformation("SignIn success for userId: {UserId}", user.Id);

            return new SignInResponse(accessToken, refreshToken, user.Role.Name);       //Trả về kết quả đăng nhập
        }


        //Xác minh token có hợp lệ hay không
        public async Task<IntrospectResponse> VerifyToken(IntrospectRequest request)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(configuration["Jwt:Key"]);

            try
            {
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = configuration["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = configuration["Jwt:Audience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                var principal = tokenHandler.ValidateToken(request.Token, validationParameters, out _);
                var roleClaim = principal?.FindFirst("Authorities")?.Value;

                return new IntrospectResponse
                {
                    Valid = true,
                    Scope = roleClaim ?? "Unknown"
                };
            }
            catch
            {
                return new IntrospectResponse
                {
                    Valid = false,
                    Scope = "Invalid"
                };
            }
        }
    }
}
