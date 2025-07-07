-- Migration: Food Analysis Schema
-- Version: 2.3.0
-- Created: 2024-01-01T00:00:00.000Z
-- Description: AI food analysis with images, results, feedback, and barcode scans

-- ============================================================================
-- FOOD ANALYSIS SCHEMA
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS food_analysis;

-- Food images uploaded by users for analysis
CREATE TABLE food_analysis.food_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References user_service.users(id)
    
    -- Image details
    original_filename TEXT,
    file_size_bytes BIGINT,
    mime_type TEXT,
    width INTEGER,
    height INTEGER,
    
    -- Storage information
    storage_url TEXT NOT NULL,
    storage_provider TEXT DEFAULT 'supabase', -- supabase, aws, etc.
    storage_path TEXT,
    
    -- Image metadata
    taken_at TIMESTAMP WITH TIME ZONE,
    location_data JSONB, -- GPS coordinates, location name
    device_info JSONB, -- Camera, device model, etc.
    
    -- Processing status
    processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT file_size_reasonable CHECK (file_size_bytes > 0 AND file_size_bytes < 50000000) -- 50MB limit
);

-- Food analysis results from AI/ML processing
CREATE TABLE food_analysis.food_analysis_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References user_service.users(id)
    image_id UUID REFERENCES food_analysis.food_images(id) ON DELETE SET NULL,
    
    -- Analysis metadata
    analysis_source analysis_source_enum NOT NULL DEFAULT 'vision',
    analysis_model TEXT, -- e.g., 'gpt-4-vision', 'custom-model-v1'
    analysis_version TEXT,
    confidence_score DECIMAL(3,2) CHECK (confidence_score BETWEEN 0 AND 1),
    
    -- Analysis results
    total_foods_detected INTEGER DEFAULT 0,
    processing_time_ms INTEGER,
    
    -- Raw analysis data
    raw_response JSONB, -- Full AI response
    analysis_notes TEXT,
    
    -- Verification and feedback
    verification_status verification_status_enum DEFAULT 'pending',
    user_feedback JSONB, -- User corrections and feedback
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT total_foods_non_negative CHECK (total_foods_detected >= 0),
    CONSTRAINT processing_time_reasonable CHECK (processing_time_ms IS NULL OR processing_time_ms >= 0)
);

-- Individual foods detected in analysis results
CREATE TABLE food_analysis.analyzed_foods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_result_id UUID NOT NULL REFERENCES food_analysis.food_analysis_results(id) ON DELETE CASCADE,
    
    -- Food identification
    detected_name TEXT NOT NULL,
    category food_category_enum,
    confidence_score DECIMAL(3,2) CHECK (confidence_score BETWEEN 0 AND 1),
    
    -- Quantity estimation
    estimated_portion DECIMAL(8,2),
    portion_unit portion_unit_enum DEFAULT 'grams',
    portion_confidence DECIMAL(3,2) CHECK (portion_confidence BETWEEN 0 AND 1),
    
    -- Nutritional estimates
    estimated_calories DECIMAL(8,2),
    estimated_carbs_g DECIMAL(8,2),
    estimated_protein_g DECIMAL(8,2),
    estimated_fat_g DECIMAL(8,2),
    
    -- Image analysis details
    bounding_box JSONB, -- Coordinates where food was detected
    visual_features JSONB, -- Color, texture, shape analysis
    
    -- Matching and linking
    matched_food_id UUID, -- References food_service.foods(id)
    match_confidence DECIMAL(3,2),
    
    -- User corrections
    user_corrected_name TEXT,
    user_corrected_portion DECIMAL(8,2),
    user_corrected_unit portion_unit_enum,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT detected_name_not_empty CHECK (length(trim(detected_name)) > 0),
    CONSTRAINT estimated_values_non_negative CHECK (
        (estimated_portion IS NULL OR estimated_portion >= 0) AND
        (estimated_calories IS NULL OR estimated_calories >= 0) AND
        (estimated_carbs_g IS NULL OR estimated_carbs_g >= 0) AND
        (estimated_protein_g IS NULL OR estimated_protein_g >= 0) AND
        (estimated_fat_g IS NULL OR estimated_fat_g >= 0)
    )
);

-- User feedback on analysis results
CREATE TABLE food_analysis.analysis_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References user_service.users(id)
    analysis_result_id UUID NOT NULL REFERENCES food_analysis.food_analysis_results(id) ON DELETE CASCADE,
    
    -- Feedback details
    overall_accuracy_rating INTEGER CHECK (overall_accuracy_rating BETWEEN 1 AND 5),
    food_identification_rating INTEGER CHECK (food_identification_rating BETWEEN 1 AND 5),
    portion_estimation_rating INTEGER CHECK (portion_estimation_rating BETWEEN 1 AND 5),
    
    -- Specific feedback
    missing_foods TEXT[], -- Foods that were missed
    incorrect_foods TEXT[], -- Foods that were incorrectly identified
    comments TEXT,
    
    -- Feedback metadata
    feedback_type TEXT DEFAULT 'user_rating' CHECK (feedback_type IN ('user_rating', 'expert_review', 'automated')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Barcode scanning results
CREATE TABLE food_analysis.barcode_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References user_service.users(id)
    
    -- Barcode details
    barcode_value TEXT NOT NULL,
    barcode_type TEXT, -- EAN-13, UPC-A, etc.
    
    -- Scan metadata
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    device_info JSONB,
    app_version TEXT,
    
    -- Product lookup results
    product_found BOOLEAN DEFAULT false,
    matched_food_id UUID, -- References food_service.foods(id)
    
    -- External API results
    external_api_response JSONB, -- Response from OpenFoodFacts, etc.
    external_product_name TEXT,
    external_brand TEXT,
    
    -- User actions
    user_added_to_log BOOLEAN DEFAULT false,
    user_created_food BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT barcode_value_not_empty CHECK (length(trim(barcode_value)) > 0)
);

-- ============================================================================
-- INDEXES FOR FOOD ANALYSIS
-- ============================================================================

-- Food images indexes
CREATE INDEX idx_food_images_user_id ON food_analysis.food_images(user_id);
CREATE INDEX idx_food_images_created_at ON food_analysis.food_images(created_at DESC);
CREATE INDEX idx_food_images_processing_status ON food_analysis.food_images(processing_status);
CREATE INDEX idx_food_images_storage_url ON food_analysis.food_images(storage_url);

-- Food analysis results indexes
CREATE INDEX idx_food_analysis_user_created ON food_analysis.food_analysis_results(user_id, created_at DESC);
CREATE INDEX idx_food_analysis_image_id ON food_analysis.food_analysis_results(image_id);
CREATE INDEX idx_food_analysis_source ON food_analysis.food_analysis_results(analysis_source);
CREATE INDEX idx_food_analysis_verification ON food_analysis.food_analysis_results(verification_status);
CREATE INDEX idx_food_analysis_confidence ON food_analysis.food_analysis_results(confidence_score DESC);

-- Analyzed foods indexes
CREATE INDEX idx_analyzed_foods_analysis_result ON food_analysis.analyzed_foods(analysis_result_id);
CREATE INDEX idx_analyzed_foods_category ON food_analysis.analyzed_foods(category);
CREATE INDEX idx_analyzed_foods_matched_food ON food_analysis.analyzed_foods(matched_food_id);
CREATE INDEX idx_analyzed_foods_confidence ON food_analysis.analyzed_foods(confidence_score DESC);
CREATE INDEX idx_analyzed_foods_name ON food_analysis.analyzed_foods(detected_name);

-- Analysis feedback indexes
CREATE INDEX idx_analysis_feedback_user_id ON food_analysis.analysis_feedback(user_id);
CREATE INDEX idx_analysis_feedback_result_id ON food_analysis.analysis_feedback(analysis_result_id);
CREATE INDEX idx_analysis_feedback_rating ON food_analysis.analysis_feedback(overall_accuracy_rating);
CREATE INDEX idx_analysis_feedback_created_at ON food_analysis.analysis_feedback(created_at DESC);

-- Barcode scans indexes
CREATE INDEX idx_barcode_scans_user_id ON food_analysis.barcode_scans(user_id);
CREATE INDEX idx_barcode_scans_barcode ON food_analysis.barcode_scans(barcode_value);
CREATE INDEX idx_barcode_scans_scanned_at ON food_analysis.barcode_scans(scanned_at DESC);
CREATE INDEX idx_barcode_scans_matched_food ON food_analysis.barcode_scans(matched_food_id);
CREATE INDEX idx_barcode_scans_product_found ON food_analysis.barcode_scans(product_found);

-- ============================================================================
-- TRIGGERS FOR FOOD ANALYSIS
-- ============================================================================

-- Updated_at triggers
CREATE TRIGGER food_images_updated_at BEFORE UPDATE ON food_analysis.food_images
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER food_analysis_results_updated_at BEFORE UPDATE ON food_analysis.food_analysis_results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER analyzed_foods_updated_at BEFORE UPDATE ON food_analysis.analyzed_foods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER analysis_feedback_updated_at BEFORE UPDATE ON food_analysis.analysis_feedback
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER barcode_scans_updated_at BEFORE UPDATE ON food_analysis.barcode_scans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 