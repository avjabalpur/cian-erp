using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Xcianify.Core.DTOs.Customer;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.Exceptions;
using Xcianify.Core.DTOs.CustomerAddress;
using Xcianify.Core.DTOs.CustomerBankingDetails;
using Xcianify.Core.DTOs.CustomerBusinessTerms;
using Xcianify.Core.DTOs.CustomerTaxCompliance;

namespace Xcianify.Presentation.Controllers
{
    [Route("api/customers")]
    public class CustomerController : BaseApiController
    {
        private readonly ICustomerService _customerService;
        private readonly ICustomerAddressService _customerAddressService;
        private readonly ICustomerBankingDetailsService _customerBankingDetailsService;
        private readonly ICustomerBusinessTermsService _customerBusinessTermsService;
        private readonly ICustomerTaxComplianceService _customerTaxComplianceService;
        private readonly ILogger<CustomerController> _logger;

        public CustomerController(
            ICustomerService customerService,
            ICustomerAddressService customerAddressService,
            ICustomerBankingDetailsService customerBankingDetailsService,
            ICustomerBusinessTermsService customerBusinessTermsService,
            ICustomerTaxComplianceService customerTaxComplianceService,
            ILogger<CustomerController> logger)
        {
            _customerService = customerService;
            _customerAddressService = customerAddressService;
            _customerBankingDetailsService = customerBankingDetailsService;
            _customerBusinessTermsService = customerBusinessTermsService;
            _customerTaxComplianceService = customerTaxComplianceService;
            _logger = logger;
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

        // --- Customer Address Endpoints ---

        [HttpGet("{customerId}/addresses")]
        public async Task<IActionResult> GetAddressesByCustomerId(int customerId)
        {
            var addresses = await _customerAddressService.GetByCustomerIdAsync(customerId);
            return Ok(addresses);
        }

        [HttpGet("{customerId}/addresses/{id}")]
        public async Task<IActionResult> GetAddressById(int customerId, int id)
        {
            var address = await _customerAddressService.GetByIdAsync(id);
            if (address == null || address.CustomerId != customerId)
                return NotFound();
            return Ok(address);
        }

        [HttpPost("{customerId}/addresses")]
        public async Task<IActionResult> CreateAddress(int customerId, [FromBody] CreateCustomerAddressDto createDto)
        {
         
            createDto.CustomerId = customerId;
            var result = await _customerAddressService.CreateAsync(createDto, CurrentUserId);
            return CreatedAtAction(nameof(GetAddressById), new { customerId, id = result.Id }, result);
        }

        [HttpPut("{customerId}/addresses/{id}")]
        public async Task<IActionResult> UpdateAddress(int customerId, int id, [FromBody] UpdateCustomerAddressDto updateDto)
        {

            var address = await _customerAddressService.GetByIdAsync(id);
            if (address == null || address.CustomerId != customerId)
                return NotFound();

            var result = await _customerAddressService.UpdateAsync(id, updateDto, CurrentUserId);
            return Ok(result);
        }

        [HttpDelete("{customerId}/addresses/{id}")]
        public async Task<IActionResult> DeleteAddress(int customerId, int id)
        {
            var address = await _customerAddressService.GetByIdAsync(id);
            if (address == null || address.CustomerId != customerId)
                return NotFound();

            var success = await _customerAddressService.DeleteAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }

        // --- Customer Banking Details Endpoints ---

        [HttpGet("{customerId}/banking-details")]
        public async Task<IActionResult> GetBankingDetailsByCustomerId(int customerId)
        {
            var bankingDetails = await _customerBankingDetailsService.GetByCustomerIdAsync(customerId);
            return Ok(bankingDetails);
        }

        [HttpGet("{customerId}/banking-details/{id}")]
        public async Task<IActionResult> GetBankingDetailsById(int customerId, int id)
        {
            var bankingDetails = await _customerBankingDetailsService.GetByIdAsync(id);
            if (bankingDetails == null || bankingDetails.CustomerId != customerId)
                return NotFound();
            return Ok(bankingDetails);
        }

        [HttpPost("{customerId}/banking-details")]
        public async Task<IActionResult> CreateBankingDetails(int customerId, [FromBody] CreateCustomerBankingDetailsDto createDto)
        {
            createDto.CustomerId = customerId;
            var result = await _customerBankingDetailsService.CreateAsync(createDto, CurrentUserId);
            return CreatedAtAction(nameof(GetBankingDetailsById), new { customerId, id = result.Id }, result);
        }

        [HttpPut("{customerId}/banking-details/{id}")]
        public async Task<IActionResult> UpdateBankingDetails(int customerId, int id, [FromBody] UpdateCustomerBankingDetailsDto updateDto)
        {

            var bankingDetails = await _customerBankingDetailsService.GetByIdAsync(id);
            if (bankingDetails == null || bankingDetails.CustomerId != customerId)
                return NotFound();

            var result = await _customerBankingDetailsService.UpdateAsync(id, updateDto, CurrentUserId);
            return Ok(result);
        }

        [HttpDelete("{customerId}/banking-details/{id}")]
        public async Task<IActionResult> DeleteBankingDetails(int customerId, int id)
        {
            var bankingDetails = await _customerBankingDetailsService.GetByIdAsync(id);
            if (bankingDetails == null || bankingDetails.CustomerId != customerId)
                return NotFound();

            var success = await _customerBankingDetailsService.DeleteAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }

        // --- Customer Business Terms Endpoints ---

        [HttpGet("{customerId}/business-terms")]
        public async Task<IActionResult> GetBusinessTermsByCustomerId(int customerId)
        {
            var businessTerms = await _customerBusinessTermsService.GetByCustomerIdAsync(customerId);
            return Ok(businessTerms);
        }

        [HttpGet("{customerId}/business-terms/{id}")]
        public async Task<IActionResult> GetBusinessTermsById(int customerId, int id)
        {
            var businessTerms = await _customerBusinessTermsService.GetByIdAsync(id);
            if (businessTerms == null || businessTerms.CustomerId != customerId)
                return NotFound();
            return Ok(businessTerms);
        }

        [HttpPost("{customerId}/business-terms")]
        public async Task<IActionResult> CreateBusinessTerms(int customerId, [FromBody] CreateCustomerBusinessTermsDto createDto)
        {
      

            createDto.CustomerId = customerId;
            var result = await _customerBusinessTermsService.CreateAsync(createDto, CurrentUserId);
            return CreatedAtAction(nameof(GetBusinessTermsById), new { customerId, id = result.Id }, result);
        }

        [HttpPut("{customerId}/business-terms/{id}")]
        public async Task<IActionResult> UpdateBusinessTerms(int customerId, int id, [FromBody] UpdateCustomerBusinessTermsDto updateDto)
        {
            var businessTerms = await _customerBusinessTermsService.GetByIdAsync(id);
            if (businessTerms == null || businessTerms.CustomerId != customerId)
                return NotFound();

            var result = await _customerBusinessTermsService.UpdateAsync(id, updateDto, CurrentUserId);
            return Ok(result);
        }

        [HttpDelete("{customerId}/business-terms/{id}")]
        public async Task<IActionResult> DeleteBusinessTerms(int customerId, int id)
        {
            var businessTerms = await _customerBusinessTermsService.GetByIdAsync(id);
            if (businessTerms == null || businessTerms.CustomerId != customerId)
                return NotFound();

            var success = await _customerBusinessTermsService.DeleteAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }

        // --- Customer Tax Compliance Endpoints ---

        [HttpGet("{customerId}/tax-compliance")]
        public async Task<IActionResult> GetTaxComplianceByCustomerId(int customerId)
        {
            var taxCompliance = await _customerTaxComplianceService.GetByCustomerIdAsync(customerId);
            return Ok(taxCompliance);
        }

        [HttpGet("{customerId}/tax-compliance/{id}")]
        public async Task<IActionResult> GetTaxComplianceById(int customerId, int id)
        {
            var taxCompliance = await _customerTaxComplianceService.GetByIdAsync(id);
            if (taxCompliance == null || taxCompliance.CustomerId != customerId)
                return NotFound();
            return Ok(taxCompliance);
        }

        [HttpPost("{customerId}/tax-compliance")]
        public async Task<IActionResult> CreateTaxCompliance(int customerId, [FromBody] CreateCustomerTaxComplianceDto createDto)
        {
            createDto.CustomerId = customerId;
            var result = await _customerTaxComplianceService.CreateAsync(createDto, CurrentUserId);
            return CreatedAtAction(nameof(GetTaxComplianceById), new { customerId, id = result.Id }, result);
        }

        [HttpPut("{customerId}/tax-compliance/{id}")]
        public async Task<IActionResult> UpdateTaxCompliance(int customerId, int id, [FromBody] UpdateCustomerTaxComplianceDto updateDto)
        {
            var taxCompliance = await _customerTaxComplianceService.GetByIdAsync(id);
            if (taxCompliance == null || taxCompliance.CustomerId != customerId)
                return NotFound();

            var result = await _customerTaxComplianceService.UpdateAsync(id, updateDto, CurrentUserId);
            return Ok(result);
        }

        [HttpDelete("{customerId}/tax-compliance/{id}")]
        public async Task<IActionResult> DeleteTaxCompliance(int customerId, int id)
        {
            var taxCompliance = await _customerTaxComplianceService.GetByIdAsync(id);
            if (taxCompliance == null || taxCompliance.CustomerId != customerId)
                return NotFound();

            var success = await _customerTaxComplianceService.DeleteAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
} 