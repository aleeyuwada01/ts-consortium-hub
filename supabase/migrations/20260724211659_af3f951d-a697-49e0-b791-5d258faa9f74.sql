
-- Roles enum + user_roles table
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

-- First signup becomes admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- About content (single row)
CREATE TABLE public.about_content (
  id int PRIMARY KEY DEFAULT 1,
  hero_eyebrow text NOT NULL DEFAULT 'About Us',
  hero_title text NOT NULL,
  hero_subtitle text NOT NULL,
  story_heading text NOT NULL,
  story_body text NOT NULL,
  mission text NOT NULL,
  vision text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);
GRANT SELECT ON public.about_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.about_content TO authenticated;
GRANT ALL ON public.about_content TO service_role;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "about read all" ON public.about_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "about admin write" ON public.about_content FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER about_updated_at BEFORE UPDATE ON public.about_content
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.about_content (id, hero_title, hero_subtitle, story_heading, story_body, mission, vision) VALUES (
  1,
  'A Nigerian industrial group with a Sahara-wide vision.',
  'Trans Sahara Consortium Limited was founded to bring together the specialized capability required to deliver Africa''s most demanding infrastructure and industrial projects — under one accountable roof.',
  'Built for the industries that build nations.',
  'Headquartered on the 8th Floor of the Bank of Industry Tower in Abuja, Trans Sahara Consortium operates as an integrated industrial platform — bringing engineering, capital, logistics and local expertise to bear on projects that move Africa forward. Our six subsidiaries operate independently in their sectors, yet share a common commitment to technical excellence, transparent governance and long-term community value.',
  'To deliver world-class industrial and infrastructure solutions that unlock prosperity across Africa — safely, sustainably and profitably.',
  'To be the most trusted African industrial consortium — the partner of choice for governments, investors and communities from the Sahara to the sea.'
);

-- Subsidiaries
CREATE TABLE public.subsidiaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  short text NOT NULL,
  tagline text NOT NULL,
  description text NOT NULL,
  capabilities text[] NOT NULL DEFAULT '{}',
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.subsidiaries TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.subsidiaries TO authenticated;
GRANT ALL ON public.subsidiaries TO service_role;
ALTER TABLE public.subsidiaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subs read all" ON public.subsidiaries FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "subs admin write" ON public.subsidiaries FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER subs_updated_at BEFORE UPDATE ON public.subsidiaries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.subsidiaries (slug, name, short, tagline, description, capabilities, sort_order) VALUES
('power-infrastructure','TSC Power & Infrastructure','Power & Infrastructure','Engineering the grid that powers a continent.','From transmission and distribution to substation construction and renewable integration, we deliver turnkey power infrastructure that meets the scale and reliability demands of modern Africa.',ARRAY['HV/MV Transmission & Distribution','Substation EPC (up to 330kV)','Solar & Hybrid Power Plants','Rural Electrification Programs','Grid Modernization & SCADA'],1),
('oil-and-gas','TSC Oil & Gas','Oil & Gas','Upstream to downstream, engineered with precision.','We provide integrated oil and gas services spanning exploration support, production optimization, midstream logistics and refined product distribution across West Africa.',ARRAY['Upstream Exploration Support','Production & Field Services','LPG & Gas Distribution','Refined Product Trading','HSE-led Operations'],2),
('agriculture','TSC Agriculture','Agriculture','Cultivating food security across the Sahara belt.','Large-scale mechanized farming, agro-processing and export of premium Nigerian produce. We combine climate-smart practices with modern supply chains to strengthen food security.',ARRAY['Mechanized Grain & Cereal Farming','Agro-Processing & Value Addition','Contract Farming Programs','Cold-Chain & Export Logistics','Irrigation & Climate-Smart Ops'],3),
('pipeline-infrastructure','TSC Pipeline Infrastructure','Pipeline Infrastructure','Miles of steel. Zero compromise on integrity.','Design, construction, commissioning and integrity management of onshore and offshore pipelines for oil, gas and water — delivered to international API and ISO standards.',ARRAY['Onshore & Offshore Pipeline EPC','Pipeline Integrity & Inspection','Cathodic Protection Systems','Pump & Metering Stations','Rehabilitation & Right-of-Way'],4),
('logistics-services','TSC Logistics Services','Logistics Services','Moving the industries that move Africa.','End-to-end freight forwarding, heavy haulage, customs brokerage and project logistics for the energy, mining and agricultural sectors — with a fleet built for the toughest routes.',ARRAY['Heavy & Abnormal Haulage','Freight Forwarding (Air/Sea/Land)','Customs Clearing & Brokerage','Project Cargo & Rig Moves','Warehousing & 3PL'],5),
('mining-and-exploration','TSC Mining & Exploration','Mining & Exploration','Responsibly unlocking Africa''s mineral wealth.','Exploration, extraction and processing of solid minerals with a firm commitment to community development, environmental stewardship and international best practice.',ARRAY['Geological Surveys & Exploration','Open-Pit & Underground Mining','Mineral Processing & Beneficiation','Environmental & Social Governance','Community Development Programs'],6);

-- Team members
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  image_url text,
  linkedin_url text,
  email text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.team_members TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "team read all" ON public.team_members FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "team admin write" ON public.team_members FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

INSERT INTO public.team_members (name, role, sort_order) VALUES
('Chairman','Chairman, Board of Directors',1),
('Group CEO','Group Chief Executive Officer',2),
('Group COO','Group Chief Operating Officer',3),
('Group CFO','Group Chief Financial Officer',4),
('MD, Power & Infrastructure','Managing Director',5),
('MD, Oil & Gas','Managing Director',6),
('MD, Agriculture','Managing Director',7),
('MD, Pipeline Infrastructure','Managing Director',8),
('MD, Logistics Services','Managing Director',9),
('MD, Mining & Exploration','Managing Director',10);

-- Gallery images
CREATE TABLE public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text,
  image_url text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.gallery_images TO authenticated;
GRANT ALL ON public.gallery_images TO service_role;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gallery read all" ON public.gallery_images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "gallery admin write" ON public.gallery_images FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
