using ManagerStaff.Dto.Request;
using ManagerStaff.Dto.Response;
using ManagerStaff.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ManagerStaff.Controllers
{
    [Route("api/departments")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {

        private readonly IDepartmentService departmentService;

        public DepartmentController(IDepartmentService departmentService)
        {
            this.departmentService = departmentService;
        }

        // API lấy danh sách tất cả các phòng ban cùng với các phòng ban con
        [HttpGet]
        public async Task<ApiResponse<List<DepartmentResponse>>> GetAllDepartmentsWithSubDepartments()
        {
            var departments = await departmentService.GetAllDepartmentsWithSubDepartmentsAsync();   // Gọi service để lấy danh sách phòng ban và phòng ban con
            return new ApiResponse<List<DepartmentResponse>>    // Trả về phản hồi với mã 200 (OK) và danh sách phòng ban
            {
                code = 200,
                message = "Get all departments successfully",
                result = departments
            };
        }

        //API tạo 1 phòng ban mới
        [HttpPost]
        [AllowAnonymous]
        public async Task<ApiResponse<DepartmentCreateResponse>> CreateDepartment([FromBody] DepartmentCreateRequest request)
        {
            var departments = await departmentService.CreateDepartment(request);

            return new ApiResponse<DepartmentCreateResponse>(
              code: 201,
              message: "Tạo phòng ban mới thành công",
              result: departments
            );
        }

        // API cập nhật thông tin phòng ban
        [HttpPut]
        //[Authorize(Roles = "ADMIN")]
        public async Task<ApiResponse<DepartmentResponse>> UpdateDepartment([FromBody] DepartmentUpdateRequest request)
        {
            var department = await departmentService.UpdateDepartment(request);
            return new ApiResponse<DepartmentResponse>(
                code: 200,
                message: "Cập nhật thông tin phòng ban thành công",
                result: department
            );
        }

        // API xóa phòng ban
        [HttpDelete("{id}")]
        //[Authorize(Roles = "ADMIN")]
        public async Task<ApiResponse<bool>> DeleteDepartment(int id)
        {
            var result = await departmentService.DeleteDepartment(id);
            return new ApiResponse<bool>(
                code: 200,
                message: "Xóa phòng ban thành công",
                result: result
            );
        }
    }
}
