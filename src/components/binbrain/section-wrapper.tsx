import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  contentClassName?: string;
}

export function SectionWrapper({
  id,
  title,
  description,
  children,
  className,
  titleClassName,
  descriptionClassName,
  contentClassName,
}: SectionWrapperProps) {
  return (
    <section id={id} className={cn("py-12 md:py-16 lg:py-20", className)}>
      <div className="container max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-8 md:mb-12">
          <h2 className={cn("text-3xl sm:text-4xl font-bold tracking-tight text-foreground", titleClassName)}>
            {title}
          </h2>
          {description && (
            <p className={cn("mt-3 sm:mt-4 text-lg sm:text-xl text-muted-foreground", descriptionClassName)}>
              {description}
            </p>
          )}
        </div>
        <div className={cn(contentClassName)}>{children}</div>
      </div>
    </section>
  );
}
