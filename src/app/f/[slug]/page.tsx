import React from 'react';
import { notFound } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { FormModel, PublicFormField } from '@/types/form';
import { PublicFormContainer } from '@/modules/forms/public/PublicFormContainer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicFormPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = getSupabase();

  const { data: form, error: formError } = await supabase
    .from('forms')
    .select('*')
    .eq('slug', slug)
    .single();

  if (formError || !form || !form.is_active) {
    notFound();
  }

  const { data: rawFields } = await supabase
    .from('form_fields')
    .select('id, form_id, type, label, description, is_required, order_index, options, scale_min, scale_max, scale_min_label, scale_max_label, points')
    .eq('form_id', form.id)
    .order('order_index', { ascending: true });

  const fields: PublicFormField[] = (rawFields || []) as PublicFormField[];

  return (
    <main className="min-h-screen bg-[#F5F5F7] px-4 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto">
        <PublicFormContainer form={form as FormModel} fields={fields} />
      </div>
    </main>
  );
}
