"use client"

import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Table, clx } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import { groupBy } from "lodash"

type ItemsTemplateProps = {
  cart: HttpTypes.StoreCart
}

const ItemsPreviewTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart.items
  const newItems = groupBy(items, "metadata.group_id")

  const groupsArray = Object.entries(newItems).map(
    ([type, items]) => ({
      type,
      items,
      created_at: items[0].created_at
    })
  )

  const hasOverflow = groupsArray && groupsArray.length > 4
  return (
    <div
      className={clx({
        "pl-[1px] overflow-y-scroll overflow-x-hidden no-scrollbar max-h-[420px]":
          hasOverflow,
      })}
    >
      <Table>
        <Table.Body data-testid="items-table">
          {groupsArray
            ? groupsArray
              .sort((a, b) => {
                return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
              })
              .map((item, idx) => {
                return (
                  <Item
                    key={idx}
                    item={item.items}
                    type="preview"
                    currencyCode={cart.currency_code}
                  />
                )
              })
            : repeat(5).map((i) => {
              return <SkeletonLineItem key={i} />
            })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ItemsPreviewTemplate
