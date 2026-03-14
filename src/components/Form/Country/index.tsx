import type { FieldErrorsImpl, FieldValues, Control } from "react-hook-form";
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
import { FORM_FIELD_CLASS, FORM_LABEL_CLASS } from "../styles";
import { Width } from "../Width";

type CountryPhoneOption = {
  value: string;
  label: string;
};

type CountryFieldProps = {
  name: string;
  label?: string | null;
  defaultValue?: string | null;
  placeholder?: string | null;
  required?: boolean | null;
  width?: number | string | null;
};

const COUNTRY_PHONE_OPTIONS: CountryPhoneOption[] = [
  { value: "+51", label: "+51 Peru" },
  { value: "+54", label: "+54 Argentina" },
  { value: "+591", label: "+591 Bolivia" },
  { value: "+55", label: "+55 Brasil" },
  { value: "+56", label: "+56 Chile" },
  { value: "+57", label: "+57 Colombia" },
  { value: "+593", label: "+593 Ecuador" },
  { value: "+595", label: "+595 Paraguay" },
  { value: "+598", label: "+598 Uruguay" },
  { value: "+58", label: "+58 Venezuela" },
  { value: "+507", label: "+507 Panama" },
  { value: "+506", label: "+506 Costa Rica" },
  { value: "+52", label: "+52 Mexico" },
  { value: "+1", label: "+1 United States / Canada" },
  { value: "+34", label: "+34 Spain" },
];

export const Country: React.FC<
  CountryFieldProps & {
    control: Control<FieldValues>;
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: unknown;
      }>
    >;
  }
> = ({
  name,
  label,
  control,
  defaultValue,
  errors,
  placeholder,
  required: requiredFromProps,
  width,
}) => {
  const placeholderLabel = placeholder || label || "Select country code";

  return (
    <Width width={width ?? undefined}>
      <Label className={FORM_LABEL_CLASS} htmlFor={name}>
        {label}
      </Label>
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
            <SelectTrigger className={FORM_FIELD_CLASS} id={name}>
              <SelectValue placeholder={placeholderLabel} />
            </SelectTrigger>
            <SelectContent>
              {COUNTRY_PHONE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
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
