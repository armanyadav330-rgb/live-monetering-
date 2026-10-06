import React from 'react';
import { Quote, Sparkles, MapPin, Award, Heart } from 'lucide-react';
import { SuccessStory } from '../../types/donation';

export const SuccessStories: React.FC = () => {
  const stories: SuccessStory[] = [
    {
      id: 'pooja',
      name: 'Pooja Kumari',
      age: 15,
      location: 'Faridkot, Punjab',
      program: 'Digital Education & Merit Scholarship',
      quote:
        'When my school fees were sponsored, a whole new world opened up. Now I teach coding basics to younger girls in our village.',
      story:
        'The daughter of a smallholder farmer, Pooja faced dropping out of school at age 13. Through our donor-supported scholarship and community smart classroom, she achieved 94% in STEM exams and is preparing for regional polytechnic engineering entrance.',
      imageUrl: '/assets/donations/story_pooja.jpg',
      impactMetric: 'Sponsored for 3 consecutive academic years',
    },
    {
      id: 'rameshwar',
      name: 'Rameshwar Ji',
      age: 71,
      location: 'Dahod District, Gujarat',
      program: 'Mobile Health & Nutrition Care for Seniors',
      quote:
        'At my age, when going to the distant town hospital was impossible, the mobile clinic came right to my doorstep with warmth and medicines.',
      story:
        'Living alone in a rural hamlet with chronic hypertension, Rameshwar Ji now receives weekly diagnostic monitoring, prescribed medicines, and nutritious grain kits delivered by our volunteer health workers.',
      imageUrl: '/assets/donations/story_rameshwar.jpg',
      impactMetric: 'Receives bi-weekly wellness checks & nutrition kits',
    },
    {
      id: 'meena',
      name: 'Meena Devi',
      age: 38,
      location: 'Gaya, Bihar',
      program: 'Women Self-Help Group (SHG) Livelihoods',
      quote:
        'Financial independence gave us dignity. Now our children attend school without worry, and we contribute to our household with pride.',
      story:
        'Meena was trained through our micro-enterprise program in textile handicraft production. Today she coordinates a 22-woman self-help collective, creating sustainable income for rural families.',
      imageUrl: '/assets/donations/story_meena.jpg',
      impactMetric: 'Empowered 22 rural women with stable monthly earnings',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-900 border border-slate-300 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-slate-900" />
            <span>Real Lives Transformed</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Stories of Hope & Dignity
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Behind every statistic is a human story. Your donations create real, lasting change
            for people who simply needed an opportunity to thrive.
          </p>
        </div>

        {/* 3 Success Story Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1 text-left"
            >
              <div>
                {/* Header Image with subtle badge */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <img
                    src={story.imageUrl}
                    alt={story.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Program Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-900/90 text-white backdrop-blur-xs shadow-xs border border-white/20">
                      {story.program}
                    </span>
                  </div>

                  {/* Beneficiary Name & Location */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-lg font-black tracking-tight flex items-center justify-between">
                      <span>{story.name}, {story.age}</span>
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-white font-medium mt-0.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{story.location}</span>
                    </div>
                  </div>
                </div>

                {/* Story Body */}
                <div className="p-6">
                  {/* Quote */}
                  <div className="relative pl-6 italic text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mb-4">
                    <Quote className="w-4 h-4 text-slate-900 absolute -top-1 left-0 shrink-0 opacity-80" />
                    “{story.quote}”
                  </div>

                  {/* Narrative */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {story.story}
                  </p>
                </div>
              </div>

              {/* Verified Impact Pill at footer */}
              <div className="p-6 pt-0">
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-300 text-[11px] font-semibold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-slate-900 shrink-0" />
                  <span>{story.impactMetric}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
