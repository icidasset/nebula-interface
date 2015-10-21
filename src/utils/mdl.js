export function overrideTextFieldValidation(nodes) {
  nodes.forEach((node) => {
    const mt = node.MaterialTextfield;

    mt.checkValidity = checkValidity.bind(mt)
    mt.checkValidity({ isInitialRender: true });
  });
}


/// Private
///

/// checkValidity override
/// Don't mark as invalid on initial render
function checkValidity(options = {}) {
  if (this.input_.validity) {
    if (this.input_.validity.valid || options.isInitialRender) {
      this.element_.classList.remove(this.CssClasses_.IS_INVALID);
    } else {
      this.element_.classList.add(this.CssClasses_.IS_INVALID);
    }
  }
}
