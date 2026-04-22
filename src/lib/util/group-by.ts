export function groupBy<T>(
  items: T[] | null | undefined,
  getKey: (item: T) => string,
): Record<string, T[]> {
  return (items ?? []).reduce<Record<string, T[]>>((groups, item) => {
    const key = getKey(item);

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(item);
    return groups;
  }, {});
}
