using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace ManagerStaff.Configuration
{
    // cấu hình JWT để thiết lập xác thực JWT trong ứng dụng
    public static class JwtConfiguration
    {
        // thêm xác thực JWT vào dịch vụ
        public static void AddCustomJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            // Lấy cấu hình JWT từ appsettings.json
            var jwtSettings = configuration.GetSection("Jwt");
            var secretKey = jwtSettings["Key"];

            // Kiểm tra nếu Sercret không được cấu hình
            if (string.IsNullOrEmpty(secretKey))
            {
                throw new Exception("JWT Key is not configured in appsettings.json");
            }

            // Cấu hình xác thực JWT
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true, // Xác thực Issuer
                    ValidateAudience = true, // Xác thực Audience
                    ValidateLifetime = true, // Xác thực thời gian sống của token
                    ValidateIssuerSigningKey = true, // Xác thực khóa ký JWT
                    ValidIssuer = jwtSettings["Issuer"], // Định nghĩa Issuer hợp lệ
                    ValidAudience = jwtSettings["Audience"], // Định nghĩa Audience hợp lệ
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)), // Khóa ký token
                    ClockSkew = TimeSpan.Zero, // Không cho phép trễ thời gian xác thực token
                    RoleClaimType = "Authorities" // Xác định kiểu claim chứa quyền hạn của người dùng
                };
            });
        }
    }
}
