class Forms {
  static getHtmlID(id) {
    return `input-${id}`;
  }

  static renderField({ label, id, content, help, type, category = "general" }) {
    const $field = createElementFromTemplate(`
    <div class="field field${type}" data-cat="${category}">
      <div class="label">
        <label for="${Forms.getHtmlID(id)}">${label}</label>
        ${help ? `<p>${help}</p>` : ""}
      </div>
    </div>
    `);

    $field.appendChild(
      content instanceof Element ? content : createElementFromTemplate(content)
    );

    return $field;
  }

  static renderTextField(label, value, fieldOptions) {
    const { id } = fieldOptions;
    return Forms.renderField({
      ...fieldOptions,
      label,
      content: `<div class="input">
          <input type="text" id="${Forms.getHtmlID(
            id
          )}" name="${id}" value="${value ? value.toString() : ''}"/>
        </div>`,
    });
  }

  static renderSelectField(label, value, fieldOptions) {
    const { id, options } = fieldOptions;
    const optionTransformer = (option) => {
      const oText = isObject(option) ? option.text : option;
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
    const $content = createElementFromTemplate(
      `<div class="input image-input">
        <label for="${htmlID}" class="image-input__preview is-hidden"><span></span></label>
        <label class="image-input__file is-hidden">
          <span class="image-input__file-l">New file:</span>
          <span class="image-input__file-v">Something.gif</span>
        </label>
        <label for="${htmlID}" class="image-input__trigger">
          <input type="file" id="${htmlID}" name="${id}"/>
          <span class="image-input__trigger-text">Edit</span>
        </label>
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
      <label for="${Forms.getHtmlID(id)}" class="checkbox">
        <input type="checkbox" id="${Forms.getHtmlID(
          id
        )}" name="${id}" value="1" ${checked}/>
        <span></span>
      </label>
    </div>`;
    return Forms.renderField({ ...fieldOptions, label, content });
  }
}
