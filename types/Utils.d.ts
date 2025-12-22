// FLOATING FIELDSET
type BaseProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange"
> & {
  id: string;
  type?: "password" | "text" | "time";
};

type ControlledFloatingInputProps = BaseProps & {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: never;
};

type UncontrolledFloatingInputProps = BaseProps & {
  defaultValue?: string;
  value?: never;
  onChange?: never;
};

type FloatingInputProps =
  | ControlledFloatingInputProps
  | UncontrolledFloatingInputProps;

// REDUCERS
type AccordionItem = {
  id: string;
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
  date: string | null;
};
