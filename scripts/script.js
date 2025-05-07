//  local storage data terug zetten
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const fields = document.querySelectorAll("input");

  //  HTML5-validatie uitschakelen als js beschikbaar is
  if (form) {
    form.setAttribute("novalidate", "novalidate");
  }

  // geen id dan overslaan
  fields.forEach((field) => {
    const id = field.id;
    if (!id) return;

    // als het opgeslagen is stop het terug
    const stored = localStorage.getItem(id);
    if (stored !== null) {
      if (field.type === "radio") {
        field.checked = stored === field.value;
      } else {
        field.value = stored;
      }
    }
  });


  //  uit en in schakelen velden (1b en 1d)
  function setupConditionalDisabling(wrapperSelector, triggerSelector) {
    // kijkt naar alle radios in de stukken en alles met class .skipped
    const triggerRadios = document.querySelectorAll(triggerSelector);
    const optionalFieldsets = document.querySelectorAll(`${wrapperSelector} .skipped`);

    if (!triggerRadios.length || !optionalFieldsets.length) return; // niks gevonden stop dan

    const toggleFieldsets = () => {
      const selectedRadio = Array.from(triggerRadios).find(r => r.checked);
      const isSkip = selectedRadio?.classList.contains('skip'); // controleer of nee is aangeklikt

      optionalFieldsets.forEach(fieldset => {
        const inputs = fieldset.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
          // zet alles uit of aan met .disabled
          if (isSkip) input.setAttribute('disabled', 'disabled');
          else input.removeAttribute('disabled');
        });

        // class toevoegen
        fieldset.classList.toggle('disabled', isSkip);
      });
    };

    toggleFieldsets();
    triggerRadios.forEach(radio => radio.addEventListener('change', toggleFieldsets));
  }

  // voor beide functie aanroepen
  setupConditionalDisabling('.one-b', '.one-b-line-one input');
  setupConditionalDisabling('.one-d', '.one-d-line-one input');

  //  voer change event uit na localStorage herstel
  const allRadios = document.querySelectorAll("input[type='radio']");
  allRadios.forEach(radio => {
    radio.dispatchEvent(new Event('change'));
  });


//  door/terug springen datum velden
  document.querySelectorAll('.datum-groep').forEach(group => {
    const inputs = group.querySelectorAll('input.date-input');

    // als max.legnth is behaald springt curser door
    inputs.forEach((input, index) => {
      input.addEventListener('input', () => {
        if (input.value.length === parseInt(input.maxLength)) {
          const next = inputs[index + 1];
          if (next) next.focus();
        }
      });

      // als veld leeg is en dan op backspace drukt dan:
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && input.value === '') {
          const prev = inputs[index - 1];
          if (prev) {
            e.preventDefault();
            prev.focus();
          }
        }
      });
    });
  });


  //  local storage opslaan
  fields.forEach((field) => {
    // check op id
    const id = field.id;
    if (!id) return;

    const save = () => {
      if (field.type === "radio" && field.checked) {
        localStorage.setItem(id, field.value);
      } else {
        localStorage.setItem(id, field.value);
      }
    };

    // slaat het op als iemand typed of checked
    field.addEventListener("input", save);
    field.addEventListener("change", save);
  });


  //  validatie verstuur form (submit)
  form.addEventListener("submit", (e) => {
    const requiredInputs = form.querySelectorAll("input[required]");
    let allValid = true;

    requiredInputs.forEach(input => {
      if (!input.checkValidity()) {
        input.classList.add("invalid-input"); // class toevoegen voor rode rand
        allValid = false;

        // zodra er word getyped dan haal class en event weg
        input.addEventListener("input", function clearInvalid() {
          input.classList.remove("invalid-input");
          input.removeEventListener("input", clearInvalid);
        });
      }
    });

    // stopt als niet alles goed is en springt naar form
    if (!allValid) {
      e.preventDefault();
      form.scrollIntoView({ behavior: "smooth" });
    } else {
      localStorage.clear(); // als alles klopt, clear
    }
  });
});
