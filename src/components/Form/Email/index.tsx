import type { EmailField } from "@payloadcms/plugin-form-builder/types";
import type {
  FieldErrorsImpl,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

import { Error } from "../Error";
import { FORM_FIELD_CLASS, FORM_LABEL_CLASS } from "../styles";
import { Width } from "../Width";

export const Email: React.FC<
  EmailField & {
    errors: Partial<FieldErrorsImpl<Record<string, unknown>>>;
    register: UseFormRegister<FieldValues>;
  }
> = ({
  name,
  defaultValue,
  errors,
  label,
  register,
  required: requiredFromProps,
  width,
}) => {
  return (
    <Width width={width}>
      <Label className={FORM_LABEL_CLASS} htmlFor={name}>
        {label}
      </Label>
      <Input
        className={FORM_FIELD_CLASS}
        defaultValue={defaultValue}
        id={name}
        type="email"
        placeholder={label ?? ""}
        {...register(name, {
          pattern: /^\S[^\s@]*@\S+$/,
          required: requiredFromProps,
        })}
      />

      {requiredFromProps && errors[name] && <Error />}
    </Width>
  );
};
