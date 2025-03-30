using ManagerStaff.DbConnection;
using ManagerStaff.Dto.Request;
using ManagerStaff.Dto.Response;
using ManagerStaff.Model;
using ManagerStaff.Services;
using ManagerStaff.Services.Impl;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ManagerStaff.Controllers
{
    // Định nghĩa route chung cho controller là "api/users"
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        // Khai báo các dependency cần thiết
        private readonly IUserService userService;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly ApplicationDbContext dbContext;


        public UserController(IUserService userService, IHttpContextAccessor httpContextAccessor, ApplicationDbContext dbContext)
        {
            this.userService = userService;
            this.httpContextAccessor = httpContextAccessor;
            this.dbContext = dbContext;
        }

        // API lấy danh sách tất cả người dùng, chỉ dành cho Admin
        [Authorize(Roles = "ADMIN")]
        [HttpGet]
        public async Task<ApiResponse<PageResponse<UserResponse>>> FetchAllUser
        (
            [FromQuery] int? page,   
            [FromQuery] int? size,   
            [FromQuery] string? searchQuery,
            [FromQuery] int? departmentId,
            [FromQuery] int? roleId
        )
        {
            int currentPage = page ?? 1;    // Số trang hiện tại (nếu không có, mặc định là 1)
            int pageSize = size ?? 4;       // Kích thước trang (nếu không có, mặc định là 4)

            var users = await userService.FindAll(currentPage, pageSize, searchQuery, departmentId, roleId);  // Gọi service để lấy danh sách người dùng

            return new ApiResponse<PageResponse<UserResponse>>(     // Trả về phản hồi với mã 200 (OK) và danh sách người dùng
                code: 200,
                message: "Đã lấy tất cả người dùng",
                result: users
            );
        }

        // API tạo mới người dùng, không yêu cầu xác thực
        [HttpPost]
        [AllowAnonymous]
        public async Task<ApiResponse<UserCreationResponse>> CreateUser([FromBody] UserCreationRequest request)
        {
            var users = await userService.CreateUser(request);  // Gọi service để tạo người dùng mới

            return new ApiResponse<UserCreationResponse>(   // Trả về phản hồi và thông báo thành công
                code: 201,
                message: "Tạo người dùng thành công",
                result: users
            );
        }

        // API update người dùng
        [HttpPut]
        [AllowAnonymous]
        public async Task<ApiResponse<UserUpdateResponse>> UpdateUser([FromBody] UserUpdateRequest request)
        {
            var users = await userService.UpdateUser(request);  //gọi service để sửa thông tin user
                
            return new ApiResponse<UserUpdateResponse>( //trả về phản hồi và thông báo thành công
                code: 200,  
                message: "Cập nhật thông tin người dùng thành công",
                result: users
            );
        }

        //Xóa người dùng theo email
        [HttpDelete]
        public async Task<IActionResult> DeleteUserByEmail(string email)
        {
            var result = await userService.DeleteUserByEmailAsync(email);   //gọi service để xóa thông tin user
            if (!result)
            {
                return NotFound(new { message = "Không tìm thấy người dùng" });
            }

            return Ok(new { message = "Xóa người dùng thành công" });   //trả về phản hồi và thông báo thành công
        }

        // API lấy danh sách nhân viên cùng phòng ban với người dùng hiện tại - User
        [HttpGet("user-department")]
        public async Task<ApiResponse<List<UserResponse>>> GetEmployeesSameDepartment()
        {
            // Lấy userId từ token trong HttpContext
            var userIdClaim = httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(c => c.Type == "userId");
            if (userIdClaim == null)
            {
                throw new Exception("Không tìm thấy người dùng");
            }

            var userId = int.Parse(userIdClaim.Value);
            Console.WriteLine(userId);  // Ghi log ID của người dùng

            // Truy vấn user từ database để lấy thông tin phòng ban
            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                throw new Exception("Không tìm thấy người dùng");
            }

            var departmentId = user.DepartmentId;

            var usersList = await userService.GetEmployeesBySameDepartment(departmentId.Value);

            // Map Employee list to UserResponse list
            var userResponses = usersList.Select(u => new UserResponse
            {
                Email = u.Email,
                Name = u.UserName,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Phone = u.Phone,
                RoleId = u.RoleId,
                UserType = u.Role?.Name ?? "Unknown",
                DepartmentName = u.Department?.Name ?? "Không có phòng ban",
                SubDepartment = u.Department?.Parent?.Name ?? "Không có phòng ban con"
            }).ToList();

            return new ApiResponse<List<UserResponse>>(
                code: 200,
                message: "Lấy danh sách nhân viên cùng phòng ban thành công",
                result: userResponses
            );
        }

        // API lấy thông tin profile của người dùng hiện tại
        [HttpGet("profile")]
        [Authorize]
        public async Task<ApiResponse<UserResponse>> GetUserProfile()
        {
            // Lấy userId từ token trong HttpContext
            var userIdClaim = httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(c => c.Type == "userId");
            if (userIdClaim == null)
            {
                throw new Exception("Không tìm thấy người dùng");
            }

            var userId = int.Parse(userIdClaim.Value);

            // Truy vấn user từ database kèm thông tin department
            var user = await dbContext.Users
                .Include(u => u.Department)
                .FirstOrDefaultAsync(u => u.Id == userId);
                
            if (user == null)
            {
                throw new Exception("Không tìm thấy người dùng");
            }

            // Map user data to UserResponse
            var userResponse = new UserResponse
            {
                Email = user.Email,
                Name = user.UserName,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Phone = user.Phone,
                DepartmentName = user.Department?.Name ?? "Không có phòng ban"
            };

            return new ApiResponse<UserResponse>(
                code: 200,
                message: "Lấy thông tin profile thành công",
                result: userResponse
            );
        }
    }
}
