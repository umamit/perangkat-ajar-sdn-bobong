import React from "react";
import { StudentPersonalFields } from "./StudentPersonalFields";
import { StudentAdditionalFields } from "./StudentAdditionalFields";

export function StudentFormFields(props: any) {
  return (
    <div className="max-h-[58vh] overflow-y-auto pr-1.5 space-y-3.5 text-left text-xs">
      <StudentPersonalFields {...props} />
      <StudentAdditionalFields {...props} />
    </div>
  );
}
