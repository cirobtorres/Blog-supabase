import CodeBlockShiki from "tiptap-extension-code-block-shiki";

// TipTapCodeEditor is being prevented from create new nodes.
// TipTap CodeBlock Lowlight generates new <pre><code> by pressing enter three times or by navigation with arrow down at the end of every block.
// CustomCodeBlockShiki modifies that behavior. CodeBlockShiki is a tiptap third party extention to integrate it with Shiki.
// Thats because TipTap works with Lowlight through your native extension CodeBlockLowlight.
// Shiki wrapperes code content within <pre><code> tags. TipTap is doing the same. TipTapCodeEditor is only allowed to have one single <pre> block for editor.

const CustomCodeBlockShiki = CodeBlockShiki.extend({
  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      ArrowDown: ({ editor }) => {
        const { state } = editor;
        const { $from } = state.selection;
        const after = $from.after();

        if (after !== undefined) {
          // Evaluates the existance of a node
          return false; // Standard behavior to arrow down → just to navigate
        }

        return true; // Do not create another <pre><code></pre></code> tags
      },
      ArrowUp: () => {
        // Navigation (only)
        return false;
      },

      Enter: () => {
        // Break to a new line (only)
        return false;
      },
    };
  },
});

export default CustomCodeBlockShiki;
