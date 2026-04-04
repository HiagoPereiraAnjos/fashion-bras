import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useSiteContent } from '@/services/content';
import {
  hasMinLength,
  isRequired,
  isValidEmail,
  isValidPhone,
  normalizeText,
} from '@/utils/validation';

type LeasingFormFields = {
  name: string;
  email: string;
  phone: string;
  company: string;
  spaceType: string;
  segment: string;
  message: string;
};

type LeasingFormErrors = Partial<Record<keyof LeasingFormFields, string>>;
type LeasingFormTouched = Partial<Record<keyof LeasingFormFields, boolean>>;

const INITIAL_FORM: LeasingFormFields = {
  name: '',
  email: '',
  phone: '',
  company: '',
  spaceType: '',
  segment: '',
  message: '',
};

const BASE_INPUT_CLASSNAME =
  'w-full border px-4 py-3 text-sm focus:outline-none transition-colors bg-white';

function sanitizeForm(values: LeasingFormFields): LeasingFormFields {
  return {
    name: normalizeText(values.name),
    email: normalizeText(values.email),
    phone: normalizeText(values.phone),
    company: normalizeText(values.company),
    spaceType: normalizeText(values.spaceType),
    segment: normalizeText(values.segment),
    message: normalizeText(values.message),
  };
}

export default function LeasingForm() {
  const { spaceTypes, storeSegments } = useSiteContent();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState<LeasingFormFields>(INITIAL_FORM);
  const [errors, setErrors] = useState<LeasingFormErrors>({});
  const [touched, setTouched] = useState<LeasingFormTouched>({});

  const availableSpaceTypes = useMemo(
    () =>
      spaceTypes
        .filter((space) => isRequired(space.name))
        .map((space) => ({
          value: space.name,
          label: `${space.name}${space.size ? ` (${space.size})` : ''}`,
        })),
    [spaceTypes],
  );

  const availableSegments = useMemo(
    () =>
      storeSegments
        .filter((segment) => segment.slug !== 'todos' && isRequired(segment.label))
        .map((segment) => ({
          value: segment.label,
          label: segment.label,
        })),
    [storeSegments],
  );

  const hasSpaceTypeCatalog = availableSpaceTypes.length > 0;
  const hasSegmentCatalog = availableSegments.length > 0;

  const spaceTypeOptions = hasSpaceTypeCatalog
    ? availableSpaceTypes
    : [{ value: 'A definir com equipe comercial', label: 'A definir com equipe comercial' }];

  const segmentOptions = hasSegmentCatalog
    ? [...availableSegments, { value: 'Outro', label: 'Outro' }]
    : [{ value: 'Outro', label: 'Outro' }];

  const getFieldError = (
    key: keyof LeasingFormFields,
    value: string,
  ): string | undefined => {
    switch (key) {
      case 'name':
        if (!isRequired(value)) return 'Informe seu nome completo.';
        if (!hasMinLength(value, 3)) return 'Use pelo menos 3 caracteres.';
        return undefined;
      case 'email':
        if (!isRequired(value)) return 'Informe um e-mail para contato.';
        if (!isValidEmail(value)) return 'Digite um e-mail valido.';
        return undefined;
      case 'phone':
        if (!isRequired(value)) return 'Informe telefone ou WhatsApp.';
        if (!isValidPhone(value)) return 'Digite um telefone valido com DDD.';
        return undefined;
      case 'company':
        if (!isRequired(value)) return 'Informe o nome da marca ou empresa.';
        if (!hasMinLength(value, 2)) return 'Nome da marca muito curto.';
        return undefined;
      case 'spaceType':
        if (!isRequired(value)) return 'Selecione o tipo de espaco desejado.';
        return undefined;
      case 'segment':
        if (!isRequired(value)) return 'Selecione o segmento da marca.';
        return undefined;
      case 'message':
        if (!isRequired(value)) return 'Descreva brevemente sua proposta comercial.';
        if (!hasMinLength(value, 20)) {
          return 'Mensagem muito curta. Escreva pelo menos 20 caracteres.';
        }
        return undefined;
    }
  };

  const validateForm = (values: LeasingFormFields): LeasingFormErrors => {
    const nextErrors: LeasingFormErrors = {};
    for (const key of Object.keys(values) as Array<keyof LeasingFormFields>) {
      const error = getFieldError(key, values[key]);
      if (error) nextErrors[key] = error;
    }
    return nextErrors;
  };

  const hasErrors = Object.keys(errors).length > 0;

  const updateField = (name: keyof LeasingFormFields, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));

    if (!attemptedSubmit && !touched[name]) return;

    const nextErrors = validateForm({ ...form, [name]: value });
    setErrors(nextErrors);
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    updateField(name as keyof LeasingFormFields, value);
  };

  const handleBlur = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    const key = name as keyof LeasingFormFields;

    setTouched((current) => ({ ...current, [key]: true }));
    const nextErrors = validateForm({ ...form, [key]: value });
    setErrors(nextErrors);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setAttemptedSubmit(true);
    setSubmitError(null);

    const sanitized = sanitizeForm(form);
    setForm(sanitized);

    const nextErrors = validateForm(sanitized);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitError('Revise os campos obrigatorios para continuar.');
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setTouched({});
    setAttemptedSubmit(false);
    setSubmitError(null);
    setSubmitted(false);
    setIsSubmitting(false);
  };

  const inputClassName = (key: keyof LeasingFormFields) =>
    `${BASE_INPUT_CLASSNAME} ${
      errors[key] ? 'border-red-300 focus:border-red-400' : 'border-stone-200 focus:border-amber-500'
    }`;

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 px-8"
        >
          <div className="flex justify-center mb-6">
            <CheckCircle size={56} className="text-amber-600" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-900 mb-4">
            Solicitação registrada com sucesso
          </h3>
          <p className="text-stone-500 max-w-md mx-auto leading-relaxed">
            Seus dados foram validados e registrados localmente para demonstração do fluxo.
          </p>
          <p className="text-xs text-stone-400 mt-3">
            Nesta etapa, nenhum envio externo e realizado.
          </p>
          <button
            onClick={resetForm}
            className="mt-8 text-amber-700 text-xs tracking-widest uppercase font-medium hover:underline"
          >
            Enviar nova solicitação
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          noValidate
        >
          {!hasSpaceTypeCatalog && (
            <div className="md:col-span-2 border border-stone-200 bg-stone-50 px-4 py-3 text-xs text-stone-600 flex items-start gap-2">
              <Info size={14} className="mt-0.5 shrink-0 text-amber-700" />
              Tipos de espaco estao em atualizacao. Voce pode seguir com a opcao "A definir com equipe comercial".
            </div>
          )}

          {!hasSegmentCatalog && (
            <div className="md:col-span-2 border border-stone-200 bg-stone-50 px-4 py-3 text-xs text-stone-600 flex items-start gap-2">
              <Info size={14} className="mt-0.5 shrink-0 text-amber-700" />
              Segmentos de marca estao em atualizacao. Selecione "Outro" para continuar.
            </div>
          )}

          {[
            { name: 'name', label: 'Nome Completo', type: 'text' },
            { name: 'email', label: 'E-mail', type: 'email' },
            { name: 'phone', label: 'Telefone / WhatsApp', type: 'tel' },
            { name: 'company', label: 'Nome da Empresa / Marca', type: 'text' },
          ].map((field) => {
            const key = field.name as keyof LeasingFormFields;

            return (
              <div key={field.name}>
                <label className="block text-xs text-stone-500 tracking-wider uppercase mb-2">
                  {field.label} <span className="text-amber-600">*</span>
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[key]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClassName(key)}
                  aria-invalid={Boolean(errors[key])}
                  aria-describedby={errors[key] ? `${field.name}-error` : undefined}
                  required
                />
                {errors[key] && (
                  <p id={`${field.name}-error`} className="mt-1 text-xs text-red-600">
                    {errors[key]}
                  </p>
                )}
              </div>
            );
          })}

          <div>
            <label className="block text-xs text-stone-500 tracking-wider uppercase mb-2">
              Tipo de Espaco <span className="text-amber-600">*</span>
            </label>
            <select
              name="spaceType"
              value={form.spaceType}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${inputClassName('spaceType')} appearance-none`}
              required
            >
              <option value="">Selecione...</option>
              {spaceTypeOptions.map((space) => (
                <option key={space.value} value={space.value}>
                  {space.label}
                </option>
              ))}
            </select>
            {errors.spaceType && <p className="mt-1 text-xs text-red-600">{errors.spaceType}</p>}
          </div>

          <div>
            <label className="block text-xs text-stone-500 tracking-wider uppercase mb-2">
              Segmento da Marca <span className="text-amber-600">*</span>
            </label>
            <select
              name="segment"
              value={form.segment}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${inputClassName('segment')} appearance-none`}
              required
            >
              <option value="">Selecione...</option>
              {segmentOptions.map((segment) => (
                <option key={segment.value} value={segment.value}>
                  {segment.label}
                </option>
              ))}
            </select>
            {errors.segment && <p className="mt-1 text-xs text-red-600">{errors.segment}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs text-stone-500 tracking-wider uppercase mb-2">
              Mensagem <span className="text-amber-600">*</span>
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={4}
              placeholder="Conte-nos sobre sua marca, publico e objetivo comercial no shopping."
              className={`${inputClassName('message')} resize-none`}
              aria-invalid={Boolean(errors.message)}
              required
            />
            {errors.message ? (
              <p className="mt-1 text-xs text-red-600">{errors.message}</p>
            ) : (
              <p className="mt-1 text-xs text-stone-400">
                Minimo recomendado: 20 caracteres para uma analise comercial inicial.
              </p>
            )}
          </div>

          {(submitError || (attemptedSubmit && hasErrors)) && (
            <div
              className="md:col-span-2 border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 flex items-start gap-2"
              aria-live="polite"
            >
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              {submitError || 'Revise os campos destacados antes de enviar.'}
            </div>
          )}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto bg-stone-900 text-white px-10 py-4 text-xs tracking-widest uppercase font-medium hover:bg-amber-700 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Validando...' : 'Enviar Solicitação'}
            </button>
            <p className="text-xs text-stone-400 mt-3">
              Fluxo de validação frontend-only. Sem backend e sem envio externo nesta fase.
            </p>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
