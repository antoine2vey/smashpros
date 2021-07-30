import Joi from "joi";
import { CrewUpdateAction } from "../typings/enums";

export const updateMemberSchema = Joi
  .string()
  .allow([CrewUpdateAction.ACCEPT, CrewUpdateAction.DENY])
  .message('Sent wrong action')