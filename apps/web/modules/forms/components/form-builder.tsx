'use client';

import { useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StepIndicator } from './step-indicator';
import { FormDetailsStep } from './form-details-step';
import { FormFieldsStep } from './form-fields-step';
import { FormConfigureStep } from './form-configure-step';
import { FormPreviewStep } from './form-preview-step';
import { useFormBuilderStore } from '@/store/form-builder.store';
import { useCreateForm, useUpdateForm } from '@/modules/forms/hooks/useForms';
import type { FieldDefinition } from '@starform/trpc/server';
import { toast } from 'sonner';

interface FormBuilderProps {
  existingFormId?: string;
  onPublished?: (form: { id: string; slug: string }) => void;
}

const stepLabels = ['Details', 'Fields', 'Configure', 'Preview & Publish'];

export function FormBuilder({ existingFormId, onPublished }: FormBuilderProps) {
  const [formId, setFormId] = useState<string | null>(existingFormId ?? null);
  const [isSaving, setIsSaving] = useState(false);
  const {
    step,
    setStep,
    fields,
    title,
    description,
    slug,
    themeId,
    visibility,
    expiryDate,
    responseLimit,
    password,
    thankYouMessage,
    webhookUrl,
    isDirty,
  } = useFormBuilderStore();
  const createMutation = useCreateForm();
  const updateMutation = useUpdateForm();

  const canProceed = useCallback(() => {
    switch (step) {
      case 0: {
        return title.trim().length > 0;
      }
      case 1: {
        return fields.length > 0;
      }
      case 2: {
        return true;
      }
      default: {
        return true;
      }
    }
  }, [step, title, fields]);

  const saveForm = async (): Promise<boolean> => {
    if (!formId || !isDirty) return true;
    setIsSaving(true);
    try {
      await updateMutation.mutateAsync({
        id: formId,
        data: {
          title,
          description: description || undefined,
          slug: slug || undefined,
          fields: fields as FieldDefinition[],
          themeId: themeId ?? undefined,
          visibility,
          config: {
            expiryDate: expiryDate ?? undefined,
            responseLimit: responseLimit ?? undefined,
            password: password || undefined,
            thankYouMessage: thankYouMessage || undefined,
            webhookUrl: webhookUrl || undefined,
          },
        },
      });
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save changes');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    if (!canProceed()) return;

    if (step === 1 && !formId) {
      setIsSaving(true);
      try {
        const form = await createMutation.mutateAsync({
          title,
          description: description || undefined,
          slug: slug || undefined,
          fields: fields as FieldDefinition[],
        });
        setFormId(form.id);
        setStep(2);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to save form');
      } finally {
        setIsSaving(false);
      }
      return;
    }

    if (formId && isDirty) {
      const saved = await saveForm();
      if (!saved) return;
    }

    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handlePublished = (form: { id: string; slug: string }) => {
    onPublished?.(form);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <StepIndicator
          currentStep={step}
          onStepClick={(s) => {
            setStep(s);
          }}
        />
      </div>

      <div className="mb-8">
        <div className="mb-1 text-center font-body text-xs uppercase tracking-widest text-muted-foreground">
          Step {step + 1} of 4
        </div>
        <h2 className="text-center font-display text-2xl font-light text-foreground">
          {stepLabels[step]}
        </h2>
      </div>

      <div className="min-h-75">
        {step === 0 ? <FormDetailsStep /> : null}
        {step === 1 ? <FormFieldsStep /> : null}
        {step === 2 ? <FormConfigureStep /> : null}
        {step === 3 && formId ? (
          <FormPreviewStep formId={formId} onPublished={handlePublished} />
        ) : null}
      </div>

      {step < 3 ? (
        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <Button variant="ghost" onClick={handleBack} disabled={step === 0} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Button
            onClick={() => {
              void handleNext();
            }}
            disabled={!canProceed() || isSaving}
            className="gap-2"
          >
            {isSaving ? 'Saving...' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
