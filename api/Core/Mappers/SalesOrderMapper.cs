using AutoMapper;
using Xcianify.Core.DTOs.SalesOrder;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class SalesOrderMapper : Profile
    {
        public SalesOrderMapper()
        {
            // Sales Order mappings
            CreateMap<SalesOrder, SalesOrderDto>().ReverseMap();
            CreateMap<SalesOrder, CreateSalesOrderDto>().ReverseMap();
            CreateMap<SalesOrder, UpdateSalesOrderDto>().ReverseMap();

            // Sales Order Comment mappings
            CreateMap<SalesOrderComment, SalesOrderCommentDto>().ReverseMap();
            CreateMap<SalesOrderComment, CreateSalesOrderCommentDto>().ReverseMap();

            // Sales Order Chat mappings
            CreateMap<SalesOrderChat, SalesOrderChatDto>().ReverseMap();
            CreateMap<SalesOrderChat, CreateSalesOrderChatDto>().ReverseMap();

            // Sales Order Document mappings
            CreateMap<SalesOrderDocument, SalesOrderDocumentDto>().ReverseMap();
            CreateMap<SalesOrderDocument, CreateSalesOrderDocumentDto>().ReverseMap();

            // Sales Order Performa Invoice mappings
            CreateMap<SalesOrderPerformaInvoice, SalesOrderPerformaInvoiceDto>().ReverseMap();
            CreateMap<SalesOrderPerformaInvoice, CreateSalesOrderPerformaInvoiceDto>().ReverseMap();

            // Sales Order Performa Invoice Item mappings
            CreateMap<SalesOrderPerformaInvoiceItem, SalesOrderPerformaInvoiceItemDto>().ReverseMap();
            CreateMap<SalesOrderPerformaInvoiceItem, CreateSalesOrderPerformaInvoiceItemDto>().ReverseMap();

            // Sales Order Quotation mappings
            CreateMap<SalesOrderQuotation, SalesOrderQuotationDto>().ReverseMap();
            CreateMap<SalesOrderQuotation, CreateSalesOrderQuotationDto>().ReverseMap();

            // Sales Order Quotation Item mappings
            CreateMap<SalesOrderQuotationItem, SalesOrderQuotationItemDto>().ReverseMap();
            CreateMap<SalesOrderQuotationItem, CreateSalesOrderQuotationItemDto>().ReverseMap();

            // Sales Order Save Transaction mappings
            CreateMap<SalesOrderSaveTransaction, SalesOrderSaveTransactionDto>().ReverseMap();
            CreateMap<SalesOrderSaveTransaction, CreateSalesOrderSaveTransactionDto>().ReverseMap();

            // Item Sales Details mappings
            CreateMap<ItemSalesDetails, ItemSalesDetailsDto>().ReverseMap();
            CreateMap<ItemSalesDetails, CreateItemSalesDetailsDto>().ReverseMap();

            // Sales Order Stage mappings
            CreateMap<SalesOrderStage, SalesOrderStageDto>().ReverseMap();
            CreateMap<SalesOrderStage, CreateSalesOrderStageDto>().ReverseMap();
        }
    }
} 