import React from 'react';
import {
  GraduationCap,
  UtensilsCrossed,
  HeartPulse,
  Users,
  ArrowRight,
  Sparkles,
  Heart,
  CheckCircle2,
} from 'lucide-react';
import { DonationCause } from '../../types/donation';

interface ImpactSectionProps {
  onSelectCause: (cause: DonationCause) => void;
}

interface ImpactCardItem {
  id: DonationCause;
  title: string;
  tag: string;
  tagColor: string;
  badgeBg: string;
  iconColor: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
  alt: string;
  description: string;
  impactMetric: string;
  ctaText: string;
}

export const ImpactSection: React.FC<ImpactSectionProps> = ({ onSelectCause }) => {
  const impactCards: ImpactCardItem[] = [
    {
      id: 'EDUCATION',
      title: 'Education & Scholarships',
      tag: 'Education & Youth',
      tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      badgeBg: 'bg-emerald-600 text-white',
      iconColor: 'text-emerald-700',
      icon: GraduationCap,
      image: '/assets/donations/education_impact.jpg',
      alt: 'Children studying in rural classroom',
      description:
        'Sponsor schooling, textbooks, uniforms, and digital literacy labs for underprivileged children across village learning centers.',
      impactMetric: '₹1,000 sponsors complete study kits & academic support for 2 children for a month.',
      ctaText: 'Support Education',
    },
    {
      id: 'NUTRITION',
      title: 'Food & Essential Support',
      tag: 'Nutrition & Hunger',
      tagColor: 'bg-amber-50 text-amber-800 border-amber-200',
      badgeBg: 'bg-amber-600 text-white',
      iconColor: 'text-amber-700',
      icon: UtensilsCrossed,
      image: '/assets/donations/food_impact.jpg',
      alt: 'Community cooked meal distribution drive',
      description:
        'Deliver daily hot, wholesome meals and dry ration supply kits to impoverished families, day laborers, and vulnerable elders.',
      impactMetric: '₹500 provides 50 nutritious hot meals with fresh grain & pulse rations.',
      ctaText: 'Support Food Relief',
    },
    {
      id: 'HEALTHCARE',
      title: 'Healthcare & Well-being',
      tag: 'Primary Healthcare',
      tagColor: 'bg-rose-50 text-rose-800 border-rose-200',
      badgeBg: 'bg-rose-600 text-white',
      iconColor: 'text-rose-700',
      icon: HeartPulse,
      image: '/assets/donations/healthcare_impact.jpg',
      alt: 'Doctor providing medical checkup at rural clinic',
      description:
        'Conduct free mobile health camps, maternal care diagnostics, essential medicine distribution, and pediatric health checkups.',
      impactMetric: '₹1,500 funds medical checkups and prescribed medicines for 5 patients.',
      ctaText: 'Support Healthcare',
    },
    {
      id: 'COMMUNITY_DEV',
      title: 'Community Development',
      tag: 'Empowerment & SHG',
      tagColor: 'bg-slate-100 text-slate-800 border-slate-300',
      badgeBg: 'bg-slate-900 text-white',
      iconColor: 'text-slate-800',
      icon: Users,
      image: '/assets/donations/community_impact.jpg',
      alt: 'Women self-help group livelihood training',
      description:
        'Empower women self-help groups with vocational skills, clean drinking water borewells, and village infrastructure upgrades.',
      impactMetric: '₹2,500 provides an artisan toolkit and entrepreneurship seed training.',
      ctaText: 'Support Community',
    },
  ];

  return (
    <section id="impact-section" className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Social Initiatives</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Your Donation Creates Impact
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Every contribution directly funds audited, physical ground-level interventions.
            Select a verified cause below to direct your contribution where it matters most.
          </p>
        </div>

        {/* 4 Attractive Cards Grid: 1 col on mobile, 2 cols on tablet, 4 cols on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {impactCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onSelectCause(card.id)}
                className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xs hover:shadow-xl hover:border-slate-400 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer hover:-translate-y-1.5 text-left"
              >
                <div>
                  {/* Top Image Container with subtle zoom effect */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                    <img
                      src={card.image}
                      alt={card.alt}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-black/10 to-transparent" />

                    {/* Top Floating Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md shadow-xs border ${card.tagColor} bg-white/95`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{card.tag}</span>
                      </span>
                    </div>

                    {/* Verified Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-700 text-white shadow-xs">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    </div>

                    {/* Bottom overlay title highlight */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="w-9 h-9 rounded-xl bg-white/95 backdrop-blur-md flex items-center justify-center shadow-md mb-1.5 border border-slate-200">
                        <Icon className={`w-5 h-5 ${card.iconColor}`} />
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition">
                      {card.title}
                    </h3>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCause(card.id);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 group-hover:bg-slate-900 text-slate-800 group-hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer border border-slate-300 group-hover:border-slate-900 shadow-2xs"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600 group-hover:fill-white group-hover:text-white transition-colors" />
                    <span>{card.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
