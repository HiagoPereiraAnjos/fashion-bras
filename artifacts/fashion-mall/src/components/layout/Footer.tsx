import { Link } from 'wouter';
import { Instagram, Facebook, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { siteSettings } from '@/data/siteSettings';

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-300">
      {/* Top divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <p className="font-serif text-2xl font-bold text-white tracking-widest">FASHION</p>
              <p className="text-amber-500 text-xs tracking-[0.35em] font-light">BRAS</p>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed mb-6">
              O destino da moda que você merece. Marcas selecionadas, experiências únicas,
              estilo que inspira.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-stone-700 flex items-center justify-center hover:border-amber-500 hover:text-amber-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-stone-700 flex items-center justify-center hover:border-amber-500 hover:text-amber-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white text-xs tracking-[0.25em] uppercase font-medium mb-6">
              Navegação
            </h4>
            <ul className="space-y-3">
              {siteSettings.navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-stone-400 hover:text-amber-400 text-sm transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-xs tracking-[0.25em] uppercase font-medium mb-6">
              Contato
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-stone-400">
                <MapPin size={16} className="text-amber-500 mt-0.5 shrink-0" />
                <span>{siteSettings.address}</span>
              </li>
              <li className="flex gap-3 text-sm text-stone-400">
                <Phone size={16} className="text-amber-500 mt-0.5 shrink-0" />
                <span>{siteSettings.phone}</span>
              </li>
              <li className="flex gap-3 text-sm text-stone-400">
                <Mail size={16} className="text-amber-500 mt-0.5 shrink-0" />
                <span>{siteSettings.email}</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-white text-xs tracking-[0.25em] uppercase font-medium mb-6">
              Horário de Funcionamento
            </h4>
            <div className="flex gap-3 text-sm text-stone-400">
              <Clock size={16} className="text-amber-500 mt-0.5 shrink-0" />
              <span>{siteSettings.hours}</span>
            </div>
            <div className="mt-8">
              <p className="text-xs text-stone-500 uppercase tracking-widest mb-3">Locação de Lojas</p>
              <Link href="/locacao">
                <span className="text-amber-500 hover:text-amber-400 text-sm transition-colors cursor-pointer border-b border-amber-500/40 pb-0.5">
                  Saiba mais sobre locação
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-stone-500 text-xs">
            &copy; {new Date().getFullYear()} Fashion Bras. Todos os direitos reservados.
          </p>
          <p className="text-stone-600 text-xs">
            Desenvolvido com excelência para a moda brasileira.
          </p>
        </div>
      </div>
    </footer>
  );
}
