"use client"

import HardBreak from "@tiptap/extension-hard-break"
import Placeholder from "@tiptap/extension-placeholder"

import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import { Editor, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

interface EditorContextProviderProps {
  children: ReactNode
}

export type EditorContextType = {
  editor: Editor | null
  setEditor: Dispatch<SetStateAction<Editor | null>>
  editable: boolean
  setEditable: Dispatch<SetStateAction<boolean>>
}

const EditorContext = createContext({} as EditorContextType)

export function EditorContextProvider({
  children,
}: EditorContextProviderProps) {
  const [editor, setEditor] = useState<Editor | null>(null)
  const [editable, setEditable] = useState(false)

  const editorConfig = useEditor({
    extensions: [
      StarterKit.configure({ hardBreak: false }),
      Placeholder.configure({ placeholder: "Digite a expressão..." }),
      Subscript,
      Superscript,
      HardBreak.extend({
        addKeyboardShortcuts() {
          return {
            Enter: () => this.editor.commands.setHardBreak(),
            "Shift-Enter": () => this.editor.commands.setHardBreak(),
          }
        },
      }),
    ],

    editorProps: {
      attributes: {
        class:
          "flex py-4 text-xl w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-5",
      },
    },
  })

  useEffect(() => setEditor(editorConfig), [editorConfig])

  return (
    <EditorContext.Provider
      value={{ setEditor, editor, editable, setEditable }}
    >
      {children}
    </EditorContext.Provider>
  )
}

export const useEditorContext = () => useContext(EditorContext)
