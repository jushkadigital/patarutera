import repeat from "@lib/util/repeat";
import { HttpTypes } from "@medusajs/types";
import { Heading, Table } from "@medusajs/ui";

import Item from "@modules/cart/components/item";
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item";
import { groupBy } from "lodash";

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart;
};

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items;
  console.log("AQUI")
  console.log(items)
  const groupedItems = groupBy(
    items,
    (item) => item.metadata?.group_id ?? item.id,
  );

  const groupsArray = Object.entries(groupedItems).map(
    ([groupId, groupItems]) => ({
      groupId,
      items: groupItems,
      created_at: groupItems[0]?.created_at,
    }),
  );
  return (
    <div>
      <div className="pb-3 flex items-center">
        <Heading className="text-[2rem] leading-[2.75rem]">Cart</Heading>
      </div>
      <Table>
        <Table.Header className="border-t-0">
          <Table.Row className="text-ui-fg-subtle txt-medium-plus">
            <Table.HeaderCell className="!pl-0">Item</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell className="!pr-0 text-right">
              Total
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {groupsArray
            ? groupsArray
              .sort((a, b) => {
                return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1;
              })
              .map((groupedItem) => {
                return (
                  <Item
                    key={groupedItem.groupId}
                    item={groupedItem.items}
                    currencyCode={cart?.currency_code || ""}
                  />
                );
              })
            : repeat(5).map((i) => {
              return <SkeletonLineItem key={i} />;
            })}
        </Table.Body>
      </Table>
    </div>
  );
};

export default ItemsTemplate;
