import Joi from "joi";
import { CrewActions } from "../typings/enums";

export const updateMemberSchema = Joi
  .string()
  .valid(CrewActions.Update.ACCEPT, CrewActions.Update.DENY)