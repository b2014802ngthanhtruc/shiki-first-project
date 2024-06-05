import * as joi from 'joi';

import { BaseValidator } from '@common/validators';

export const CreateCategoryDtoValidator = BaseValidator.keys({
  name: joi.string().trim().required(),
  parentId: joi.string().trim(),
});
