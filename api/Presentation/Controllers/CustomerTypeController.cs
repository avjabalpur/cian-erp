using Microsoft.AspNetCore.Mvc;
using Xcianify.Core.DTOs.CustomerType;
using Xcianify.Core.Domain.Services;

namespace Xcianify.Presentation.Controllers
{
    [Route("api/customer-types")]
    public class CustomerTypeController : BaseApiController
    {
        private readonly ICustomerTypeService _customerTypeService;

        public CustomerTypeController(ICustomerTypeService customerTypeService)
        {
            _customerTypeService = customerTypeService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] CustomerTypeFilterDto filter)
        {
            var (customerTypes, totalCount) = await _customerTypeService.GetAllCustomerTypesAsync(filter);
            return Ok(new { items = customerTypes, totalCount });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var customerType = await _customerTypeService.GetCustomerTypeByIdAsync(id);
            if (customerType == null)
                return NotFound();

            return Ok(customerType);
        }

        [HttpGet("code/{code}")]
        public async Task<IActionResult> GetByCode(string code)
        {
            var customerType = await _customerTypeService.GetCustomerTypeByCodeAsync(code);
            if (customerType == null)
                return NotFound();

            return Ok(customerType);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCustomerTypeDto createDto)
        {
            var customerType = await _customerTypeService.CreateCustomerTypeAsync(createDto, CurrentUserId);
            return CreatedAtAction(nameof(GetById), new { id = customerType.Id }, customerType);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCustomerTypeDto updateDto)
        {
            try
            {
                var customerType = await _customerTypeService.UpdateCustomerTypeAsync(id, updateDto, CurrentUserId);
                return Ok(customerType);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _customerTypeService.DeleteCustomerTypeAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
} 