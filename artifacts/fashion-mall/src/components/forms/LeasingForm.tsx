import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';
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

export default function LeasingForm() {
  const { spaceTypes, storeSegments } = useSiteContent();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [form, setForm] = useState<LeasingFormFields>(INITIAL_FORM);
  const [errors, setErrors] = useState<LeasingFormErrors>({});

  const availableSpaceTypes = useMemo(
    () => spaceTypes.filter((space) => isRequired(space.name)),
    [spaceTypes],
  );
  const availableSegments = useMemo(
    () =>
      storeSegments.filter(
        (segment) => segment.slug !== 'todos' && isRequired(segment.label),
      ),
    [storeSegments],
  );

  const spaceTypeUnavailable = availableSpaceTypes.length === 0;

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
        if (!isValidEmail(value)) return 'Digite um e-mail válido.';
        return undefined;
      case 'phone':
        if (!isRequired(value)) return 'Informe telefone ou WhatsApp.';
        if (!isValidPhone(value)) return 'Digite um telefone válido com DDD.';
        return undefined;
      case 'company':
        if (!value) return undefined;
        if (!hasMinLength(value, 2)) return 'Nome da empresa muito curto.';
        return undefined;
      case 'spaceType':
        if (spaceTypeUnavailable) return undefined;
        if (!isRequired(value)) return 'Selecione o tipo de espaço desejado.';
        return undefined;
      case 'segment':
        return undefined;
      case 'message':
        if (!value) return undefined;
        if (!hasMinLength(value, 10)) {
          return 'Mensagem muito curta. Escreva pelo menos 10 caracteres.';
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

    if (!attemptedSubmit) return;

    const fieldError = getFieldError(name, value);
    setErrors((current) => {
      const next = { ...current };
      if (fieldError) next[name] = fieldError;
      else delete next[name];
      return next;
    });
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    updateField(name as keyof LeasingFormFields, value);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setAttemptedSubmit(true);

    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || spaceTypeUnavailable) {
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setAttemptedSubmit(false);
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
            Recebemos os dados da sua marca e nossa equipe comercial retornará em até 48 horas úteis.
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
          {spaceTypeUnavailable && (
            <div className="md:col-span-2 border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
              Tipos de espaço indisponíveis no momento. Atualize o conteúdo no admin antes de enviar novas solicitações.
            </div>
          )}

          {[
            { name: 'name', label: 'Nome Completo', type: 'text', required: true },
            { name: 'email', label: 'E-mail', type: 'email', required: true },
            { name: 'phone', label: 'Telefone / WhatsApp', type: 'tel', required: true },
            { name: 'company', label: 'Nome da Empresa / Marca', type: 'text', required: false },
          ].map((field) => {
            const key = field.name as keyof LeasingFormFields;

            return (
              <div key={field.name}>
                <label className="block text-xs text-stone-500 tracking-wider uppercase mb-2">
                  {field.label} {field.required && <span className="text-amber-600">*</span>}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[key]}
                  onChange={handleChange}
                  className={inputClassName(key)}
                  aria-invalid={Boolean(errors[key])}
                  aria-describedby={errors[key] ? `${field.name}-error` : undefined}
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
              Tipo de Espaço <span className="text-amber-600">*</span>
            </label>
            <select
              name="spaceType"
              value={form.spaceType}
              onChange={handleChange}
              disabled={spaceTypeUnavailable}
              className={`${inputClassName('spaceType')} appearance-none disabled:bg-stone-100 disabled:text-stone-400`}
            >
              <option value="">Selecione...</option>
              {availableSpaceTypes.map((space) => (
                <option key={space.name} value={space.name}>
                  {`${space.name} (${space.size})`}
                </option>
              ))}
            </select>
            {errors.spaceType && (
              <p className="mt-1 text-xs text-red-600">{errors.spaceType}</p>
            )}
          </div>

          <div>
            <label className="block text-xs text-stone-500 tracking-wider uppercase mb-2">
              Segmento da Marca
            </label>
            <select
              name="segment"
              value={form.segment}
              onChange={handleChange}
              className={`${inputClassName('segment')} appearance-none`}
            >
              <option value="">Selecione...</option>
              {availableSegments.map((segment) => (
                <option key={segment.slug} value={segment.label}>
                  {segment.label}
                </option>
              ))}
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs text-stone-500 tracking-wider uppercase mb-2">
              Mensagem
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              placeholder="Conte-nos mais sobre sua marca e o que você busca no Fashion Bras..."
              className={`${inputClassName('message')} resize-none`}
              aria-invalid={Boolean(errors.message)}
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-600">{errors.message}</p>
            )}
          </div>

          {attemptedSubmit && hasErrors && (
            <div className="md:col-span-2 border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              Revise os campos destacados antes de enviar.
            </div>
          )}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting || spaceTypeUnavailable}
              className="w-full md:w-auto bg-stone-900 text-white px-10 py-4 text-xs tracking-widest uppercase font-medium hover:bg-amber-700 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
            </button>
            <p className="text-xs text-stone-400 mt-3">
              Envio apenas em frontend para demonstração. Não há integração externa nesta etapa.
            </p>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
