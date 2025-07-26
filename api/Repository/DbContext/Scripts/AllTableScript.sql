CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION trigger_set_uuid()
RETURNS trigger AS $$
BEGIN
    IF NEW.id IS NULL THEN
        NEW.id := uuid_generate_v4();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE TABLE IF NOT EXISTS public.erpitem_master
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),

    item_code character varying(20),
    item_name character varying(200),
    short_name character varying(100),
    pharmacopoeia_name character varying(200),
    item_type character varying(20),
    sub_type character varying(50),
    gs_ind character(1),
    goods character varying(50),
    hsn character varying(20),
    uqc character varying(20),

    unit_of_measure character varying(20),
    issuing_unit character varying(20),
    uom_conv_factor bigint,
    uqc_conv_factor bigint,
    created_on date,

    drawing_ref text,
    std_assay_strength bigint,
    shelf_life_months bigint,
    shelf_life_days bigint,
    std_rate bigint,
    lead_time_days bigint,
    std_loss_on_dry bigint,
    safety_stock bigint,

    is_batch_na boolean,
    is_qc_required boolean,
    is_allergen boolean,
    is_mfg_date_applicable boolean,
    is_expiry_date_applicable boolean,
    is_track_serial_no boolean,
    is_packing_freight_service boolean,
    is_active_ingredient boolean,
    is_mfg_location_required boolean,
    is_mfg_mm_yyyy_applicable boolean,
    is_expiry_mm_yyyy_applicable boolean,
    is_statutory_principal boolean,

    is_bought_out boolean,
    is_job_work boolean,
    is_imported boolean,
    is_tax_credit_applicable boolean,
    is_manufactured boolean,
    is_sold boolean,
    is_key_product boolean,
    is_exported boolean,

    current_buyer character varying(100),
    econ_order_qty bigint,
    desired_pack_size character varying(50),
    freight_on character varying(10),

    allowed_allergen_percent bigint,
    std_mfg_fees_per_unit bigint,
    main_prod_center character varying(100),

    product_type character varying(100),
    sales_division character varying(100),
    product_group character varying(100),
    conversion_factor bigint,
    vendor_part_no character varying(100),

    pack_short character varying(50),
    product_cast character varying(100),
    pvc_color character varying(50),
    color character varying(50),
    flavour character varying(50),
    fragrance character varying(50),
    form character varying(50),
    packaging_style character varying(100),
    change_part character varying(100),
    size character varying(50),

    with_leaflet boolean,
    with_applicator boolean,
    with_wad boolean,
    with_silica boolean,
    with_cotton boolean,
    with_measuring_cap boolean,
    with_spoon boolean,

    packing_np character varying(100),
    packing_np_qty bigint,
    packing_style_ptd character varying(100),
    packing_style_ptd_qty bigint,
    note_per_strip text,
    pack_short_ptd_spec character varying(100),
    pack_short_ptd_size character varying(100),
    pack_short_ptd_qty bigint,
    packing_style_np_size character varying(100),
    packing_style_np_qty bigint,

    note_for_ctn text,
    outer_size character varying(100),
    outer_qty bigint,
    shrink character varying(100),
    shrink_packing character varying(100),
    shipper_size character varying(100),
    shipper_qty bigint,
    shipper_note text,

    item_specification text,
    substitute_for_item character varying(100),
    custom_tariff_no character varying(50),
    excise_tariff_no character varying(50),
    vat_comm_code character varying(50),

    old_code character varying(50),
    standard_weight_kg bigint,

    std_conversion_cost_factor bigint,
    std_packing_cost_factor bigint,
    margin_percent bigint,
    testing_charges_amount bigint,

    updated_by character varying(100),
    updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT erpitems_master_pkey PRIMARY KEY (id)
)
TABLESPACE pg_default;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'erpitem_master'
          AND n.nspname = 'public'
    ) THEN
        ALTER TABLE public.erpitem_master OWNER TO postgres;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_item_code ON public.erpitem_master (item_code);
CREATE INDEX IF NOT EXISTS idx_item_name ON public.erpitem_master (item_name);

CREATE EXTENSION IF NOT EXISTS pg_trgm;


-- Add created_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'erpitem_master' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE erpitem_master 
        ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Update existing records to have created_at value
UPDATE erpitem_master 
SET created_at = CURRENT_TIMESTAMP 
WHERE created_at IS NULL;

-- Table: public.import_customer_master

CREATE TABLE IF NOT EXISTS public.import_customer_master
(
    loc_cd text COLLATE pg_catalog."default",
    cust_no text COLLATE pg_catalog."default",
    cust_cd text COLLATE pg_catalog."default",
    cust_crt_dt text COLLATE pg_catalog."default",
    stop_inv text COLLATE pg_catalog."default",
    cust_name text COLLATE pg_catalog."default",
    short_name text COLLATE pg_catalog."default",
    payee_name text COLLATE pg_catalog."default",
    cust_tp_cd text COLLATE pg_catalog."default",
    segm_cd text COLLATE pg_catalog."default",
    itax_pan_no text COLLATE pg_catalog."default",
    cust_sl_tp text COLLATE pg_catalog."default",
    export_type text COLLATE pg_catalog."default",
    gstin text COLLATE pg_catalog."default",
    add_line1 text COLLATE pg_catalog."default",
    add_line2 text COLLATE pg_catalog."default",
    add_line3 text COLLATE pg_catalog."default",
    city text COLLATE pg_catalog."default",
    zip_code text COLLATE pg_catalog."default",
    country text COLLATE pg_catalog."default",
    state_cd text COLLATE pg_catalog."default",
    gst_state_cd text COLLATE pg_catalog."default",
    contact text COLLATE pg_catalog."default",
    tel_no text COLLATE pg_catalog."default",
    mobile_no text COLLATE pg_catalog."default",
    fax_no text COLLATE pg_catalog."default",
    email_id text COLLATE pg_catalog."default",
    website text COLLATE pg_catalog."default",
    destn_cd text COLLATE pg_catalog."default",
    tr_md_cd text COLLATE pg_catalog."default",
    trnsp_cd text COLLATE pg_catalog."default",
    lead_days text COLLATE pg_catalog."default",
    cust_dist text COLLATE pg_catalog."default",
    frt_ind text COLLATE pg_catalog."default",
    bnk_ifsc_cd text COLLATE pg_catalog."default",
    bnk_ac_no text COLLATE pg_catalog."default",
    bnk_name text COLLATE pg_catalog."default",
    cust_bnkr text COLLATE pg_catalog."default",
    cust_vpa text COLLATE pg_catalog."default",
    bac_tp_cd text COLLATE pg_catalog."default",
    bnk_branch text COLLATE pg_catalog."default",
    bank_loc text COLLATE pg_catalog."default",
    cust_intf_cd double precision,
    intf_fl_frmt text COLLATE pg_catalog."default",
    proj_ratio text COLLATE pg_catalog."default",
    no_of_dsp text COLLATE pg_catalog."default",
    alw_cnsg_obk text COLLATE pg_catalog."default",
    lbl_lyt text COLLATE pg_catalog."default",
    no_of_copies text COLLATE pg_catalog."default",
    old_code text COLLATE pg_catalog."default",
    cust_lot_no text COLLATE pg_catalog."default",
    is_elg_tcs text COLLATE pg_catalog."default",
    tcs_type text COLLATE pg_catalog."default",
    is_apl_hgr_rt text COLLATE pg_catalog."default",
    is_dd_nn_res text COLLATE pg_catalog."default",
    is_dd_prm_est text COLLATE pg_catalog."default",
    drug_lic_no text COLLATE pg_catalog."default",
    dlic_exp_dt text COLLATE pg_catalog."default",
    oth_lic_no text COLLATE pg_catalog."default",
    is_bl_disc text COLLATE pg_catalog."default",
    is_rev_eoyr text COLLATE pg_catalog."default",
    sup_stk_loc text COLLATE pg_catalog."default",
    cac_cd text COLLATE pg_catalog."default",
    ccrd_limit text COLLATE pg_catalog."default",
    min_inv_amt text COLLATE pg_catalog."default",
    cschm_cd text COLLATE pg_catalog."default",
    cbroker_cd text COLLATE pg_catalog."default",
    cbroker_rt text COLLATE pg_catalog."default",
    ccash_disc text COLLATE pg_catalog."default",
    cmisc_chg_pc text COLLATE pg_catalog."default",
    cmisc_dis_pc text COLLATE pg_catalog."default",
    cvat_form_cd text COLLATE pg_catalog."default",
    ccen_form_cd text COLLATE pg_catalog."default",
    cap_spl_term text COLLATE pg_catalog."default",
    cpay_term_cd text COLLATE pg_catalog."default",
    cdocs_thru text COLLATE pg_catalog."default",
    ccrd_prd text COLLATE pg_catalog."default",
    cnw_pcrd_prd text COLLATE pg_catalog."default",
    cis_ov_du_chk text COLLATE pg_catalog."default",
    cno_of_bills text COLLATE pg_catalog."default",
    cos_bl_prd text COLLATE pg_catalog."default",
    cos_bl_ac_ind text COLLATE pg_catalog."default",
    ext_info text COLLATE pg_catalog."default",
    is_rec_clsd text COLLATE pg_catalog."default",
    mst_upd_by text COLLATE pg_catalog."default",
    mst_upd_dt_tm text COLLATE pg_catalog."default",
    tx_rev_no double precision,
    is_exp_cust text COLLATE pg_catalog."default",
    is_reg_dlr text COLLATE pg_catalog."default",
    rdbts text COLLATE pg_catalog."default",
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT import_customer_master_pkey PRIMARY KEY (id)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.import_customer_master
    OWNER to postgres;

-- Table: public.export_customer_master

CREATE TABLE IF NOT EXISTS public.export_customer_master
(
    loc_cd text COLLATE pg_catalog."default",
    cust_no text COLLATE pg_catalog."default",
    cust_cd text COLLATE pg_catalog."default",
    cust_crt_dt text COLLATE pg_catalog."default",
    stop_inv text COLLATE pg_catalog."default",
    cust_name text COLLATE pg_catalog."default",
    short_name text COLLATE pg_catalog."default",
    payee_name text COLLATE pg_catalog."default",
    cust_tp_cd text COLLATE pg_catalog."default",
    segm_cd text COLLATE pg_catalog."default",
    itax_pan_no text COLLATE pg_catalog."default",
    cust_sl_tp text COLLATE pg_catalog."default",
    export_type text COLLATE pg_catalog."default",
    gstin text COLLATE pg_catalog."default",
    add_line1 text COLLATE pg_catalog."default",
    add_line2 text COLLATE pg_catalog."default",
    add_line3 text COLLATE pg_catalog."default",
    city text COLLATE pg_catalog."default",
    zip_code text COLLATE pg_catalog."default",
    country text COLLATE pg_catalog."default",
    state_cd text COLLATE pg_catalog."default",
    gst_state_cd text COLLATE pg_catalog."default",
    contact text COLLATE pg_catalog."default",
    tel_no text COLLATE pg_catalog."default",
    mobile_no text COLLATE pg_catalog."default",
    fax_no text COLLATE pg_catalog."default",
    email_id text COLLATE pg_catalog."default",
    website text COLLATE pg_catalog."default",
    destn_cd text COLLATE pg_catalog."default",
    tr_md_cd text COLLATE pg_catalog."default",
    trnsp_cd text COLLATE pg_catalog."default",
    lead_days text COLLATE pg_catalog."default",
    cust_dist text COLLATE pg_catalog."default",
    frt_ind text COLLATE pg_catalog."default",
    bnk_ifsc_cd text COLLATE pg_catalog."default",
    bnk_ac_no text COLLATE pg_catalog."default",
    bnk_name text COLLATE pg_catalog."default",
    cust_bnkr text COLLATE pg_catalog."default",
    cust_vpa text COLLATE pg_catalog."default",
    bac_tp_cd text COLLATE pg_catalog."default",
    bnk_branch text COLLATE pg_catalog."default",
    bank_loc text COLLATE pg_catalog."default",
    cust_intf_cd double precision,
    intf_fl_frmt text COLLATE pg_catalog."default",
    proj_ratio text COLLATE pg_catalog."default",
    no_of_dsp text COLLATE pg_catalog."default",
    alw_cnsg_obk text COLLATE pg_catalog."default",
    lbl_lyt text COLLATE pg_catalog."default",
    no_of_copies text COLLATE pg_catalog."default",
    old_code text COLLATE pg_catalog."default",
    cust_lot_no text COLLATE pg_catalog."default",
    is_elg_tcs text COLLATE pg_catalog."default",
    tcs_type text COLLATE pg_catalog."default",
    is_apl_hgr_rt text COLLATE pg_catalog."default",
    is_dd_nn_res text COLLATE pg_catalog."default",
    is_dd_prm_est text COLLATE pg_catalog."default",
    drug_lic_no text COLLATE pg_catalog."default",
    dlic_exp_dt text COLLATE pg_catalog."default",
    oth_lic_no text COLLATE pg_catalog."default",
    is_bl_disc text COLLATE pg_catalog."default",
    is_rev_eoyr text COLLATE pg_catalog."default",
    sup_stk_loc text COLLATE pg_catalog."default",
    cac_cd text COLLATE pg_catalog."default",
    ccrd_limit text COLLATE pg_catalog."default",
    min_inv_amt text COLLATE pg_catalog."default",
    cschm_cd text COLLATE pg_catalog."default",
    cbroker_cd text COLLATE pg_catalog."default",
    cbroker_rt text COLLATE pg_catalog."default",
    ccash_disc text COLLATE pg_catalog."default",
    cmisc_chg_pc text COLLATE pg_catalog."default",
    cmisc_dis_pc text COLLATE pg_catalog."default",
    cvat_form_cd text COLLATE pg_catalog."default",
    ccen_form_cd text COLLATE pg_catalog."default",
    cap_spl_term text COLLATE pg_catalog."default",
    cpay_term_cd text COLLATE pg_catalog."default",
    cdocs_thru text COLLATE pg_catalog."default",
    ccrd_prd text COLLATE pg_catalog."default",
    cnw_pcrd_prd text COLLATE pg_catalog."default",
    cis_ov_du_chk text COLLATE pg_catalog."default",
    cno_of_bills text COLLATE pg_catalog."default",
    cos_bl_prd text COLLATE pg_catalog."default",
    cos_bl_ac_ind text COLLATE pg_catalog."default",
    ext_info text COLLATE pg_catalog."default",
    is_rec_clsd text COLLATE pg_catalog."default",
    mst_upd_by text COLLATE pg_catalog."default",
    mst_upd_dt_tm text COLLATE pg_catalog."default",
    tx_rev_no double precision,
    is_exp_cust text COLLATE pg_catalog."default",
    is_reg_dlr text COLLATE pg_catalog."default",
    rdbts text COLLATE pg_catalog."default",
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT export_customer_master_pkey PRIMARY KEY (id)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.export_customer_master
    OWNER to postgres;

-- Trigger: set_uuid_before_insert_import

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'set_uuid_before_insert_import'
    ) THEN
        CREATE TRIGGER set_uuid_before_insert_import
        BEFORE INSERT ON public.import_customer_master
        FOR EACH ROW
        WHEN (new.id IS NULL)
        EXECUTE FUNCTION public.trigger_set_uuid();
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger: set_uuid_before_insert_export

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'set_uuid_before_insert_export'
    ) THEN
        CREATE TRIGGER set_uuid_before_insert_export
        BEFORE INSERT ON public.export_customer_master
        FOR EACH ROW
        WHEN (new.id IS NULL)
        EXECUTE FUNCTION public.trigger_set_uuid();
    END IF;
END;
$$ LANGUAGE plpgsql;


-- Table: public.import_currencies

-- DROP TABLE IF EXISTS public.import_currencies;

CREATE TABLE IF NOT EXISTS public.import_currencies
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    currency_code character varying(10) COLLATE pg_catalog."default",
    exchange_usd numeric(18,6),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT (now() AT TIME ZONE 'UTC'::text),
    updated_at timestamp without time zone DEFAULT (now() AT TIME ZONE 'UTC'::text),
    CONSTRAINT import_currencies_pkey PRIMARY KEY (id),
    CONSTRAINT import_currencies_currency_code_key UNIQUE (currency_code)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.import_currencies
    OWNER to postgres;

-- Table: public.export_currencies

-- DROP TABLE IF EXISTS public.export_currencies;

CREATE TABLE IF NOT EXISTS public.export_currencies
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    currency_code character varying(10) COLLATE pg_catalog."default",
    exchange_usd numeric(18,6),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT (now() AT TIME ZONE 'UTC'::text),
    updated_at timestamp without time zone DEFAULT (now() AT TIME ZONE 'UTC'::text),
    CONSTRAINT export_currencies_pkey PRIMARY KEY (id),
    CONSTRAINT export_currencies_currency_code_key UNIQUE (currency_code)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.export_currencies
    OWNER to postgres;

-- Table: public.import_item_master

-- DROP TABLE IF EXISTS public.import_item_master;

CREATE TABLE IF NOT EXISTS public.import_item_master
(
    item_cd text COLLATE pg_catalog."default",
    item_name text COLLATE pg_catalog."default",
    short_name text COLLATE pg_catalog."default",
    pharmacp_nm text COLLATE pg_catalog."default",
    item_tp_cd text COLLATE pg_catalog."default",
    it_sub_tp_cd text COLLATE pg_catalog."default",
    uom_cd text COLLATE pg_catalog."default",
    iss_uom_cd text COLLATE pg_catalog."default",
    conv_fact text COLLATE pg_catalog."default",
    item_crt_dt text COLLATE pg_catalog."default",
    gs_ind text COLLATE pg_catalog."default",
    hsn_sac_cd double precision,
    drawing_no text COLLATE pg_catalog."default",
    std_assay text COLLATE pg_catalog."default",
    lead_time text COLLATE pg_catalog."default",
    std_lod text COLLATE pg_catalog."default",
    sh_lf_mth text COLLATE pg_catalog."default",
    shelf_life text COLLATE pg_catalog."default",
    stnd_rate double precision,
    safety_stk text COLLATE pg_catalog."default",
    is_btch_na text COLLATE pg_catalog."default",
    is_pck_frt_sv text COLLATE pg_catalog."default",
    is_qc_reqd text COLLATE pg_catalog."default",
    is_act_ing text COLLATE pg_catalog."default",
    is_allrgn text COLLATE pg_catalog."default",
    is_mnf_reqd text COLLATE pg_catalog."default",
    is_mnf_date text COLLATE pg_catalog."default",
    is_mnf_mmyy text COLLATE pg_catalog."default",
    is_exp_dt_app text COLLATE pg_catalog."default",
    is_exp_my_app text COLLATE pg_catalog."default",
    is_trk_srl text COLLATE pg_catalog."default",
    is_pncp_item text COLLATE pg_catalog."default",
    is_bought text COLLATE pg_catalog."default",
    is_imported text COLLATE pg_catalog."default",
    is_job_work text COLLATE pg_catalog."default",
    eco_ord_qty text COLLATE pg_catalog."default",
    des_pck_size text COLLATE pg_catalog."default",
    is_vat_crd text COLLATE pg_catalog."default",
    vat_rbt_pct text COLLATE pg_catalog."default",
    cur_buy_id text COLLATE pg_catalog."default",
    frt_on_ind text COLLATE pg_catalog."default",
    gi_ovh_pct01 text COLLATE pg_catalog."default",
    gi_ovh_pct02 text COLLATE pg_catalog."default",
    gi_ovh_pct03 text COLLATE pg_catalog."default",
    gi_ovh_pct04 text COLLATE pg_catalog."default",
    gi_ovh_pct05 text COLLATE pg_catalog."default",
    is_manuf text COLLATE pg_catalog."default",
    alw_algn_pct text COLLATE pg_catalog."default",
    mfg_chg_rt text COLLATE pg_catalog."default",
    mn_prd_cnt_cd text COLLATE pg_catalog."default",
    is_sold text COLLATE pg_catalog."default",
    is_key_prod text COLLATE pg_catalog."default",
    is_exported text COLLATE pg_catalog."default",
    sl_prd_type text COLLATE pg_catalog."default",
    sl_div_cd text COLLATE pg_catalog."default",
    pg_cd text COLLATE pg_catalog."default",
    pg_conv_fact text COLLATE pg_catalog."default",
    vend_part_no text COLLATE pg_catalog."default",
    pckng_rate text COLLATE pg_catalog."default",
    spore text COLLATE pg_catalog."default",
    item_specs text COLLATE pg_catalog."default",
    mn_item_cd text COLLATE pg_catalog."default",
    ex_trf_no text COLLATE pg_catalog."default",
    ex_tf_cnv_fct text COLLATE pg_catalog."default",
    vat_cm_cd text COLLATE pg_catalog."default",
    cs_trf_no text COLLATE pg_catalog."default",
    old_code text COLLATE pg_catalog."default",
    std_wt_kgs text COLLATE pg_catalog."default",
    std_c_cfact text COLLATE pg_catalog."default",
    std_p_cfact text COLLATE pg_catalog."default",
    test_chg_amt text COLLATE pg_catalog."default",
    margin text COLLATE pg_catalog."default",
    ord_ind text COLLATE pg_catalog."default",
    exc_pln_pct text COLLATE pg_catalog."default",
    re_ord_lvl text COLLATE pg_catalog."default",
    min_stk_qty text COLLATE pg_catalog."default",
    max_stk_qty text COLLATE pg_catalog."default",
    min_bl_slf_dy text COLLATE pg_catalog."default",
    alw_vat_rbt text COLLATE pg_catalog."default",
    max_pur_rt text COLLATE pg_catalog."default",
    stop_proc_mt text COLLATE pg_catalog."default",
    is_pck_sz_app text COLLATE pg_catalog."default",
    pack_size double precision,
    min_sl_rt text COLLATE pg_catalog."default",
    min_so_qty text COLLATE pg_catalog."default",
    units_in_pck text COLLATE pg_catalog."default",
    unit_uom text COLLATE pg_catalog."default",
    qty_box text COLLATE pg_catalog."default",
    box_case text COLLATE pg_catalog."default",
    pckg_type text COLLATE pg_catalog."default",
    qty_case text COLLATE pg_catalog."default",
    case_net_wt text COLLATE pg_catalog."default",
    case_tare_wt text COLLATE pg_catalog."default",
    case_grss_wt text COLLATE pg_catalog."default",
    unit_grss_wt text COLLATE pg_catalog."default",
    case_dim_in text COLLATE pg_catalog."default",
    case_vol_cft text COLLATE pg_catalog."default",
    case_dim_cms double precision,
    case_vol_cbm text COLLATE pg_catalog."default",
    min_bt_ld_qty text COLLATE pg_catalog."default",
    nw_prd_tl_dt text COLLATE pg_catalog."default",
    item_intf_cd text COLLATE pg_catalog."default",
    gtin_no double precision,
    sgtin_no double precision,
    pgtin_no double precision,
    item_desc text COLLATE pg_catalog."default",
    exp_pg_cd double precision,
    depb_rl_no text COLLATE pg_catalog."default",
    depb_rt text COLLATE pg_catalog."default",
    depb_vl_cap text COLLATE pg_catalog."default",
    depb_rmrk text COLLATE pg_catalog."default",
    dbk_srl_no text COLLATE pg_catalog."default",
    dbk_rt_type text COLLATE pg_catalog."default",
    dbk_rt text COLLATE pg_catalog."default",
    dbk_unit text COLLATE pg_catalog."default",
    dbk_vl_cap text COLLATE pg_catalog."default",
    dbk_rmrk text COLLATE pg_catalog."default",
    abc_ind text COLLATE pg_catalog."default",
    xyz_ind text COLLATE pg_catalog."default",
    fsn_ind text COLLATE pg_catalog."default",
    ved_ind text COLLATE pg_catalog."default",
    ext_info text COLLATE pg_catalog."default",
    doc_img_des text COLLATE pg_catalog."default",
    item_notes text COLLATE pg_catalog."default",
    pckng_rm_rt text COLLATE pg_catalog."default",
    is_rec_clsd text COLLATE pg_catalog."default",
    mst_upd_by text COLLATE pg_catalog."default",
    mst_upd_dt_tm text COLLATE pg_catalog."default",
    is_stk_item text COLLATE pg_catalog."default",
    gsm text COLLATE pg_catalog."default",
    colour text COLLATE pg_catalog."default",
    size text COLLATE pg_catalog."default",
    inner_dia text COLLATE pg_catalog."default",
    outer_dia text COLLATE pg_catalog."default",
    area text COLLATE pg_catalog."default",
    cluster text COLLATE pg_catalog."default",
    width text COLLATE pg_catalog."default",
    thickness text COLLATE pg_catalog."default",
    is_print_req text COLLATE pg_catalog."default",
    is_embos_req text COLLATE pg_catalog."default",
    rej_pct text COLLATE pg_catalog."default",
    item_cat text COLLATE pg_catalog."default",
    is_rpu_item text COLLATE pg_catalog."default",
    pigment_tp text COLLATE pg_catalog."default",
    pigment_cd text COLLATE pg_catalog."default",
    is_adj_req text COLLATE pg_catalog."default",
    is_splt_req text COLLATE pg_catalog."default",
    pst_type_ind text COLLATE pg_catalog."default",
    df_pck_mch_cd text COLLATE pg_catalog."default",
    df_dye_no text COLLATE pg_catalog."default",
    i_ovh_pct01 text COLLATE pg_catalog."default",
    i_ovh_pct02 text COLLATE pg_catalog."default",
    i_ovh_pct03 text COLLATE pg_catalog."default",
    i_ovh_pct04 text COLLATE pg_catalog."default",
    i_ovh_pct05 text COLLATE pg_catalog."default",
    i_ovh_pct06 text COLLATE pg_catalog."default",
    i_ovh_pct07 text COLLATE pg_catalog."default",
    i_ovh_pct08 text COLLATE pg_catalog."default",
    i_ovh_pct09 text COLLATE pg_catalog."default",
    rdbts text COLLATE pg_catalog."default",
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT import_item_master_pkey PRIMARY KEY (id)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.import_item_master
    OWNER to postgres;

-- Table: public.export_item_master

-- DROP TABLE IF EXISTS public.export_item_master;

CREATE TABLE IF NOT EXISTS public.export_item_master
(
    item_cd text COLLATE pg_catalog."default",
    item_name text COLLATE pg_catalog."default",
    short_name text COLLATE pg_catalog."default",
    pharmacp_nm text COLLATE pg_catalog."default",
    item_tp_cd text COLLATE pg_catalog."default",
    it_sub_tp_cd text COLLATE pg_catalog."default",
    uom_cd text COLLATE pg_catalog."default",
    iss_uom_cd text COLLATE pg_catalog."default",
    conv_fact text COLLATE pg_catalog."default",
    item_crt_dt text COLLATE pg_catalog."default",
    gs_ind text COLLATE pg_catalog."default",
    hsn_sac_cd double precision,
    drawing_no text COLLATE pg_catalog."default",
    std_assay text COLLATE pg_catalog."default",
    lead_time text COLLATE pg_catalog."default",
    std_lod text COLLATE pg_catalog."default",
    sh_lf_mth text COLLATE pg_catalog."default",
    shelf_life text COLLATE pg_catalog."default",
    stnd_rate double precision,
    safety_stk text COLLATE pg_catalog."default",
    is_btch_na text COLLATE pg_catalog."default",
    is_pck_frt_sv text COLLATE pg_catalog."default",
    is_qc_reqd text COLLATE pg_catalog."default",
    is_act_ing text COLLATE pg_catalog."default",
    is_allrgn text COLLATE pg_catalog."default",
    is_mnf_reqd text COLLATE pg_catalog."default",
    is_mnf_date text COLLATE pg_catalog."default",
    is_mnf_mmyy text COLLATE pg_catalog."default",
    is_exp_dt_app text COLLATE pg_catalog."default",
    is_exp_my_app text COLLATE pg_catalog."default",
    is_trk_srl text COLLATE pg_catalog."default",
    is_pncp_item text COLLATE pg_catalog."default",
    is_bought text COLLATE pg_catalog."default",
    is_imported text COLLATE pg_catalog."default",
    is_job_work text COLLATE pg_catalog."default",
    eco_ord_qty text COLLATE pg_catalog."default",
    des_pck_size text COLLATE pg_catalog."default",
    is_vat_crd text COLLATE pg_catalog."default",
    vat_rbt_pct text COLLATE pg_catalog."default",
    cur_buy_id text COLLATE pg_catalog."default",
    frt_on_ind text COLLATE pg_catalog."default",
    gi_ovh_pct01 text COLLATE pg_catalog."default",
    gi_ovh_pct02 text COLLATE pg_catalog."default",
    gi_ovh_pct03 text COLLATE pg_catalog."default",
    gi_ovh_pct04 text COLLATE pg_catalog."default",
    gi_ovh_pct05 text COLLATE pg_catalog."default",
    is_manuf text COLLATE pg_catalog."default",
    alw_algn_pct text COLLATE pg_catalog."default",
    mfg_chg_rt text COLLATE pg_catalog."default",
    mn_prd_cnt_cd text COLLATE pg_catalog."default",
    is_sold text COLLATE pg_catalog."default",
    is_key_prod text COLLATE pg_catalog."default",
    is_exported text COLLATE pg_catalog."default",
    sl_prd_type text COLLATE pg_catalog."default",
    sl_div_cd text COLLATE pg_catalog."default",
    pg_cd text COLLATE pg_catalog."default",
    pg_conv_fact text COLLATE pg_catalog."default",
    vend_part_no text COLLATE pg_catalog."default",
    pckng_rate text COLLATE pg_catalog."default",
    spore text COLLATE pg_catalog."default",
    item_specs text COLLATE pg_catalog."default",
    mn_item_cd text COLLATE pg_catalog."default",
    ex_trf_no text COLLATE pg_catalog."default",
    ex_tf_cnv_fct text COLLATE pg_catalog."default",
    vat_cm_cd text COLLATE pg_catalog."default",
    cs_trf_no text COLLATE pg_catalog."default",
    old_code text COLLATE pg_catalog."default",
    std_wt_kgs text COLLATE pg_catalog."default",
    std_c_cfact text COLLATE pg_catalog."default",
    std_p_cfact text COLLATE pg_catalog."default",
    test_chg_amt text COLLATE pg_catalog."default",
    margin text COLLATE pg_catalog."default",
    ord_ind text COLLATE pg_catalog."default",
    exc_pln_pct text COLLATE pg_catalog."default",
    re_ord_lvl text COLLATE pg_catalog."default",
    min_stk_qty text COLLATE pg_catalog."default",
    max_stk_qty text COLLATE pg_catalog."default",
    min_bl_slf_dy text COLLATE pg_catalog."default",
    alw_vat_rbt text COLLATE pg_catalog."default",
    max_pur_rt text COLLATE pg_catalog."default",
    stop_proc_mt text COLLATE pg_catalog."default",
    is_pck_sz_app text COLLATE pg_catalog."default",
    pack_size double precision,
    min_sl_rt text COLLATE pg_catalog."default",
    min_so_qty text COLLATE pg_catalog."default",
    units_in_pck text COLLATE pg_catalog."default",
    unit_uom text COLLATE pg_catalog."default",
    qty_box text COLLATE pg_catalog."default",
    box_case text COLLATE pg_catalog."default",
    pckg_type text COLLATE pg_catalog."default",
    qty_case text COLLATE pg_catalog."default",
    case_net_wt text COLLATE pg_catalog."default",
    case_tare_wt text COLLATE pg_catalog."default",
    case_grss_wt text COLLATE pg_catalog."default",
    unit_grss_wt text COLLATE pg_catalog."default",
    case_dim_in text COLLATE pg_catalog."default",
    case_vol_cft text COLLATE pg_catalog."default",
    case_dim_cms double precision,
    case_vol_cbm text COLLATE pg_catalog."default",
    min_bt_ld_qty text COLLATE pg_catalog."default",
    nw_prd_tl_dt text COLLATE pg_catalog."default",
    item_intf_cd text COLLATE pg_catalog."default",
    gtin_no double precision,
    sgtin_no double precision,
    pgtin_no double precision,
    item_desc text COLLATE pg_catalog."default",
    exp_pg_cd double precision,
    depb_rl_no text COLLATE pg_catalog."default",
    depb_rt text COLLATE pg_catalog."default",
    depb_vl_cap text COLLATE pg_catalog."default",
    depb_rmrk text COLLATE pg_catalog."default",
    dbk_srl_no text COLLATE pg_catalog."default",
    dbk_rt_type text COLLATE pg_catalog."default",
    dbk_rt text COLLATE pg_catalog."default",
    dbk_unit text COLLATE pg_catalog."default",
    dbk_vl_cap text COLLATE pg_catalog."default",
    dbk_rmrk text COLLATE pg_catalog."default",
    abc_ind text COLLATE pg_catalog."default",
    xyz_ind text COLLATE pg_catalog."default",
    fsn_ind text COLLATE pg_catalog."default",
    ved_ind text COLLATE pg_catalog."default",
    ext_info text COLLATE pg_catalog."default",
    doc_img_des text COLLATE pg_catalog."default",
    item_notes text COLLATE pg_catalog."default",
    pckng_rm_rt text COLLATE pg_catalog."default",
    is_rec_clsd text COLLATE pg_catalog."default",
    mst_upd_by text COLLATE pg_catalog."default",
    mst_upd_dt_tm text COLLATE pg_catalog."default",
    is_stk_item text COLLATE pg_catalog."default",
    gsm text COLLATE pg_catalog."default",
    colour text COLLATE pg_catalog."default",
    size text COLLATE pg_catalog."default",
    inner_dia text COLLATE pg_catalog."default",
    outer_dia text COLLATE pg_catalog."default",
    area text COLLATE pg_catalog."default",
    cluster text COLLATE pg_catalog."default",
    width text COLLATE pg_catalog."default",
    thickness text COLLATE pg_catalog."default",
    is_print_req text COLLATE pg_catalog."default",
    is_embos_req text COLLATE pg_catalog."default",
    rej_pct text COLLATE pg_catalog."default",
    item_cat text COLLATE pg_catalog."default",
    is_rpu_item text COLLATE pg_catalog."default",
    pigment_tp text COLLATE pg_catalog."default",
    pigment_cd text COLLATE pg_catalog."default",
    is_adj_req text COLLATE pg_catalog."default",
    is_splt_req text COLLATE pg_catalog."default",
    pst_type_ind text COLLATE pg_catalog."default",
    df_pck_mch_cd text COLLATE pg_catalog."default",
    df_dye_no text COLLATE pg_catalog."default",
    i_ovh_pct01 text COLLATE pg_catalog."default",
    i_ovh_pct02 text COLLATE pg_catalog."default",
    i_ovh_pct03 text COLLATE pg_catalog."default",
    i_ovh_pct04 text COLLATE pg_catalog."default",
    i_ovh_pct05 text COLLATE pg_catalog."default",
    i_ovh_pct06 text COLLATE pg_catalog."default",
    i_ovh_pct07 text COLLATE pg_catalog."default",
    i_ovh_pct08 text COLLATE pg_catalog."default",
    i_ovh_pct09 text COLLATE pg_catalog."default",
    rdbts text COLLATE pg_catalog."default",
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT export_item_master_pkey PRIMARY KEY (id)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.export_item_master
    OWNER to postgres;

-- Table: public.import_port

-- DROP TABLE IF EXISTS public.import_port;

CREATE TABLE IF NOT EXISTS public.import_port
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    port_code character varying(255) COLLATE pg_catalog."default",
    indian_port character varying(255) COLLATE pg_catalog."default",
    foreign_port character varying(255) COLLATE pg_catalog."default",
    mode character varying(50) COLLATE pg_catalog."default",
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT (now() AT TIME ZONE 'UTC'::text),
    updated_at timestamp without time zone DEFAULT (now() AT TIME ZONE 'UTC'::text),
    CONSTRAINT import_ports_pkey PRIMARY KEY (id),
    CONSTRAINT import_ports_port_code_key UNIQUE (port_code)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.import_port
    OWNER to postgres;

-- Table: public.export_port

-- DROP TABLE IF EXISTS public.export_port;

CREATE TABLE IF NOT EXISTS public.export_port
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    port_code character varying(255) COLLATE pg_catalog."default",
    indian_port character varying(255) COLLATE pg_catalog."default",
    foreign_port character varying(255) COLLATE pg_catalog."default",
    mode character varying(50) COLLATE pg_catalog."default",
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT (now() AT TIME ZONE 'UTC'::text),
    updated_at timestamp without time zone DEFAULT (now() AT TIME ZONE 'UTC'::text),
    CONSTRAINT export_ports_pkey PRIMARY KEY (id),
    CONSTRAINT export_ports_port_code_key UNIQUE (port_code)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.export_port
    OWNER to postgres;

-- Indexes for import_item_master
CREATE INDEX IF NOT EXISTS idx_import_item_master_desc_trgm
    ON public.import_item_master USING gin
    (item_desc COLLATE pg_catalog."default" gin_trgm_ops)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_import_item_master_name_trgm
    ON public.import_item_master USING gin
    (item_name COLLATE pg_catalog."default" gin_trgm_ops)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_import_item_master_pharmacpnm_trgm
    ON public.import_item_master USING gin
    (pharmacp_nm COLLATE pg_catalog."default" gin_trgm_ops)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_import_item_master_shortname_trgm
    ON public.import_item_master USING gin
    (short_name COLLATE pg_catalog."default" gin_trgm_ops)
    TABLESPACE pg_default;

-- Indexes for export_item_master
CREATE INDEX IF NOT EXISTS idx_export_item_master_desc_trgm
    ON public.export_item_master USING gin
    (item_desc COLLATE pg_catalog."default" gin_trgm_ops)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_export_item_master_name_trgm
    ON public.export_item_master USING gin
    (item_name COLLATE pg_catalog."default" gin_trgm_ops)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_export_item_master_pharmacpnm_trgm
    ON public.export_item_master USING gin
    (pharmacp_nm COLLATE pg_catalog."default" gin_trgm_ops)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_export_item_master_shortname_trgm
    ON public.export_item_master USING gin
    (short_name COLLATE pg_catalog."default" gin_trgm_ops)
    TABLESPACE pg_default;

-- Triggers for import_item_master
CREATE OR REPLACE TRIGGER set_uuid_before_insert_import
    BEFORE INSERT
    ON public.import_item_master
    FOR EACH ROW
    WHEN (new.id IS NULL)
    EXECUTE FUNCTION public.trigger_set_uuid();

-- Triggers for export_item_master
CREATE OR REPLACE TRIGGER set_uuid_before_insert_export
    BEFORE INSERT
    ON public.export_item_master
    FOR EACH ROW
    WHEN (new.id IS NULL)
    EXECUTE FUNCTION public.trigger_set_uuid();

    -- Table: public.erp_currencies

CREATE TABLE IF NOT EXISTS public.erp_currencies
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    currency_code character varying(10) COLLATE pg_catalog."default",
    exchange_usd numeric(18,6),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT (now() AT TIME ZONE 'UTC'::text),
    updated_at timestamp without time zone DEFAULT (now() AT TIME ZONE 'UTC'::text),
    CONSTRAINT currencies_pmkey PRIMARY KEY (id),
    CONSTRAINT currencies_currency_code_ukey UNIQUE (currency_code)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.erp_currencies
    OWNER to postgres;

-- Table: public.erp_customer_master

CREATE TABLE IF NOT EXISTS public.erp_customer_master
(
    loc_cd text COLLATE pg_catalog."default",
    cust_no text COLLATE pg_catalog."default",
    cust_cd text COLLATE pg_catalog."default",
    cust_crt_dt text COLLATE pg_catalog."default",
    stop_inv text COLLATE pg_catalog."default",
    cust_name text COLLATE pg_catalog."default",
    short_name text COLLATE pg_catalog."default",
    payee_name text COLLATE pg_catalog."default",
    cust_tp_cd text COLLATE pg_catalog."default",
    segm_cd text COLLATE pg_catalog."default",
    itax_pan_no text COLLATE pg_catalog."default",
    cust_sl_tp text COLLATE pg_catalog."default",
    export_type text COLLATE pg_catalog."default",
    gstin text COLLATE pg_catalog."default",
    add_line1 text COLLATE pg_catalog."default",
    add_line2 text COLLATE pg_catalog."default",
    add_line3 text COLLATE pg_catalog."default",
    city text COLLATE pg_catalog."default",
    zip_code text COLLATE pg_catalog."default",
    country text COLLATE pg_catalog."default",
    state_cd text COLLATE pg_catalog."default",
    gst_state_cd text COLLATE pg_catalog."default",
    contact text COLLATE pg_catalog."default",
    tel_no text COLLATE pg_catalog."default",
    mobile_no text COLLATE pg_catalog."default",
    fax_no text COLLATE pg_catalog."default",
    email_id text COLLATE pg_catalog."default",
    website text COLLATE pg_catalog."default",
    destn_cd text COLLATE pg_catalog."default",
    tr_md_cd text COLLATE pg_catalog."default",
    trnsp_cd text COLLATE pg_catalog."default",
    lead_days text COLLATE pg_catalog."default",
    cust_dist text COLLATE pg_catalog."default",
    frt_ind text COLLATE pg_catalog."default",
    bnk_ifsc_cd text COLLATE pg_catalog."default",
    bnk_ac_no text COLLATE pg_catalog."default",
    bnk_name text COLLATE pg_catalog."default",
    cust_bnkr text COLLATE pg_catalog."default",
    cust_vpa text COLLATE pg_catalog."default",
    bac_tp_cd text COLLATE pg_catalog."default",
    bnk_branch text COLLATE pg_catalog."default",
    bank_loc text COLLATE pg_catalog."default",
    cust_intf_cd double precision,
    intf_fl_frmt text COLLATE pg_catalog."default",
    proj_ratio text COLLATE pg_catalog."default",
    no_of_dsp text COLLATE pg_catalog."default",
    alw_cnsg_obk text COLLATE pg_catalog."default",
    lbl_lyt text COLLATE pg_catalog."default",
    no_of_copies text COLLATE pg_catalog."default",
    old_code text COLLATE pg_catalog."default",
    cust_lot_no text COLLATE pg_catalog."default",
    is_elg_tcs text COLLATE pg_catalog."default",
    tcs_type text COLLATE pg_catalog."default",
    is_apl_hgr_rt text COLLATE pg_catalog."default",
    is_dd_nn_res text COLLATE pg_catalog."default",
    is_dd_prm_est text COLLATE pg_catalog."default",
    drug_lic_no text COLLATE pg_catalog."default",
    dlic_exp_dt text COLLATE pg_catalog."default",
    oth_lic_no text COLLATE pg_catalog."default",
    is_bl_disc text COLLATE pg_catalog."default",
    is_rev_eoyr text COLLATE pg_catalog."default",
    sup_stk_loc text COLLATE pg_catalog."default",
    cac_cd text COLLATE pg_catalog."default",
    ccrd_limit text COLLATE pg_catalog."default",
    min_inv_amt text COLLATE pg_catalog."default",
    cschm_cd text COLLATE pg_catalog."default",
    cbroker_cd text COLLATE pg_catalog."default",
    cbroker_rt text COLLATE pg_catalog."default",
    ccash_disc text COLLATE pg_catalog."default",
    cmisc_chg_pc text COLLATE pg_catalog."default",
    cmisc_dis_pc text COLLATE pg_catalog."default",
    cvat_form_cd text COLLATE pg_catalog."default",
    ccen_form_cd text COLLATE pg_catalog."default",
    cap_spl_term text COLLATE pg_catalog."default",
    cpay_term_cd text COLLATE pg_catalog."default",
    cdocs_thru text COLLATE pg_catalog."default",
    ccrd_prd text COLLATE pg_catalog."default",
    cnw_pcrd_prd text COLLATE pg_catalog."default",
    cis_ov_du_chk text COLLATE pg_catalog."default",
    cno_of_bills text COLLATE pg_catalog."default",
    cos_bl_prd text COLLATE pg_catalog."default",
    cos_bl_ac_ind text COLLATE pg_catalog."default",
    ext_info text COLLATE pg_catalog."default",
    is_rec_clsd text COLLATE pg_catalog."default",
    mst_upd_by text COLLATE pg_catalog."default",
    mst_upd_dt_tm text COLLATE pg_catalog."default",
    tx_rev_no double precision,
    is_exp_cust text COLLATE pg_catalog."default",
    is_reg_dlr text COLLATE pg_catalog."default",
    rdbts text COLLATE pg_catalog."default",
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT customer_master_pmkey PRIMARY KEY (id)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.erp_customer_master
    OWNER to postgres;

-- Trigger: set_uuid_before_insert

CREATE OR REPLACE TRIGGER set_uuid_before_insert
    BEFORE INSERT
    ON public.erp_customer_master
    FOR EACH ROW
    WHEN (new.id IS NULL)
    EXECUTE FUNCTION public.trigger_set_uuid();

-- Table: public.erp_item_master

CREATE TABLE IF NOT EXISTS public.erp_item_master
(
    item_cd text COLLATE pg_catalog."default",
    item_name text COLLATE pg_catalog."default",
    short_name text COLLATE pg_catalog."default",
    pharmacp_nm text COLLATE pg_catalog."default",
    item_tp_cd text COLLATE pg_catalog."default",
    it_sub_tp_cd text COLLATE pg_catalog."default",
    uom_cd text COLLATE pg_catalog."default",
    iss_uom_cd text COLLATE pg_catalog."default",
    conv_fact text COLLATE pg_catalog."default",
    item_crt_dt text COLLATE pg_catalog."default",
    gs_ind text COLLATE pg_catalog."default",
    hsn_sac_cd double precision,
    drawing_no text COLLATE pg_catalog."default",
    std_assay text COLLATE pg_catalog."default",
    lead_time text COLLATE pg_catalog."default",
    std_lod text COLLATE pg_catalog."default",
    sh_lf_mth text COLLATE pg_catalog."default",
    shelf_life text COLLATE pg_catalog."default",
    stnd_rate double precision,
    safety_stk text COLLATE pg_catalog."default",
    is_btch_na text COLLATE pg_catalog."default",
    is_pck_frt_sv text COLLATE pg_catalog."default",
    is_qc_reqd text COLLATE pg_catalog."default",
    is_act_ing text COLLATE pg_catalog."default",
    is_allrgn text COLLATE pg_catalog."default",
    is_mnf_reqd text COLLATE pg_catalog."default",
    is_mnf_date text COLLATE pg_catalog."default",
    is_mnf_mmyy text COLLATE pg_catalog."default",
    is_exp_dt_app text COLLATE pg_catalog."default",
    is_exp_my_app text COLLATE pg_catalog."default",
    is_trk_srl text COLLATE pg_catalog."default",
    is_pncp_item text COLLATE pg_catalog."default",
    is_bought text COLLATE pg_catalog."default",
    is_imported text COLLATE pg_catalog."default",
    is_job_work text COLLATE pg_catalog."default",
    eco_ord_qty text COLLATE pg_catalog."default",
    des_pck_size text COLLATE pg_catalog."default",
    is_vat_crd text COLLATE pg_catalog."default",
    vat_rbt_pct text COLLATE pg_catalog."default",
    cur_buy_id text COLLATE pg_catalog."default",
    frt_on_ind text COLLATE pg_catalog."default",
    gi_ovh_pct01 text COLLATE pg_catalog."default",
    gi_ovh_pct02 text COLLATE pg_catalog."default",
    gi_ovh_pct03 text COLLATE pg_catalog."default",
    gi_ovh_pct04 text COLLATE pg_catalog."default",
    gi_ovh_pct05 text COLLATE pg_catalog."default",
    is_manuf text COLLATE pg_catalog."default",
    alw_algn_pct text COLLATE pg_catalog."default",
    mfg_chg_rt text COLLATE pg_catalog."default",
    mn_prd_cnt_cd text COLLATE pg_catalog."default",
    is_sold text COLLATE pg_catalog."default",
    is_key_prod text COLLATE pg_catalog."default",
    is_exported text COLLATE pg_catalog."default",
    sl_prd_type text COLLATE pg_catalog."default",
    sl_div_cd text COLLATE pg_catalog."default",
    pg_cd text COLLATE pg_catalog."default",
    pg_conv_fact text COLLATE pg_catalog."default",
    vend_part_no text COLLATE pg_catalog."default",
    pckng_rate text COLLATE pg_catalog."default",
    spore text COLLATE pg_catalog."default",
    item_specs text COLLATE pg_catalog."default",
    mn_item_cd text COLLATE pg_catalog."default",
    ex_trf_no text COLLATE pg_catalog."default",
    ex_tf_cnv_fct text COLLATE pg_catalog."default",
    vat_cm_cd text COLLATE pg_catalog."default",
    cs_trf_no text COLLATE pg_catalog."default",
    old_code text COLLATE pg_catalog."default",
    std_wt_kgs text COLLATE pg_catalog."default",
    std_c_cfact text COLLATE pg_catalog."default",
    std_p_cfact text COLLATE pg_catalog."default",
    test_chg_amt text COLLATE pg_catalog."default",
    margin text COLLATE pg_catalog."default",
    ord_ind text COLLATE pg_catalog."default",
    exc_pln_pct text COLLATE pg_catalog."default",
    re_ord_lvl text COLLATE pg_catalog."default",
    min_stk_qty text COLLATE pg_catalog."default",
    max_stk_qty text COLLATE pg_catalog."default",
    min_bl_slf_dy text COLLATE pg_catalog."default",
    alw_vat_rbt text COLLATE pg_catalog."default",
    max_pur_rt text COLLATE pg_catalog."default",
    stop_proc_mt text COLLATE pg_catalog."default",
    is_pck_sz_app text COLLATE pg_catalog."default",
    pack_size double precision,
    min_sl_rt text COLLATE pg_catalog."default",
    min_so_qty text COLLATE pg_catalog."default",
    units_in_pck text COLLATE pg_catalog."default",
    unit_uom text COLLATE pg_catalog."default",
    qty_box text COLLATE pg_catalog."default",
    box_case text COLLATE pg_catalog."default",
    pckg_type text COLLATE pg_catalog."default",
    qty_case text COLLATE pg_catalog."default",
    case_net_wt text COLLATE pg_catalog."default",
    case_tare_wt text COLLATE pg_catalog."default",
    case_grss_wt text COLLATE pg_catalog."default",
    unit_grss_wt text COLLATE pg_catalog."default",
    case_dim_in text COLLATE pg_catalog."default",
    case_vol_cft text COLLATE pg_catalog."default",
    case_dim_cms double precision,
    case_vol_cbm text COLLATE pg_catalog."default",
    min_bt_ld_qty text COLLATE pg_catalog."default",
    nw_prd_tl_dt text COLLATE pg_catalog."default",
    item_intf_cd text COLLATE pg_catalog."default",
    gtin_no double precision,
    sgtin_no double precision,
    pgtin_no double precision,
    item_desc text COLLATE pg_catalog."default",
    exp_pg_cd double precision,
    depb_rl_no text COLLATE pg_catalog."default",
    depb_rt text COLLATE pg_catalog."default",
    depb_vl_cap text COLLATE pg_catalog."default",
    depb_rmrk text COLLATE pg_catalog."default",
    dbk_srl_no text COLLATE pg_catalog."default",
    dbk_rt_type text COLLATE pg_catalog."default",
    dbk_rt text COLLATE pg_catalog."default",
    dbk_unit text COLLATE pg_catalog."default",
    dbk_vl_cap text COLLATE pg_catalog."default",
    dbk_rmrk text COLLATE pg_catalog."default",
    abc_ind text COLLATE pg_catalog."default",
    xyz_ind text COLLATE pg_catalog."default",
    fsn_ind text COLLATE pg_catalog."default",
    ved_ind text COLLATE pg_catalog."default",
    ext_info text COLLATE pg_catalog."default",
    doc_img_des text COLLATE pg_catalog."default",
    item_notes text COLLATE pg_catalog."default",
    pckng_rm_rt text COLLATE pg_catalog."default",
    is_rec_clsd text COLLATE pg_catalog."default",
    mst_upd_by text COLLATE pg_catalog."default",
    mst_upd_dt_tm text COLLATE pg_catalog."default",
    is_stk_item text COLLATE pg_catalog."default",
    gsm text COLLATE pg_catalog."default",
    colour text COLLATE pg_catalog."default",
    size text COLLATE pg_catalog."default",
    inner_dia text COLLATE pg_catalog."default",
    outer_dia text COLLATE pg_catalog."default",
    area text COLLATE pg_catalog."default",
    cluster text COLLATE pg_catalog."default",
    width text COLLATE pg_catalog."default",
    thickness text COLLATE pg_catalog."default",
    is_print_req text COLLATE pg_catalog."default",
    is_embos_req text COLLATE pg_catalog."default",
    rej_pct text COLLATE pg_catalog."default",
    item_cat text COLLATE pg_catalog."default",
    is_rpu_item text COLLATE pg_catalog."default",
    pigment_tp text COLLATE pg_catalog."default",
    pigment_cd text COLLATE pg_catalog."default",
    is_adj_req text COLLATE pg_catalog."default",
    is_splt_req text COLLATE pg_catalog."default",
    pst_type_ind text COLLATE pg_catalog."default",
    df_pck_mch_cd text COLLATE pg_catalog."default",
    df_dye_no text COLLATE pg_catalog."default",
    i_ovh_pct01 text COLLATE pg_catalog."default",
    i_ovh_pct02 text COLLATE pg_catalog."default",
    i_ovh_pct03 text COLLATE pg_catalog."default",
    i_ovh_pct04 text COLLATE pg_catalog."default",
    i_ovh_pct05 text COLLATE pg_catalog."default",
    i_ovh_pct06 text COLLATE pg_catalog."default",
    i_ovh_pct07 text COLLATE pg_catalog."default",
    i_ovh_pct08 text COLLATE pg_catalog."default",
    i_ovh_pct09 text COLLATE pg_catalog."default",
    rdbts text COLLATE pg_catalog."default",
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT item_master_pmkey PRIMARY KEY (id)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.erp_item_master
    OWNER to postgres;

-- Indexes for erp_item_master

CREATE INDEX IF NOT EXISTS idx_item_master_desc_trgm
    ON public.erp_item_master USING gin
    (item_desc COLLATE pg_catalog."default" gin_trgm_ops)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_item_master_name_trgm
    ON public.erp_item_master USING gin
    (item_name COLLATE pg_catalog."default" gin_trgm_ops)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_item_master_pharmacpnm_trgm
    ON public.erp_item_master USING gin
    (pharmacp_nm COLLATE pg_catalog."default" gin_trgm_ops)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_item_master_shortname_trgm
    ON public.erp_item_master USING gin
    (short_name COLLATE pg_catalog."default" gin_trgm_ops)
    TABLESPACE pg_default;

-- Trigger: set_uuid_before_insert

CREATE OR REPLACE TRIGGER set_uuid_before_insert
    BEFORE INSERT
    ON public.erp_item_master
    FOR EACH ROW
    WHEN (new.id IS NULL)
    EXECUTE FUNCTION public.trigger_set_uuid();

-- Table: public.erp_port

CREATE TABLE IF NOT EXISTS public.erp_port
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    port_code character varying(255) COLLATE pg_catalog."default",
    indian_port character varying(255) COLLATE pg_catalog."default",
    foreign_port character varying(255) COLLATE pg_catalog."default",
    mode character varying(50) COLLATE pg_catalog."default",
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT (now() AT TIME ZONE 'UTC'::text),
    updated_at timestamp without time zone DEFAULT (now() AT TIME ZONE 'UTC'::text),
    CONSTRAINT ports_pmkey PRIMARY KEY (id),
    CONSTRAINT ports_port_code_ukey UNIQUE (port_code)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.erp_port
    OWNER to postgres;

    DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'erp_customer_master' AND column_name = 'continent'
    ) THEN
        ALTER TABLE erp_customer_master ADD COLUMN continent TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'import_customer_master' AND column_name = 'continent'
    ) THEN
        ALTER TABLE import_customer_master ADD COLUMN continent TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'export_customer_master' AND column_name = 'continent'
    ) THEN
        ALTER TABLE export_customer_master ADD COLUMN continent TEXT;
    END IF;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    -- short_composition
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'erp_item_master' AND column_name = 'short_composition'
    ) THEN
        ALTER TABLE erp_item_master ADD COLUMN short_composition TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'import_item_master' AND column_name = 'short_composition'
    ) THEN
        ALTER TABLE import_item_master ADD COLUMN short_composition TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'export_item_master' AND column_name = 'short_composition'
    ) THEN
        ALTER TABLE export_item_master ADD COLUMN short_composition TEXT;
    END IF;

    -- long_composition
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'erp_item_master' AND column_name = 'long_composition'
    ) THEN
        ALTER TABLE erp_item_master ADD COLUMN long_composition TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'import_item_master' AND column_name = 'long_composition'
    ) THEN
        ALTER TABLE import_item_master ADD COLUMN long_composition TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'export_item_master' AND column_name = 'long_composition'
    ) THEN
        ALTER TABLE export_item_master ADD COLUMN long_composition TEXT;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Table: public.company

-- DROP TABLE IF EXISTS public.company;

CREATE TABLE IF NOT EXISTS public.company
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT company_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.company
    OWNER to postgres;

    -- Add product_type column to the item table if it does not exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'erp_item_master'
          AND column_name = 'product_type'
    ) THEN
        ALTER TABLE erp_item_master
        ADD COLUMN product_type VARCHAR(255);
    END IF;
END $$;

-- Create an index on product_type if it does not exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE tablename = 'erp_item_master'
          AND indexname = 'idx_product_type'
    ) THEN
        CREATE INDEX idx_product_type ON erp_item_master (product_type);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'export_item_master'
          AND column_name = 'product_type'
    ) THEN
        ALTER TABLE export_item_master
        ADD COLUMN product_type VARCHAR(255);
    END IF;
END $$;

-- Create an index on product_type if it does not exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE tablename = 'export_item_master'
          AND indexname = 'export_idx_product_type'
    ) THEN
        CREATE INDEX export_idx_product_type ON export_item_master (product_type);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'import_item_master'
          AND column_name = 'product_type'
    ) THEN
        ALTER TABLE import_item_master
        ADD COLUMN product_type VARCHAR(255);
    END IF;
END $$;

-- Create an index on product_type if it does not exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE tablename = 'import_item_master'
          AND indexname = 'import_idx_product_type'
    ) THEN
        CREATE INDEX import_idx_product_type ON import_item_master (product_type);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'erp_erpitem_master'
    ) THEN
        -- Only rename if the new table doesn't already exist
        ALTER TABLE public.erpitem_master
        RENAME TO erp_erpitem_master;
    END IF;
END$$;

-- Table: public.erp_erpitem_master

-- DROP TABLE IF EXISTS public.erp_erpitem_master;

CREATE TABLE IF NOT EXISTS public.import_erpitem_master
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    item_code character varying(20),
    item_name character varying(200),
    short_name character varying(100),
    pharmacopoeia_name character varying(200),
    item_type character varying(20),
    sub_type character varying(50),
    gs_ind character(1),
    goods character varying(50),
    hsn character varying(20),
    uqc character varying(20),
    unit_of_measure character varying(20),
    issuing_unit character varying(20),
    uom_conv_factor bigint,
    uqc_conv_factor bigint,
    created_on date,
    drawing_ref text,
    std_assay_strength bigint,
    shelf_life_months bigint,
    shelf_life_days bigint,
    std_rate bigint,
    lead_time_days bigint,
    std_loss_on_dry bigint,
    safety_stock bigint,
    is_batch_na boolean,
    is_qc_required boolean,
    is_allergen boolean,
    is_mfg_date_applicable boolean,
    is_expiry_date_applicable boolean,
    is_track_serial_no boolean,
    is_packing_freight_service boolean,
    is_active_ingredient boolean,
    is_mfg_location_required boolean,
    is_mfg_mm_yyyy_applicable boolean,
    is_expiry_mm_yyyy_applicable boolean,
    is_statutory_principal boolean,
    is_bought_out boolean,
    is_job_work boolean,
    is_imported boolean,
    is_tax_credit_applicable boolean,
    is_manufactured boolean,
    is_sold boolean,
    is_key_product boolean,
    is_exported boolean,
    current_buyer character varying(100),
    econ_order_qty bigint,
    desired_pack_size character varying(50),
    freight_on character varying(10),
    allowed_allergen_percent bigint,
    std_mfg_fees_per_unit bigint,
    main_prod_center character varying(100),
    product_type character varying(100),
    sales_division character varying(100),
    product_group character varying(100),
    conversion_factor bigint,
    vendor_part_no character varying(100),
    pack_short character varying(50),
    product_cast character varying(100),
    pvc_color character varying(50),
    color character varying(50),
    flavour character varying(50),
    fragrance character varying(50),
    form character varying(50),
    packaging_style character varying(100),
    change_part character varying(100),
    size character varying(50),
    with_leaflet boolean,
    with_applicator boolean,
    with_wad boolean,
    with_silica boolean,
    with_cotton boolean,
    with_measuring_cap boolean,
    with_spoon boolean,
    packing_np character varying(100),
    packing_np_qty bigint,
    packing_style_ptd character varying(100),
    packing_style_ptd_qty bigint,
    note_per_strip text,
    pack_short_ptd_spec character varying(100),
    pack_short_ptd_size character varying(100),
    pack_short_ptd_qty bigint,
    packing_style_np_size character varying(100),
    packing_style_np_qty bigint,
    note_for_ctn text,
    outer_size character varying(100),
    outer_qty bigint,
    shrink character varying(100),
    shrink_packing character varying(100),
    shipper_size character varying(100),
    shipper_qty bigint,
    shipper_note text,
    item_specification text,
    substitute_for_item character varying(100),
    custom_tariff_no character varying(50),
    excise_tariff_no character varying(50),
    vat_comm_code character varying(50),
    old_code character varying(50),
    standard_weight_kg bigint,
    std_conversion_cost_factor bigint,
    std_packing_cost_factor bigint,
    margin_percent bigint,
    testing_charges_amount bigint,
    updated_by character varying(100),
    updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT import_erpitems_master_pkey PRIMARY KEY (id)
)
TABLESPACE pg_default;

-- Change owner if table exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'import_erpitem_master') THEN
        ALTER TABLE public.import_erpitem_master OWNER TO postgres;
    END IF;
END$$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_import_item_code
    ON public.import_erpitem_master (item_code);

CREATE INDEX IF NOT EXISTS idx_import_item_name
    ON public.import_erpitem_master (item_name);

    -- Table: public.erp_erpitem_master

-- DROP TABLE IF EXISTS public.erp_erpitem_master;

CREATE TABLE IF NOT EXISTS public.export_erpitem_master
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    item_code character varying(20) COLLATE pg_catalog."default",
    item_name character varying(200) COLLATE pg_catalog."default",
    short_name character varying(100) COLLATE pg_catalog."default",
    pharmacopoeia_name character varying(200) COLLATE pg_catalog."default",
    item_type character varying(20) COLLATE pg_catalog."default",
    sub_type character varying(50) COLLATE pg_catalog."default",
    gs_ind character(1) COLLATE pg_catalog."default",
    goods character varying(50) COLLATE pg_catalog."default",
    hsn character varying(20) COLLATE pg_catalog."default",
    uqc character varying(20) COLLATE pg_catalog."default",
    unit_of_measure character varying(20) COLLATE pg_catalog."default",
    issuing_unit character varying(20) COLLATE pg_catalog."default",
    uom_conv_factor bigint,
    uqc_conv_factor bigint,
    created_on date,
    drawing_ref text COLLATE pg_catalog."default",
    std_assay_strength bigint,
    shelf_life_months bigint,
    shelf_life_days bigint,
    std_rate bigint,
    lead_time_days bigint,
    std_loss_on_dry bigint,
    safety_stock bigint,
    is_batch_na boolean,
    is_qc_required boolean,
    is_allergen boolean,
    is_mfg_date_applicable boolean,
    is_expiry_date_applicable boolean,
    is_track_serial_no boolean,
    is_packing_freight_service boolean,
    is_active_ingredient boolean,
    is_mfg_location_required boolean,
    is_mfg_mm_yyyy_applicable boolean,
    is_expiry_mm_yyyy_applicable boolean,
    is_statutory_principal boolean,
    is_bought_out boolean,
    is_job_work boolean,
    is_imported boolean,
    is_tax_credit_applicable boolean,
    is_manufactured boolean,
    is_sold boolean,
    is_key_product boolean,
    is_exported boolean,
    current_buyer character varying(100) COLLATE pg_catalog."default",
    econ_order_qty bigint,
    desired_pack_size character varying(50) COLLATE pg_catalog."default",
    freight_on character varying(10) COLLATE pg_catalog."default",
    allowed_allergen_percent bigint,
    std_mfg_fees_per_unit bigint,
    main_prod_center character varying(100) COLLATE pg_catalog."default",
    product_type character varying(100) COLLATE pg_catalog."default",
    sales_division character varying(100) COLLATE pg_catalog."default",
    product_group character varying(100) COLLATE pg_catalog."default",
    conversion_factor bigint,
    vendor_part_no character varying(100) COLLATE pg_catalog."default",
    pack_short character varying(50) COLLATE pg_catalog."default",
    product_cast character varying(100) COLLATE pg_catalog."default",
    pvc_color character varying(50) COLLATE pg_catalog."default",
    color character varying(50) COLLATE pg_catalog."default",
    flavour character varying(50) COLLATE pg_catalog."default",
    fragrance character varying(50) COLLATE pg_catalog."default",
    form character varying(50) COLLATE pg_catalog."default",
    packaging_style character varying(100) COLLATE pg_catalog."default",
    change_part character varying(100) COLLATE pg_catalog."default",
    size character varying(50) COLLATE pg_catalog."default",
    with_leaflet boolean,
    with_applicator boolean,
    with_wad boolean,
    with_silica boolean,
    with_cotton boolean,
    with_measuring_cap boolean,
    with_spoon boolean,
    packing_np character varying(100) COLLATE pg_catalog."default",
    packing_np_qty bigint,
    packing_style_ptd character varying(100) COLLATE pg_catalog."default",
    packing_style_ptd_qty bigint,
    note_per_strip text COLLATE pg_catalog."default",
    pack_short_ptd_spec character varying(100) COLLATE pg_catalog."default",
    pack_short_ptd_size character varying(100) COLLATE pg_catalog."default",
    pack_short_ptd_qty bigint,
    packing_style_np_size character varying(100) COLLATE pg_catalog."default",
    packing_style_np_qty bigint,
    note_for_ctn text COLLATE pg_catalog."default",
    outer_size character varying(100) COLLATE pg_catalog."default",
    outer_qty bigint,
    shrink character varying(100) COLLATE pg_catalog."default",
    shrink_packing character varying(100) COLLATE pg_catalog."default",
    shipper_size character varying(100) COLLATE pg_catalog."default",
    shipper_qty bigint,
    shipper_note text COLLATE pg_catalog."default",
    item_specification text COLLATE pg_catalog."default",
    substitute_for_item character varying(100) COLLATE pg_catalog."default",
    custom_tariff_no character varying(50) COLLATE pg_catalog."default",
    excise_tariff_no character varying(50) COLLATE pg_catalog."default",
    vat_comm_code character varying(50) COLLATE pg_catalog."default",
    old_code character varying(50) COLLATE pg_catalog."default",
    standard_weight_kg bigint,
    std_conversion_cost_factor bigint,
    std_packing_cost_factor bigint,
    margin_percent bigint,
    testing_charges_amount bigint,
    updated_by character varying(100) COLLATE pg_catalog."default",
    updated_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT export_erpitems_master_pkey PRIMARY KEY (id)
)
TABLESPACE pg_default;

-- Change owner if table exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'export_erpitem_master') THEN
        ALTER TABLE public.export_erpitem_master OWNER TO postgres;
    END IF;
END$$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_export_item_code
    ON public.export_erpitem_master (item_code);

CREATE INDEX IF NOT EXISTS idx_export_item_name
    ON public.export_erpitem_master (item_name);

    -- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.role
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name character varying(255) COLLATE pg_catalog."default",
    description character varying(500) COLLATE pg_catalog."default",
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT (now() AT TIME ZONE 'UTC'::text),
    updated_at timestamp without time zone DEFAULT (now() AT TIME ZONE 'UTC'::text),
    CONSTRAINT role_pkey PRIMARY KEY (id)
);

-- Add UNIQUE constraint on name if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'role_name_key'
    ) THEN
        ALTER TABLE public.role ADD CONSTRAINT role_name_key UNIQUE (name);
    END IF;
END$$;

-- Set the owner (optional if already set correctly)
ALTER TABLE IF EXISTS public.role OWNER TO postgres;

-- Create table if not exists
CREATE TABLE IF NOT EXISTS public."user"
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name character varying(255) COLLATE pg_catalog."default",
    username character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    first_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    last_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    role_id uuid NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT (now() AT TIME ZONE 'UTC'::text),
    updated_at timestamp without time zone DEFAULT (now() AT TIME ZONE 'UTC'::text),
    CONSTRAINT user_pkey PRIMARY KEY (id)
);

-- Add unique constraint on email if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'user_email_key'
    ) THEN
        ALTER TABLE public."user"
        ADD CONSTRAINT user_email_key UNIQUE (email);
    END IF;
END$$;

-- Add unique constraint on username if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'user_username_key'
    ) THEN
        ALTER TABLE public."user"
        ADD CONSTRAINT user_username_key UNIQUE (username);
    END IF;
END$$;

-- Add foreign key constraint on role_id if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_role'
    ) THEN
        ALTER TABLE public."user"
        ADD CONSTRAINT fk_user_role FOREIGN KEY (role_id)
            REFERENCES public.role (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE RESTRICT;
    END IF;
END$$;

-- Set owner (optional)
ALTER TABLE IF EXISTS public."user" OWNER TO postgres;
