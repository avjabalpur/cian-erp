using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.Division;

namespace Xcianify.Presentation.Controllers
{
    [Route("api/divisions")]
    public class DivisionController : BaseApiController
    {
        private readonly IDivisionService _divisionService;

        public DivisionController(IDivisionService divisionService)
        {
            _divisionService = divisionService ?? throw new ArgumentNullException(nameof(divisionService));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var division = await _divisionService.GetByIdAsync(id);
            return Ok(division);
        }

        [HttpGet("code/{code}")]
        public async Task<IActionResult> GetByCode(string code)
        {
            var division = await _divisionService.GetByCodeAsync(code);
            return Ok(division);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var divisions = await _divisionService.GetAllAsync();
            return Ok(divisions);
        }

        [HttpGet("department/{departmentId}")]
        public async Task<IActionResult> GetByDepartmentId(int departmentId)
        {
            var divisions = await _divisionService.GetByDepartmentIdAsync(departmentId);
            return Ok(divisions);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateDivisionDto createDto)
        {
            var division = await _divisionService.CreateAsync(createDto, CurrentUserId);
            return CreatedAtAction(nameof(GetById), new { id = division.Id }, division);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateDivisionDto updateDto)
        {
            var division = await _divisionService.UpdateAsync(id, updateDto, CurrentUserId);
            return Ok(division);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _divisionService.DeleteAsync(id);
            return NoContent();
        }
    }
}
