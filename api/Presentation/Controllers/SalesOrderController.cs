using Microsoft.AspNetCore.Mvc;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.SalesOrder;

namespace Xcianify.Presentation.Controllers
{
    [Route("api/sales-order")]
    public class SalesOrderController : BaseApiController
    {
        private readonly ISalesOrderService _salesOrderService;
        private readonly ISalesOrderCommentService _commentService;
        private readonly ISalesOrderChatService _chatService;
        private readonly ISalesOrderDocumentService _documentService;

        public SalesOrderController(
            ISalesOrderService salesOrderService,
            ISalesOrderCommentService commentService,
            ISalesOrderChatService chatService,
            ISalesOrderDocumentService documentService)
        {
            _salesOrderService = salesOrderService ?? throw new ArgumentNullException(nameof(salesOrderService));
            _commentService = commentService ?? throw new ArgumentNullException(nameof(commentService));
            _chatService = chatService ?? throw new ArgumentNullException(nameof(chatService));
            _documentService = documentService ?? throw new ArgumentNullException(nameof(documentService));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] SalesOrderFilterDto filterDto)
        {
            try
            {
                var (items, totalCount) = await _salesOrderService.GetAllSalesOrdersAsync(filterDto);
                return Ok(new { Items = items, TotalCount = totalCount });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var salesOrder = await _salesOrderService.GetSalesOrderByIdAsync(id);
                return Ok(salesOrder);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("number/{soNumber}")]
        public async Task<IActionResult> GetBySoNumber(string soNumber)
        {
            try
            {
                var salesOrder = await _salesOrderService.GetSalesOrderBySoNumberAsync(soNumber);
                return Ok(salesOrder);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSalesOrderDto createSalesOrderDto)
        {
            try
            {
                var createdSalesOrder = await _salesOrderService.CreateSalesOrderAsync(createSalesOrderDto);
                return CreatedAtAction(nameof(GetById), new { id = createdSalesOrder.Id }, createdSalesOrder);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateSalesOrderDto updateSalesOrderDto)
        {
            try
            {
                await _salesOrderService.UpdateSalesOrderAsync(updateSalesOrderDto);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _salesOrderService.DeleteSalesOrderAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetByCustomer(int customerId)
        {
            try
            {
                var salesOrders = await _salesOrderService.GetSalesOrdersByCustomerAsync(customerId);
                return Ok(salesOrders);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("organization/{organizationId}")]
        public async Task<IActionResult> GetByOrganization(int organizationId)
        {
            try
            {
                var salesOrders = await _salesOrderService.GetSalesOrdersByOrganizationAsync(organizationId);
                return Ok(salesOrders);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("status/{status}")]
        public async Task<IActionResult> GetByStatus(string status)
        {
            try
            {
                var salesOrders = await _salesOrderService.GetSalesOrdersByStatusAsync(status);
                return Ok(salesOrders);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("generate-number")]
        public async Task<IActionResult> GenerateSoNumber()
        {
            try
            {
                var soNumber = await _salesOrderService.GenerateSoNumberAsync();
                return Ok(new { SoNumber = soNumber });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("{id}/submit")]
        public async Task<IActionResult> Submit(int id)
        {
            try
            {
                var result = await _salesOrderService.SubmitSalesOrderAsync(id);
                return Ok(new { Success = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("{id}/approve")]
        public async Task<IActionResult> Approve(int id)
        {
            try
            {
                var result = await _salesOrderService.ApproveSalesOrderAsync(id);
                return Ok(new { Success = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("{id}/reject")]
        public async Task<IActionResult> Reject(int id)
        {
            try
            {
                var result = await _salesOrderService.RejectSalesOrderAsync(id);
                return Ok(new { Success = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // --- Sales Order Comments Endpoints ---

        [HttpGet("{id}/comments")]
        public async Task<IActionResult> GetComments(int id)
        {
            try
            {
                var comments = await _commentService.GetCommentsBySalesOrderAsync(id);
                return Ok(comments);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("{id}/comments")]
        public async Task<IActionResult> CreateComment(int id, [FromBody] CreateSalesOrderCommentDto createCommentDto)
        {
            try
            {
                createCommentDto.SalesOrderId = id;
                var createdComment = await _commentService.CreateCommentAsync(createCommentDto);
                return CreatedAtAction(nameof(GetComments), new { id }, createdComment);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPut("{id}/comments/{commentId}")]
        public async Task<IActionResult> UpdateComment(int id, int commentId, [FromBody] CreateSalesOrderCommentDto updateCommentDto)
        {
            try
            {
                updateCommentDto.SalesOrderId = id;
                await _commentService.UpdateCommentAsync(commentId, updateCommentDto);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpDelete("{id}/comments/{commentId}")]
        public async Task<IActionResult> DeleteComment(int id, int commentId)
        {
            try
            {
                await _commentService.DeleteCommentAsync(commentId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // --- Sales Order Chat Endpoints ---

        [HttpGet("{id}/chat")]
        public async Task<IActionResult> GetChatMessages(int id)
        {
            try
            {
                var chatMessages = await _chatService.GetChatMessagesBySalesOrderAsync(id);
                return Ok(chatMessages);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("{id}/chat")]
        public async Task<IActionResult> CreateChatMessage(int id, [FromBody] CreateSalesOrderChatDto createChatDto)
        {
            try
            {
                createChatDto.SalesOrderId = id;
                var createdChatMessage = await _chatService.CreateChatMessageAsync(createChatDto);
                return CreatedAtAction(nameof(GetChatMessages), new { id }, createdChatMessage);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPut("{id}/chat/{chatId}")]
        public async Task<IActionResult> UpdateChatMessage(int id, int chatId, [FromBody] CreateSalesOrderChatDto updateChatDto)
        {
            try
            {
                updateChatDto.SalesOrderId = id;
                await _chatService.UpdateChatMessageAsync(chatId, updateChatDto);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpDelete("{id}/chat/{chatId}")]
        public async Task<IActionResult> DeleteChatMessage(int id, int chatId)
        {
            try
            {
                await _chatService.DeleteChatMessageAsync(chatId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // --- Sales Order Documents Endpoints ---

        [HttpGet("{id}/documents")]
        public async Task<IActionResult> GetDocuments(int id)
        {
            try
            {
                var documents = await _documentService.GetDocumentsBySalesOrderAsync(id);
                return Ok(documents);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("{id}/documents")]
        public async Task<IActionResult> CreateDocument(int id, [FromBody] CreateSalesOrderDocumentDto createDocumentDto)
        {
            try
            {
                createDocumentDto.SalesOrderId = id;
                var createdDocument = await _documentService.CreateDocumentAsync(createDocumentDto);
                return CreatedAtAction(nameof(GetDocuments), new { id }, createdDocument);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPut("{id}/documents/{documentId}")]
        public async Task<IActionResult> UpdateDocument(int id, int documentId, [FromBody] CreateSalesOrderDocumentDto updateDocumentDto)
        {
            try
            {
                updateDocumentDto.SalesOrderId = id;
                await _documentService.UpdateDocumentAsync(documentId, updateDocumentDto);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpDelete("{id}/documents/{documentId}")]
        public async Task<IActionResult> DeleteDocument(int id, int documentId)
        {
            try
            {
                await _documentService.DeleteDocumentAsync(documentId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
} 