"use client";

import type { Form as PayloadForm } from "@payloadcms/plugin-form-builder/types";
import { CheckCircleSolid } from "@medusajs/icons";
import { HttpTypes } from "@medusajs/types";
import { Heading, Text } from "@medusajs/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { FormBlock } from "@/components/Form/Component";
import {
  completePreDataStep,
  savePreDataGroupSubmission,
} from "@lib/data/cart";
import Divider from "@modules/common/components/divider";

type FormStructureType = {
  group_id: string;
  formId: string | number;
  tour_date?: string;
  package_date?: string;
  structure: unknown;
};

type GroupSubmissionStatus = "idle" | "saving" | "completed" | "error";

type GroupSubmissionState = {
  status: GroupSubmissionStatus;
  message?: string;
};

type GroupSubmissionStateMap = Record<string, GroupSubmissionState>;

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isPayloadForm = (value: unknown): value is PayloadForm => {
  return isRecord(value) && Array.isArray(value.fields);
};

const getCompletedGroupIdsFromCart = (
  cart: HttpTypes.StoreCart | null,
): Set<string> => {
  if (!cart || !isRecord(cart.metadata)) {
    return new Set<string>();
  }

  const preData = isRecord(cart.metadata.preData) ? cart.metadata.preData : {};
  const groups = isRecord(preData.groups) ? preData.groups : {};

  return Object.entries(groups).reduce((acc, [groupId, groupData]) => {
    if (isRecord(groupData) && groupData.status === "completed") {
      acc.add(groupId);
    }

    return acc;
  }, new Set<string>());
};

const toAnswersRecord = (value: unknown): Record<string, unknown> => {
  return isRecord(value) ? value : {};
};

const getStructureMessage = (value: unknown): string => {
  if (!isRecord(value)) {
    return "Form structure is not available.";
  }

  return typeof value.message === "string"
    ? value.message
    : "Form structure is not available.";
};

const withSubmitLabel = (form: PayloadForm): PayloadForm => {
  return {
    ...form,
    submitButtonLabel: "Pasar a pago",
  };
};

export default function PreData({
  cart,
  formStructures,
}: {
  cart: HttpTypes.StoreCart | null;
  formStructures: FormStructureType[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [continueError, setContinueError] = useState<string | null>(null);

  const requiredGroupIds = useMemo(
    () =>
      formStructures
        .filter((groupForm) => isPayloadForm(groupForm.structure))
        .map((groupForm) => groupForm.group_id),
    [formStructures],
  );

  const [groupSubmissionState, setGroupSubmissionState] =
    useState<GroupSubmissionStateMap>(() => {
      const completedGroupIds = getCompletedGroupIdsFromCart(cart);

      return requiredGroupIds.reduce<GroupSubmissionStateMap>(
        (acc, groupId) => {
          acc[groupId] = {
            status: completedGroupIds.has(groupId) ? "completed" : "idle",
          };
          return acc;
        },
        {},
      );
    });

  const isAnyGroupSaving = Object.values(groupSubmissionState).some(
    (group) => group.status === "saving",
  );

  const isOpen =
    searchParams.get("step") === "predata" ||
    (!searchParams.get("step") && !cart?.metadata?.preDataCompleted);

  const handleEdit = () => {
    router.push(pathname + "?step=predata");
  };

  const handleGroupSubmitted = async (
    groupForm: FormStructureType,
    values: unknown,
  ) => {
    if (isSubmitting || isAnyGroupSaving) {
      return;
    }

    setContinueError(null);

    setGroupSubmissionState((currentState) => ({
      ...currentState,
      [groupForm.group_id]: {
        status: "saving",
      },
    }));

    try {
      await savePreDataGroupSubmission({
        groupId: groupForm.group_id,
        formId: groupForm.formId,
        answers: toAnswersRecord(values),
        tourDate: groupForm.tour_date,
        packageDate: groupForm.package_date,
      });

      let nextState: GroupSubmissionStateMap = {};

      setGroupSubmissionState((currentState) => {
        nextState = {
          ...currentState,
          [groupForm.group_id]: {
            status: "completed",
          },
        };

        return nextState;
      });

      const hasPendingRequiredGroups = requiredGroupIds.some(
        (groupId) => nextState[groupId]?.status !== "completed",
      );

      if (hasPendingRequiredGroups) {
        setContinueError(
          "Debes completar todos los formularios de reserva antes de continuar a pago.",
        );
        return;
      }

      setIsSubmitting(true);

      try {
        await completePreDataStep({ requiredGroupIds });
        router.push(pathname + "?step=payment");
      } catch (error) {
        setContinueError(
          error instanceof Error
            ? error.message
            : "No se pudo validar los formularios antes de continuar a pago.",
        );
      } finally {
        setIsSubmitting(false);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "No se pudo guardar el formulario en el carrito.";

      setGroupSubmissionState((currentState) => ({
        ...currentState,
        [groupForm.group_id]: {
          status: "error",
          message: errorMessage,
        },
      }));

      throw error;
    }
  };

  return (
    <div className="bg-white">
      <div className="mb-6 flex flex-row items-center justify-between">
        <Heading
          level="h2"
          className="flex flex-row items-baseline gap-x-2 text-3xl-regular"
        >
          Datos de Reserva
          {!isOpen && <CheckCircleSolid className="text-ui-fg-interactive" />}
        </Heading>
        {!isOpen && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-predata-button"
            >
              Editar
            </button>
          </Text>
        )}
      </div>

      {isOpen ? (
        <div className="pb-8">
          <div className="mb-4 flex flex-col gap-6">
            {formStructures?.map((groupForm, index) => {
              const groupState = groupSubmissionState[groupForm.group_id];

              return (
                <div
                  key={`${groupForm.group_id}-${groupForm.formId}`}
                  className="rounded-md border bg-gray-50 p-4 text-sm"
                >
                  {isPayloadForm(groupForm.structure) ? (
                    <FormBlock
                      id={`predata-group-${groupForm.group_id}-${index}`}
                      enableIntro={false}
                      form={withSubmitLabel(groupForm.structure)}
                      submitToApi={false}
                      showLoadingIndicator={false}
                      onSuccessfulSubmit={(values) =>
                        handleGroupSubmitted(groupForm, values)
                      }
                    />
                  ) : (
                    <Text className="txt-medium text-ui-fg-subtle">
                      {getStructureMessage(groupForm.structure)}
                    </Text>
                  )}

                  {groupState?.status === "error" && (
                    <Text className="txt-medium mt-2 text-red-600">
                      {groupState.message ||
                        "No se pudo guardar este formulario."}
                    </Text>
                  )}
                </div>
              );
            })}
          </div>

          {continueError && (
            <Text className="txt-medium text-red-600">{continueError}</Text>
          )}

          {isSubmitting && (
            <Text className="txt-medium mt-4 text-ui-fg-subtle">
              Validando formularios y redirigiendo a pago...
            </Text>
          )}
        </div>
      ) : (
        <div>
          <div className="pb-8 text-small-regular">
            <Text className="txt-medium text-ui-fg-subtle">
              Datos de reserva completados correctamente.
            </Text>
          </div>
        </div>
      )}

      <Divider className="mt-8" />
    </div>
  );
}
