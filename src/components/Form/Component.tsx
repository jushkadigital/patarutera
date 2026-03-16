"use client";
import type { Form as FormType } from "@payloadcms/plugin-form-builder/types";

import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { useForm, FormProvider, type FieldValues } from "react-hook-form";
import classes from "./index.module.scss";
import { Button } from "@/components/ui/button";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

import { buildInitialFormState } from "./buildInitialFormState";
import { fields } from "./fields";
import { FORM_SUBMIT_BUTTON_CLASS } from "./styles";
import { getClientSideURL } from "@/utilities/getURL";
import RichText from "../RichText";
import Grid from "../Grid";
import Spinner from "@modules/common/icons/spinner";

export type Data = FieldValues;

export type FormBlockType = {
  blockName?: string;
  blockType?: "formBlock";
  enableIntro: boolean;
  form: FormType;
  introContent?: SerializedEditorState;
};

type FormBlockSubmitProps = {
  onSuccessfulSubmit?: (data: FieldValues) => Promise<void> | void;
  submitToApi?: boolean;
};

type FormField = NonNullable<FormType["fields"]>[number];

type RowField = {
  field: FormField;
  width: number;
  index: number;
};

type FieldRow = {
  fields: RowField[];
  totalWidth: number;
};

const normalizeFieldWidth = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.min(100, Math.max(1, value));
  }

  if (typeof value === "string") {
    const parsedValue = Number(value.trim());

    if (Number.isFinite(parsedValue)) {
      return Math.min(100, Math.max(1, parsedValue));
    }
  }

  return 100;
};

const buildFieldRows = (formFields: FormType["fields"]): FieldRow[] => {
  if (!formFields || formFields.length === 0) {
    return [];
  }

  const rows: FieldRow[] = [];
  let currentRow: RowField[] = [];
  let currentRowWidth = 0;

  formFields.forEach((field, index) => {
    const width = normalizeFieldWidth((field as { width?: unknown }).width);

    if (currentRow.length > 0 && currentRowWidth + width > 100) {
      rows.push({
        fields: currentRow,
        totalWidth: currentRowWidth,
      });
      currentRow = [];
      currentRowWidth = 0;
    }

    currentRow.push({
      field,
      width,
      index,
    });
    currentRowWidth += width;

    if (currentRowWidth >= 100) {
      rows.push({
        fields: currentRow,
        totalWidth: Math.min(currentRowWidth, 100),
      });
      currentRow = [];
      currentRowWidth = 0;
    }
  });

  if (currentRow.length > 0) {
    rows.push({
      fields: currentRow,
      totalWidth: currentRowWidth,
    });
  }

  return rows;
};

export const FormBlock: React.FC<
  {
    id?: string;
  } & FormBlockType &
    FormBlockSubmitProps
> = (props) => {
  const {
    enableIntro,
    form: formFromProps,
    form: {
      id: formID,
      confirmationMessage,
      confirmationType,
      redirect,
      submitButtonLabel,
    } = {},
    introContent,
    id,
    onSuccessfulSubmit,
    submitToApi = true,
  } = props;

  const formMethods = useForm<FieldValues>({
    defaultValues: buildInitialFormState(formFromProps.fields) as FieldValues,
  });
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods;

  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>();
  const [error, setError] = useState<
    { message: string; status?: string } | undefined
  >();
  const router = useRouter();
  const fieldRows = buildFieldRows(formFromProps.fields);
  const shouldShowIntro = Boolean(enableIntro && introContent && !hasSubmitted);
  const formClassName = shouldShowIntro
    ? `${classes.form} ${classes.formWithIntro}`
    : classes.form;

  const onSubmit = useCallback(
    (data: FieldValues) => {
      let loadingTimerID: ReturnType<typeof setTimeout>;

      const submitForm = async () => {
        setError(undefined);

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }));

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true);
        }, 1000);

        try {
          if (submitToApi) {
            const req = await fetch(
              `${getClientSideURL()}/api/form-submissions`,
              {
                body: JSON.stringify({
                  form: formID,
                  submissionData: dataToSend,
                }),
                headers: {
                  "Content-Type": "application/json",
                },
                method: "POST",
              },
            );

            const res = await req.json();

            if (req.status >= 400) {
              clearTimeout(loadingTimerID);
              setIsLoading(false);

              setError({
                message: res.errors?.[0]?.message || "Internal Server Error",
                status: res.status,
              });

              return;
            }
          }

          if (onSuccessfulSubmit) {
            await onSuccessfulSubmit(data);
          }

          clearTimeout(loadingTimerID);

          setIsLoading(false);
          setHasSubmitted(true);

          if (confirmationType === "redirect" && redirect) {
            const { url } = redirect;

            const redirectUrl = url;

            if (redirectUrl) router.push(redirectUrl);
          }
        } catch (err) {
          clearTimeout(loadingTimerID);
          console.warn(err);
          setIsLoading(false);
          setError({
            message: "Something went wrong.",
          });
        }
      };

      void submitForm();
    },
    [
      router,
      formID,
      redirect,
      confirmationType,
      onSuccessfulSubmit,
      submitToApi,
    ],
  );

  return (
    <div className={classes.formSection}>
      <div>
        <Grid className={classes.contentContainer}>
          {shouldShowIntro && (
            <div className={classes.introContainer}>
              <RichText data={introContent} />
            </div>
          )}
          <FormProvider {...formMethods}>
            {!isLoading && hasSubmitted && confirmationType === "message" && (
              <RichText data={confirmationMessage} />
            )}
            {isLoading && !hasSubmitted && (
              <div className="flex items-center text-ui-fg-subtle">
                <Spinner size={16} />
              </div>
            )}
            {error && (
              <div>{`${error.status || "500"}: ${error.message || ""}`}</div>
            )}
            {!hasSubmitted && (
              <form
                className={formClassName}
                id={formID}
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="mb-4 space-y-6 last:mb-0" id={id}>
                  {fieldRows.map((row, rowIndex) => {
                    const remainingWidth = Math.max(0, 100 - row.totalWidth);
                    const gridTemplateColumns = [
                      ...row.fields.map(
                        (rowField) => `minmax(0, ${rowField.width}fr)`,
                      ),
                      ...(remainingWidth > 0
                        ? [`minmax(0, ${remainingWidth}fr)`]
                        : []),
                    ].join(" ");

                    return (
                      <div
                        className="grid items-start gap-x-4 gap-y-6"
                        key={`form-row-${rowIndex}`}
                        style={{ gridTemplateColumns }}
                      >
                        {row.fields.map(({ field, index }) => {
                          const fieldBlockType = field.blockType as
                            | keyof typeof fields
                            | undefined;
                          const Field = fieldBlockType
                            ? (fields[fieldBlockType] as
                                | React.ComponentType<Record<string, unknown>>
                                | undefined)
                            : undefined;

                          if (!Field) {
                            return null;
                          }

                          return (
                            <Field
                              key={`${field.blockType}-${index}`}
                              form={formFromProps}
                              {...(field as unknown as Record<string, unknown>)}
                              {...formMethods}
                              control={control}
                              errors={errors}
                              register={register}
                              width={100}
                            />
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
                <Button
                  className={FORM_SUBMIT_BUTTON_CLASS}
                  form={formID}
                  type="submit"
                  variant="default"
                >
                  {submitButtonLabel}
                </Button>
              </form>
            )}
          </FormProvider>
        </Grid>
      </div>
    </div>
  );
};
