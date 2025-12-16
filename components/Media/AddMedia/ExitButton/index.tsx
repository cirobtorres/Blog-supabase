import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogCancelIcon,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/styles/classNames";
import { cn } from "@/utils/classnames";

export const ExitButton = ({ onConfirm, children }: ExitButtonProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="overflow-hidden">
        <AlertDialogTitle className="relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-neutral-800 flex justify-between items-center bg-neutral-950">
          Sair sem salvar?
          <AlertDialogCancelIcon />
        </AlertDialogTitle>
        <AlertDialogDescription className="min-h-20 flex items-center text-neutral-500">
          Os arquivos selecionados serão descartados. Deseja realmente sair?
        </AlertDialogDescription>
        <AlertDialogFooter className="w-full flex justify-between sm:justify-between items-center relative after:absolute after:top-0 after:left-0 after:right-0 after:h-[1px] after:bg-neutral-800 bg-neutral-950">
          <AlertDialogCancel
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Voltar
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Sair mesmo assim
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
