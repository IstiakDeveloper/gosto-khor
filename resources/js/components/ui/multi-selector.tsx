import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface MultiSelectorContext {
  values: string[];
  onSelect: (value: string) => void;
  onRemove: (value: string) => void;
  onClear: () => void;
}

const MultiSelectorContext = React.createContext<MultiSelectorContext | null>(null);

function useMultiSelector() {
  const context = React.useContext(MultiSelectorContext);
  if (!context) {
    throw new Error("useMultiSelector must be used within a MultiSelector");
  }
  return context;
}

export function MultiSelector({
  values,
  onValuesChange,
  className,
  children,
}: {
  values: string[];
  onValuesChange: (values: string[]) => void;
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = React.useCallback(
    (value: string) => {
      if (values.includes(value)) {
        onValuesChange(values.filter((v) => v !== value));
      } else {
        onValuesChange([...values, value]);
      }
    },
    [values, onValuesChange]
  );

  const handleRemove = React.useCallback(
    (value: string) => {
      onValuesChange(values.filter((v) => v !== value));
    },
    [values, onValuesChange]
  );

  const handleClear = React.useCallback(() => {
    onValuesChange([]);
  }, [onValuesChange]);

  return (
    <MultiSelectorContext.Provider
      value={{
        values,
        onSelect: handleSelect,
        onRemove: handleRemove,
        onClear: handleClear,
      }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <div className={cn("relative w-full", className)}>
          {children}
        </div>
      </Popover>
    </MultiSelectorContext.Provider>
  );
}

export function MultiSelectorTrigger({
  className,
  placeholder = "Select items...",
}: {
  className?: string;
  placeholder?: string;
}) {
  const { values } = useMultiSelector();

  return (
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        type="button"
        className={cn(
          "w-full justify-between text-sm font-normal",
          values.length > 0 ? "min-h-10" : "h-10",
          className
        )}
      >
        <div className="flex flex-wrap gap-1 py-1">
          {values.length > 0 ? (
            values.map((value) => (
              <MultiSelectorBadge key={value} value={value} />
            ))
          ) : (
            <span>{placeholder}</span>
          )}
        </div>
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
  );
}

export function MultiSelectorContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <PopoverContent className={cn("w-full p-0", className)} align="start">
      {children}
    </PopoverContent>
  );
}

export function MultiSelectorList({
  className,
  searchPlaceholder = "Search...",
  emptyMessage = "No items found.",
  children,
}: {
  className?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  children: React.ReactNode;
}) {
  return (
    <Command className={cn("w-full", className)}>
      <CommandInput placeholder={searchPlaceholder} />
      <CommandEmpty>{emptyMessage}</CommandEmpty>
      <CommandGroup className="max-h-64 overflow-auto">
        {children}
      </CommandGroup>
    </Command>
  );
}

export function MultiSelectorItem({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { values, onSelect } = useMultiSelector();
  const isSelected = values.includes(value);

  return (
    <CommandItem
      value={value}
      onSelect={() => onSelect(value)}
      className={cn("flex items-center gap-2", className)}
    >
      <div
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded-sm border",
          isSelected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-input"
        )}
      >
        {isSelected && <Check className="h-3 w-3" />}
      </div>
      <span>{children}</span>
    </CommandItem>
  );
}

function MultiSelectorBadge({
  value,
  label,
}: {
  value: string;
  label?: string;
}) {
  const { onRemove } = useMultiSelector();

  return (
    <Badge
      variant="secondary"
      className="flex items-center gap-1 rounded px-2 py-0.5"
    >
      {label || value}
      <X
        className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(value);
        }}
      />
    </Badge>
  );
}

export function ClearMultiSelector({
  className,
}: {
  className?: string;
}) {
  const { onClear } = useMultiSelector();

  return (
    <Button
      variant="ghost"
      size="sm"
      type="button"
      className={cn("absolute right-8 top-2 h-6 px-2", className)}
      onClick={onClear}
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Clear</span>
    </Button>
  );
}
