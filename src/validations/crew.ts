import Joi from "joi";
import { CrewUpdateAction } from "../typings/enums";

export const updateMemberSchema = Joi
  .string()
  .valid(CrewUpdateAction.ACCEPT, CrewUpdateAction.DENY)