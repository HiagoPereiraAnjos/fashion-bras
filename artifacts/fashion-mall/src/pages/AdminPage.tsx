import { useState, useRef } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Store, BookOpen, Users, Building2, Info,
  Plus, Trash2, Edit3, Save, X, ChevronDown, ChevronUp,
  RotateCcw, ExternalLink, AlertTriangle, Check, Image,
  Tag, Phone, Instagram, MapPin, Globe, Mail, Clock
} from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import type { Store as StoreType, BlogPost, Partner } from '@/types';
import { storeSegments } from '@/data/storesData';

// ── Shared UI ────────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text', className = '' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors bg-white ${className}`}
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors bg-white resize-vertical"
    />
  );
}

function Select({ value, onChange, options }: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors bg-white"
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function SaveButton({ onClick, saved }: { onClick: () => void; saved: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
        saved
          ? 'bg-green-600 text-white'
          : 'bg-stone-900 text-white hover:bg-amber-700'
      }`}
    >
      {saved ? <Check size={14} /> : <Save size={14} />}
      {saved ? 'Salvo!' : 'Salvar alterações'}
    </button>
  );
}

function useSaveState() {
  const [saved, setSaved] = useState(false);
  const trigger = (fn: () => void) => {
    fn();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  return { saved, trigger };
}

function SectionCard({ title, children, onReset }: { title: string; children: React.ReactNode; onReset?: () => void }) {
  return (
    <div className="bg-white border border-stone-100 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50">
        <h3 className="font-medium text-stone-800 text-sm">{title}</h3>
        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-red-500 transition-colors"
          >
            <RotateCcw size={12} />
            Restaurar padrão
          </button>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ── Tab: Configurações do Site ────────────────────────────────────────────────

function SiteSettingsTab() {
  const { siteSettings, setSiteSettings, resetSection } = useAdminData();
  const [form, setForm] = useState({ ...siteSettings });
  const { saved, trigger } = useSaveState();

  const update = (key: keyof typeof form, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const updateNavLink = (i: number, key: 'label' | 'href', val: string) => {
    const navLinks = [...form.navLinks];
    navLinks[i] = { ...navLinks[i], [key]: val };
    setForm((f) => ({ ...f, navLinks }));
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Identidade do Site" onReset={() => { resetSection('siteSettings'); setForm({ ...siteSettings }); }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nome do Shopping">
            <Input value={form.name} onChange={(v) => update('name', v)} placeholder="Fashion Bras" />
          </Field>
          <Field label="Slogan">
            <Input value={form.tagline} onChange={(v) => update('tagline', v)} placeholder="O destino da moda..." />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Informações de Contato">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'address', label: 'Endereço', icon: MapPin },
            { key: 'phone', label: 'Telefone', icon: Phone },
            { key: 'email', label: 'E-mail', icon: Mail },
            { key: 'hours', label: 'Horário de Funcionamento', icon: Clock },
            { key: 'instagram', label: 'Instagram', icon: Instagram },
            { key: 'facebook', label: 'Facebook', icon: Globe },
          ].map(({ key, label }) => (
            <Field key={key} label={label}>
              <Input
                value={form[key as keyof typeof form] as string}
                onChange={(v) => update(key as keyof typeof form, v)}
              />
            </Field>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Navegação">
        <div className="space-y-3">
          {form.navLinks.map((link, i) => (
            <div key={i} className="flex gap-3 items-center">
              <Input value={link.label} onChange={(v) => updateNavLink(i, 'label', v)} placeholder="Label" className="flex-1" />
              <Input value={link.href} onChange={(v) => updateNavLink(i, 'href', v)} placeholder="/caminho" className="flex-1" />
            </div>
          ))}
        </div>
      </SectionCard>

      <SaveButton onClick={() => trigger(() => setSiteSettings(form))} saved={saved} />
    </div>
  );
}

// ── Tab: Lojas ────────────────────────────────────────────────────────────────

function StoreEditor({ store, onSave, onClose }: {
  store: StoreType; onSave: (s: StoreType) => void; onClose: () => void;
}) {
  const [form, setForm] = useState({ ...store, images: [...store.images] });
  const update = (key: keyof StoreType, val: string) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center pt-16 pb-8 px-4"
    >
      <div className="bg-white w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50">
          <h3 className="font-medium text-stone-800">Editar Loja: {form.name}</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nome da Loja"><Input value={form.name} onChange={(v) => update('name', v)} /></Field>
            <Field label="Segmento">
              <Select value={form.segmentSlug} onChange={(v) => {
                const seg = storeSegments.find(s => s.slug === v);
                setForm(f => ({ ...f, segmentSlug: v, segment: seg?.label || v }));
              }} options={storeSegments.filter(s => s.slug !== 'todos').map(s => ({ value: s.slug, label: s.label }))} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Piso / Localização"><Input value={form.floor} onChange={(v) => update('floor', v)} /></Field>
            <Field label="Telefone"><Input value={form.phone} onChange={(v) => update('phone', v)} /></Field>
          </div>
          <Field label="Instagram"><Input value={form.instagram} onChange={(v) => update('instagram', v)} /></Field>
          <Field label="Descrição Curta"><Textarea value={form.description} onChange={(v) => update('description', v)} rows={2} /></Field>
          <Field label="Descrição Completa"><Textarea value={form.longDescription} onChange={(v) => update('longDescription', v)} rows={5} /></Field>
          <div>
            <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">Imagens (URLs)</label>
            {form.images.map((img, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input value={img} onChange={(v) => {
                  const imgs = [...form.images];
                  imgs[i] = v;
                  setForm(f => ({ ...f, images: imgs }));
                }} placeholder="https://..." />
                <button onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                  className="text-red-400 hover:text-red-600 px-2"><Trash2 size={14} /></button>
              </div>
            ))}
            <button onClick={() => setForm(f => ({ ...f, images: [...f.images, ''] }))}
              className="text-xs text-amber-700 hover:underline flex items-center gap-1 mt-1"><Plus size={12} /> Adicionar imagem</button>
          </div>
          <Field label="Destaque na Home">
            <label className="flex items-center gap-2 cursor-pointer mt-1">
              <input type="checkbox" checked={!!form.featured} onChange={(e) => setForm(f => ({ ...f, featured: e.target.checked }))} className="accent-amber-600" />
              <span className="text-sm text-stone-700">Exibir como loja em destaque na página inicial</span>
            </label>
          </Field>
        </div>
        <div className="px-6 py-4 border-t border-stone-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-xs text-stone-500 border border-stone-200 hover:border-stone-400 uppercase tracking-wider">Cancelar</button>
          <button onClick={() => { onSave(form); onClose(); }}
            className="px-5 py-2 bg-stone-900 text-white text-xs uppercase tracking-wider hover:bg-amber-700 transition-colors">
            Salvar Loja
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function StoresTab() {
  const { stores, setStores, resetSection } = useAdminData();
  const [editing, setEditing] = useState<StoreType | null>(null);
  const [saved, setSaved] = useState(false);

  const saveStore = (updated: StoreType) => {
    setStores(stores.map(s => s.id === updated.id ? updated : s));
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const deleteStore = (id: string) => {
    if (confirm('Remover esta loja?')) setStores(stores.filter(s => s.id !== id));
  };

  const addStore = () => {
    const newStore: StoreType = {
      id: `store-${Date.now()}`,
      name: 'Nova Loja',
      segment: 'Moda Feminina',
      segmentSlug: 'feminina',
      floor: 'Piso 1',
      description: '',
      longDescription: '',
      phone: '',
      instagram: '',
      images: ['https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80'],
      featured: false,
    };
    setStores([...stores, newStore]);
    setEditing(newStore);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-stone-500">{stores.length} lojas cadastradas</span>
          {saved && <span className="text-xs text-green-600 flex items-center gap-1"><Check size={12} /> Salvo</span>}
        </div>
        <div className="flex gap-2">
          <button onClick={() => resetSection('stores')} className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-red-500 transition-colors px-3 py-2 border border-stone-200">
            <RotateCcw size={12} /> Restaurar
          </button>
          <button onClick={addStore} className="flex items-center gap-2 bg-stone-900 text-white text-xs px-4 py-2 uppercase tracking-wider hover:bg-amber-700 transition-colors">
            <Plus size={14} /> Nova Loja
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {stores.map((store) => (
          <div key={store.id} className="flex items-center gap-4 bg-white border border-stone-100 p-4 hover:border-stone-200 transition-colors">
            <img src={store.images[0]} alt={store.name} className="w-14 h-14 object-cover shrink-0 bg-stone-100" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium text-stone-800 text-sm">{store.name}</p>
                {store.featured && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5">Destaque</span>}
              </div>
              <p className="text-xs text-stone-400 mt-0.5">{store.segment} · {store.floor}</p>
              <p className="text-xs text-stone-500 mt-1 truncate">{store.description}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setEditing(store)} className="p-2 text-stone-400 hover:text-amber-700 hover:bg-amber-50 transition-colors"><Edit3 size={15} /></button>
              <button onClick={() => deleteStore(store.id)} className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editing && <StoreEditor store={editing} onSave={saveStore} onClose={() => setEditing(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ── Tab: Blog ─────────────────────────────────────────────────────────────────

function PostEditor({ post, onSave, onClose }: {
  post: BlogPost; onSave: (p: BlogPost) => void; onClose: () => void;
}) {
  const [form, setForm] = useState({ ...post });
  const update = (key: keyof BlogPost, val: string | boolean) => setForm(f => ({ ...f, [key]: val }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center pt-16 pb-8 px-4"
    >
      <div className="bg-white w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50">
          <h3 className="font-medium text-stone-800 truncate pr-4">Editar Post: {form.title}</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 shrink-0"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <Field label="Título"><Input value={form.title} onChange={(v) => update('title', v)} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Slug (URL)"><Input value={form.slug} onChange={(v) => update('slug', v)} placeholder="titulo-do-post" /></Field>
            <Field label="Categoria">
              <Select value={form.category} onChange={(v) => update('category', v)} options={
                ['Tendências','Estilo','Eventos','Dicas','Moda Sustentável'].map(c => ({ value: c, label: c }))
              } />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Autor"><Input value={form.author} onChange={(v) => update('author', v)} /></Field>
            <Field label="Tempo de Leitura"><Input value={form.readTime} onChange={(v) => update('readTime', v)} placeholder="5 min" /></Field>
          </div>
          <Field label="Data de Publicação"><Input value={form.date} onChange={(v) => update('date', v)} /></Field>
          <Field label="Imagem de Capa (URL)"><Input value={form.coverImage} onChange={(v) => update('coverImage', v)} /></Field>
          {form.coverImage && <img src={form.coverImage} alt="" className="w-full h-32 object-cover border border-stone-100" />}
          <Field label="Resumo (excerpt)"><Textarea value={form.excerpt} onChange={(v) => update('excerpt', v)} rows={2} /></Field>
          <Field label="Conteúdo Completo"><Textarea value={form.content} onChange={(v) => update('content', v)} rows={10} placeholder="Use **texto** para negrito, duas linhas em branco para novo parágrafo..." /></Field>
          <Field label="Destaque">
            <label className="flex items-center gap-2 cursor-pointer mt-1">
              <input type="checkbox" checked={!!form.featured} onChange={(e) => update('featured', e.target.checked)} className="accent-amber-600" />
              <span className="text-sm text-stone-700">Exibir como artigo em destaque no topo do blog</span>
            </label>
          </Field>
        </div>
        <div className="px-6 py-4 border-t border-stone-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-xs text-stone-500 border border-stone-200 hover:border-stone-400 uppercase tracking-wider">Cancelar</button>
          <button onClick={() => { onSave(form); onClose(); }}
            className="px-5 py-2 bg-stone-900 text-white text-xs uppercase tracking-wider hover:bg-amber-700 transition-colors">
            Salvar Post
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function BlogTab() {
  const { blogPosts, setBlogPosts, resetSection } = useAdminData();
  const [editing, setEditing] = useState<BlogPost | null>(null);

  const savePost = (updated: BlogPost) => setBlogPosts(blogPosts.map(p => p.slug === updated.slug ? updated : p));
  const deletePost = (slug: string) => { if (confirm('Remover este artigo?')) setBlogPosts(blogPosts.filter(p => p.slug !== slug)); };

  const addPost = () => {
    const newPost: BlogPost = {
      slug: `post-${Date.now()}`,
      title: 'Novo Artigo',
      category: 'Tendências',
      date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
      excerpt: '',
      content: '',
      coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80',
      author: '',
      readTime: '5 min',
      featured: false,
    };
    setBlogPosts([...blogPosts, newPost]);
    setEditing(newPost);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-stone-500">{blogPosts.length} artigos</span>
        <div className="flex gap-2">
          <button onClick={() => resetSection('blogPosts')} className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-red-500 px-3 py-2 border border-stone-200">
            <RotateCcw size={12} /> Restaurar
          </button>
          <button onClick={addPost} className="flex items-center gap-2 bg-stone-900 text-white text-xs px-4 py-2 uppercase tracking-wider hover:bg-amber-700 transition-colors">
            <Plus size={14} /> Novo Artigo
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {blogPosts.map((post) => (
          <div key={post.slug} className="flex items-center gap-4 bg-white border border-stone-100 p-4">
            <img src={post.coverImage} alt="" className="w-20 h-14 object-cover shrink-0 bg-stone-100" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium text-stone-800 text-sm truncate">{post.title}</p>
                {post.featured && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 shrink-0">Destaque</span>}
              </div>
              <p className="text-xs text-stone-400 mt-0.5">{post.category} · {post.date} · {post.readTime}</p>
              <p className="text-xs text-stone-500 mt-1 truncate">{post.excerpt}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setEditing(post)} className="p-2 text-stone-400 hover:text-amber-700 hover:bg-amber-50 transition-colors"><Edit3 size={15} /></button>
              <button onClick={() => deletePost(post.slug)} className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editing && <PostEditor post={editing} onSave={savePost} onClose={() => setEditing(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ── Tab: Parceiros ────────────────────────────────────────────────────────────

function PartnersTab() {
  const { partners, setPartners, resetSection } = useAdminData();
  const { saved, trigger } = useSaveState();
  const [local, setLocal] = useState([...partners]);

  const update = (i: number, name: string) => setLocal(p => p.map((x, j) => j === i ? { ...x, name } : x));
  const remove = (i: number) => setLocal(p => p.filter((_, j) => j !== i));
  const add = () => setLocal(p => [...p, { id: String(Date.now()), name: 'Nova Marca' }]);

  return (
    <div className="space-y-6">
      <SectionCard title="Marcas e Parceiros" onReset={() => { resetSection('partners'); setLocal([...partners]); }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {local.map((p, i) => (
            <div key={p.id} className="flex gap-2">
              <Input value={p.name} onChange={(v) => update(i, v)} placeholder="Nome da marca" />
              <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 px-2"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <button onClick={add} className="text-xs text-amber-700 hover:underline flex items-center gap-1"><Plus size={12} /> Adicionar parceiro</button>
      </SectionCard>
      <SaveButton onClick={() => trigger(() => setPartners(local))} saved={saved} />
    </div>
  );
}

// ── Tab: Locação ──────────────────────────────────────────────────────────────

function LeasingTab() {
  const { leasingBenefits, setLeasingBenefits, spaceTypes, setSpaceTypes, testimonials, setTestimonials, leasingDifferentials, setLeasingDifferentials, resetSection } = useAdminData();
  const [localDiffs, setLocalDiffs] = useState([...leasingDifferentials]);
  const [localSpaces, setLocalSpaces] = useState([...spaceTypes]);
  const [localTestimonials, setLocalTestimonials] = useState([...testimonials]);
  const [localBenefits, setLocalBenefits] = useState([...leasingBenefits]);
  const { saved, trigger } = useSaveState();

  const saveAll = () => {
    setLeasingDifferentials(localDiffs);
    setSpaceTypes(localSpaces);
    setTestimonials(localTestimonials);
    setLeasingBenefits(localBenefits);
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Benefícios (ícones: MapPin, Users, Shield, Zap, TrendingUp, Star)" onReset={() => { resetSection('leasingBenefits'); setLocalBenefits([...leasingBenefits]); }}>
        <div className="space-y-4">
          {localBenefits.map((b, i) => (
            <div key={i} className="border border-stone-100 p-4 space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Ícone"><Input value={b.icon} onChange={(v) => setLocalBenefits(arr => arr.map((x,j) => j===i ? {...x,icon:v} : x))} /></Field>
                <Field label="Título"><Input value={b.title} onChange={(v) => setLocalBenefits(arr => arr.map((x,j) => j===i ? {...x,title:v} : x))} /></Field>
              </div>
              <Field label="Descrição"><Textarea value={b.description} onChange={(v) => setLocalBenefits(arr => arr.map((x,j) => j===i ? {...x,description:v} : x))} rows={2} /></Field>
              <button onClick={() => setLocalBenefits(arr => arr.filter((_,j) => j!==i))} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"><Trash2 size={11} /> Remover</button>
            </div>
          ))}
          <button onClick={() => setLocalBenefits(arr => [...arr, { icon: 'Star', title: '', description: '' }])} className="text-xs text-amber-700 hover:underline flex items-center gap-1"><Plus size={12} /> Adicionar benefício</button>
        </div>
      </SectionCard>

      <SectionCard title="Tipos de Espaço" onReset={() => { resetSection('spaceTypes'); setLocalSpaces([...spaceTypes]); }}>
        <div className="space-y-4">
          {localSpaces.map((s, i) => (
            <div key={i} className="border border-stone-100 p-4 space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nome"><Input value={s.name} onChange={(v) => setLocalSpaces(arr => arr.map((x,j) => j===i ? {...x,name:v} : x))} /></Field>
                <Field label="Tamanho"><Input value={s.size} onChange={(v) => setLocalSpaces(arr => arr.map((x,j) => j===i ? {...x,size:v} : x))} /></Field>
              </div>
              <Field label="Descrição"><Textarea value={s.description} onChange={(v) => setLocalSpaces(arr => arr.map((x,j) => j===i ? {...x,description:v} : x))} rows={2} /></Field>
              <button onClick={() => setLocalSpaces(arr => arr.filter((_,j) => j!==i))} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"><Trash2 size={11} /> Remover</button>
            </div>
          ))}
          <button onClick={() => setLocalSpaces(arr => [...arr, { name: '', size: '', description: '' }])} className="text-xs text-amber-700 hover:underline flex items-center gap-1"><Plus size={12} /> Adicionar espaço</button>
        </div>
      </SectionCard>

      <SectionCard title="Depoimentos de Lojistas" onReset={() => { resetSection('testimonials'); setLocalTestimonials([...testimonials]); }}>
        <div className="space-y-4">
          {localTestimonials.map((t, i) => (
            <div key={i} className="border border-stone-100 p-4 space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nome"><Input value={t.name} onChange={(v) => setLocalTestimonials(arr => arr.map((x,j) => j===i ? {...x,name:v} : x))} /></Field>
                <Field label="Loja"><Input value={t.store} onChange={(v) => setLocalTestimonials(arr => arr.map((x,j) => j===i ? {...x,store:v} : x))} /></Field>
              </div>
              <Field label="Depoimento"><Textarea value={t.text} onChange={(v) => setLocalTestimonials(arr => arr.map((x,j) => j===i ? {...x,text:v} : x))} rows={3} /></Field>
              <button onClick={() => setLocalTestimonials(arr => arr.filter((_,j) => j!==i))} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"><Trash2 size={11} /> Remover</button>
            </div>
          ))}
          <button onClick={() => setLocalTestimonials(arr => [...arr, { name: '', store: '', text: '' }])} className="text-xs text-amber-700 hover:underline flex items-center gap-1"><Plus size={12} /> Adicionar depoimento</button>
        </div>
      </SectionCard>

      <SectionCard title="Diferenciais (lista)" onReset={() => { resetSection('leasingDifferentials'); setLocalDiffs([...leasingDifferentials]); }}>
        <div className="space-y-2 mb-3">
          {localDiffs.map((d, i) => (
            <div key={i} className="flex gap-2">
              <Input value={d} onChange={(v) => setLocalDiffs(arr => arr.map((x,j) => j===i ? v : x))} />
              <button onClick={() => setLocalDiffs(arr => arr.filter((_,j) => j!==i))} className="text-red-400 hover:text-red-600 px-2"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <button onClick={() => setLocalDiffs(arr => [...arr, ''])} className="text-xs text-amber-700 hover:underline flex items-center gap-1"><Plus size={12} /> Adicionar diferencial</button>
      </SectionCard>

      <SaveButton onClick={() => trigger(saveAll)} saved={saved} />
    </div>
  );
}

// ── Tab: Sobre ────────────────────────────────────────────────────────────────

function AboutTab() {
  const { aboutData, setAboutData, resetSection } = useAdminData();
  const [local, setLocal] = useState({ ...aboutData, history: [...aboutData.history], values: [...aboutData.values], differentials: [...aboutData.differentials], team: [...aboutData.team] });
  const { saved, trigger } = useSaveState();

  return (
    <div className="space-y-6">
      <SectionCard title="Missão e Visão" onReset={() => { resetSection('aboutData'); setLocal({ ...aboutData, history: [...aboutData.history], values: [...aboutData.values], differentials: [...aboutData.differentials], team: [...aboutData.team] }); }}>
        <div className="space-y-4">
          <Field label="Missão"><Textarea value={local.mission} onChange={(v) => setLocal(f => ({ ...f, mission: v }))} rows={2} /></Field>
          <Field label="Visão"><Textarea value={local.vision} onChange={(v) => setLocal(f => ({ ...f, vision: v }))} rows={2} /></Field>
        </div>
      </SectionCard>

      <SectionCard title="História (parágrafos)">
        <div className="space-y-3">
          {local.history.map((p, i) => (
            <div key={i} className="flex gap-2">
              <Textarea value={p} onChange={(v) => setLocal(f => ({ ...f, history: f.history.map((x,j) => j===i ? v : x) }))} rows={3} />
              <button onClick={() => setLocal(f => ({ ...f, history: f.history.filter((_,j) => j!==i) }))} className="text-red-400 hover:text-red-600 px-2 self-start mt-1"><Trash2 size={14} /></button>
            </div>
          ))}
          <button onClick={() => setLocal(f => ({ ...f, history: [...f.history, ''] }))} className="text-xs text-amber-700 hover:underline flex items-center gap-1"><Plus size={12} /> Adicionar parágrafo</button>
        </div>
      </SectionCard>

      <SectionCard title="Valores">
        <div className="space-y-3">
          {local.values.map((v, i) => (
            <div key={i} className="border border-stone-100 p-3 space-y-2">
              <div className="grid grid-cols-3 gap-3">
                <Field label="Título"><Input value={v.title} onChange={(val) => setLocal(f => ({ ...f, values: f.values.map((x,j) => j===i ? {...x,title:val} : x) }))} /></Field>
                <div className="col-span-2"><Field label="Descrição"><Input value={v.description} onChange={(val) => setLocal(f => ({ ...f, values: f.values.map((x,j) => j===i ? {...x,description:val} : x) }))} /></Field></div>
              </div>
              <button onClick={() => setLocal(f => ({ ...f, values: f.values.filter((_,j) => j!==i) }))} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"><Trash2 size={11} /> Remover</button>
            </div>
          ))}
          <button onClick={() => setLocal(f => ({ ...f, values: [...f.values, { title: '', description: '' }] }))} className="text-xs text-amber-700 hover:underline flex items-center gap-1"><Plus size={12} /> Adicionar valor</button>
        </div>
      </SectionCard>

      <SectionCard title="Diferenciais">
        <div className="space-y-2 mb-3">
          {local.differentials.map((d, i) => (
            <div key={i} className="flex gap-2">
              <Input value={d} onChange={(v) => setLocal(f => ({ ...f, differentials: f.differentials.map((x,j) => j===i ? v : x) }))} />
              <button onClick={() => setLocal(f => ({ ...f, differentials: f.differentials.filter((_,j) => j!==i) }))} className="text-red-400 hover:text-red-600 px-2"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <button onClick={() => setLocal(f => ({ ...f, differentials: [...f.differentials, ''] }))} className="text-xs text-amber-700 hover:underline flex items-center gap-1"><Plus size={12} /> Adicionar</button>
      </SectionCard>

      <SectionCard title="Equipe">
        <div className="space-y-4">
          {local.team.map((m, i) => (
            <div key={i} className="border border-stone-100 p-4 space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nome"><Input value={m.name} onChange={(v) => setLocal(f => ({ ...f, team: f.team.map((x,j) => j===i ? {...x,name:v} : x) }))} /></Field>
                <Field label="Cargo"><Input value={m.role} onChange={(v) => setLocal(f => ({ ...f, team: f.team.map((x,j) => j===i ? {...x,role:v} : x) }))} /></Field>
              </div>
              <Field label="Descrição"><Textarea value={m.description} onChange={(v) => setLocal(f => ({ ...f, team: f.team.map((x,j) => j===i ? {...x,description:v} : x) }))} rows={2} /></Field>
              <button onClick={() => setLocal(f => ({ ...f, team: f.team.filter((_,j) => j!==i) }))} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"><Trash2 size={11} /> Remover</button>
            </div>
          ))}
          <button onClick={() => setLocal(f => ({ ...f, team: [...f.team, { name: '', role: '', description: '' }] }))} className="text-xs text-amber-700 hover:underline flex items-center gap-1"><Plus size={12} /> Adicionar membro</button>
        </div>
      </SectionCard>

      <SaveButton onClick={() => trigger(() => setAboutData(local))} saved={saved} />
    </div>
  );
}

// ── Main Admin Page ──────────────────────────────────────────────────────────

const TABS = [
  { id: 'settings', label: 'Configurações', icon: Settings },
  { id: 'stores', label: 'Lojas', icon: Store },
  { id: 'blog', label: 'Blog', icon: BookOpen },
  { id: 'partners', label: 'Parceiros', icon: Users },
  { id: 'leasing', label: 'Locação', icon: Building2 },
  { id: 'about', label: 'Sobre', icon: Info },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('settings');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const { resetAll, hasCustomData } = useAdminData();

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Admin Header */}
      <header className="bg-stone-950 text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-amber-500 flex items-center justify-center">
              <Settings size={13} className="text-white" />
            </div>
            <span className="font-serif font-bold tracking-wider text-sm">FASHION BRAS</span>
            <span className="text-stone-500 text-xs">/ Painel Administrativo</span>
          </div>
          <div className="flex items-center gap-3">
            {hasCustomData && (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-red-400 transition-colors"
              >
                <RotateCcw size={12} />
                Resetar tudo
              </button>
            )}
            <Link href="/">
              <span className="flex items-center gap-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 transition-colors cursor-pointer">
                <ExternalLink size={12} />
                Ver Site
              </span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-stone-900 mb-1">Painel de Administração</h1>
          <p className="text-stone-500 text-sm">Gerencie todo o conteúdo do site Fashion Bras. As alterações são salvas localmente e aplicadas imediatamente.</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-48 shrink-0">
            <nav className="space-y-1 sticky top-20">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-amber-700 font-medium border-l-2 border-amber-600 shadow-sm'
                        : 'text-stone-600 hover:bg-white hover:text-stone-900'
                    }`}
                  >
                    <Icon size={15} className={activeTab === tab.id ? 'text-amber-600' : 'text-stone-400'} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'settings' && <SiteSettingsTab />}
                {activeTab === 'stores' && <StoresTab />}
                {activeTab === 'blog' && <BlogTab />}
                {activeTab === 'partners' && <PartnersTab />}
                {activeTab === 'leasing' && <LeasingTab />}
                {activeTab === 'about' && <AboutTab />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Reset confirm modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white p-8 max-w-sm w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle size={22} className="text-amber-600 shrink-0" />
                <h3 className="font-serif text-xl font-bold text-stone-900">Resetar tudo?</h3>
              </div>
              <p className="text-stone-500 text-sm mb-6">Todas as suas personalizações serão removidas e o conteúdo padrão será restaurado. Esta ação não pode ser desfeita.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowResetConfirm(false)} className="flex-1 border border-stone-200 py-2.5 text-xs uppercase tracking-wider text-stone-600 hover:border-stone-400">Cancelar</button>
                <button onClick={() => { resetAll(); setShowResetConfirm(false); }} className="flex-1 bg-red-600 text-white py-2.5 text-xs uppercase tracking-wider hover:bg-red-700">Resetar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
