import { useState } from "react";

interface SpecFeature {
  name: string;
  values: string[];
}

interface SpecGroupType {
  type: string;
  defaultOpen?: boolean;
  features: SpecFeature[];
}

interface SpecGroupProps {
  group: SpecGroupType;
}

export default function SpecGroup({ group }: SpecGroupProps) {
  return (
    <div className="border border-white/8 rounded-xl overflow-hidden mb-2.5">
      <h4 className="text-xl md:text-2xl lg:text-3xl font-bold text-black mb-4">{group.type}</h4>

      <div>
        {group.features.map((feat, i) => (
          <div key={i} className="flex  gap-4 mb-3  items-start">
            <span className="text-lg sm:text-xl md:text-[22px] lg:text-2xl font-bold text-[#656565] leading-relaxed w-1/4">
              {feat.name}
            </span>
            <div className="w-3/4 flex flex-col gap-2 ">
              {feat.values.map((value, j) => (
                <div
                  key={`${feat.name}-${i}-${j}`}
                  className="flex items-start"
                >
                  <span className="min-w-1 h-1 mt-2 rounded-full bg-black inline-flex mr-2"></span>{" "}
                  <span
                    className="text-sm sm:text-base md:text-lg lg:text-xl inline-flex text-black font-medium leading-relaxed "
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
