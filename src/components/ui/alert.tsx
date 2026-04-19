import React from 'react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  children?: React.ReactNode;
}

const variantClasses = {
  default: 'bg-blue-50 border border-blue-200 text-blue-900',
  destructive: 'bg-red-50 border border-red-200 text-red-900',
  success: 'bg-green-50 border border-green-200 text-green-900',
  warning: 'bg-yellow-50 border border-yellow-200 text-yellow-900',
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className = '', variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-lg p-4
          ${variantClasses[variant]}
          ${className}
        `}
        role="alert"
        {...props}
      >
        {children}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const AlertDescription = React.forwardRef<HTMLDivElement, AlertDescriptionProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          text-sm
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AlertDescription.displayName = 'AlertDescription';

interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
}

export const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <h5
        ref={ref}
        className={`
          mb-1 font-medium leading-tight
          ${className}
        `}
        {...props}
      >
        {children}
      </h5>
    );
  }
);

AlertTitle.displayName = 'AlertTitle';
