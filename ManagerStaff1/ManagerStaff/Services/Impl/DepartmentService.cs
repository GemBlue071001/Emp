using ManagerStaff.Dto.Request;
using ManagerStaff.Dto.Response;
using ManagerStaff.Model;
using ManagerStaff.Repositories;

namespace ManagerStaff.Services.Impl
{
    public class DepartmentService : IDepartmentService
    {
        private readonly DepartmentRepository departmentRepository;        // Khai báo repository để tương tác với database

        public DepartmentService(DepartmentRepository departmentRepository)
        {
            this.departmentRepository = departmentRepository;
        }

        // Lấy danh sách tất cả các phòng ban cùng với các phòng ban con
        public async Task<List<DepartmentResponse>> GetAllDepartmentsWithSubDepartmentsAsync()
        {
            return await departmentRepository.GetAllDepartmentsWithSubDepartmentsAsync(); // Gọi repository để lấy dsach phòng ban cùng với phòng ban con từ DB
        }

        //Tạo 1 phòng ban mới dựa trên thông tin từ DepartmentCreateRequest
        public async Task<DepartmentCreateResponse> CreateDepartment(DepartmentCreateRequest request)
        {
            //tạo đối tượng Department mới và thiết lập thông tin
            Department department = new Department();
            department.Name = request.Name;
            department.ParentId = request.ParentId;

            await departmentRepository.CreateDepartmentAsync(department);

            //trả về phòng ban vừa tạo
            return new DepartmentCreateResponse
            {
                Name = department.Name,
                ParentId = request.ParentId,
            };

        }

    }
}
 