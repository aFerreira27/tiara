// app/api/upload-csv/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import Papa from 'papaparse';

// Configure your PostgreSQL connection
const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DATABASE,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

interface CSVRow {
  [key: string]: string;
}

// Helper function to convert string to array (comma-separated values)
const stringToArray = (value: string | undefined): string[] | null => {
  if (!value || value.trim() === '') return null;
  return value.split(',').map(item => item.trim()).filter(item => item !== '');
};

// Helper function to convert string to boolean
const stringToBoolean = (value: string | undefined): boolean => {
  if (!value) return false;
  const lowerValue = value.toLowerCase().trim();
  return lowerValue === 'true' || lowerValue === '1' || lowerValue === 'yes';
};

// Helper function to convert string to number (with fallback)
const stringToNumber = (value: string | undefined, fallback: number = 0): number => {
  if (!value || value.trim() === '') return fallback;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('csvFile') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // Read file content
    const fileContent = await file.text();

    // Parse CSV with headers
    const parseResult = Papa.parse<CSVRow>(fileContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
    });

    if (parseResult.errors.length > 0) {
      return NextResponse.json({ 
        message: 'CSV parsing error', 
        errors: parseResult.errors 
      }, { status: 400 });
    }

    const data = parseResult.data;
    if (data.length === 0) {
      return NextResponse.json({ message: 'No data found in CSV' }, { status: 400 });
    }

    // Get database client
    const client = await pool.connect();
    let recordsProcessed = 0;

    try {
      await client.query('BEGIN');

      // SQL query for inserting/updating products - adjust table name as needed
      const insertQuery = `
        INSERT INTO products (
          sku, family, products_available_to_serve, shipping_dimensions, case_dimensions_in,
          product_length_in, product_weight_lbs, list_price, map_price, upc, hts_code,
          flow_rate_gpm, pallet_quantity, case_quantity, case_price, case_weight_lbs,
          number_of_taps, glycol_lines, ice_capacity_lbs, btuhr_k, interior_diameter_in,
          shipping_weight_lbs, working_height_in, trunk_line_length_in, height_of_ceiling_in,
          diameter_in, caster_quantity, mug_capacity, wheel_diameter_in, spray_head_flow_rate_gpm,
          hose_length_in, hose_length_ft, gallon_capacity, beverage_line_diameter_in,
          chase_diameter_in, glycol_line_diameter_in, hertz_hz, massachusetts_listed_certification,
          cec_listed_certification, ada_compliance, freight_class, country_of_origin,
          production_code, product_status, compressor_location, top_finish_options,
          cold_plate, handle_type, spout_style, brakes, inlet, bottle_capacity,
          refrigerant, spout_size_in, thread, pumps, gas_system_compatibility,
          wrap_style, restock_fee, din_cables, spray_head_pattern, type, heat_recovery,
          stream_type, cabinet_side_finish, front_finish, division, visibility,
          nsf_certification, csa_certification, ul_certification, etl_certification,
          asse_certification, iampo_certification, series, warranty, doordrawer_finish_options,
          mounting_style, tower_style, underbar_structure_options, bowl_location,
          centers, doordrawer_style, drain_size, outlet, beverage_compatibility_options,
          tower_location, tower_finish, hp, tower_mounting, ice_bin_location,
          power_source, voltage, drain_location, psi_range, valve_type, plug_type,
          collaboration, product_height_in, features, product_description, erp_description,
          materials, finish, product_depth_in, operating_range, raises_equipment,
          temperature_range, aq_description, design_upgrades, faqs, issuessolutions,
          upsell_items, parent_products, parts_and_accessories, beverage_lines,
          images, videos, spec_sheet, manuals, sell_sheet, brochure, backsplash_height_in,
          bowl_size_in, perforated_inserts, related_products, includes, amps,
          compressor_size_in, phase, partsbykrowne, load_capacity_lbs_per_caster,
          plate_size_in, caster_overall_height_in, keg_capacity, product_weight,
          drain_outlet, product_width_in, california_prop_warning, website_link,
          product_height_without_legs_in, internal_only_product, coo, tags
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
          $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38,
          $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56,
          $57, $58, $59, $60, $61, $62, $63, $64, $65, $66, $67, $68, $69, $70, $71, $72, $73, $74,
          $75, $76, $77, $78, $79, $80, $81, $82, $83, $84, $85, $86, $87, $88, $89, $90, $91, $92,
          $93, $94, $95, $96, $97, $98, $99, $100, $101, $102, $103, $104, $105, $106, $107, $108,
          $109, $110, $111, $112, $113, $114, $115, $116, $117, $118, $119, $120, $121, $122, $123,
          $124, $125, $126, $127, $128, $129, $130, $131, $132, $133, $134, $135, $136, $137, $138,
          $139, $140, $141, $142, $143, $144, $145, $146, $147, $148, $149, $150, $151, $152, $153
        )
        ON CONFLICT (sku) DO UPDATE SET
          family = EXCLUDED.family,
          products_available_to_serve = EXCLUDED.products_available_to_serve,
          shipping_dimensions = EXCLUDED.shipping_dimensions,
          case_dimensions_in = EXCLUDED.case_dimensions_in,
          product_length_in = EXCLUDED.product_length_in,
          product_weight_lbs = EXCLUDED.product_weight_lbs,
          list_price = EXCLUDED.list_price,
          map_price = EXCLUDED.map_price,
          upc = EXCLUDED.upc,
          hts_code = EXCLUDED.hts_code,
          flow_rate_gpm = EXCLUDED.flow_rate_gpm,
          pallet_quantity = EXCLUDED.pallet_quantity,
          case_quantity = EXCLUDED.case_quantity,
          case_price = EXCLUDED.case_price,
          case_weight_lbs = EXCLUDED.case_weight_lbs,
          number_of_taps = EXCLUDED.number_of_taps,
          glycol_lines = EXCLUDED.glycol_lines,
          ice_capacity_lbs = EXCLUDED.ice_capacity_lbs,
          btuhr_k = EXCLUDED.btuhr_k,
          interior_diameter_in = EXCLUDED.interior_diameter_in,
          shipping_weight_lbs = EXCLUDED.shipping_weight_lbs,
          working_height_in = EXCLUDED.working_height_in,
          trunk_line_length_in = EXCLUDED.trunk_line_length_in,
          height_of_ceiling_in = EXCLUDED.height_of_ceiling_in,
          diameter_in = EXCLUDED.diameter_in,
          caster_quantity = EXCLUDED.caster_quantity,
          mug_capacity = EXCLUDED.mug_capacity,
          wheel_diameter_in = EXCLUDED.wheel_diameter_in,
          spray_head_flow_rate_gpm = EXCLUDED.spray_head_flow_rate_gpm,
          hose_length_in = EXCLUDED.hose_length_in,
          hose_length_ft = EXCLUDED.hose_length_ft,
          gallon_capacity = EXCLUDED.gallon_capacity,
          beverage_line_diameter_in = EXCLUDED.beverage_line_diameter_in,
          chase_diameter_in = EXCLUDED.chase_diameter_in,
          glycol_line_diameter_in = EXCLUDED.glycol_line_diameter_in,
          hertz_hz = EXCLUDED.hertz_hz,
          massachusetts_listed_certification = EXCLUDED.massachusetts_listed_certification,
          cec_listed_certification = EXCLUDED.cec_listed_certification,
          ada_compliance = EXCLUDED.ada_compliance,
          freight_class = EXCLUDED.freight_class,
          country_of_origin = EXCLUDED.country_of_origin,
          production_code = EXCLUDED.production_code,
          product_status = EXCLUDED.product_status,
          compressor_location = EXCLUDED.compressor_location,
          top_finish_options = EXCLUDED.top_finish_options,
          cold_plate = EXCLUDED.cold_plate,
          handle_type = EXCLUDED.handle_type,
          spout_style = EXCLUDED.spout_style,
          brakes = EXCLUDED.brakes,
          inlet = EXCLUDED.inlet,
          bottle_capacity = EXCLUDED.bottle_capacity,
          refrigerant = EXCLUDED.refrigerant,
          spout_size_in = EXCLUDED.spout_size_in,
          thread = EXCLUDED.thread,
          pumps = EXCLUDED.pumps,
          gas_system_compatibility = EXCLUDED.gas_system_compatibility,
          wrap_style = EXCLUDED.wrap_style,
          restock_fee = EXCLUDED.restock_fee,
          din_cables = EXCLUDED.din_cables,
          spray_head_pattern = EXCLUDED.spray_head_pattern,
          type = EXCLUDED.type,
          heat_recovery = EXCLUDED.heat_recovery,
          stream_type = EXCLUDED.stream_type,
          cabinet_side_finish = EXCLUDED.cabinet_side_finish,
          front_finish = EXCLUDED.front_finish,
          division = EXCLUDED.division,
          visibility = EXCLUDED.visibility,
          nsf_certification = EXCLUDED.nsf_certification,
          csa_certification = EXCLUDED.csa_certification,
          ul_certification = EXCLUDED.ul_certification,
          etl_certification = EXCLUDED.etl_certification,
          asse_certification = EXCLUDED.asse_certification,
          iampo_certification = EXCLUDED.iampo_certification,
          series = EXCLUDED.series,
          warranty = EXCLUDED.warranty,
          doordrawer_finish_options = EXCLUDED.doordrawer_finish_options,
          mounting_style = EXCLUDED.mounting_style,
          tower_style = EXCLUDED.tower_style,
          underbar_structure_options = EXCLUDED.underbar_structure_options,
          bowl_location = EXCLUDED.bowl_location,
          centers = EXCLUDED.centers,
          doordrawer_style = EXCLUDED.doordrawer_style,
          drain_size = EXCLUDED.drain_size,
          outlet = EXCLUDED.outlet,
          beverage_compatibility_options = EXCLUDED.beverage_compatibility_options,
          tower_location = EXCLUDED.tower_location,
          tower_finish = EXCLUDED.tower_finish,
          hp = EXCLUDED.hp,
          tower_mounting = EXCLUDED.tower_mounting,
          ice_bin_location = EXCLUDED.ice_bin_location,
          power_source = EXCLUDED.power_source,
          voltage = EXCLUDED.voltage,
          drain_location = EXCLUDED.drain_location,
          psi_range = EXCLUDED.psi_range,
          valve_type = EXCLUDED.valve_type,
          plug_type = EXCLUDED.plug_type,
          collaboration = EXCLUDED.collaboration,
          product_height_in = EXCLUDED.product_height_in,
          features = EXCLUDED.features,
          product_description = EXCLUDED.product_description,
          erp_description = EXCLUDED.erp_description,
          materials = EXCLUDED.materials,
          finish = EXCLUDED.finish,
          product_depth_in = EXCLUDED.product_depth_in,
          operating_range = EXCLUDED.operating_range,
          raises_equipment = EXCLUDED.raises_equipment,
          temperature_range = EXCLUDED.temperature_range,
          aq_description = EXCLUDED.aq_description,
          design_upgrades = EXCLUDED.design_upgrades,
          faqs = EXCLUDED.faqs,
          issuessolutions = EXCLUDED.issuessolutions,
          upsell_items = EXCLUDED.upsell_items,
          parent_products = EXCLUDED.parent_products,
          parts_and_accessories = EXCLUDED.parts_and_accessories,
          beverage_lines = EXCLUDED.beverage_lines,
          images = EXCLUDED.images,
          videos = EXCLUDED.videos,
          spec_sheet = EXCLUDED.spec_sheet,
          manuals = EXCLUDED.manuals,
          sell_sheet = EXCLUDED.sell_sheet,
          brochure = EXCLUDED.brochure,
          backsplash_height_in = EXCLUDED.backsplash_height_in,
          bowl_size_in = EXCLUDED.bowl_size_in,
          perforated_inserts = EXCLUDED.perforated_inserts,
          related_products = EXCLUDED.related_products,
          includes = EXCLUDED.includes,
          amps = EXCLUDED.amps,
          compressor_size_in = EXCLUDED.compressor_size_in,
          phase = EXCLUDED.phase,
          partsbykrowne = EXCLUDED.partsbykrowne,
          load_capacity_lbs_per_caster = EXCLUDED.load_capacity_lbs_per_caster,
          plate_size_in = EXCLUDED.plate_size_in,
          caster_overall_height_in = EXCLUDED.caster_overall_height_in,
          keg_capacity = EXCLUDED.keg_capacity,
          product_weight = EXCLUDED.product_weight,
          drain_outlet = EXCLUDED.drain_outlet,
          product_width_in = EXCLUDED.product_width_in,
          california_prop_warning = EXCLUDED.california_prop_warning,
          website_link = EXCLUDED.website_link,
          product_height_without_legs_in = EXCLUDED.product_height_without_legs_in,
          internal_only_product = EXCLUDED.internal_only_product,
          coo = EXCLUDED.coo,
          tags = EXCLUDED.tags,
          updated_at = CURRENT_TIMESTAMP
      `;

      for (const row of data) {
        // Skip empty rows
        if (Object.values(row).every(value => !value || value.trim() === '')) {
          continue;
        }

        // Map CSV data to database values with proper type conversion
        const values = [
          row.sku || '',
          row.family || '',
          row.products_available_to_serve || '',
          row.shipping_dimensions || '',
          row.case_dimensions_in || '',
          stringToNumber(row.product_length_in),
          stringToNumber(row.product_weight_lbs),
          stringToNumber(row.list_price),
          stringToNumber(row.map_price),
          row.upc || '',
          row.hts_code || '',
          stringToNumber(row.flow_rate_gpm),
          stringToNumber(row.pallet_quantity),
          stringToNumber(row.case_quantity),
          stringToNumber(row.case_price),
          stringToNumber(row.case_weight_lbs),
          stringToNumber(row.number_of_taps),
          stringToNumber(row.glycol_lines),
          stringToNumber(row.ice_capacity_lbs),
          stringToNumber(row.btuhr_k),
          stringToNumber(row.interior_diameter_in),
          stringToNumber(row.shipping_weight_lbs),
          stringToNumber(row.working_height_in),
          stringToNumber(row.trunk_line_length_in),
          stringToNumber(row.height_of_ceiling_in),
          stringToNumber(row.diameter_in),
          stringToNumber(row.caster_quantity),
          stringToNumber(row.mug_capacity),
          stringToNumber(row.wheel_diameter_in),
          stringToNumber(row.spray_head_flow_rate_gpm),
          stringToNumber(row.hose_length_in),
          stringToNumber(row.hose_length_ft),
          stringToNumber(row.gallon_capacity),
          stringToNumber(row.beverage_line_diameter_in),
          stringToNumber(row.chase_diameter_in),
          stringToNumber(row.glycol_line_diameter_in),
          stringToNumber(row.hertz_hz),
          stringToBoolean(row.massachusetts_listed_certification),
          stringToBoolean(row.cec_listed_certification),
          stringToBoolean(row.ada_compliance),
          row.freight_class || '',
          row.country_of_origin || '',
          row.production_code || '',
          row.product_status || '',
          row.compressor_location || '',
          row.top_finish_options || '',
          row.cold_plate || '',
          row.handle_type || '',
          row.spout_style || '',
          row.brakes || '',
          row.inlet || '',
          row.bottle_capacity || '',
          row.refrigerant || '',
          stringToNumber(row.spout_size_in),
          row.thread || '',
          row.pumps || '',
          row.gas_system_compatibility || '',
          row.wrap_style || '',
          row.restock_fee || '',
          row.din_cables || '',
          row.spray_head_pattern || '',
          row.type || '',
          row.heat_recovery || '',
          row.stream_type || '',
          row.cabinet_side_finish || '',
          row.front_finish || '',
          row.division || '',
          row.visibility || '',
          row.nsf_certification || '',
          row.csa_certification || '',
          row.ul_certification || '',
          row.etl_certification || '',
          row.asse_certification || '',
          row.iampo_certification || '',
          row.series || '',
          row.warranty || '',
          row.doordrawer_finish_options || '',
          row.mounting_style || '',
          row.tower_style || '',
          row.underbar_structure_options || '',
          row.bowl_location || '',
          row.centers || '',
          row.doordrawer_style || '',
          row.drain_size || '',
          row.outlet || '',
          row.beverage_compatibility_options || '',
          row.tower_location || '',
          row.tower_finish || '',
          row.hp || '',
          row.tower_mounting || '',
          row.ice_bin_location || '',
          row.power_source || '',
          row.voltage || '',
          row.drain_location || '',
          row.psi_range || '',
          row.valve_type || '',
          row.plug_type || '',
          row.collaboration || '',
          stringToNumber(row.product_height_in),
          row.features || '',
          row.product_description || '',
          row.erp_description || '',
          row.materials || '',
          row.finish || '',
          stringToNumber(row.product_depth_in),
          row.operating_range || '',
          row.raises_equipment || '',
          row.temperature_range || '',
          row.aq_description || '',
          row.design_upgrades || '',
          row.faqs || '',
          row.issuessolutions || '',
          row.upsell_items || '',
          row.parent_products || '',
          row.parts_and_accessories || '',
          row.beverage_lines || '',
          stringToArray(row.images), // Convert comma-separated to array
          stringToArray(row.videos), // Convert comma-separated to array
          stringToArray(row.spec_sheet), // Convert comma-separated to array
          row.manuals || '',
          row.sell_sheet || '',
          row.brochure || '',
          stringToNumber(row.backsplash_height_in),
          row.bowl_size_in || '',
          row.perforated_inserts || '',
          row.related_products || '',
          row.includes || '',
          row.amps || '',
          row.compressor_size_in || '',
          row.phase || '',
          row.partsbykrowne || '',
          row.load_capacity_lbs_per_caster || '',
          row.plate_size_in || '',
          row.caster_overall_height_in || '',
          row.keg_capacity || '',
          row.product_weight || '',
          row.drain_outlet || '',
          stringToNumber(row.product_width_in),
          row.california_prop_warning || '',
          row.website_link || '',
          row.product_height_without_legs_in || '',
          row.internal_only_product || '',
          row.coo || '',
          stringToArray(row.tags), // Convert comma-separated to array
        ];

        await client.query(insertQuery, values);
        recordsProcessed++;
      }

      await client.query('COMMIT');

      return NextResponse.json({
        message: 'CSV uploaded successfully',
        recordsProcessed,
      });

    } catch (dbError) {
      await client.query('ROLLBACK');
      console.error('Database error:', dbError);
      return NextResponse.json({ 
        message: 'Database error occurred',
        error: dbError instanceof Error ? dbError.message : 'Unknown database error'
      }, { status: 500 });
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      message: 'Server error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Optional: Add GET method to check API status
export async function GET() {
  return NextResponse.json({ message: 'CSV Upload API is running' });
}