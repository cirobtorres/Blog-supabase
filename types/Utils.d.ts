// FLOATING FIELDSET
type ControlledFloatingInputProps = {
  id: string;
  placeholder?: string;
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

type UncontrolledFloatingInputProps = {
  id: string;
  placeholder?: string;
  className?: string;
  value?: undefined;
  onChange?: undefined;
  defaultValue?: string;
};

type FloatingInputProps =
  | ControlledFloatingInputProps
  | UncontrolledFloatingInputProps;

// REDUCERS
type AccordionItem = {
  id: string;
  checked: boolean;
  title: string;
  message: string;
};

// UPDATE BLOCKS
type UpdateBlockProps = Partial<Record<string, unknown>>; // unknown = string | boolean | File | AccordionItem[] | null | undefined

// BLOCKS
type BlockIcons = {
  svg: ({ className }: { className?: string }) => JSX.Element;
  tooltip: string;
};

type BlockButton = BlockType<BlockIcons>;

// STICKY NAVBAR
type AnchorTracher = {
  id: string;
  text: string | React.ReactNode;
  tag: string;
}[];

// IMAGE EDITOR
// TODO: possivelmente será modificado
type ImageState = {
  preview: string | null;
  file?: File | null;
  filename: string | null;
  size: number | null;
  type: string;
  width: number | null;
  height: number | null;
  date: string;
};
