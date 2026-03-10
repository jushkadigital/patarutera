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
import { getClientSideURL } from "@/utilities/getURL";
import RichText from "../RichText";
import Grid from "../Grid";

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

  // @ts-ignore
  return (
    <div className={classes.formSection}>
      <div>
        <Grid className={classes.contentContainer}>
          {enableIntro && introContent && !hasSubmitted && (
            <div className={classes.introContainer}>
              <RichText data={introContent} />
            </div>
          )}
          <FormProvider {...formMethods}>
            {!isLoading && hasSubmitted && confirmationType === "message" && (
              <RichText data={confirmationMessage} />
            )}
            {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
            {error && (
              <div>{`${error.status || "500"}: ${error.message || ""}`}</div>
            )}
            {!hasSubmitted && (
              <form
                className={classes.form}
                id={formID}
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="mb-4 last:mb-0" id={id}>
                  {formFromProps &&
                    formFromProps.fields &&
                    formFromProps.fields?.map((field, index) => {
                      const Field: React.FC<any> = fields?.[field.blockType];
                      if (Field) {
                        return (
                          <div className="mb-6 last:mb-0" key={index}>
                            <Field
                              form={formFromProps}
                              {...field}
                              {...formMethods}
                              control={control}
                              errors={errors}
                              register={register}
                            />
                          </div>
                        );
                      }
                      return null;
                    })}
                </div>
                {/*@ts-ignore*/}
                <Button form={formID} type="submit" variant="default">
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
