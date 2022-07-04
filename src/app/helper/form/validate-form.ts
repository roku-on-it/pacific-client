import { ClassConstructor, plainToInstance } from 'class-transformer';
import { FormGroup } from '@angular/forms';
import { validateSync } from 'class-validator';

export const validateForm =
  (cls: ClassConstructor<any>) => (formGroup: FormGroup) => {
    const controls = Object.keys(formGroup.controls);
    const validationErrors = validateSync(
      plainToInstance(cls, formGroup.value)
    );
    const errors = {};

    if (0 !== validationErrors.length) {
      for (const control of controls) {
        const constraint = Object.values(
          validationErrors.find((v) => control === v.property)?.constraints ??
            {}
        )[0];

        if (null != constraint) {
          errors[control] = constraint;
          formGroup.controls[control].setErrors({ [control]: constraint });
        }
      }

      return errors;
    }

    return null;
  };
