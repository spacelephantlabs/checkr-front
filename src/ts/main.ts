import { isValid, Coins, Socials, Personals } from 'checkr-lib';

const TYPE_COINS: string = 'Coins';
const TYPE_SOCIALS: string = 'Socials';
const TYPE_PERSONALS: string = 'Personals';

const CHECKR_FORM_ID = '#checkrForm';
const CHECKR_FORM_TYPE_ID = '#type';
const CHECKR_FORM_SUBTYPE_ID = '#subType';
const CHECKR_FORM_IDENTIFIER_ID = '#identifier';

(function($) {
  $(function() {
    resetSubTypeSelect();

    /**
     * Update subtype items on type change
     */
    $(CHECKR_FORM_TYPE_ID).on('change', (_) => {
      resetSubTypeSelect();
    });

    /**
     * Reset alerts on form values change
     */
    $(`${CHECKR_FORM_TYPE_ID}, ${CHECKR_FORM_SUBTYPE_ID}, ${CHECKR_FORM_IDENTIFIER_ID}`).on('change', resetAlerts);
    $(CHECKR_FORM_IDENTIFIER_ID).on('keydown', resetAlerts);

    $(CHECKR_FORM_ID).on('submit', () => {
      let type = getSelectedOption(CHECKR_FORM_TYPE_ID);
      let subtype = getSelectedOption(CHECKR_FORM_SUBTYPE_ID);
      let identifier: string = $(CHECKR_FORM_IDENTIFIER_ID).val() as string;

      if (type && subtype && identifier) {
        let idType = getEnum(type, subtype);
        if (idType) {
          try {
            let valid = isValid(idType, identifier);
            setResultInfos(valid, subtype, identifier);
          } catch (err) {
            displayError(err.message);
          }
        }
      }
    });

    function resetAlerts() {
      $('.alert').fadeOut();
    }

    function displayError(err: string): void {
      $('#error-details').html(err);
      $('#error').fadeIn();
    }

    function setResultInfos(valid: boolean, type: string, id: string): void {
      $('#result .resultFullType').html(type);
      $('#result .resultId').html(id);
      $(`#result .alert-${valid ? 'success' : 'danger'}`).fadeIn();
    }

    function getSelectedOption(id: string): string | undefined {
      if (id) {
        let select = $(id);
        if (select) {
          let selected = select.find(':selected');
          if (selected) {
            return selected.text();
          }
        }
      }
    }

    /**
     * Get enum corresponding to type and subtype
     * @param type
     * @param subtype
     */
    function getEnum(type: string, subtype: any): Coins | Socials | Personals | undefined {
      switch (type) {
        case TYPE_COINS:
          return Coins[subtype] as Coins;
        case TYPE_SOCIALS:
          return Socials[subtype] as Socials;
        case TYPE_PERSONALS:
          return Personals[subtype] as Personals;
      }
    }

    /**
     * Reset subtype items corresponding to selected type
     */
    function resetSubTypeSelect() {
      let selectedOption: string = $(CHECKR_FORM_TYPE_ID)
        .find(':selected')
        .text();
      if (selectedOption) {
        let subtypesSelect = $(CHECKR_FORM_SUBTYPE_ID);
        if (subtypesSelect) {
          let subtypes: string[] = getSubtypes(selectedOption);
          // Reset select
          $(`${CHECKR_FORM_SUBTYPE_ID} option`).remove();
          subtypes.forEach((element, index) => {
            $(`<option value="${element}"${index === 0 ? ' selected' : ''}>${element}</option>`).appendTo(
              subtypesSelect,
            );
          });
        }
      }
    }

    /**
     * Returns type enum content
     * @param type
     */
    function getSubtypes(type: string): string[] {
      switch (type) {
        case TYPE_COINS:
          return Object.keys(Coins);
        case TYPE_SOCIALS:
          return Object.keys(Socials);
        case TYPE_PERSONALS:
          return Object.keys(Personals);
        default:
          return [];
      }
    }
  });
})(jQuery);
