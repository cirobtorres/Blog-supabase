import {
  FloatingFieldset,
  FloatingInput,
  FloatingLabel,
  FloatingTextArea,
} from "../../../components/Fieldsets";
import { MinusIcon, PlusIcon } from "../../../components/Icons";
import { accordionReducer, initialAccordionState } from "../../../reducers";
import { focusVisibleWhiteRing } from "../../../styles/classNames";
import { cn } from "../../../utils/classnames";
import { useReducer } from "react";

export default function AccordionEditorContent({
  ...blockProps
}: AccordionEditorProps) {
  const [accordions, baseDispatch] = useReducer(
    accordionReducer,
    blockProps.accordions || initialAccordionState
  );

  const accordDispatch = (action: AccordionStateAction) => {
    const newState = accordionReducer(accordions, action);
    blockProps.setAccordions(newState); // Updates parent component
    baseDispatch(action);
  };

  const AddButton = () => (
    <button
      type="button"
      onClick={() => accordDispatch({ type: "ADD" })}
      className={cn(
        "mx-auto w-fit flex justify-center items-center cursor-pointer p-1 rounded-sm outline-none transition-all duration-300 border border-neutral-700 bg-neutral-900 hover:border-neutral-600 hover:bg-neutral-800",
        focusVisibleWhiteRing
      )}
    >
      <PlusIcon />
    </button>
  );

  const RemoveButton = ({ accordionId: id }: { accordionId: string }) => (
    <button
      type="button"
      onClick={() => accordDispatch({ type: "REMOVE", id })}
      className={cn(
        "flex justify-center items-center cursor-pointer p-1 rounded-sm transition-all duration-300 outline-none border border-neutral-700 bg-neutral-900 hover:border-neutral-600 hover:bg-neutral-800",
        focusVisibleWhiteRing
      )}
    >
      <MinusIcon />
    </button>
  );

  return (
    <div className="max-w-full mx-auto p-2 flex flex-col items-start gap-2">
      <div className="w-full flex flex-1 flex-col justify-center gap-2">
        {accordions.map((accordion, index) => {
          const uniqueFloatingTitleId = `floating-title-${crypto
            .randomUUID()
            .split("-")
            .slice(4)}`;
          const uniqueFloatingMessageId = `floating-message-${crypto
            .randomUUID()
            .split("-")
            .slice(4)}`;
          return (
            <div
              key={accordion.id}
              className="w-full grid grid-cols-[minmax(0,1fr)_36px] items-start rounded p-2 gap-2 border border-neutral-800 first:bg-theme-color-backdrop first:border-theme-color"
            >
              <div className="flex flex-col gap-2">
                {index === 0 && (
                  <p className="text-theme-color uppercase text-xs font-extrabold">
                    Default
                  </p>
                )}
                <FloatingFieldset className="focus-within:ring-0 focus-within:ring-offset-0">
                  <FloatingInput
                    id={uniqueFloatingTitleId}
                    value={accordion.title}
                    onChange={(e) =>
                      accordDispatch({
                        type: "UPDATE_TITLE",
                        id: accordion.id,
                        value: e.target.value,
                      })
                    }
                  />
                  <FloatingLabel
                    htmlFor={`title-${accordion.id}`}
                    label="Título"
                  />
                </FloatingFieldset>
                <FloatingFieldset className="focus-within:ring-0 focus-within:ring-offset-0">
                  <FloatingTextArea
                    id={uniqueFloatingMessageId}
                    value={accordion.message}
                    onChange={(e) =>
                      accordDispatch({
                        type: "UPDATE_MESSAGE",
                        id: accordion.id,
                        value: e.target.value,
                      })
                    }
                    placeholder="Mensagem"
                  />
                </FloatingFieldset>
              </div>
              {index > 0 && <RemoveButton accordionId={accordion.id} />}
            </div>
          );
        })}
        <AddButton />
      </div>
    </div>
  );
}
