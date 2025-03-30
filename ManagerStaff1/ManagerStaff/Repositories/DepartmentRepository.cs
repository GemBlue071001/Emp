using ManagerStaff.DbConnection;
using ManagerStaff.Dto.Response;
using ManagerStaff.Model;
using Microsoft.EntityFrameworkCore;

namespace ManagerStaff.Repositories
{
    public class DepartmentRepository
    {
        private readonly ApplicationDbContext _context;

        public DepartmentRepository(ApplicationDbContext context)
        {
            this._context = context;
        }

        // Lấy danh sách tất cả phòng ban cùng với các phòng ban con
        public async Task<List<DepartmentResponse>> GetAllDepartmentsWithSubDepartmentsAsync()
        {
            var departments = await _context.Departments
                .OrderBy(d => d.Id)
                .ToListAsync();

            return departments.Select(d => new DepartmentResponse
            {
                Id = d.Id,
                Name = d.Name,
                ParentId = d.ParentId ?? 0
            }).ToList();
        }

        //Tạo mới 1 phòng ban
        public async Task CreateDepartmentAsync(Department department)
        {
            await _context.Departments.AddAsync(department);
            await _context.SaveChangesAsync();
        }

        // Cập nhật thông tin phòng ban
        public async Task<Department?> UpdateDepartmentAsync(Department department)
        {
            var existingDepartment = await _context.Departments.FindAsync(department.Id);
            if (existingDepartment == null)
            {
                return null;
            }

            existingDepartment.Name = department.Name;
            existingDepartment.ParentId = department.ParentId;

            await _context.SaveChangesAsync();
            return existingDepartment;
        }

        // Xóa phòng ban
        public async Task<bool> DeleteDepartmentAsync(int id)
        {
            var department = await _context.Departments
                .Include(d => d.Users)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (department == null)
            {
                return false;
            }

            // Check if department has users
            if (department.Users != null && department.Users.Any())
            {
                return false;
            }

            _context.Departments.Remove(department);
            await _context.SaveChangesAsync();
            return true;
        }

        //Chuyển đổi một đối tượng Department thành DepartmentResponse, bao gồm cả phòng ban con
        private DepartmentResponse MapToDepartmentResponse(Department department)
        {
            return new DepartmentResponse
            {
                Id = department.Id, // Gán ID của phòng ban
                Name = department.Name, // Gán tên phòng ban
                //SubDepartments = department.SubDepartments != null && department.SubDepartments.Any()
                //    ? department.SubDepartments.Select(sub => MapToDepartmentResponse(sub)).ToList() // Nếu có phòng ban con, tiếp tục chuyển đổi đệ quy
                //    : new List<DepartmentResponse>() // Nếu không có phòng ban con, trả về danh sách rỗng
            };
        }
    }
}
