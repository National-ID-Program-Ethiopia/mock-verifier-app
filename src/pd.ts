import type { PresentationDefinition } from "./sdk";

export const faydaPidPd: PresentationDefinition = {
  id: "fayda-digital-credential",
  purpose:
    "Mock Verifier Portal is requesting your Fayda digital ID to complete verification",
  format: {
    "vc+sd-jwt": {
      "sd-jwt_alg_values": ["ES256"],
    },
  },
  input_descriptors: [
    {
      id: "fayda-digital-credential",
      format: {
        "vc+sd-jwt": {
          "sd-jwt_alg_values": ["ES256"],
        },
      },
      constraints: {
        fields: [
          {
            path: ["$.vct"],
            filter: {
              type: "string",
              pattern: "FaydaDigitalCredential",
            },
          },
        ],
      },
    },
  ],
};
