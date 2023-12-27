import { AlertDialogAction } from "@radix-ui/react-alert-dialog"
import { ReactNode } from "react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog"
import { Button } from "./button"

type WarningProps = {
  title: string
  description: string
  cancel?: {
    text: string
    action?: () => void
  }
  proceed?: {
    text: string
    action?: () => void
  }
  children: ReactNode
}

export const Warning = ({
  title,
  description,
  cancel,
  proceed,
  children,
}: WarningProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {cancel && (
            <AlertDialogCancel onClick={cancel.action}>
              {cancel.text}
            </AlertDialogCancel>
          )}
          {proceed && (
            <AlertDialogAction asChild>
              <Button onClick={proceed.action}>{proceed.text}</Button>
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
