using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.DTOs.SalesOrder;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class SalesOrderRepository : ISalesOrderRepository
    {
        private readonly DapperDbContext _context;

        public SalesOrderRepository(DapperDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<(IEnumerable<SalesOrder> Items, int TotalCount)> GetAllAsync(SalesOrderFilterDto filterDto)
        {
            using var connection = _context.GetConnection();
            
            var whereClause = "WHERE so.is_deleted = 0";
            var parameters = new DynamicParameters();

            if (!string.IsNullOrEmpty(filterDto.search))
            {
                whereClause += " AND (so.so_number ILIKE @search OR so.so_status ILIKE @search OR c.customer_name ILIKE @search)";
                parameters.Add("@search", $"%{filterDto.search}%");
            }

            if (!string.IsNullOrEmpty(filterDto.SoNumber))
            {
                whereClause += " AND so.so_number ILIKE @SoNumber";
                parameters.Add("@SoNumber", $"%{filterDto.SoNumber}%");
            }

            if (!string.IsNullOrEmpty(filterDto.SoStatus))
            {
                whereClause += " AND so.so_status = @SoStatus";
                parameters.Add("@SoStatus", filterDto.SoStatus);
            }

            if (filterDto.CustomerId.HasValue)
            {
                whereClause += " AND so.customer_id = @CustomerId";
                parameters.Add("@CustomerId", filterDto.CustomerId.Value);
            }

            if (filterDto.OrganizationId.HasValue)
            {
                whereClause += " AND so.organization_id = @OrganizationId";
                parameters.Add("@OrganizationId", filterDto.OrganizationId.Value);
            }

            if (filterDto.DivisionId.HasValue)
            {
                whereClause += " AND so.divisionid = @DivisionId";
                parameters.Add("@DivisionId", filterDto.DivisionId.Value);
            }

            if (filterDto.ItemId.HasValue)
            {
                whereClause += " AND so.item_id = @ItemId";
                parameters.Add("@ItemId", filterDto.ItemId.Value);
            }

            if (filterDto.FromDate.HasValue)
            {
                whereClause += " AND so.so_date >= @FromDate";
                parameters.Add("@FromDate", filterDto.FromDate.Value);
            }

            if (filterDto.ToDate.HasValue)
            {
                whereClause += " AND so.so_date <= @ToDate";
                parameters.Add("@ToDate", filterDto.ToDate.Value);
            }

            if (filterDto.IsSubmitted.HasValue)
            {
                whereClause += " AND so.is_submitted = @IsSubmitted";
                parameters.Add("@IsSubmitted", filterDto.IsSubmitted.Value ? 1 : 0);
            }

            if (filterDto.AssignedDesigner.HasValue)
            {
                whereClause += " AND so.assigned_designer = @AssignedDesigner";
                parameters.Add("@AssignedDesigner", filterDto.AssignedDesigner.Value);
            }

            var countQuery = $@"
                SELECT COUNT(*)
                FROM sales_orders so
                LEFT JOIN customers c ON so.customer_id = c.id
                LEFT JOIN item_master im ON so.item_id = im.id
                LEFT JOIN divisions d ON so.divisionid = d.id
                LEFT JOIN users u1 ON so.created_by = u1.id
                LEFT JOIN users u2 ON so.updated_by = u2.id
                LEFT JOIN users u3 ON so.assigned_designer = u3.id
                {whereClause}";

            var totalCount = await connection.QuerySingleAsync<int>(countQuery, parameters);

            var orderClause = $"ORDER BY so.{filterDto.SortBy} {filterDto.SortOrder}";
            var limitClause = $"LIMIT {filterDto.PageSize} OFFSET {(filterDto.Page - 1) * filterDto.PageSize}";

            var query = $@"
                SELECT 
                    so.id,
                    so.so_number as soNumber,
                    so.so_date as soDate,
                    so.so_status as soStatus,
                    so.organization_id as organizationId,
                    so.customer_id as customerId,
                    so.payment_term as paymentTerm,
                    o.name as organizationName,
                    c.customer_name as customerName,
                    im.item_name as itemName,
                    d.name as divisionName,
                    u1.first_name || ' ' || u1.last_name as createdBy,
                    u2.first_name || ' ' || u2.last_name as updatedBy,
                    u3.first_name || ' ' || u3.last_name as assignedDesigner
                FROM sales_orders so
                LEFT JOIN customers c ON so.customer_id = c.id
                LEFT JOIN organizations o ON so.organization_id = o.id
                LEFT JOIN item_master im ON so.item_id = im.id
                LEFT JOIN divisions d ON so.divisionid = d.id
                LEFT JOIN users u1 ON so.created_by = u1.id
                LEFT JOIN users u2 ON so.updated_by = u2.id
                LEFT JOIN users u3 ON so.assigned_designer = u3.id
                {whereClause}
                {orderClause}
                {limitClause}";

            var salesOrders = await connection.QueryAsync<SalesOrder>(query, parameters);

            return (salesOrders, totalCount);
        }

        public async Task<SalesOrder> GetByIdAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                   so.id,
                    so.so_number as soNumber,
                    so.so_date as soDate,
                    so.so_status as soStatus,
                    so.organization_id as organizationId,
                    so.customer_id as customerId,
                    so.payment_term as paymentTerm,
                    o.name as organizationName,
                    c.customer_name as customerName,
                    im.item_name as itemName,
                    d.name as divisionName,
                    u1.first_name || ' ' || u1.last_name as createdBy,
                    u2.first_name || ' ' || u2.last_name as updatedBy,
                    u3.first_name || ' ' || u3.last_name as assignedDesigner
                FROM sales_orders so
                LEFT JOIN customers c ON so.customer_id = c.id
                LEFT JOIN organizations o ON so.organization_id = o.id
                LEFT JOIN item_master im ON so.item_id = im.id
                LEFT JOIN divisions d ON so.divisionid = d.id
                LEFT JOIN users u1 ON so.created_by = u1.id
                LEFT JOIN users u2 ON so.updated_by = u2.id
                LEFT JOIN users u3 ON so.assigned_designer = u3.id
                WHERE so.id = @Id AND so.is_deleted = 0";

            return await connection.QuerySingleOrDefaultAsync<SalesOrder>(query, new { Id = id });
        }

        public async Task<SalesOrder> GetBySoNumberAsync(string soNumber)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    so.id,
                    so.so_number as soNumber,
                    so.so_date as soDate,
                    so.so_status as soStatus,
                    so.organization_id as organizationId,
                    so.customer_id as customerId,
                    so.payment_term as paymentTerm,
                    o.name as organizationName,
                    c.customer_name as customerName,
                    im.item_name as itemName,
                    d.name as divisionName,
                    u1.first_name || ' ' || u1.last_name as createdBy,
                    u2.first_name || ' ' || u2.last_name as updatedBy,
                    u3.first_name || ' ' || u3.last_name as assignedDesigner
                FROM sales_orders so
                LEFT JOIN customers c ON so.customer_id = c.id
                LEFT JOIN organizations o ON so.organization_id = o.id
                LEFT JOIN item_master im ON so.item_id = im.id
                LEFT JOIN divisions d ON so.divisionid = d.id
                LEFT JOIN users u1 ON so.created_by = u1.id
                LEFT JOIN users u2 ON so.updated_by = u2.id
                LEFT JOIN users u3 ON so.assigned_designer = u3.id
                WHERE so.so_number = @SoNumber AND so.is_deleted = 0";

            return await connection.QuerySingleOrDefaultAsync<SalesOrder>(query, new { SoNumber = soNumber });
        }

        public async Task<SalesOrder> AddAsync(SalesOrder salesOrder)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                INSERT INTO sales_orders (
                    so_number, so_date, so_status, organization_id, customer_id, payment_term,
                    quotation_date, quotation_no, hsn_code, item_id, dosage_name, divisionid,
                    design_under, packing_style_description, composition, pack_short, tablet_type,
                    tablet_size, change_part, capsule_size, shipper_size, qty_per_shipper,
                    no_of_shipper, flavour, fragrance, quantity, foc_qty, mrp, billing_rate,
                    costing, inventory_charges, cylinder_charge, plate_charges, domino, stereo,
                    shipper_drawing_ref_code, ctn_outer_drawing_ref_no, ctn_inner_drawing_ref_no,
                    foil_drawing_ref_no, leaflet_drawing_ref_no, tube_drawing_ref_no,
                    label_drawing_ref_no, pm_outer_ctn_stock, pm_inner_ctn_stock, pm_foil_stock,
                    pm_leaflet_stock, pm_tube_stock, pm_label_stock, drug_approval_under,
                    current_status, comments, is_submitted, is_deleted, assigned_designer,
                    plant_email_sent, created_by, created_at, updated_by, updated_at
                ) VALUES (
                    @SoNumber, @SoDate, @SoStatus, @OrganizationId, @CustomerId, @PaymentTerm,
                    @QuotationDate, @QuotationNo, @HsnCode, @ItemId, @DosageName, @DivisionId,
                    @DesignUnder, @PackingStyleDescription, @Composition, @PackShort, @TabletType,
                    @TabletSize, @ChangePart, @CapsuleSize, @ShipperSize, @QtyPerShipper,
                    @NoOfShipper, @Flavour, @Fragrance, @Quantity, @FocQty, @Mrp, @BillingRate,
                    @Costing, @InventoryCharges, @CylinderCharge, @PlateCharges, @Domino, @Stereo,
                    @ShipperDrawingRefCode, @CtnOuterDrawingRefNo, @CtnInnerDrawingRefNo,
                    @FoilDrawingRefNo, @LeafletDrawingRefNo, @TubeDrawingRefNo,
                    @LabelDrawingRefNo, @PmOuterCtnStock, @PmInnerCtnStock, @PmFoilStock,
                    @PmLeafletStock, @PmTubeStock, @PmLabelStock, @DrugApprovalUnder,
                    @CurrentStatus, @Comments, @IsSubmitted, @IsDeleted, @AssignedDesigner,
                    @PlantEmailSent, @CreatedBy, @CreatedTime, @UpdatedBy, @UpdatedTime
                ) RETURNING *";

            return await connection.QuerySingleAsync<SalesOrder>(query, salesOrder);
        }

        public async Task<SalesOrder> UpdateAsync(SalesOrder salesOrder)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                UPDATE sales_orders SET
                    so_number = @SoNumber, so_date = @SoDate, so_status = @SoStatus,
                    organization_id = @OrganizationId, customer_id = @CustomerId, payment_term = @PaymentTerm,
                    quotation_date = @QuotationDate, quotation_no = @QuotationNo, hsn_code = @HsnCode,
                    item_id = @ItemId, dosage_name = @DosageName, divisionid = @DivisionId,
                    design_under = @DesignUnder, packing_style_description = @PackingStyleDescription,
                    composition = @Composition, pack_short = @PackShort, tablet_type = @TabletType,
                    tablet_size = @TabletSize, change_part = @ChangePart, capsule_size = @CapsuleSize,
                    shipper_size = @ShipperSize, qty_per_shipper = @QtyPerShipper, no_of_shipper = @NoOfShipper,
                    flavour = @Flavour, fragrance = @Fragrance, quantity = @Quantity, foc_qty = @FocQty,
                    mrp = @Mrp, billing_rate = @BillingRate, costing = @Costing, inventory_charges = @InventoryCharges,
                    cylinder_charge = @CylinderCharge, plate_charges = @PlateCharges, domino = @Domino,
                    stereo = @Stereo, shipper_drawing_ref_code = @ShipperDrawingRefCode,
                    ctn_outer_drawing_ref_no = @CtnOuterDrawingRefNo, ctn_inner_drawing_ref_no = @CtnInnerDrawingRefNo,
                    foil_drawing_ref_no = @FoilDrawingRefNo, leaflet_drawing_ref_no = @LeafletDrawingRefNo,
                    tube_drawing_ref_no = @TubeDrawingRefNo, label_drawing_ref_no = @LabelDrawingRefNo,
                    pm_outer_ctn_stock = @PmOuterCtnStock, pm_inner_ctn_stock = @PmInnerCtnStock,
                    pm_foil_stock = @PmFoilStock, pm_leaflet_stock = @PmLeafletStock, pm_tube_stock = @PmTubeStock,
                    pm_label_stock = @PmLabelStock, drug_approval_under = @DrugApprovalUnder,
                    current_status = @CurrentStatus, comments = @Comments, is_submitted = @IsSubmitted,
                    assigned_designer = @AssignedDesigner, plant_email_sent = @PlantEmailSent,
                    updated_by = @UpdatedBy, updated_at = @UpdatedAt
                WHERE id = @Id AND is_deleted = 0
                RETURNING *";

            return await connection.QuerySingleAsync<SalesOrder>(query, salesOrder);
        }

        public async Task DeleteAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var query = "UPDATE sales_orders SET is_deleted = 1 WHERE id = @Id";
            await connection.ExecuteAsync(query, new { Id = id });
        }

        public async Task<bool> ExistsAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var query = "SELECT COUNT(*) FROM sales_orders WHERE id = @Id AND is_deleted = 0";
            var count = await connection.QuerySingleAsync<int>(query, new { Id = id });
            return count > 0;
        }

        public async Task<bool> SoNumberExistsAsync(string soNumber, int? excludeId = null)
        {
            using var connection = _context.GetConnection();
            
            var query = "SELECT COUNT(*) FROM sales_orders WHERE so_number = @SoNumber AND is_deleted = 0";
            var parameters = new { SoNumber = soNumber };
            
            var count = await connection.QuerySingleAsync<int>(query, parameters);
            return count > 0;
        }

        public async Task<int> GetNextSoNumberAsync()
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT COALESCE(MAX(CAST(SUBSTRING(so_number FROM 3) AS INTEGER)), 0) + 1
                FROM sales_orders 
                WHERE so_number LIKE 'SO%' AND is_deleted = 0";

            return await connection.QuerySingleAsync<int>(query);
        }

        public async Task<int> CreateApprovalAsync(string soStatus, string dosageName, int createdBy)
        {
            using var connection = _context.GetConnection();
            
            var currentTime = DateTime.UtcNow;
            
            var query = @"
                INSERT INTO sales_orders (
                    so_status,
                    dosage_name,
                    created_by,
                    created_at,
                    updated_by,
                    updated_at,
                    current_status,
                    is_deleted,
                    is_submitted
                ) VALUES (
                    @SoStatus,
                    @DosageName,
                    @CreatedBy,
                    @CreatedAt,
                    @CreatedBy,
                    @CreatedAt,
                    'IN-PROGRESS',
                    0,
                    0
                ) RETURNING id";

            var parameters = new
            {
                SoStatus = soStatus,
                DosageName = dosageName,
                CreatedBy = createdBy,
                CreatedAt = currentTime
            };

            return await connection.QuerySingleAsync<int>(query, parameters);
        }
    }
} 