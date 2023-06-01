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
      switch (type) {
        case "image":
          if (value) {
            const $field = $input.closest(".field");
            const $preview = $field.querySelector(".image-input__preview");
            const src = objectHasKey(value, "src") ? value.src : value;
            $preview.querySelector(
              ".image-input__img"
            ).innerHTML = `<img src="${src}" alt="Preview"/>`;
            $preview.classList.remove("is-hidden");
            console.log({ name, type, value: src });
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
    const imageSrc = objectHasKey(value, "src") ? value.src : value;
    const $el = window[window.APP_NS].createElement(
      `<div class="input image-input" data-id="${id}">
        <label for="${htmlID}" class="image-input__preview ${
        value ? "" : "is-hidden"
      }">
          <span><span class="image-input__img">
          ${imageSrc ? `<img src="${imageSrc}" alt="Preview"/>` : ""}
          </span></span>
        </label>
        <label class="image-input__file is-hidden">
          <span class="image-input__file-l">New file:</span>
          <span class="image-input__file-v">Something.gif</span>
        </label>
        <div class="image-input__buttons">
          <label for="${htmlID}" class="button image-input__trigger">
            <input type="file" id="${htmlID}" name="${id}"/>
            <span class="image-input__trigger-text">Edit</span>
          </label>
          <button class="button is-remove${!imageSrc ? " is-hidden" : ""}">
            <span class="text">Remove</span>
          </button>
        </div>
      </div>`
    );

    $el.querySelector("input").addEventListener("change", (e) => {
      const $input = e.target;
      const $file = $el.querySelector(".image-input__file");
      $file.classList.remove("is-hidden");
      $file.querySelector(".image-input__file-v").innerHTML =
        $input.files[0].name;
    });

    $el
      .querySelector(".button.is-remove")
      .addEventListener("click", async (e) => {
        e.preventDefault();
        const confirmMessage =
          "Are you sure you want to remove this image? It cannot be undone.";

        if (confirm(confirmMessage)) {
          const body = new FormData();
          const $img = $el.querySelector(".image-input__img img");
          body.append("path", $img.getAttribute("src"));
          const response = await fetch("/api/media", {
            method: "DELETE",
            body,
          });
          const { data } = await response.json();
          if (data.deleted) {
            $el.querySelector(".button.is-remove").classList.add("is-hidden");
            $el.querySelector(".image-input__img").innerHTML = "";
            $el
              .querySelector(".image-input__preview")
              .classList.add("is-hidden");
          }
        }
      });

    return Forms.renderField({ ...fieldOptions, label, content: $el });
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

class Templates {
  constructor() {
    this.engine = null;
  }

  getEngine() {
    if (!this.engine) {
      this.engine = new Templateable();
    }
    return this.engine;
  }

  render(t, p) {
    return this.getEngine().render(t, p);
  }

  createElement(t) {
    return this.getEngine().createElement(t);
  }

  imageTemplate(src, alt) {
    if (!src) return "";
    const _src = objectHasKey(src, "src") ? src.src : src;
    return `<figure class="image"><span><span><img src="${_src}" alt="${alt}"/></span></span></figure>`;
  }

  image(src, alt, parent) {
    return src
      ? this.getEngine().render(this.imageTemplate(src, alt), parent)
      : null;
  }
}

const app = getApp();

app.Forms = Forms;
app.Templates = new Templates();

app.render = app.Templates.render.bind(app.Templates);
app.createElement = app.Templates.createElement.bind(app.Templates);
