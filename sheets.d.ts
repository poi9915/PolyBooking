import "react-native-actions-sheet";

interface BookingSheetPayload {
  onEdit: () => void;
  onCancel: () => void;
}

declare module "react-native-actions-sheet" {
  interface Sheets {
    "booking-sheet": SheetDefinition<{ payload: BookingSheetPayload }>;
  }
}