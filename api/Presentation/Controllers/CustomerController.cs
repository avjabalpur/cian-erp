using Microsoft.AspNetCore.Mvc;
using Xcianify.Core.DTOs.Customer;
using Xcianify.Core.Domain.Services;

namespace Xcianify.Presentation.Controllers
{
    [Route("api/customers")]
    public class CustomerController : BaseApiController
    {
        private readonly ICustomerService _customerService;

        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] CustomerFilterDto filter)
        {
            var (customers, totalCount) = await _customerService.GetAllCustomersAsync(filter);
            return Ok(new { items = customers, totalCount });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var customer = await _customerService.GetCustomerByIdAsync(id);
            if (customer == null)
                return NotFound();

            return Ok(customer);
        }

        [HttpGet("code/{customerCode}")]
        public async Task<IActionResult> GetByCode(string customerCode)
        {
            var customer = await _customerService.GetCustomerByCodeAsync(customerCode);
            if (customer == null)
                return NotFound();

            return Ok(customer);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCustomerDto createDto)
        {
            var customer = await _customerService.CreateCustomerAsync(createDto, CurrentUserId);
            return CreatedAtAction(nameof(GetById), new { id = customer.Id }, customer);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCustomerDto updateDto)
        {
            try
            {
                var customer = await _customerService.UpdateCustomerAsync(id, updateDto, CurrentUserId);
                return Ok(customer);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _customerService.DeleteCustomerAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
} 