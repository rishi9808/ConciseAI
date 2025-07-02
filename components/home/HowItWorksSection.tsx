import {
  BrainCircuit,
  FileOutput,
  FileText,
  MoveRight,
  Sparkles,
} from "lucide-react";
import { ReactNode } from "react";
import { MotionDiv } from "../common/motion-wrapper";
import { containerVariants, itemVariants } from "@/utils/animations";

type Steps = {
  icon: ReactNode;
  title: ReactNode;
  description: string;
};

const steps: Steps[] = [
  {
    icon: <FileText size={64} strokeWidth={1.5} />,
    title: "Upload your PDF",
    description:
      "Drag and drop your PDF file or click to select it from your device.",
  },
  {
    icon: <BrainCircuit size={64} strokeWidth={1.5} />,
    title: (
      <span className="flex items-center justify-center">
        AI Processing{" "}
        <Sparkles
          size={16}
          className="inline-block text-yellow-400 mb-1 ml-1"
        />
      </span>
    ),
    description:
      "Our AI analyzes the content of your PDF to create a concise summary.",
  },
  {
    icon: <FileOutput size={64} strokeWidth={1.5} />,
    title: "Get Your Summary",
    description:
      "Receive an easy-to-read summary of your PDF, ready for you to use.",
  },
];

export default function HowItWorksSection() {
  return (
    <MotionDiv
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      className="relative overflow-hidden bg-gray-50"
    >
      <div className="mx-auto max-w-5xl py-12 lg:py-24 px-4 sm:px-6 lg:px-8">
        {/* Gradient background */}
        <div
          aria-hidden="true"
          className="pointer-events-none relative inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-30"
        >
          <div
            style={{
              clipPath:
                "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            }}
            className="absolute left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72rem]"
          />
        </div>
        <div className="text-center mb-16">
          <h2 className="bg-linear-to-r from-rose-500 to-rose-700 bg-clip-text text-transparent uppercase font-bold text-xl">
            How it works
          </h2>
          <h3 className="font-bold text-3xl max-w-2xl mx-auto">
            Transform any PDF into an easy-to-digest summary in three simple
            steps
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
          {steps.map((step, index) => {
            return (
              <MotionDiv
                key={index}
                variants={itemVariants}
                className="relative flex items-stretch"
              >
                <StepItem {...step} />
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <MoveRight
                      size={32}
                      strokeWidth={1}
                      className="text-rose-400"
                    ></MoveRight>
                  </div>
                )}
              </MotionDiv>
            );
          })}
        </div>
      </div>
    </MotionDiv>
  );
}

function StepItem({ icon, title, description }: Steps) {
  return (
    <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10 hover:border-rose-500/50 transition-colors group w-full">
      <div className="flex flex-col gap-4 h-full">
        <div className="flex items-center justify-center h-24 w-24 mx-auto rounded-2xl bg-linear-to-br from-rose-500/10 to-transparent group-hover:from-rose-500/20">
          <div className="text-rose-500">{icon}</div>
        </div>
        <div className="flex flex-col flex-1 gap-1 justify-between">
          <h4 className="font-bold text-center text-xl">{title}</h4>
          <p className="text-sm text-center text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}
