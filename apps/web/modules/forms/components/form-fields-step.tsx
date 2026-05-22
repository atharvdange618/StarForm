'use client';

import { useFormBuilderStore } from '@/store/form-builder.store';
import { FormFieldEditor } from './field-editor';

export function FormFieldsStep() {
  const { fields, addField, updateField, removeField, reorderFields } = useFormBuilderStore();

  return (
    <div className="mx-auto max-w-xl">
      <FormFieldEditor
        fields={fields}
        onAdd={addField}
        onUpdate={updateField}
        onRemove={removeField}
        onReorder={reorderFields}
      />
    </div>
  );
}
