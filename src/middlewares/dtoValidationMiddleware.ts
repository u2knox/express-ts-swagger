import { RequestHandler } from "express";
import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { sanitize } from "class-sanitizer";
import { ClassConstructor } from "class-transformer";
import { unlink } from "fs";

export const dtoValidationMiddleware = (
  type: ClassConstructor<Object>,
  skipMissingProperties = false
): RequestHandler => {
  return (req, res, next) => {
    const dtoObj = plainToClass(type, req.body);
    validate(dtoObj, { skipMissingProperties }).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          if (req.file) {
            unlink(req.file.destination + req.file.filename, () => {});
          }

          res.status(400);
          res.json(errors[0].constraints);
        } else {
          sanitize(dtoObj);
          req.body = dtoObj;
          next();
        }
      }
    );
  };
};
