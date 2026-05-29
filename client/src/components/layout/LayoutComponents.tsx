import React from 'react';

/**
 * PageLayout Component
 * Standardized wrapper for all pages to ensure consistent spacing
 * 
 * Usage:
 * <PageLayout>
 *   <h1>Page Title</h1>
 *   <p>Content here</p>
 * </PageLayout>
 */

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
  sectionSize?: 'hero' | 'standard' | 'compact';
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className = '',
  compact = false,
  sectionSize = 'standard',
}) => {
  const containerClass = compact ? 'layout-container-compact' : 'layout-container';
  const sectionClass = `section-${sectionSize}`;

  return (
    <section className={`${sectionClass} ${className}`}>
      <div className={containerClass}>
        {children}
      </div>
    </section>
  );
};

/**
 * CardGrid Component
 * Responsive grid for displaying cards with consistent spacing
 * 
 * Usage:
 * <CardGrid columns={3}>
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 * </CardGrid>
 */

interface CardGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export const CardGrid: React.FC<CardGridProps> = ({
  children,
  columns = 3,
  className = '',
}) => {
  const gridClass = `grid-${columns}-col`;

  return (
    <div className={`${gridClass} ${className}`}>
      {children}
    </div>
  );
};

/**
 * FlexRow Component
 * Horizontal layout with consistent gap spacing
 * 
 * Usage:
 * <FlexRow align="center" justify="between">
 *   <span>Label</span>
 *   <button>Action</button>
 * </FlexRow>
 */

type Alignment = 'start' | 'center' | 'end' | 'stretch';
type Justification = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
type GapSize = 'compact' | 'standard' | 'spacious' | 'wide';

interface FlexRowProps {
  children: React.ReactNode;
  align?: Alignment;
  justify?: Justification;
  gap?: GapSize;
  className?: string;
}

export const FlexRow: React.FC<FlexRowProps> = ({
  children,
  align = 'center',
  justify = 'start',
  gap = 'standard',
  className = '',
}) => {
  const alignClass = align === 'center' ? 'items-center' : `items-${align}`;
  const justifyClass = justify === 'between' ? 'justify-between' : `justify-${justify}`;
  const gapClass = `gap-${gap}`;

  return (
    <div className={`flex ${alignClass} ${justifyClass} ${gapClass} ${className}`}>
      {children}
    </div>
  );
};

/**
 * FlexColumn Component
 * Vertical layout with consistent gap spacing
 * 
 * Usage:
 * <FlexColumn gap="spacious">
 *   <h3>Title</h3>
 *   <p>Content</p>
 * </FlexColumn>
 */

interface FlexColumnProps {
  children: React.ReactNode;
  gap?: GapSize;
  className?: string;
}

export const FlexColumn: React.FC<FlexColumnProps> = ({
  children,
  gap = 'standard',
  className = '',
}) => {
  const gapClass = `flex-col gap-${gap}`;

  return (
    <div className={`${gapClass} ${className}`}>
      {children}
    </div>
  );
};

/**
 * Section Component
 * Semantic section with proper spacing
 * 
 * Usage:
 * <Section size="standard" title="My Section">
 *   <p>Section content</p>
 * </Section>
 */

interface SectionProps {
  children: React.ReactNode;
  size?: 'hero' | 'standard' | 'compact';
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  size = 'standard',
  title,
  subtitle,
  className = '',
}) => {
  const sectionClass = `section-${size}`;

  return (
    <section className={`${sectionClass} ${className}`}>
      <div className="layout-container">
        {title && (
          <div className={subtitle ? 'mb-md' : 'mb-lg'}>
            <h2 className="heading-section">{title}</h2>
            {subtitle && <p className="text-body-elegant mt-sm">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

/**
 * Card Component
 * Standard card with consistent padding and styling
 * 
 * Usage:
 * <Card size="lg">
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </Card>
 */

type CardSize = 'sm' | 'md' | 'lg';

interface CardProps {
  children: React.ReactNode;
  size?: CardSize;
  glass?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  size = 'md',
  glass = true,
  className = '',
}) => {
  const paddingClass = size === 'sm' ? 'card-padding-sm' : size === 'lg' ? 'card-padding-lg' : 'card-padding';
  const glassClass = glass ? 'glass-premium' : '';

  return (
    <div className={`${paddingClass} ${glassClass} ${className}`}>
      {children}
    </div>
  );
};

/**
 * Stack Component
 * Vertical list layout with consistent spacing between items
 * 
 * Usage:
 * <Stack size="lg">
 *   <p>Item 1</p>
 *   <p>Item 2</p>
 * </Stack>
 */

type StackSize = 'sm' | 'md' | 'lg';

interface StackProps {
  children: React.ReactNode;
  size?: StackSize;
  className?: string;
}

export const Stack: React.FC<StackProps> = ({
  children,
  size = 'md',
  className = '',
}) => {
  const stackClass = `stack-${size}`;

  return (
    <div className={`${stackClass} ${className}`}>
      {children}
    </div>
  );
};

export default {
  PageLayout,
  CardGrid,
  FlexRow,
  FlexColumn,
  Section,
  Card,
  Stack,
};
