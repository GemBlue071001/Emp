using ManagerStaff.Common;
using ManagerStaff.Dto.Request;
using ManagerStaff.Dto.Response;
using ManagerStaff.Model;
using ManagerStaff.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace ManagerStaff.Services.Impl
{
    public class UserService : IUserService
    {
        private readonly UserRepository userRepository;
        private readonly RoleRepository roleRepository;
        private readonly IPasswordHasher<Employee> passwordHasher;

        public UserService(UserRepository userRepository, RoleRepository roleRepository, IPasswordHasher<Employee> passwordHasher)
        {
            this.userRepository = userRepository;
            this.roleRepository = roleRepository;
            this.passwordHasher = passwordHasher; 
        }

        //Tạo mới 1 người dùng dựa trên thông tin từ UserCreationRequest
        public async Task<UserCreationResponse> CreateUser(UserCreationRequest request)
        {
            var userOptinal = await userRepository.FindUserByEmail(request.Email);  //Tìm kiếm xem email đã có trong hệ thống hay chưa
            if (userOptinal != null)
            {
                throw new Exception("Người dùng đã tồn tại"); //tồn tại thì lỗi
            }

            // Tạo đối tượng Employee mới và thiết lập thông tin người dùng
            Employee user = new Employee();
            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.Email = request.Email;
            user.Phone = request.Phone;
            user.DepartmentId = request.DepartmentId;
            user.UserName = request.UserName;
            user.Password = passwordHasher.HashPassword(user, request.Password.Trim()); //Mã hóa mật khẩu trước khi lưu

            //Gán vai trò User
            var role = await roleRepository.FindByRoleName(DefinitionRole.USER);   //Kiểm tra xem vai trò ADMIN đã có trong hệ thống chưa-???
            if (role == null)
            {
                role = new Role();
                role.Name = DefinitionRole.USER;
                await roleRepository.CreateRole(role);
            }
            user.Role = role;
            await userRepository.CreateUserAsync(user); //lưu vào DB

            //Trả về thông tin user vừa tạo
            return new UserCreationResponse
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Phone = user.Phone,
                userType = user.Role.Name,
                UserName = user.UserName
            };
        }

        //Cập nhật thông tin người dùng
        public async Task<UserUpdateResponse> UpdateUser(UserUpdateRequest request)
        {
            var user = await userRepository.FindUserByEmail(request.Email);     //Kiểm tra Email đã có trong hệ thống chưa
            if (user == null)
            {
                throw new Exception("Không tìm thấy người dùng");
            }
            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.Email = request.Email;
            user.Phone = request.Phone;
            user.UserName = request.UserName;
            user.Password = passwordHasher.HashPassword(user, request.Password.Trim());
            if (!string.IsNullOrWhiteSpace(request.Password))
            {
                user.Password = passwordHasher.HashPassword(user, request.Password.Trim()); //Chỉ băm lại mật khẩu nếu mật khẩu mới được cung cấp
            }

            await userRepository.UpdateUserAsync(user); //Lưu vào DB

            return new UserUpdateResponse   //Trả về thông tin vừa update
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Phone = user.Phone,
                UserName = user.UserName
            };
        }

        //Xóa nhân viên theo email
        public async Task<bool> DeleteUserByEmailAsync(string email)
        {
            return await userRepository.DeleteUserByEmailAsync(email);
        }

        // Lấy danh sách người dùng theo phân trang, có thể tìm kiếm theo từ khóa
        public async Task<PageResponse<UserResponse>> FindAll(int page, int size, string? searchQuery = null, int? departmentId = null, int? roleId = null)
        {
            var users = await userRepository.GetAllUsers(page, size, searchQuery, departmentId, roleId);      // Lấy danh sách người dùng theo trang và từ khóa tìm kiếm
            var totalItems = await userRepository.GetTotalUsersCount(searchQuery, departmentId, roleId);      // Lấy tổng số lượng người dùng phù hợp với từ khóa tìm kiếm

            var result = users.Select(user => new UserResponse      // Chuyển danh sách Employee sang danh sách UserResponse
            {
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Name = user.UserName,
                Phone = user.Phone,
                UserType = user.Role?.Name ?? "Unknown",
                DepartmentName = user.Department?.Name ?? "Không có phòng ban",
                SubDepartment = user.Department?.Parent?.Name ?? "Không có phòng ban con"
            }).ToList();

            var totalPages = (int)Math.Ceiling((double)totalItems / size);      //Tính tổng số trang

            return new PageResponse<UserResponse>       //Trả về kết quả phân trang
            {
                CurrentPage = page,
                PageSize = size,
                TotalPages = totalPages,
                TotalElemets = totalItems,
                Data = result
            };
        }


        // Lấy danh sách nhân viên thuộc cùng một phòng ban theo DepartmentId
        public async Task<List<Employee>> GetEmployeesBySameDepartment(int departmentId)
        {
            return await userRepository.GetEmployeesByDepartmentIdAsync(departmentId);
        }
    }
}
