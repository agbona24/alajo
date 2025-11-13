import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
  shadow = 'md',
  hover = false,
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200',
        paddingStyles[padding],
        shadowStyles[shadow],
        hover && 'transition-shadow hover:shadow-lg',
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
}) => {
  return <div className={cn('mb-4', className)}>{children}</div>;
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className,
}) => {
  return (
    <h3 className={cn('text-lg font-semibold text-gray-900', className)}>
      {children}
    </h3>
  );
};

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  className,
}) => {
  return (
    <p className={cn('text-sm text-gray-600 mt-1', className)}>{children}</p>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className,
}) => {
  return <div className={cn(className)}>{children}</div>;
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn('mt-4 pt-4 border-t border-gray-200', className)}
    >
      {children}
    </div>
  );
};
