using ManagerStaff.DbConnection;
using ManagerStaff.Model;
using Microsoft.EntityFrameworkCore;

namespace ManagerStaff.Repositories
{
    public class RoleRepository
    {
        private readonly ApplicationDbContext _context;

        public RoleRepository(ApplicationDbContext context)
        {
            this._context = context;
        }

        //Tạo một vai trò mới (Role) nếu nó chưa tồn tại trong cơ sở dữ liệu
        public async Task<Role> CreateRole(Role role)
        {
            var existingRole = await _context.Roles
                .FirstOrDefaultAsync(x => x.Name == role.Name); // Kiểm tra xem Role có tồn tại trong CSDL không

            if (existingRole != null)
            {
                throw new Exception("Role already exists");
            }

            _context.Roles.Add(role);   // Thêm role mới vào DbSet Roles
            await _context.SaveChangesAsync(); // Lưu thay đổi vào CSDL

            return role;
        }

        //Tìm kiếm một Role theo tên Role
        public async Task<Role?> FindByRoleName(string RoleName)
        {
            return await _context.Roles
                .FirstOrDefaultAsync(x => x.Name == RoleName);  // Tìm Role theo tên và trả về kết quả đầu tiên hoặc null

        }
    }
}
