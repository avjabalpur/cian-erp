using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class SalesOrderPerformaInvoiceRepository : ISalesOrderPerformaInvoiceRepository
    {
        private readonly DapperDbContext _context;

        public SalesOrderPerformaInvoiceRepository(DapperDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<IEnumerable<SalesOrderPerformaInvoice>> GetAllAsync()
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    pi.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name,
                    u2.first_name || ' ' || u2.last_name as updated_by_name
                FROM sales_order_performa_invoice pi
                LEFT JOIN users u1 ON pi.created_by = u1.id
                LEFT JOIN users u2 ON pi.updated_by = u2.id
                WHERE pi.is_deleted = 0
                ORDER BY pi.created_at DESC";

            return await connection.QueryAsync<SalesOrderPerformaInvoice>(query);
        }

        public async Task<SalesOrderPerformaInvoice> GetByIdAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    pi.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name,
                    u2.first_name || ' ' || u2.last_name as updated_by_name
                FROM sales_order_performa_invoice pi
                LEFT JOIN users u1 ON pi.created_by = u1.id
                LEFT JOIN users u2 ON pi.updated_by = u2.id
                WHERE pi.id = @Id AND pi.is_deleted = 0";

            return await connection.QuerySingleOrDefaultAsync<SalesOrderPerformaInvoice>(query, new { Id = id });
        }

        public async Task<SalesOrderPerformaInvoice> GetByInvoiceNumberAsync(string invoiceNumber)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    pi.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name,
                    u2.first_name || ' ' || u2.last_name as updated_by_name
                FROM sales_order_performa_invoice pi
                LEFT JOIN users u1 ON pi.created_by = u1.id
                LEFT JOIN users u2 ON pi.updated_by = u2.id
                WHERE pi.performa_invoice_number = @InvoiceNumber AND pi.is_deleted = 0";

            return await connection.QuerySingleOrDefaultAsync<SalesOrderPerformaInvoice>(query, new { InvoiceNumber = invoiceNumber });
        }

        public async Task<SalesOrderPerformaInvoice> AddAsync(SalesOrderPerformaInvoice performaInvoice)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                INSERT INTO sales_order_performa_invoice (
                    exporter_name, organization_name, consignee_name, consignee_contact_details,
                    consignee_address, performa_invoice_number, performa_invoice_date,
                    exporters_reference_number, other_references, other_buyer_name,
                    country_of_origin, country_of_final_destination, prepration,
                    port_of_discharge, place_of_receipt_by_pre_carrier, final_destination,
                    terms_of_delivery, payment_terms, shipment_mode, port_of_loading,
                    additionalcharges, total_amount, previous_performa_invoice_id,
                    is_deleted, created_by, created_at, updated_by, updated_at
                ) VALUES (
                    @ExporterName, @OrganizationName, @ConsigneeName, @ConsigneeContactDetails,
                    @ConsigneeAddress, @PerformaInvoiceNumber, @PerformaInvoiceDate,
                    @ExportersReferenceNumber, @OtherReferences, @OtherBuyerName,
                    @CountryOfOrigin, @CountryOfFinalDestination, @Prepration,
                    @PortOfDischarge, @PlaceOfReceiptByPreCarrier, @FinalDestination,
                    @TermsOfDelivery, @PaymentTerms, @ShipmentMode, @PortOfLoading,
                    @AdditionalCharges, @TotalAmount, @PreviousPerformaInvoiceId,
                    @IsDeleted, @CreatedBy, @CreatedTime, @UpdatedBy, @UpdatedTime
                ) RETURNING *";

            return await connection.QuerySingleAsync<SalesOrderPerformaInvoice>(query, performaInvoice);
        }

        public async Task<SalesOrderPerformaInvoice> UpdateAsync(SalesOrderPerformaInvoice performaInvoice)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                UPDATE sales_order_performa_invoice SET
                    exporter_name = @ExporterName, organization_name = @OrganizationName,
                    consignee_name = @ConsigneeName, consignee_contact_details = @ConsigneeContactDetails,
                    consignee_address = @ConsigneeAddress, performa_invoice_number = @PerformaInvoiceNumber,
                    performa_invoice_date = @PerformaInvoiceDate, exporters_reference_number = @ExportersReferenceNumber,
                    other_references = @OtherReferences, other_buyer_name = @OtherBuyerName,
                    country_of_origin = @CountryOfOrigin, country_of_final_destination = @CountryOfFinalDestination,
                    prepration = @Prepration, port_of_discharge = @PortOfDischarge,
                    place_of_receipt_by_pre_carrier = @PlaceOfReceiptByPreCarrier, final_destination = @FinalDestination,
                    terms_of_delivery = @TermsOfDelivery, payment_terms = @PaymentTerms,
                    shipment_mode = @ShipmentMode, port_of_loading = @PortOfLoading,
                    additionalcharges = @AdditionalCharges, total_amount = @TotalAmount,
                    previous_performa_invoice_id = @PreviousPerformaInvoiceId,
                    updated_by = @UpdatedBy, updated_at = @UpdatedTime
                WHERE id = @Id AND is_deleted = 0
                RETURNING *";

            return await connection.QuerySingleAsync<SalesOrderPerformaInvoice>(query, performaInvoice);
        }

        public async Task DeleteAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var query = "UPDATE sales_order_performa_invoice SET is_deleted = 1 WHERE id = @Id";
            await connection.ExecuteAsync(query, new { Id = id });
        }

        public async Task<bool> ExistsAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var query = "SELECT COUNT(*) FROM sales_order_performa_invoice WHERE id = @Id AND is_deleted = 0";
            var count = await connection.QuerySingleAsync<int>(query, new { Id = id });
            return count > 0;
        }

        public async Task<bool> InvoiceNumberExistsAsync(string invoiceNumber, int? excludeId = null)
        {
            using var connection = _context.GetConnection();
            
            var query = $@"SELECT COUNT(*) 
                            FROM sales_order_performa_invoice 
                            WHERE performa_invoice_number = @InvoiceNumber AND is_deleted = 0";
              var parameters = new { InvoiceNumber = invoiceNumber };
            var count = await connection.QuerySingleAsync<int>(query, parameters);
            return count > 0;
        }

        public async Task<IEnumerable<SalesOrderPerformaInvoice>> GetBySalesOrderIdAsync(int salesOrderId)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    pi.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name,
                    u2.first_name || ' ' || u2.last_name as updated_by_name
                FROM sales_order_performa_invoice pi
                LEFT JOIN users u1 ON pi.created_by = u1.id
                LEFT JOIN users u2 ON pi.updated_by = u2.id
                WHERE pi.is_deleted = 0
                ORDER BY pi.created_at DESC";

            return await connection.QueryAsync<SalesOrderPerformaInvoice>(query);
        }
    }
} 