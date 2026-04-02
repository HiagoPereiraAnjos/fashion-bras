import type { LeasingBenefit, SpaceType, Testimonial } from '@/types';

export const leasingBenefits: LeasingBenefit[] = [
  {
    icon: 'MapPin',
    title: 'Localização Estratégica',
    description:
      'Situado em uma das regiões de maior fluxo da cidade, o Fashion Bras garante visibilidade e acesso a um público qualificado e com alto poder de compra.',
  },
  {
    icon: 'Users',
    title: 'Alto Fluxo de Visitantes',
    description:
      'Com mais de 50.000 visitantes por mês, o Fashion Bras oferece um volume consistente de clientes potenciais para o seu negócio crescer.',
  },
  {
    icon: 'Shield',
    title: 'Segurança 24 Horas',
    description:
      'Monitoramento contínuo, equipe de segurança treinada e sistema de vigilância de última geração garantem a tranquilidade de lojistas e clientes.',
  },
  {
    icon: 'Zap',
    title: 'Infraestrutura Completa',
    description:
      'Internet de alta velocidade, sistema elétrico dimensionado para varejo, climatização central e espaços de carga e descarga planejados para facilitar sua operação.',
  },
  {
    icon: 'TrendingUp',
    title: 'Suporte ao Lojista',
    description:
      'Equipe dedicada para apoiar desde a montagem da loja até campanhas de marketing conjuntas. Você não está sozinho — crescemos juntos.',
  },
  {
    icon: 'Star',
    title: 'Mix Comercial Curado',
    description:
      'Selecionamos cuidadosamente as marcas que fazem parte do Fashion Bras para garantir que o mix de lojas seja complementar, sofisticado e atrativo.',
  },
];

export const spaceTypes: SpaceType[] = [
  {
    name: 'Loja Padrão',
    size: 'A partir de 30m²',
    description:
      'Ideal para marcas em crescimento que buscam um espaço funcional e bem localizado nos corredores principais do shopping.',
  },
  {
    name: 'Loja Premium',
    size: 'De 60m² a 150m²',
    description:
      'Espaços amplos com localização diferenciada, vitrines duplas e maior visibilidade. Perfeito para marcas consolidadas que buscam presença de destaque.',
  },
  {
    name: 'Quiosque & Pop-up',
    size: 'De 8m² a 20m²',
    description:
      'Solução flexível para marcas que desejam testar o mercado, lançar produtos ou ter presença temporária com baixo investimento inicial.',
  },
  {
    name: 'Sala Comercial',
    size: 'De 15m² a 40m²',
    description:
      'Espaços destinados a serviços complementares: estúdios de beleza, consultórios de imagem, ateliês e serviços especializados em moda.',
  },
];

export const testimonials: Testimonial[] = [
  {
    name: 'Camila Rodrigues',
    store: 'Aria Moda',
    text: 'Abrir nossa loja no Fashion Bras foi a decisão mais acertada da nossa história. O suporte da equipe, o perfil dos clientes e o ambiente sofisticado do shopping fizeram toda a diferença para o crescimento da marca.',
  },
  {
    name: 'Ricardo Pedrosa',
    store: 'Brutal Homme',
    text: 'O Fashion Bras não é apenas um espaço para vender — é uma comunidade de lojistas que se apoiam e crescem juntos. O ambiente, o fluxo de clientes e as iniciativas de marketing do shopping são incomparáveis.',
  },
  {
    name: 'Mariana Lima',
    store: 'Sole Story',
    text: 'Estamos há dois anos no Fashion Bras e cada ano superamos nossas metas. A gestão do shopping é transparente, parceira e sempre atenta às necessidades dos lojistas. Recomendo sem hesitar.',
  },
];

export const leasingDifferentials = [
  'Gestão profissional e transparente',
  'Campanhas de marketing coletivas incluídas',
  'Eventos exclusivos para lojistas e clientes',
  'Estacionamento amplo e gratuito para clientes',
  'Praça de alimentação premium para conforto dos visitantes',
  'Programa de fidelidade integrado entre as lojas',
  'Espaço de co-working para lojistas',
  'Treinamentos e capacitações mensais gratuitos',
];
