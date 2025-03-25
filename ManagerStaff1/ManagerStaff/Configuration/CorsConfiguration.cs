namespace ManagerStaff.Configuration
{
    // cấu hình CORS để kiểm soát nguồn gốc request từ FE
    public static class CorsConfiguration
    {
        //thêm cấu hình CORS 
        public static void AddCustomCors(this IServiceCollection services, string[] allowedOrigins)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("_myAllowSpecificOrigins", policy =>
                {
                    policy.WithOrigins(allowedOrigins) // chỉ cho phép các nguồn gốc được chỉ định
                          .AllowAnyHeader() // cho phép tất cả các loại tiêu đề HTTP
                          .AllowAnyMethod(); // cho phép tất cả các phương thức HTTP 
                });
            });
        }
    }
}