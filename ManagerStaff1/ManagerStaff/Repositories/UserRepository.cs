using ManagerStaff.DbConnection;
using ManagerStaff.Model;
using Microsoft.EntityFrameworkCore;

namespace ManagerStaff.Repositories
{
    public class UserRepository
    {
        private readonly ApplicationDbContext _context;     //Kết nối DB

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Employee?> FindUserByEmail(string email)   //Tìm kiếm User theo email
        {
            return await _context.Users
                                 .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<List<Employee>> GetAllUsers(int page, int size)   // Lấy danh sách user theo phân trang
        {
            return await _context.Users
                .Include(u => u.Role) // Join bảng Role để lấy thông tin vai trò của user
                .Skip((page - 1) * size) // Bỏ qua các user của các trang trước đó
                .Take(size) // Giới hạn số lượng user trên trang hiện tại
                .ToListAsync();
        }

        public async Task<int> GetTotalUsersCount() //Lấy tổng số lượng user trong hệ thống
        {
            return await _context.Users.CountAsync();
        }


        public async Task CreateUserAsync(Employee user)    //Thêm user mới vào DB
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateUserAsync(Employee user)    //Cập nhật User trong DB
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task<Employee?> FindUserById(int id)   //Tìm user theo Id
        {
            return await _context.Users
                                 .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<List<Employee>> GetEmployeesByDepartmentIdAsync(int departmentId) //Lấy ds nhân viên theo phòng ban
        {
            return await _context.Users
                .Where(e => e.DepartmentId == departmentId)
                .Include(e => e.Department)
                    .ThenInclude(d => d.Parent)
                .Include(e => e.Role)
                .ToListAsync();
        }
        // Lấy danh sách user theo phân trang và tìm kiếm
        public async Task<List<Employee>> GetAllUsers(int page, int size, string? searchQuery = null, int? departmentId = null, int? roleId = null)
        {
            IQueryable<Employee> query = _context.Users
                .Include(u => u.Role)
                .Include(u => u.Department);

            if (!string.IsNullOrEmpty(searchQuery))
            {
                // Chuyển searchQuery về chữ thường
                var normalizedSearchQuery = searchQuery.ToLower();

                // Lọc dữ liệu dựa trên các trường và không phân biệt chữ hoa chữ thường
                query = query.Where(u => u.Email.ToLower().Contains(normalizedSearchQuery) ||
                                         u.FirstName.ToLower().Contains(normalizedSearchQuery) ||
                                         u.Role.Name.ToLower().Contains(normalizedSearchQuery) ||
                                         (u.Department != null && u.Department.Name.ToLower().Contains(normalizedSearchQuery)) ||
                                         u.LastName.ToLower().Contains(normalizedSearchQuery) ||
                                         u.UserName.ToLower().Contains(normalizedSearchQuery));
            }

            // Thêm bộ lọc theo department và sub-departments
            if (departmentId.HasValue)
            {
                // Lấy tất cả các ID của department và sub-departments
                var departmentIds = await GetDepartmentAndSubDepartmentIds(departmentId.Value);
                query = query.Where(u => departmentIds.Contains(u.DepartmentId.Value));
            }

            // Thêm bộ lọc theo role
            if (roleId.HasValue)
            {
                query = query.Where(u => u.RoleId == roleId.Value);
            }

            return await query
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();
        }

        // Lấy số lượng user thỏa mãn điều kiện tìm kiếm
        public async Task<long> GetTotalUsersCount(string? searchQuery = null, int? departmentId = null, int? roleId = null)
        {
            IQueryable<Employee> query = _context.Users;

            if (!string.IsNullOrEmpty(searchQuery))
            {
                var normalizedSearchQuery = searchQuery.ToLower();

                // Lọc user theo các trường
                query = query.Where(u => u.Email.ToLower().Contains(normalizedSearchQuery) ||
                                         u.FirstName.ToLower().Contains(normalizedSearchQuery) ||
                                         u.Role.Name.ToLower().Contains(normalizedSearchQuery) ||
                                         u.Department.Name.ToLower().Contains(normalizedSearchQuery) ||
                                         u.LastName.ToLower().Contains(normalizedSearchQuery) ||
                                         u.UserName.ToLower().Contains(normalizedSearchQuery));
            }

            // Thêm bộ lọc theo department và sub-departments
            if (departmentId.HasValue)
            {
                // Lấy tất cả các ID của department và sub-departments
                var departmentIds = await GetDepartmentAndSubDepartmentIds(departmentId.Value);
                query = query.Where(u => departmentIds.Contains(u.DepartmentId.Value));
            }

            // Thêm bộ lọc theo role
            if (roleId.HasValue)
            {
                query = query.Where(u => u.RoleId == roleId.Value);
            }

            return await query.CountAsync();    // Đếm số lượng user phù hợp
        }

        // Lấy tất cả các ID của department và sub-departments
        private async Task<List<int>> GetDepartmentAndSubDepartmentIds(int departmentId)
        {
            var departmentIds = new List<int> { departmentId };
            var subDepartments = await _context.Departments
                .Where(d => d.ParentId == departmentId)
                .ToListAsync();

            foreach (var subDepartment in subDepartments)
            {
                departmentIds.AddRange(await GetDepartmentAndSubDepartmentIds(subDepartment.Id));
            }

            return departmentIds;
        }

        //Xóa User theo email
        public async Task<bool> DeleteUserByEmailAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return false;
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
