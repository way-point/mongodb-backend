import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { GraphQLSchema } from "graphql";

function descriptionDirective(directiveName: string) {
  return {
    descriptionDirectiveTypeDefs: `directive @${directiveName}(value: String) on FIELD_DEFINITION | ENUM_VALUE`,
    descriptionDirectiveTransformer: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
          const descriptionDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
          if (descriptionDirective) {
            fieldConfig.description = descriptionDirective["value"];
            return fieldConfig;
          }
        },
        [MapperKind.ENUM_VALUE]: (enumValueConfig) => {
          const descriptionDirective = getDirective(schema, enumValueConfig, directiveName)?.[0];
          if (descriptionDirective) {
            enumValueConfig.description = descriptionDirective["value"];
            return enumValueConfig;
          }
        },
      }),
  };
}

export default descriptionDirective;
