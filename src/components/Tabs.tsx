"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { MapPin, CheckCircle, Tag, Info, ListTodo } from "lucide-react"
import RichText from "./RichText"
import Image from "@/components/PayloadImage"
import { Media } from "@/cms-types"

interface Tab {
  id: number
  label: string
  icon: Media
  content: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  };
}

interface Props {
  tabs: Tab[]
}
export default function TabsViaje({ tabs }: Props) {
  const [activeTab, setActiveTab] = useState(0)
  console.log(tabs)

  return (
    <div className="w-full  mx-auto ">
      <div className=" flex  lg:flex-wrap flex-col lg:flex-row justify-between gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex flex-col items-center justify-center p-4 min-w-[230px] border rounded-md transition-all ${activeTab === tab.id ? "border-green-600 bg-white" : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
          >
            <div className="flex justify-center mb-2">
              <Image media={tab.icon} className="object-cover" />
            </div>
            <span className="text-sm text-[clamp(12.2px,1.2vw,23px)] font-medium">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div
                className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-green-600"
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
      <div className="mt-6 border rounded-lg p-0 md:p-3 lg:p-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="space-y-4">
            <RichText data={tabs.find((tab) => tab.id === activeTab)?.content!} className="" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
