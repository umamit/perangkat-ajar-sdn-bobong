'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { FormModel, FormFieldModel } from '@/types/form';
import { FieldEditorCard } from '@/modules/forms/builder/FieldEditorCard';
import { BuilderHeader } from '@/modules/forms/builder/BuilderHeader';
import { FormSettingsCard } from '@/modules/forms/builder/FormSettingsCard';

export default function FormBuilderPage() {
  const params = useParams();
  const formId = params.id as string;

  const [form, setForm] = useState<FormModel | null>(null);
  const [fields, setFields] = useState<FormFieldModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const supabase = getSupabase();
      const { data: formData } = await supabase.from('forms').select('*').eq('id', formId).single();
      const { data: fieldData } = await supabase.from('form_fields').select('*').eq('form_id', formId).order('order_index', { ascending: true });
      if (formData) setForm(formData as FormModel);
      if (fieldData) setFields(fieldData as FormFieldModel[]);
      setLoading(false);
    }
    loadData();
  }, [formId]);

  const handleAddField = () => {
    const newField: FormFieldModel = {
      id: crypto.randomUUID(),
      form_id: formId,
      type: 'text',
      label: 'Pertanyaan Baru',
      is_required: false,
      order_index: fields.length,
      options: [],
      points: form?.type === 'quiz' ? 10 : 0,
    };
    setFields([...fields, newField]);
  };

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    setMsg(null);
    try {
      const supabase = getSupabase();
      await supabase.from('forms').update({
        title: form.title,
        description: form.description,
        type: form.type,
        is_active: form.is_active,
        duration_minutes: form.duration_minutes,
        updated_at: new Date().toISOString(),
      }).eq('id', form.id);

      await supabase.from('form_fields').delete().eq('form_id', form.id);
      if (fields.length > 0) {
        await supabase.from('form_fields').insert(fields.map((f, idx) => ({ ...f, order_index: idx })));
      }
      setMsg('Formulir berhasil disimpan.');
    } catch (err: any) {
      setMsg(err.message || 'Gagal menyimpan.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return <div className="p-8 text-center text-slate-500">Memuat editor formulir...</div>;

  return (
    <div className="min-h-screen bg-[#F5F5F7] p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <BuilderHeader form={form} saving={saving} onSave={handleSave} />

      <FormSettingsCard
        form={form}
        disabled={saving}
        onChange={(updated) => setForm({ ...form, ...updated })}
      />

      <div className="space-y-4">
        {fields.map((f, idx) => (
          <FieldEditorCard
            key={f.id}
            field={f}
            formType={form.type}
            index={idx}
            onUpdate={(updated) => {
              const updatedList = [...fields];
              updatedList[idx] = updated;
              setFields(updatedList);
            }}
            onDelete={() => setFields(fields.filter((_, i) => i !== idx))}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddField}
        className="w-full h-12 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#12A5B8] hover:bg-white text-slate-600 hover:text-[#12A5B8] font-semibold text-sm transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" /> Tambah Butir Pertanyaan
      </button>

      {msg && <p className="text-sm font-medium text-center text-[#2A9D5C]">{msg}</p>}
    </div>
  );
}
