import CodeBlockShiki from "tiptap-extension-code-block-shiki";

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
        // Break line (only)
        return false;
      },
    };
  },
});

export default CustomCodeBlockShiki;
