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
