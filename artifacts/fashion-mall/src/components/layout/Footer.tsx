import { Link } from 'wouter';
import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { useSiteContent } from '@/services/content';
import type { SiteSocialProfile } from '@/types';

function SocialIconLink({
  profile,
  icon: Icon,
  label,
}: {
  profile: SiteSocialProfile;
  icon: typeof Instagram;
  label: string;
}) {
  if (!profile.isAvailable) {
    return (
      <span
        className="w-9 h-9 rounded-full border border-stone-700 flex items-center justify-center opacity-50 cursor-not-allowed"
        aria-label={`${label} indisponivel`}
      >
        <Icon size={16} />
      </span>
    );
  }

  return (
    <a
      href={profile.href}
      className="w-9 h-9 rounded-full border border-stone-700 flex items-center justify-center transition-colors hover:border-amber-500 hover:text-amber-500"
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon size={16} />
    </a>
  );
}

export default function Footer() {
  const { branding, contactInfo, footer, socialLinks } = useSiteContent();

  return (
    <footer className="bg-stone-950 text-stone-300">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <div className="mb-6">
              <p className="font-serif text-2xl font-bold text-white tracking-widest">
                {branding.mainName.toUpperCase()}
              </p>
              <p className="text-amber-500 text-xs tracking-[0.35em] font-light">
                {branding.secondaryName.toUpperCase()}
              </p>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed mb-6">{footer.description}</p>
            <div className="flex gap-4">
              <SocialIconLink profile={socialLinks.instagram} icon={Instagram} label="Instagram" />
              <SocialIconLink profile={socialLinks.facebook} icon={Facebook} label="Facebook" />
            </div>
          </div>

          <div>
            <h4 className="text-white text-xs tracking-[0.25em] uppercase font-medium mb-6">
              Navegacao
            </h4>
            <ul className="space-y-3">
              {footer.links.map((link) => (
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

          <div>
            <h4 className="text-white text-xs tracking-[0.25em] uppercase font-medium mb-6">
              Contato
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-stone-400">
                <MapPin size={16} className="text-amber-500 mt-0.5 shrink-0" />
                <span>{contactInfo.address}</span>
              </li>
              <li className="flex gap-3 text-sm text-stone-400">
                <Phone size={16} className="text-amber-500 mt-0.5 shrink-0" />
                <span>{contactInfo.phone}</span>
              </li>
              <li className="flex gap-3 text-sm text-stone-400">
                <Mail size={16} className="text-amber-500 mt-0.5 shrink-0" />
                <span>{contactInfo.email}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs tracking-[0.25em] uppercase font-medium mb-6">
              Horario de Funcionamento
            </h4>
            <div className="flex gap-3 text-sm text-stone-400">
              <Clock size={16} className="text-amber-500 mt-0.5 shrink-0" />
              <span>{contactInfo.hours}</span>
            </div>
            <div className="mt-8">
              <p className="text-xs text-stone-500 uppercase tracking-widest mb-3">Locacao de Lojas</p>
              <Link href={footer.leasingLink.href}>
                <span className="text-amber-500 hover:text-amber-400 text-sm transition-colors cursor-pointer border-b border-amber-500/40 pb-0.5">
                  {footer.leasingLink.label}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-stone-500 text-xs">
            &copy; {new Date().getFullYear()} {branding.fullName}. Todos os direitos reservados.
          </p>
          <p className="text-stone-600 text-xs">{footer.legalNote}</p>
        </div>
      </div>
    </footer>
  );
}
