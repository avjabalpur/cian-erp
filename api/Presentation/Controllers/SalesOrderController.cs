using Microsoft.AspNetCore.Mvc;
using Xcianify.Core.DTOs.SalesOrder;
using Xcianify.Core.Domain.Services;

namespace Xcianify.Presentation.Controllers
{
    [ApiController]
    [Route("api/sales-order")]
    public class SalesOrderController : BaseApiController
    {
        private readonly ISalesOrderService _salesOrderService;
        private readonly ISalesOrderCommentService _commentService;
        private readonly ISalesOrderChatService _chatService;
        private readonly ISalesOrderDocumentService _documentService;
        private readonly ISalesOrderStageService _stageService;

        public SalesOrderController(
            ISalesOrderService salesOrderService,
            ISalesOrderCommentService commentService,
            ISalesOrderChatService chatService,
            ISalesOrderDocumentService documentService,
            ISalesOrderStageService stageService)
        {
            _salesOrderService = salesOrderService ?? throw new ArgumentNullException(nameof(salesOrderService));
            _commentService = commentService ?? throw new ArgumentNullException(nameof(commentService));
            _chatService = chatService ?? throw new ArgumentNullException(nameof(chatService));
            _documentService = documentService ?? throw new ArgumentNullException(nameof(documentService));
            _stageService = stageService ?? throw new ArgumentNullException(nameof(stageService));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] SalesOrderFilterDto filterDto)
        {
            var (items, totalCount) = await _salesOrderService.GetAllAsync(filterDto);
            return Ok(new { Items = items, TotalCount = totalCount });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var salesOrder = await _salesOrderService.GetByIdAsync(id);
            return Ok(salesOrder);
        }

        [HttpGet("number/{soNumber}")]
        public async Task<IActionResult> GetBySoNumber(string soNumber)
        {
            var salesOrder = await _salesOrderService.GetBySoNumberAsync(soNumber);
            return Ok(salesOrder);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSalesOrderDto createSalesOrderDto)
        {
            var createdSalesOrder = await _salesOrderService.CreateAsync(createSalesOrderDto);
            return CreatedAtAction(nameof(GetById), new { id = createdSalesOrder.Id }, createdSalesOrder);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateSalesOrderDto updateSalesOrderDto)
        {
            await _salesOrderService.UpdateAsync(updateSalesOrderDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _salesOrderService.DeleteAsync(id);
            return NoContent();
        }


        [HttpGet("generate-number")]
        public async Task<IActionResult> GenerateSoNumber()
        {
            var nextNumber = await _salesOrderService.GenerateSoNumberAsync();
            return Ok(new { NextNumber = nextNumber });
        }

        [HttpPost("{id}/submit")]
        public async Task<IActionResult> Submit(int id)
        {
            await _salesOrderService.SubmitAsync(id);
            return NoContent();
        }

        [HttpPost("{id}/approve")]
        public async Task<IActionResult> Approve(int id)
        {
            await _salesOrderService.ApproveAsync(id);
            return NoContent();
        }

        [HttpPost("{id}/reject")]
        public async Task<IActionResult> Reject(int id)
        {
            await _salesOrderService.RejectAsync(id);
            return NoContent();
        }

        // --- Sales Order Comments Endpoints ---

        [HttpGet("{salesOrderId}/comments")]
        public async Task<IActionResult> GetComments(int salesOrderId)
        {
            var comments = await _commentService.GetCommentsBySalesOrderAsync(salesOrderId);
            return Ok(comments);
        }

        [HttpPost("{salesOrderId}/comments")]
        public async Task<IActionResult> CreateComment(int salesOrderId, [FromBody] CreateSalesOrderCommentDto createCommentDto)
        {
            createCommentDto.SalesOrderId = salesOrderId;
            var createdComment = await _commentService.CreateCommentAsync(createCommentDto);
            return CreatedAtAction(nameof(GetComments), new { salesOrderId }, createdComment);
        }

        [HttpPut("{salesOrderId}/comments/{commentId}")]
        public async Task<IActionResult> UpdateComment(int salesOrderId, int commentId, [FromBody] CreateSalesOrderCommentDto updateCommentDto)
        {
            updateCommentDto.SalesOrderId = salesOrderId;
            await _commentService.UpdateCommentAsync(commentId, updateCommentDto);
            return NoContent();
        }

        [HttpDelete("{salesOrderId}/comments/{commentId}")]
        public async Task<IActionResult> DeleteComment(int salesOrderId, int commentId)
        {
            await _commentService.DeleteCommentAsync(commentId);
            return NoContent();
        }

        // --- Sales Order Chat Endpoints ---

        [HttpGet("{salesOrderId}/chat")]
        public async Task<IActionResult> GetChatMessages(int salesOrderId)
        {
            var chatMessages = await _chatService.GetChatMessagesBySalesOrderAsync(salesOrderId);
            return Ok(chatMessages);
        }

        [HttpPost("{salesOrderId}/chat")]
        public async Task<IActionResult> CreateChatMessage(int salesOrderId, [FromBody] CreateSalesOrderChatDto createChatDto)
        {
            createChatDto.SalesOrderId = salesOrderId;
            var createdChatMessage = await _chatService.CreateChatMessageAsync(createChatDto);
            return CreatedAtAction(nameof(GetChatMessages), new { salesOrderId }, createdChatMessage);
        }

        [HttpPut("{salesOrderId}/chat/{chatId}")]
        public async Task<IActionResult> UpdateChatMessage(int salesOrderId, int chatId, [FromBody] CreateSalesOrderChatDto updateChatDto)
        {
            updateChatDto.SalesOrderId = salesOrderId;
            await _chatService.UpdateChatMessageAsync(chatId, updateChatDto);
            return NoContent();
        }

        [HttpDelete("{salesOrderId}/chat/{chatId}")]
        public async Task<IActionResult> DeleteChatMessage(int salesOrderId, int chatId)
        {
            await _chatService.DeleteChatMessageAsync(chatId);
            return NoContent();
        }

        // --- Sales Order Documents Endpoints ---

        [HttpGet("{salesOrderId}/documents")]
        public async Task<IActionResult> GetDocuments(int salesOrderId)
        {
            var documents = await _documentService.GetDocumentsBySalesOrderAsync(salesOrderId);
            return Ok(documents);
        }

        [HttpPost("{salesOrderId}/documents")]
        public async Task<IActionResult> CreateDocument(int salesOrderId, [FromBody] CreateSalesOrderDocumentDto createDocumentDto)
        {
            createDocumentDto.SalesOrderId = salesOrderId;
            var createdDocument = await _documentService.CreateDocumentAsync(createDocumentDto);
            return CreatedAtAction(nameof(GetDocuments), new { salesOrderId }, createdDocument);
        }

        [HttpPut("{salesOrderId}/documents/{documentId}")]
        public async Task<IActionResult> UpdateDocument(int salesOrderId, int documentId, [FromBody] CreateSalesOrderDocumentDto updateDocumentDto)
        {
            updateDocumentDto.SalesOrderId = salesOrderId;
            await _documentService.UpdateDocumentAsync(documentId, updateDocumentDto);
            return NoContent();
        }

        [HttpDelete("{salesOrderId}/documents/{documentId}")]
        public async Task<IActionResult> DeleteDocument(int salesOrderId, int documentId)
        {
            await _documentService.DeleteDocumentAsync(documentId);
            return NoContent();
        }

        // --- Sales Order Stages Endpoints ---

        [HttpGet("{salesOrderId}/stages")]
        public async Task<IActionResult> GetStages(int salesOrderId)
        {
            var stages = await _stageService.GetStagesBySalesOrderAsync(salesOrderId);
            return Ok(stages);
        }

        [HttpPost("{salesOrderId}/stages")]
        public async Task<IActionResult> CreateStage(int salesOrderId, [FromBody] CreateSalesOrderStageDto createStageDto)
        {
            createStageDto.SalesOrderId = salesOrderId;
            var createdStage = await _stageService.CreateStageAsync(createStageDto);
            return CreatedAtAction(nameof(GetStages), new { salesOrderId }, createdStage);
        }

        [HttpPut("{salesOrderId}/stages/{stageId}")]
        public async Task<IActionResult> UpdateStage(int salesOrderId, int stageId, [FromBody] CreateSalesOrderStageDto updateStageDto)
        {
            updateStageDto.SalesOrderId = salesOrderId;
            await _stageService.UpdateStageAsync(stageId, updateStageDto);
            return NoContent();
        }

        [HttpDelete("{salesOrderId}/stages/{stageId}")]
        public async Task<IActionResult> DeleteStage(int salesOrderId, int stageId)
        {
            await _stageService.DeleteStageAsync(stageId);
            return NoContent();
        }

        [HttpPost("{salesOrderId}/stages/{stageName}/approve")]
        public async Task<IActionResult> ApproveStage(int salesOrderId, string stageName)
        {
            await _stageService.ApproveStageAsync(salesOrderId, stageName);
            return NoContent();
        }

        [HttpPost("{salesOrderId}/stages/{stageName}/reject")]
        public async Task<IActionResult> RejectStage(int salesOrderId, string stageName)
        {
            await _stageService.RejectStageAsync(salesOrderId, stageName);
            return NoContent();
        }
    }
} 