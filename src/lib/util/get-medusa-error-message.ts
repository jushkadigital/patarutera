const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const getValidString = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

const getMessageFromPayload = (payload: unknown): string | undefined => {
  if (!isRecord(payload)) {
    return getValidString(payload);
  }

  return (
    getValidString(payload.message) ??
    getValidString(payload.error) ??
    getValidString(payload.detail) ??
    getValidString(payload.details)
  );
};

export const getMedusaErrorMessage = (
  error: unknown,
  fallbackMessage = "No se pudo agregar al carrito.",
): string => {
  const directMessage = getValidString(error);

  if (directMessage) {
    return directMessage;
  }

  if (isRecord(error)) {
    const responseDataMessage = getMessageFromPayload(
      isRecord(error.response) ? error.response.data : undefined,
    );

    if (responseDataMessage) {
      return responseDataMessage;
    }

    const dataMessage = getMessageFromPayload(error.data);

    if (dataMessage) {
      return dataMessage;
    }

    const message = getValidString(error.message);

    if (message) {
      return message;
    }

    const type = getValidString(
      isRecord(error.response) && isRecord(error.response.data)
        ? error.response.data.type
        : isRecord(error.data)
          ? error.data.type
          : undefined,
    );

    if (type) {
      return `Error en la solicitud (${type}).`;
    }
  }

  if (error instanceof Error) {
    const message = getValidString(error.message);

    if (message) {
      return message;
    }
  }

  return fallbackMessage;
};
