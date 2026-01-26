import { isEmpty } from "./isEmpty"

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-US",
}: ConvertToLocaleParams) => {
  return currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency_code,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(amount)
    : amount.toString()
}
export const myConvertToLocale = ({
  amount,
  currency_code,
  locale = "en-US",
}: {
  amount: number
  currency_code?: string
  locale?: string
}) => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false, // 👈 evita 1,000.00
  }).format(amount)
}
