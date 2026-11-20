interface SlotRange { id: string; startsAt: string; endsAt: string }

export function nextConsecutiveSelection(slots: SlotRange[], selectedIds: string[], clickedId: string): string[] {
  if (selectedIds.includes(clickedId)) return [];
  const clickedIndex = slots.findIndex((slot) => slot.id === clickedId);
  if (clickedIndex < 0 || selectedIds.length === 0) return clickedIndex < 0 ? selectedIds : [clickedId];

  const selectedIndices = slots.map((slot, index) => selectedIds.includes(slot.id) ? index : -1).filter((index) => index >= 0);
  const min = Math.min(...selectedIndices);
  const max = Math.max(...selectedIndices);
  if (selectedIds.length >= 16 || (clickedIndex !== min - 1 && clickedIndex !== max + 1)) return [clickedId];

  const candidateIndices = [...selectedIndices, clickedIndex].sort((left, right) => left - right);
  const candidateSlots = candidateIndices.map((index) => slots[index]!);
  const consecutive = candidateSlots.every((slot, index) => index === 0 || candidateSlots[index - 1]!.endsAt === slot.startsAt);
  return consecutive ? candidateSlots.map((slot) => slot.id) : [clickedId];
}
