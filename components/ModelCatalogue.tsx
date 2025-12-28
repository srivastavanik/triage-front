'use client';

import type { JSX } from 'react';
import Image from 'next/image';

const PROVIDER_LOGOS = [
  { name: 'Anthropic', src: '/anthropic-logo.webp' },
  { name: 'Google', src: '/google-logo.png' },
  { name: 'OpenAI', src: '/openai-logo.svg' },
  { name: 'xAI', src: '/xai-logo.png' },
  { name: 'Hugging Face', src: '/huggingface-logo.png' },
  { name: 'Meta', src: '/meta-logo.png' },
  { name: 'AWS', src: '/aws-logo.png' },
];

export function ModelCatalogue(): JSX.Element {
  return (
    <div className="model-catalogue">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-[36px] lg:text-[42px] font-normal leading-[1.1] tracking-[-0.02em] mb-4">
          Unified observability for every model
        </h2>
        <p className="text-text-secondary text-[17px] max-w-xl mx-auto">
          One integration for complete visibility across all your AI providers and models
        </p>
      </div>

      {/* Provider Logos */}
      <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 lg:gap-20">
        {PROVIDER_LOGOS.map((logo) => (
          <div key={logo.name} className="flex items-center justify-center">
            <Image
              src={logo.src}
              alt={logo.name}
              width={200}
              height={60}
              className="h-12 md:h-16 lg:h-20 w-auto opacity-60 hover:opacity-100 transition-opacity"
              style={{ 
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
