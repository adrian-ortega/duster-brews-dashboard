class Templateable {
  render(template, $parent) {
    const $el = this.createElement(template);
    if ($parent) {
      $parent.appendChild($el);
    }
    return $el;
  }

  createElement(template) {
    if (!template && isFunction(this.template)) {
      template = this.template();
    }

    const _div = document.createElement("div");
    _div.innerHTML = template.trim();
    return _div.firstChild;
  }
}

class Forms {
  static renderFields(fields, $form, eachCallback = NOOP) {
    fields.forEach((field) => {
      let $field;
      const fieldOpts = { ...field, id: field.name };
      switch (field.type) {
        case "select":
          $field = Forms.renderSelectField(field.label, field.value, fieldOpts);
          break;
        case "boolean":
        case "bool":
          $field = Forms.renderSwitchField(field.label, field.value, fieldOpts);
          break;
        case "image":
          $field = Forms.renderImageField(field.label, field.value, fieldOpts);
          break;
        case "text":
        default:
          $field = Forms.renderTextField(field.label, field.value, fieldOpts);
          break;
      }
      $form.appendChild($field);

      if (isFunction(eachCallback)) {
        eachCallback.apply(null, [$field, field]);
      }
    });

    const $firstField = $form.querySelector(".field:first-child");
    if ($firstField) {
      $firstField
        .querySelector(".input")
        .querySelectorAll("select, input, textarea")[0]
        .focus();
    }
  }

  static fillFields(fields, model, $form) {
    for (let i = 0; i < fields.length; i++) {
      const { name, type } = fields[i];
      const value = objectHasKey(model, name) ? model[name] : null;
      const $input = $form.querySelector(`[name="${name}"]`);
      console.log({ name, type, value });
      switch (type) {
        case "image":
          if (value) {
            const $field = $input.closest(".field");
            const $preview = $field.querySelector(".image-input__preview");
            $preview.querySelector(
              ".image-input__img"
            ).innerHTML = `<img src="${value}" alt="Preview"/>`;
            $preview.classList.remove("is-hidden");
          }
          break;
        default:
          $input.value = value;
          break;
      }
    }
  }

  static getHtmlID(id) {
    return `input-${id}`;
  }

  static renderField({
    label,
    id,
    content,
    help,
    type = "text",
    category = "general",
    required = false,
  }) {
    const template = new Templateable();
    const $field = template.createElement(`
    <div class="field field--${type}" data-cat="${category}">
      <div class="label">
        <label for="${Forms.getHtmlID(id)}">
          ${label}${required ? '<span class="required">*</span>' : ""}
        </label>
        ${help ? `<p>${help}</p>` : ""}
      </div>
    </div>
    `);

    $field.appendChild(
      content instanceof Element ? content : template.createElement(content)
    );

    return $field;
  }

  static renderTextField(label, value, fieldOptions) {
    const { id } = fieldOptions;
    return Forms.renderField({
      ...fieldOptions,
      label,
      content: `<div class="input">
          <input type="text" id="${Forms.getHtmlID(id)}" name="${id}" value="${
        value ? value.toString() : ""
      }"/>
        </div>`,
    });
  }

  static renderSelectField(label, value, fieldOptions) {
    const { id, options } = fieldOptions;
    const optionTransformer = (option) => {
      const oText = (isObject(option) ? option.text : option).replace(
        /^-*(.)|-+(.)/g,
        (s, c, d) => (c ? c.toUpperCase() : " " + d.toUpperCase())
      );
      const oValue = isObject(option) ? option.value : option;
      const oSel = oValue === value ? ' selected="selected"' : "";
      return `<option value="${oValue}"${oSel}>${oText}</option>`;
    };
    return Forms.renderField({
      ...fieldOptions,
      label,
      content: `<div class="input">
        <div class="select">
          <select id="${Forms.getHtmlID(id)}" name="${id}">${options.map(
        optionTransformer
      )}</select>
          <span for="${Forms.getHtmlID(
            id
          )}" class="icon">${ICON_MENU_DOWN}</span>
        </div>
      </div>`,
    });
  }

  static renderImageField(label, value, fieldOptions) {
    const { id } = fieldOptions;
    const htmlID = Forms.getHtmlID(id);
    const $content = window[window.APP_NS].createElement(
      `<div class="input image-input">
        <label for="${htmlID}" class="image-input__preview ${
        value ? "" : "is-hidden"
      }">
          <span><span class="image-input__img">
          ${value ? `<img src="${value.src}" alt="Preview"/>` : ""}
          </span></span>
        </label>
        <label class="image-input__file is-hidden">
          <span class="image-input__file-l">New file:</span>
          <span class="image-input__file-v">Something.gif</span>
        </label>
        <label for="${htmlID}" class="button image-input__trigger">
          <input type="file" id="${htmlID}" name="${id}"/>
          <span class="image-input__trigger-text">Edit</span>
        </label>
        <input type="hidden" name="" value=""/>
      </div>`
    );

    $content.querySelector("input").addEventListener("change", (e) => {
      const $input = e.target;
      const $text = $content.querySelector(".image-input__trigger-text");
      const $file = $content.querySelector(".image-input__file");

      // @TODO language?
      $text.innerHTML = "Change";
      console.log($input.files);

      // $preview.classList.remove('is-hidden');
      $file.classList.remove("is-hidden");
      $file.querySelector(".image-input__file-v").innerHTML =
        $input.files[0].name;
    });

    return Forms.renderField({ ...fieldOptions, label, content: $content });
  }

  static renderSwitchField(label, value, fieldOptions) {
    const { id } = fieldOptions;
    const checked = value ? 'checked="checked"' : "";
    const content = `<div class="input">
      <label for="${Forms.getHtmlID(id)}" class="switch">
        <input type="checkbox" id="${Forms.getHtmlID(
          id
        )}" name="${id}" value="1" ${checked}/>
        <span></span>
      </label>
    </div>`;
    return Forms.renderField({ ...fieldOptions, label, content });
  }
}

window[window.APP_NS].Forms = Forms;
window[window.APP_NS].render = (t, p) => new Templateable().render(t, p);
window[window.APP_NS].createElement = (t) =>
  new Templateable().createElement(t);
