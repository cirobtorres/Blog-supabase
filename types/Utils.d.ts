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
