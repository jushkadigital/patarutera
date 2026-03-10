import type { SelectField } from "@payloadcms/plugin-form-builder/types";
import type { Control, FieldErrorsImpl, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";

import { Label } from "@/components/ui/label";
import {
  Select as SelectUi,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

import { Error } from "../Error";
import { Width } from "../Width";

type SelectOption = {
  label: string;
  value: string;
  id?: string | null;
};

const getOptions = (options: SelectField["options"]): SelectOption[] => {
  if (!Array.isArray(options)) {
    return [];
  }

  return options.filter((option): option is SelectOption => {
    return (
      typeof option === "object" &&
      option !== null &&
      typeof option.label === "string" &&
      typeof option.value === "string"
    );
  });
};

export const Select: React.FC<
  SelectField & {
    control: Control<FieldValues>;
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: unknown;
      }>
    >;
  }
> = ({
  name,
  control,
  defaultValue,
  errors,
  label,
  options,
  placeholder,
  required: requiredFromProps,
  width,
}) => {
  const availableOptions = getOptions(options);
  const placeholderLabel = placeholder || label || "Select an option";

  return (
    <Width width={width}>
      <Label htmlFor={name}>{label}</Label>
      <Controller
        name={name}
        control={control}
        rules={{ required: requiredFromProps ?? false }}
        defaultValue={typeof defaultValue === "string" ? defaultValue : ""}
        render={({ field }) => (
          <SelectUi
            value={typeof field.value === "string" ? field.value : ""}
            onValueChange={(value) => {
              field.onChange(value);
            }}
          >
            <SelectTrigger id={name}>
              <SelectValue placeholder={placeholderLabel} />
            </SelectTrigger>
            <SelectContent>
              {availableOptions.map((option) => (
                <SelectItem
                  key={option.id ?? `${name}-${option.value}`}
                  value={option.value}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectUi>
        )}
      />
      {requiredFromProps && errors[name] && <Error />}
    </Width>
  );
};
