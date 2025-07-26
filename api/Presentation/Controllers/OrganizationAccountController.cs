using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Xcianify.Core.DTOs.Organization;
using Xcianify.Core.Domain.Services;

namespace Xcianify.Presentation.Controllers
{
    [Route("api/organizations/{organizationId}/accounts")]
    public class OrganizationAccountController : BaseApiController
    {
        private readonly IOrganizationAccountService _organizationAccountService;

        public OrganizationAccountController(IOrganizationAccountService organizationAccountService)
        {
            _organizationAccountService = organizationAccountService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrganizationAccountDto>>> GetAll(int organizationId)
        {
            var accounts = await _organizationAccountService.GetOrganizationAccountsAsync(organizationId);
            return Ok(accounts);
        }

        [HttpGet("{id}", Name = "GetOrganizationAccountById")]
        public async Task<ActionResult<OrganizationAccountDto>> GetById(int organizationId, int id)
        {
            var account = await _organizationAccountService.GetOrganizationAccountByIdAsync(id);
            
            if (account.OrganizationId != organizationId)
            {
                return NotFound();
            }
            
            return Ok(account);
        }

        [HttpPost]
        public async Task<ActionResult<OrganizationAccountDto>> Create(
            int organizationId, 
            [FromBody] CreateOrganizationAccountDto dto)
        {
            if (dto.OrganizationId != organizationId)
            {
                return BadRequest("Organization ID in the route does not match the request body.");
            }

            var createdAccount = await _organizationAccountService.CreateOrganizationAccountAsync(dto);
            return CreatedAtRoute(
                "GetOrganizationAccountById", 
                new { organizationId, id = createdAccount.Id }, 
                createdAccount);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int organizationId, 
            int id, 
            [FromBody] UpdateOrganizationAccountDto dto)
        {
            if (id != dto.Id || organizationId != dto.OrganizationId)
            {
                return BadRequest("IDs in the URL do not match the request body.");
            }

            await _organizationAccountService.UpdateOrganizationAccountAsync(dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int organizationId, int id)
        {
            var account = await _organizationAccountService.GetOrganizationAccountByIdAsync(id);
            if (account == null || account.OrganizationId != organizationId)
            {
                return NotFound();
            }

            await _organizationAccountService.DeleteOrganizationAccountAsync(id);
            return NoContent();
        }
    }
}
