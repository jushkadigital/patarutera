import type { TextField } from "@payloadcms/plugin-form-builder/types";
import type {
  FieldErrorsImpl,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";

import { Label } from "@/components/ui/label";
import React from "react";
import { Error } from "../Error";
import { FORM_LABEL_CLASS, FORM_TEXTAREA_CLASS } from "../styles";
import { Width } from "../Width";

export const Textarea: React.FC<
  TextField & {
    errors: Partial<FieldErrorsImpl<Record<string, unknown>>>;
    register: UseFormRegister<FieldValues>;
    rows?: number;
  }
> = ({
  name,
  defaultValue,
  errors,
  label,
  register,
  required: requiredFromProps,
  rows = 3,
  width,
}) => {
  return (
    <Width width={width}>
      <Label className={FORM_LABEL_CLASS} htmlFor={name}>
        {label}
      </Label>

      <textarea
        className={FORM_TEXTAREA_CLASS}
        defaultValue={defaultValue}
        id={name}
        rows={rows}
        placeholder={label ?? ""}
        {...register(name, { required: requiredFromProps })}
      />

      {requiredFromProps && errors[name] && <Error />}
    </Width>
  );
};
