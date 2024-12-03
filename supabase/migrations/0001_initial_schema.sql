-- Create enum types
CREATE TYPE bourbon_type AS ENUM ('bourbon', 'rye', 'wheat', 'malt', 'blend');
CREATE TYPE rarity_level AS ENUM ('common', 'uncommon', 'rare', 'allocated');

-- Create the main bourbon table
CREATE TABLE bourbons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    distillery VARCHAR(255) NOT NULL,
    type bourbon_type NOT NULL,
    proof DECIMAL(4,1) NOT NULL,
    age_statement VARCHAR(50),
    msrp DECIMAL(10,2),
    rarity rarity_level DEFAULT 'common',
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the users collection table
CREATE TABLE collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    bourbon_id UUID REFERENCES bourbons(id) ON DELETE CASCADE,
    purchase_date DATE,
    purchase_price DECIMAL(10,2),
    purchase_location TEXT,
    notes TEXT,
    rating SMALLINT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, bourbon_id)
);

-- Create the locations table
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the prices table
CREATE TABLE prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bourbon_id UUID REFERENCES bourbons(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    reported_by UUID REFERENCES auth.users(id),
    reported_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(bourbon_id, location_id)
);

-- Create reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    bourbon_id UUID REFERENCES bourbons(id) ON DELETE CASCADE,
    rating SMALLINT CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, bourbon_id)
);

-- Create activities table for points system
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    points INTEGER NOT NULL,
    reference_id UUID,  -- Can reference any other table's ID
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE bourbons ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Policies for collections
CREATE POLICY "Users can view their own collections"
    ON collections FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own collections"
    ON collections FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policies for reviews
CREATE POLICY "Reviews are viewable by everyone"
    ON reviews FOR SELECT
    USING (true);

CREATE POLICY "Users can create their own reviews"
    ON reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_bourbons_updated_at
    BEFORE UPDATE ON bourbons
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Create indexes
CREATE INDEX idx_bourbons_name ON bourbons(name);
CREATE INDEX idx_bourbons_distillery ON bourbons(distillery);
CREATE INDEX idx_collections_user_id ON collections(user_id);
CREATE INDEX idx_prices_bourbon_location ON prices(bourbon_id, location_id);
CREATE INDEX idx_locations_coords ON locations(latitude, longitude);
