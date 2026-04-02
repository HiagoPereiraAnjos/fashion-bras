import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export default function LeasingForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    spaceType: '',
    segment: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
            Mensagem Enviada com Sucesso
          </h3>
          <p className="text-stone-500 max-w-md mx-auto leading-relaxed">
            Obrigado pelo seu interesse em fazer parte do Fashion Bras. Nossa equipe comercial
            entrará em contato em até 48 horas úteis.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-8 text-amber-700 text-xs tracking-widest uppercase font-medium hover:underline"
          >
            Enviar nova mensagem
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {[
            { name: 'name', label: 'Nome Completo', type: 'text', required: true },
            { name: 'email', label: 'E-mail', type: 'email', required: true },
            { name: 'phone', label: 'Telefone / WhatsApp', type: 'tel', required: true },
            { name: 'company', label: 'Nome da Empresa / Marca', type: 'text', required: false },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-xs text-stone-500 tracking-wider uppercase mb-2">
                {field.label} {field.required && <span className="text-amber-600">*</span>}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                required={field.required}
                className="w-full border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors bg-white"
              />
            </div>
          ))}

          <div>
            <label className="block text-xs text-stone-500 tracking-wider uppercase mb-2">
              Tipo de Espaço <span className="text-amber-600">*</span>
            </label>
            <select
              name="spaceType"
              value={form.spaceType}
              onChange={handleChange}
              required
              className="w-full border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors bg-white appearance-none"
            >
              <option value="">Selecione...</option>
              <option>Loja Padrão (a partir de 30m²)</option>
              <option>Loja Premium (60m² a 150m²)</option>
              <option>Quiosque & Pop-up (8m² a 20m²)</option>
              <option>Sala Comercial (15m² a 40m²)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-stone-500 tracking-wider uppercase mb-2">
              Segmento da Marca
            </label>
            <select
              name="segment"
              value={form.segment}
              onChange={handleChange}
              className="w-full border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors bg-white appearance-none"
            >
              <option value="">Selecione...</option>
              <option>Moda Feminina</option>
              <option>Moda Masculina</option>
              <option>Moda Infantil</option>
              <option>Calçados & Bolsas</option>
              <option>Acessórios</option>
              <option>Esportes & Lifestyle</option>
              <option>Casa & Decoração</option>
              <option>Serviços</option>
              <option>Outro</option>
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
              className="w-full border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors bg-white resize-none"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full md:w-auto bg-stone-900 text-white px-10 py-4 text-xs tracking-widest uppercase font-medium hover:bg-amber-700 transition-colors duration-300"
            >
              Enviar Solicitação
            </button>
            <p className="text-xs text-stone-400 mt-3">
              Ao enviar, você concorda com nossa política de privacidade. Respondemos em até 48h úteis.
            </p>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
