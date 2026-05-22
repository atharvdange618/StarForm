'use client';

import { useState } from 'react';
import { GripVertical, Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FieldConfigDialog } from './field-config-dialog';
import type { FieldData } from '../types';

interface FieldEditorProps {
  fields: FieldData[];
  onAdd: (field: FieldData) => void;
  onUpdate: (id: string, field: Partial<FieldData>) => void;
  onRemove: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

const fieldIcons: Record<string, string> = {
  shortText: 'Aa',
  longText: '¶',
  email: '@',
  number: '#',
  singleSelect: '○',
  multiSelect: '☑',
  dropdown: '▾',
  rating: '★',
  date: '📅',
};

const fieldLabels: Record<string, string> = {
  shortText: 'Short Text',
  longText: 'Long Text',
  email: 'Email',
  number: 'Number',
  singleSelect: 'Single Select',
  multiSelect: 'Multi Select',
  dropdown: 'Dropdown',
  rating: 'Rating',
  date: 'Date',
};

export function FormFieldEditor({
  fields,
  onAdd,
  onUpdate,
  onRemove,
  onReorder,
}: FieldEditorProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<FieldData | null>(null);
  const handleAdd = () => {
    setEditingField(null);
    setDialogOpen(true);
  };

  const handleEdit = (field: FieldData) => {
    setEditingField(field);
    setDialogOpen(true);
  };

  const handleSave = (field: FieldData) => {
    if (editingField) {
      onUpdate(field.id, field);
    } else {
      const fieldWithOrder = { ...field, order: fields.length };
      onAdd(fieldWithOrder);
    }
  };

  const moveField = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= fields.length) return;
    onReorder(fromIndex, toIndex);
  };

  return (
    <div className="space-y-3">
      {fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[calc(var(--radius)*0.8)] border-2 border-dashed border-border py-10">
          <p className="font-body text-sm text-muted-foreground">
            No fields yet. Add your first field.
          </p>
          <Button onClick={handleAdd} className="mt-3 gap-2" size="sm">
            <Plus className="h-4 w-4" />
            Add Field
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-center gap-3 rounded-[calc(var(--radius)*0.8)] border border-border bg-card px-4 py-3 transition-colors hover:border-primary/30"
            >
              <div className="touch-none text-muted-foreground/50">
                <GripVertical className="h-4 w-4" />
              </div>

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-body text-sm text-primary">
                {fieldIcons[field.type] ?? '?'}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-body text-sm font-medium text-foreground">
                    {field.label}
                  </span>
                  {field.required ? <span className="text-destructive">*</span> : null}
                </div>
                <span className="font-body text-xs text-muted-foreground">
                  {fieldLabels[field.type] ?? field.type}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      moveField(index, index - 1);
                    }}
                    disabled={index === 0}
                    className="flex h-4 w-4 items-center justify-center text-muted-foreground/50 hover:text-muted-foreground disabled:opacity-20"
                    aria-label="Move up"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      moveField(index, index + 1);
                    }}
                    disabled={index === fields.length - 1}
                    className="flex h-4 w-4 items-center justify-center text-muted-foreground/50 hover:text-muted-foreground disabled:opacity-20"
                    aria-label="Move down"
                  >
                    ▼
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleEdit(field);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground/50 transition-colors hover:bg-primary/10 hover:text-primary"
                  aria-label="Edit field"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onRemove(field.id);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground/50 transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Remove field"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}

          <Button
            onClick={handleAdd}
            variant="ghost"
            className="w-full gap-2 border border-dashed border-border"
          >
            <Plus className="h-4 w-4" />
            Add Field
          </Button>
        </div>
      )}

      <FieldConfigDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        field={editingField}
        onSave={handleSave}
      />
    </div>
  );
}
