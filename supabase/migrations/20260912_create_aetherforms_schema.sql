-- Migration: AetherForms Schema
-- Tables: forms, form_fields, form_responses

CREATE TABLE IF NOT EXISTS public.forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    type TEXT NOT NULL DEFAULT 'standard', -- 'standard', 'quiz', 'assessment'
    is_active BOOLEAN NOT NULL DEFAULT true,
    header_image_url TEXT,
    theme_color TEXT DEFAULT '#12A5B8',
    created_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.form_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'text', 'textarea', 'radio', 'checkbox', 'dropdown', 'linear_scale', 'date'
    label TEXT NOT NULL,
    description TEXT,
    is_required BOOLEAN NOT NULL DEFAULT false,
    order_index INTEGER NOT NULL DEFAULT 0,
    options JSONB DEFAULT '[]'::jsonb,
    scale_min INTEGER DEFAULT 1,
    scale_max INTEGER DEFAULT 5,
    scale_min_label TEXT,
    scale_max_label TEXT,
    correct_answer TEXT,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.form_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
    respondent_name TEXT,
    respondent_meta JSONB DEFAULT '{}'::jsonb,
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC DEFAULT 0,
    max_score NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_forms_slug ON public.forms(slug);
CREATE INDEX IF NOT EXISTS idx_form_fields_form_id ON public.form_fields(form_id, order_index);
CREATE INDEX IF NOT EXISTS idx_form_responses_form_id ON public.form_responses(form_id, created_at DESC);

ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public forms are viewable if active" ON public.forms;
CREATE POLICY "Public forms are viewable if active" ON public.forms
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin has full access to forms" ON public.forms;
CREATE POLICY "Admin has full access to forms" ON public.forms
    FOR ALL USING (true);

DROP POLICY IF EXISTS "Form fields are viewable by public" ON public.form_fields;
CREATE POLICY "Form fields are viewable by public" ON public.form_fields
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.forms f 
            WHERE f.id = form_fields.form_id AND f.is_active = true
        )
    );

DROP POLICY IF EXISTS "Admin has full access to form fields" ON public.form_fields;
CREATE POLICY "Admin has full access to form fields" ON public.form_fields
    FOR ALL USING (true);

DROP POLICY IF EXISTS "Public can submit responses" ON public.form_responses;
CREATE POLICY "Public can submit responses" ON public.form_responses
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.forms f 
            WHERE f.id = form_responses.form_id AND f.is_active = true
        )
    );

DROP POLICY IF EXISTS "Admin can view all responses" ON public.form_responses;
CREATE POLICY "Admin can view all responses" ON public.form_responses
    FOR SELECT USING (true);

-- Add Quiz Duration in minutes
ALTER TABLE public.forms ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT NULL;
