import { Editor, isNodeSelection, useEditorState } from '@tiptap/react';
import { BubbleMenu, type BubbleMenuProps } from '@tiptap/react/menus';
import { Bold, Code, Italic, Strikethrough, Underline } from 'lucide-react';
import { useState, useCallback, useMemo, memo } from 'react';

import { ColorButton } from '@colanode/ui/editor/menus/color-button';
import { HighlightButton } from '@colanode/ui/editor/menus/highlight-button';
import { LinkButton } from '@colanode/ui/editor/menus/link-button';
import { MarkButton } from '@colanode/ui/editor/menus/mark-button';

interface ToolbarMenuProps extends Omit<BubbleMenuProps, 'children'> {
  editor: Editor;
}

export const ToolbarMenu = memo((props: ToolbarMenuProps) => {
  const [isColorButtonOpen, setIsColorButtonOpen] = useState(false);
  const [isLinkButtonOpen, setIsLinkButtonOpen] = useState(false);
  const [isHighlightButtonOpen, setIsHighlightButtonOpen] = useState(false);

  const state = useEditorState({
    editor: props.editor,
    selector: ({ editor }) => {
      if (!editor) {
        return null;
      }

      return {
        isEditable: editor.isEditable,
        isBoldActive: editor.isActive('bold'),
        isItalicActive: editor.isActive('italic'),
        isUnderlineActive: editor.isActive('underline'),
        isStrikeActive: editor.isActive('strike'),
        isCodeActive: editor.isActive('code'),
      };
    },
  });

  const shouldShow = useCallback(
    ({ state, editor }: { state: any; editor: Editor }) => {
      const { selection } = state;
      const { empty } = selection;

      if (empty) {
        return false;
      }

      if (isNodeSelection(selection)) {
        return false;
      }

      if (
        editor.isActive('page') ||
        editor.isActive('database') ||
        editor.isActive('folder') ||
        editor.isActive('file') ||
        editor.isActive('tempFile')
      ) {
        return false;
      }

      return true;
    },
    []
  );

  const onHide = useCallback(() => {
    setIsColorButtonOpen(false);
    setIsLinkButtonOpen(false);
    setIsHighlightButtonOpen(false);
  }, []);

  const bubbleMenuProps: ToolbarMenuProps = useMemo(
    () => ({
      ...props,
      shouldShow,
      options: {
        strategy: 'absolute' as const,
        placement: 'top' as const,
        offset: 8,
        onHide,
      },
    }),
    [props, shouldShow, onHide]
  );

  const handleLinkButtonOpenChange = useCallback(
    (isOpen: boolean) => {
      setIsColorButtonOpen(false);
      setIsHighlightButtonOpen(false);
      setIsLinkButtonOpen(isOpen);
    },
    []
  );

  const handleColorButtonOpenChange = useCallback(
    (isOpen: boolean) => {
      setIsColorButtonOpen(isOpen);
      setIsLinkButtonOpen(false);
      setIsHighlightButtonOpen(false);
    },
    []
  );

  const handleHighlightButtonOpenChange = useCallback(
    (isOpen: boolean) => {
      setIsHighlightButtonOpen(isOpen);
      setIsColorButtonOpen(false);
      setIsLinkButtonOpen(false);
    },
    []
  );

  const handleBoldClick = useCallback(() => {
    props.editor?.chain().focus().toggleBold().run();
  }, [props.editor]);

  const handleItalicClick = useCallback(() => {
    props.editor?.chain().focus().toggleItalic().run();
  }, [props.editor]);

  const handleUnderlineClick = useCallback(() => {
    props.editor?.chain().focus().toggleUnderline().run();
  }, [props.editor]);

  const handleStrikeClick = useCallback(() => {
    props.editor?.chain().focus().toggleStrike().run();
  }, [props.editor]);

  const handleCodeClick = useCallback(() => {
    props.editor?.chain().focus().toggleCode().run();
  }, [props.editor]);

  if (props.editor == null) {
    return null;
  }

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="flex flex-row items-center gap-1 rounded border border-border bg-muted p-0.5 shadow-xl transition-transform duration-150 ease-out"
    >
      <LinkButton
        editor={props.editor}
        isOpen={isLinkButtonOpen}
        setIsOpen={handleLinkButtonOpenChange}
      />
      <MarkButton
        isActive={state?.isBoldActive ?? false}
        onClick={handleBoldClick}
        icon={Bold}
      />
      <MarkButton
        isActive={state?.isItalicActive ?? false}
        onClick={handleItalicClick}
        icon={Italic}
      />
      <MarkButton
        isActive={state?.isUnderlineActive ?? false}
        onClick={handleUnderlineClick}
        icon={Underline}
      />
      <MarkButton
        isActive={state?.isStrikeActive ?? false}
        onClick={handleStrikeClick}
        icon={Strikethrough}
      />
      <MarkButton
        isActive={state?.isCodeActive ?? false}
        onClick={handleCodeClick}
        icon={Code}
      />
      <ColorButton
        editor={props.editor}
        isOpen={isColorButtonOpen}
        setIsOpen={handleColorButtonOpenChange}
      />
      <HighlightButton
        editor={props.editor}
        isOpen={isHighlightButtonOpen}
        setIsOpen={handleHighlightButtonOpenChange}
      />
    </BubbleMenu>
  );
});

ToolbarMenu.displayName = 'ToolbarMenu';
