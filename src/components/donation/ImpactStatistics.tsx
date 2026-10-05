import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  CheckCircle2,
  X,
  Maximize2,
  Heart,
  Calendar,
} from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  image: string;
  fallbackImage: string;
  description: string;
  beneficiaries: string;
}

export const ImpactStatistics: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'medical-camp',
      title: 'Free Rural Pediatric & Elderly Health Camp',
      category: 'Healthcare & Wellness',
      location: 'Wardha District, Maharashtra',
      date: 'Weekly Initiative',
      image: '/assets/gallery/medical_camp.jpg',
      fallbackImage: '/assets/donations/healthcare_impact.jpg',
      description:
        'Comprehensive health checkups, infant growth monitoring, vision screenings, and free essential medicine distribution for remote villages.',
      beneficiaries: '350+ patients screened per camp',
    },
    {
      id: 'education-drive',
      title: 'Open-Air Learning & School Kit Distribution',
      category: 'Education & Youth',
      location: 'Ranchi Rural Cluster, Jharkhand',
      date: 'Ongoing Program',
      image: '/assets/gallery/education_drive.jpg',
      fallbackImage: '/assets/donations/education_impact.jpg',
      description:
        'Equipping first-generation learners with school bags, notebooks, textbooks, stationery, and fundamental digital literacy tutorials.',
      beneficiaries: '1,200+ students supported',
    },
    {
      id: 'food-seva',
      title: 'Nutritious Hot Cooked Meal Distribution',
      category: 'Zero Hunger Support',
      location: 'Urban Slum Outreach, Delhi NCR',
      date: 'Daily Drive',
      image: '/assets/gallery/food_seva.jpg',
      fallbackImage: '/assets/donations/food_impact.jpg',
      description:
        'Freshly prepared khichdi, lentils, vegetables, and fruit rations delivered daily to homeless citizens, ragpickers, and daily laborers.',
      beneficiaries: '800+ hot meals served daily',
    },
    {
      id: 'women-empowerment',
      title: 'Women Self-Help Group (SHG) Livelihood Workshop',
      category: 'Community Empowerment',
      location: 'Udaipur Rural, Rajasthan',
      date: 'Bi-monthly Cohort',
      image: '/assets/gallery/community_empowerment.jpg',
      fallbackImage: '/assets/donations/community_impact.jpg',
      description:
        'Vocational handicraft, tailoring, and micro-business financial literacy training helping rural women achieve sustainable financial independence.',
      beneficiaries: '450+ women micro-entrepreneurs',
    },
    {
      id: 'clean-water',
      title: 'Community Clean Drinking Water Initiative',
      category: 'Health & Sanitation',
      location: 'Bundelkhand Region, Uttar Pradesh',
      date: 'Community Project',
      image: '/assets/gallery/clean_water.jpg',
      fallbackImage: '/assets/donations/community_impact.jpg',
      description:
        'Installation of deep-bore solar water filtration units providing clean, safe, and fluorosis-free drinking water to drought-prone hamlets.',
      beneficiaries: '2,800+ villagers with safe water',
    },
    {
      id: 'child-welfare',
      title: 'Child Nutrition & Early Care Development',
      category: 'Child Welfare',
      location: 'Tribal Belt, Odisha',
      date: 'Active Project',
      image: '/assets/gallery/child_welfare.jpg',
      fallbackImage: '/assets/donations/education_impact.jpg',
      description:
        'Supplementary protein nutrition packs, warm winter clothes, immunization follow-ups, and safe childhood learning spaces.',
      beneficiaries: '600+ infants & toddlers',
    },
  ];

  return (
    <section
      id="ngo-gallery-section"
      className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-blue-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Verified NGO Ground Activities</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B2545] tracking-tight">
            Our Work in Action
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Real photographic glimpses from accredited NGO field interventions across India.
            Every drive is physically verified with live timestamps and geotagged audits.
          </p>
        </div>

        {/* 6 High-Res NGO Activities Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="group bg-white rounded-2xl sm:rounded-3xl border border-blue-100 shadow-2xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1.5 text-left flex flex-col justify-between"
            >
              <div>
                {/* Photo Container with smooth zoom */}
                <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src.indexOf(item.fallbackImage) === -1) {
                        target.src = item.fallbackImage;
                      }
                    }}
                  />
                  {/* Natural photo gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545]/80 via-black/20 to-transparent" />

                  {/* Top Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-blue-900 shadow-xs backdrop-blur-md border border-blue-100">
                      <span>{item.category}</span>
                    </span>
                  </div>

                  {/* Top Right Verified Tag */}
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-600 text-white shadow-xs">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  </div>

                  {/* Bottom Photo Overlay Info */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center gap-1.5 text-xs text-sky-300 font-semibold mb-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>

                  {/* Hover View Full Photo Button */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <span className="px-4 py-2 rounded-full bg-white/95 text-[#0B2545] font-bold text-xs flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform border border-blue-100">
                      <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>View Photo Details</span>
                    </span>
                  </div>
                </div>

                {/* Card Text Content */}
                <div className="p-5 sm:p-6 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-blue-500" />
                      {item.date}
                    </span>
                    <span className="font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 text-[10px]">
                      {item.beneficiaries}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#0B2545] leading-snug group-hover:text-blue-600 transition">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="p-5 sm:p-6 pt-0">
                <div className="w-full py-2 px-3 rounded-xl bg-blue-50/70 group-hover:bg-[#0B2545] text-blue-900 group-hover:text-white font-bold text-xs flex items-center justify-between transition-colors border border-blue-100 group-hover:border-[#0B2545]">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 fill-blue-600 text-blue-600 group-hover:fill-white group-hover:text-white transition-colors" />
                    <span>Active Community Intervention</span>
                  </span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Enlarged Photo */}
            <div className="relative h-72 sm:h-96 w-full bg-black">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src.indexOf(selectedPhoto.fallbackImage) === -1) {
                    target.src = selectedPhoto.fallbackImage;
                  }
                }}
              />
              <div className="absolute bottom-3 left-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-[#0B2545] shadow-md">
                  {selectedPhoto.category}
                </span>
              </div>
            </div>

            {/* Photo Details */}
            <div className="p-6 sm:p-8 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{selectedPhoto.location}</span>
                </div>
                <span className="font-semibold text-slate-700">{selectedPhoto.beneficiaries}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-[#0B2545] leading-snug">
                {selectedPhoto.title}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedPhoto.description}
              </p>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Field Audit Verified by Satya Nirakshak Ground Monitoring</span>
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
