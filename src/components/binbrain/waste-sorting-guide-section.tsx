"use client";

import Image from 'next/image';
import { SectionWrapper } from './section-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Recycle, Leaf, Trash2, Smartphone, Biohazard, Package } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface WasteCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  iconColor: string;
  description: string;
  examples: string[];
  imageHint: string;
}

const wasteCategories: WasteCategory[] = [
  {
    id: 'recyclables',
    name: 'Recyclables',
    icon: Recycle,
    iconColor: 'text-blue-500',
    description: 'Items that can be processed and remanufactured into new products. Ensure they are clean and dry.',
    examples: ['Paper (newspapers, magazines, cardboard)', 'Plastic bottles & containers (rinsed)', 'Glass bottles & jars (rinsed)', 'Metal cans (tin, aluminum, steel)'],
    imageHint: 'recyclable materials pile',
  },
  {
    id: 'organic',
    name: 'Organic Waste',
    icon: Leaf,
    iconColor: 'text-green-600',
    description: 'Biodegradable waste that can be composted. Includes food scraps and yard trimmings.',
    examples: ['Fruit & vegetable peels', 'Coffee grounds & tea bags', 'Eggshells', 'Grass clippings & leaves'],
    imageHint: 'organic compost bin',
  },
  {
    id: 'general',
    name: 'General Waste',
    icon: Trash2,
    iconColor: 'text-gray-700',
    description: 'Non-recyclable, non-hazardous waste that goes to landfill. Aim to minimize this category.',
    examples: ['Plastic bags & wrappers', 'Styrofoam', 'Broken ceramics', 'Non-recyclable packaging'],
    imageHint: 'general landfill waste',
  },
  {
    id: 'ewaste',
    name: 'E-Waste',
    icon: Smartphone,
    iconColor: 'text-purple-600',
    description: 'Discarded electronic devices. Often contain hazardous materials and require special disposal.',
    examples: ['Old phones & chargers', 'Computers & accessories', 'Batteries', 'Light bulbs (CFLs)'],
    imageHint: 'electronic waste items',
  },
  {
    id: 'hazardous',
    name: 'Hazardous Waste',
    icon: Biohazard,
    iconColor: 'text-red-600',
    description: 'Waste that poses a substantial or potential threat to public health or the environment.',
    examples: ['Chemicals & solvents', 'Paints & thinners', 'Pesticides', 'Medical waste (needles, expired meds)'],
    imageHint: 'hazardous waste symbols',
  },
   {
    id: 'paper',
    name: 'Paper & Cardboard',
    icon: Package,
    iconColor: 'text-yellow-600',
    description: 'Clean paper and cardboard products. Flatten boxes to save space.',
    examples: ['Newspapers, magazines, junk mail', 'Cardboard boxes (flattened)', 'Paperboard (cereal boxes)', 'Office paper'],
    imageHint: 'stacked paper cardboard',
  },
];

export function WasteSortingGuideSection() {
  return (
    <SectionWrapper
      id="guide"
      title="Waste Sorting Guide"
      description="Learn how to properly sort your waste to promote recycling and environmental health."
      className="bg-secondary/50"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {wasteCategories.map((category) => (
          <Card key={category.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center mb-3">
                <category.icon className={`w-8 h-8 mr-3 ${category.iconColor}`} />
                <CardTitle className="text-2xl">{category.name}</CardTitle>
              </div>
              <CardDescription className="text-base">{category.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
              <div>
                <h4 className="font-semibold mb-2 text-md">Examples:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {category.examples.map((example, index) => (
                    <li key={index}>{example}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 rounded-md overflow-hidden aspect-video relative">
                 <Image
                    src={`https://placehold.co/400x250/e2e8f0/64748b?text=${category.name.replace(' ','+')}`} // Placeholder with category name
                    alt={`${category.name} waste sorting`}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={category.imageHint}
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
}
