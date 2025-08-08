using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class ItemOtherDetailsRepository : IItemOtherDetailsRepository
    {
        private const string TableName = "item_other_details";
        private readonly DapperDbContext _dbContext;

        public ItemOtherDetailsRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<ItemOtherDetails> GetByIdAsync(int id)
        {
            const string query = @"
                SELECT 
                    id as Id,
                    item_id as ItemId,
                    pack_short as PackShort,
                    product_cast as ProductCast,
                    pvc_color as PvcColor,
                    color as Color,
                    flavour as Flavour,
                    fragrance as Fragrance,
                    form as Form,
                    packaging_style as PackagingStyle,
                    change_part as ChangePart,
                    size as Size,
                    with_leaflet as WithLeaflet,
                    with_applicator as WithApplicator,
                    with_wad as WithWad,
                    with_silica as WithSilica,
                    with_cotton as WithCotton,
                    with_measuring_cap as WithMeasuringCap,
                    with_spoon as WithSpoon,
                    packing_np as PackingNp,
                    packing_np_qty as PackingNpQty,
                    packing_style_ptd as PackingStylePtd,
                    packing_style_ptd_qty as PackingStylePtdQty,
                    note_per_strip as NotePerStrip,
                    pack_short_ptd_spec as PackShortPtdSpec,
                    pack_short_ptd_size as PackShortPtdSize,
                    pack_short_ptd_qty as PackShortPtdQty,
                    packing_style_np_size as PackingStyleNpSize,
                    packing_style_np_qty as PackingStyleNpQty,
                    note_for_ctn as NoteForCtn,
                    outer_size as OuterSize,
                    outer_qty as OuterQty,
                    shrink as Shrink,
                    shrink_packing as ShrinkPacking,
                    shipper_size as ShipperSize,
                    qty_per_shipper as QtyPerShipper,
                    shipper_note as ShipperNote
                FROM item_other_details 
                WHERE id = @Id";
            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<ItemOtherDetails>(query, new { Id = id });
        }

        public async Task<IEnumerable<ItemOtherDetails>> GetByItemIdAsync(int itemId)
        {
            const string query = @"
                SELECT 
                    id as Id,
                    item_id as ItemId,
                    pack_short as PackShort,
                    product_cast as ProductCast,
                    pvc_color as PvcColor,
                    color as Color,
                    flavour as Flavour,
                    fragrance as Fragrance,
                    form as Form,
                    packaging_style as PackagingStyle,
                    change_part as ChangePart,
                    size as Size,
                    with_leaflet as WithLeaflet,
                    with_applicator as WithApplicator,
                    with_wad as WithWad,
                    with_silica as WithSilica,
                    with_cotton as WithCotton,
                    with_measuring_cap as WithMeasuringCap,
                    with_spoon as WithSpoon,
                    packing_np as PackingNp,
                    packing_np_qty as PackingNpQty,
                    packing_style_ptd as PackingStylePtd,
                    packing_style_ptd_qty as PackingStylePtdQty,
                    note_per_strip as NotePerStrip,
                    pack_short_ptd_spec as PackShortPtdSpec,
                    pack_short_ptd_size as PackShortPtdSize,
                    pack_short_ptd_qty as PackShortPtdQty,
                    packing_style_np_size as PackingStyleNpSize,
                    packing_style_np_qty as PackingStyleNpQty,
                    note_for_ctn as NoteForCtn,
                    outer_size as OuterSize,
                    outer_qty as OuterQty,
                    shrink as Shrink,
                    shrink_packing as ShrinkPacking,
                    shipper_size as ShipperSize,
                    qty_per_shipper as QtyPerShipper,
                    shipper_note as ShipperNote
                FROM item_other_details 
                WHERE item_id = @ItemId";
            using var connection = _dbContext.GetConnection();
            return await connection.QueryAsync<ItemOtherDetails>(query, new { ItemId = itemId });
        }

        public async Task<int> CreateAsync(ItemOtherDetails entity)
        {
            const string query = @"
                INSERT INTO item_other_details (
                    item_id, pack_short, product_cast, pvc_color, color, flavour, fragrance, form, packaging_style, change_part, size, with_leaflet, with_applicator, with_wad, with_silica, with_cotton, with_measuring_cap, with_spoon, packing_np, packing_np_qty, packing_style_ptd, packing_style_ptd_qty, note_per_strip, pack_short_ptd_spec, pack_short_ptd_size, pack_short_ptd_qty, packing_style_np_size, packing_style_np_qty, note_for_ctn, outer_size, outer_qty, shrink, shrink_packing, shipper_size, qty_per_shipper, shipper_note,
                    created_at, updated_at, created_by, updated_by
                ) VALUES (
                    @ItemId, @PackShort, @ProductCast, @PvcColor, @Color, @Flavour, @Fragrance, @Form, @PackagingStyle, @ChangePart, @Size, @WithLeaflet, @WithApplicator, @WithWad, @WithSilica, @WithCotton, @WithMeasuringCap, @WithSpoon, @PackingNp, @PackingNpQty, @PackingStylePtd, @PackingStylePtdQty, @NotePerStrip, @PackShortPtdSpec, @PackShortPtdSize, @PackShortPtdQty, @PackingStyleNpSize, @PackingStyleNpQty, @NoteForCtn, @OuterSize, @OuterQty, @Shrink, @ShrinkPacking, @ShipperSize, @QtyPerShipper, @ShipperNote,
                    @CreatedAt, @UpdatedAt, @CreatedBy, @UpdatedBy
                ) RETURNING id;";
            using var connection = _dbContext.GetConnection();
            return await connection.ExecuteScalarAsync<int>(query, entity);
        }

        public async Task<bool> UpdateAsync(ItemOtherDetails entity)
        {
            const string query = @"UPDATE item_other_details SET
                pack_short = @PackShort,
                product_cast = @ProductCast,
                pvc_color = @PvcColor,
                color = @Color,
                flavour = @Flavour,
                fragrance = @Fragrance,
                form = @Form,
                packaging_style = @PackagingStyle,
                change_part = @ChangePart,
                size = @Size,
                with_leaflet = @WithLeaflet,
                with_applicator = @WithApplicator,
                with_wad = @WithWad,
                with_silica = @WithSilica,
                with_cotton = @WithCotton,
                with_measuring_cap = @WithMeasuringCap,
                with_spoon = @WithSpoon,
                packing_np = @PackingNp,
                packing_np_qty = @PackingNpQty,
                packing_style_ptd = @PackingStylePtd,
                packing_style_ptd_qty = @PackingStylePtdQty,
                note_per_strip = @NotePerStrip,
                pack_short_ptd_spec = @PackShortPtdSpec,
                pack_short_ptd_size = @PackShortPtdSize,
                pack_short_ptd_qty = @PackShortPtdQty,
                packing_style_np_size = @PackingStyleNpSize,
                packing_style_np_qty = @PackingStyleNpQty,
                note_for_ctn = @NoteForCtn,
                outer_size = @OuterSize,
                outer_qty = @OuterQty,
                shrink = @Shrink,
                shrink_packing = @ShrinkPacking,
                shipper_size = @ShipperSize,
                qty_per_shipper = @QtyPerShipper,
                shipper_note = @ShipperNote,
                updated_at = @UpdatedAt,
                updated_by = @UpdatedBy
            WHERE id = @Id;";
            using var connection = _dbContext.GetConnection();
            return await connection.ExecuteAsync(query, entity) > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            const string query = @"DELETE FROM item_other_details WHERE id = @Id";
            using var connection = _dbContext.GetConnection();
            return await connection.ExecuteAsync(query, new { Id = id }) > 0;
        }


    }
}
