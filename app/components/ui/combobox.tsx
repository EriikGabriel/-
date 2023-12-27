"use client"

import { Check, ChevronsUpDown } from "lucide-react"

import { HTMLAttributes, ReactNode, useState } from "react"
import { cn } from "../../lib/utils"
import { Button } from "./button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./command"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

interface ComboBoxProps extends HTMLAttributes<HTMLDivElement> {
  onValueChange: (value: string) => void
  setValue?: (value: string) => void
  value: string
  options: {
    value: string
    label: string
  }[]
  placeholder?: string
  hasSearch?: boolean
  children: ReactNode
}

export function ComboBox({
  children,
  options,
  placeholder,
  hasSearch,
  value,
  onValueChange,
}: ComboBoxProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : children}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          {hasSearch && (
            <>
              <CommandInput placeholder={placeholder} />
              <CommandEmpty>Opção não encontrada.</CommandEmpty>
            </>
          )}
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={(currentValue) => {
                  onValueChange(currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
