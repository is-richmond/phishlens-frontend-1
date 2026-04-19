import React, { createContext, useContext, useState } from 'react';

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  children?: React.ReactNode;
}

export const Tabs = ({
  value: controlledValue,
  onValueChange,
  defaultValue = '',
  className = '',
  children,
  ...props
}: TabsProps) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setUncontrolledValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={`w-full ${className}`} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs context not found');
  }
  return context;
};

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          inline-flex h-10 items-center justify-center
          rounded-md bg-gray-100 p-1
          ${className}
        `}
        role="tablist"
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabsList.displayName = 'TabsList';

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children?: React.ReactNode;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, className = '', children, ...props }, ref) => {
    const { value: activeValue, onValueChange } = useTabsContext();
    const isActive = activeValue === value;

    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isActive}
        data-state={isActive ? 'active' : 'inactive'}
        onClick={() => onValueChange(value)}
        className={`
          inline-flex items-center justify-center whitespace-nowrap
          rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white
          transition-all focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-blue-500 focus-visible:ring-offset-2
          disabled:pointer-events-none disabled:opacity-50
          ${isActive ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);

TabsTrigger.displayName = 'TabsTrigger';

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children?: React.ReactNode;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, className = '', children, ...props }, ref) => {
    const { value: activeValue } = useTabsContext();

    if (activeValue !== value) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="tabpanel"
        aria-labelledby={`tabpanel-${value}`}
        className={`
          mt-2 ring-offset-white focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabsContent.displayName = 'TabsContent';
