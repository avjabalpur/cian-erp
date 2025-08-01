using Microsoft.AspNetCore.Mvc;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.DTOs.SalesOrder;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace Xcianify.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : BaseApiController
    {
        private readonly IItemMasterService _itemService;
        private readonly ISalesOrderService _salesOrderService;

        public DashboardController(
            IItemMasterService itemService,
            ISalesOrderService salesOrderService)
        {
            _itemService = itemService;
            _salesOrderService = salesOrderService;
        }

        [HttpGet("stats")]
        public async Task<ActionResult<DashboardStatsDto>> GetDashboardStats()
        {
            try
            {
                // Get items data
                var itemsResult = await _itemService.GetAllItemsAsync(new ItemMasterFilterDto());
                var recentItems = itemsResult.Items
                    .OrderByDescending(x => x.CreatedAt)
                    .Take(5)
                    .Select(x => new RecentItemDto
                    {
                        Id = x.Id,
                        ItemCode = x.ItemCode,
                        ItemName = x.ItemName,
                    })
                    .ToList();

                // Get sales orders data
                var salesOrdersResult = await _salesOrderService.GetAllAsync(new SalesOrderFilterDto());
                var recentSalesOrders = salesOrdersResult.Items
                    .OrderByDescending(x => x.CreatedAt)
                    .Take(5)
                    .Select(x => new RecentSalesOrderDto
                    {
                        Id = x.Id,
                        SoNumber = x.SoNumber,
                        CustomerName = x.CustomerName ?? "Unknown",
                        SoStatus = x.SoStatus ?? "Pending",
                    })
                    .ToList();

                var stats = new DashboardStatsDto
                {
                    TotalCustomers = 0, // TODO: Implement customer service
                    TotalItems = itemsResult.TotalCount,
                    TotalSalesOrders = salesOrdersResult.TotalCount,
                    RecentCustomers = new List<RecentCustomerDto>(), // TODO: Implement customer service
                    RecentItems = recentItems,
                    RecentSalesOrders = recentSalesOrders
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving dashboard statistics", error = ex.Message });
            }
        }
    }
} 