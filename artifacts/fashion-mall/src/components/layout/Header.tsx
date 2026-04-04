import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Settings } from 'lucide-react';
import { useSiteContent } from '@/services/content';

export default function Header() {
  const { navigationLinks, branding } = useSiteContent();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isHome = location === '/';
  const isTransparent = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isTransparent
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-stone-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col cursor-pointer"
            >
              <span
                className={`font-serif text-xl md:text-2xl font-bold tracking-widest transition-colors duration-300 ${
                  isTransparent ? 'text-white' : 'text-stone-900'
                }`}
              >
                {branding.mainName.toUpperCase()}
              </span>
              <span
                className={`text-xs tracking-[0.35em] font-light transition-colors duration-300 ${
                  isTransparent ? 'text-amber-300' : 'text-amber-600'
                }`}
              >
                {branding.secondaryName.toUpperCase()}
              </span>
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navigationLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={link.href}>
                  <span
                    className={`text-sm tracking-widest font-medium uppercase cursor-pointer transition-colors duration-200 relative group ${
                      isTransparent
                        ? 'text-white/90 hover:text-amber-300'
                        : 'text-stone-700 hover:text-amber-600'
                    } ${location === link.href ? (isTransparent ? 'text-amber-300' : 'text-amber-600') : ''}`}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-px transition-all duration-300 group-hover:w-full ${
                        location === link.href ? 'w-full' : 'w-0'
                      } ${isTransparent ? 'bg-amber-300' : 'bg-amber-600'}`}
                    />
                  </span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <ShoppingBag
              size={20}
              className={`hidden md:block transition-colors duration-300 ${
                isTransparent ? 'text-white/80' : 'text-stone-600'
              }`}
            />
            <Link href="/admin">
              <motion.span
                title="Painel Admin"
                className={`hidden md:flex items-center justify-center w-8 h-8 transition-colors duration-300 cursor-pointer ${
                  isTransparent
                    ? 'text-white/60 hover:text-white'
                    : 'text-stone-400 hover:text-amber-700'
                } ${location === '/admin' ? (isTransparent ? 'text-white' : 'text-amber-700') : ''}`}
              >
                <Settings size={17} />
              </motion.span>
            </Link>
            <button
              className={`md:hidden transition-colors duration-300 ${
                isTransparent ? 'text-white' : 'text-stone-900'
              }`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-stone-100 overflow-hidden"
          >
            <nav className="flex flex-col px-6 py-4 gap-4">
              {navigationLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className={`text-sm tracking-widest uppercase font-medium cursor-pointer block py-2 transition-colors ${
                      location === link.href ? 'text-amber-600' : 'text-stone-700'
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              <Link href="/admin">
                <span className="text-sm tracking-widest uppercase font-medium cursor-pointer block py-2 text-amber-600 border-t border-stone-100 mt-2 pt-4">
                  Admin
                </span>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
