import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "../ui/card";
import { MotionDiv } from "../common/motion-wrapper";
import { containerVariants, itemVariants } from "@/utils/animations";

type PriceType = {
  id: string;
  name: string;
  price: number;
  description: string;
  items: string[];
  paymentLink: string;
  priceId: string;
};

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 9,
    description: "Perfect for occasional use",
    items: [
      "5 PDF Summaries per month",
      "Basic AI Summarization",
      "Email Support",
    ],
    paymentLink: "",
    priceId: "",
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    description: "Pro plan for professionals",
    items: [
      "Unlimited PDF Summaries",
      "Advanced AI Summarization",
      "Priority Support",
      "Markdown Export",
    ],
    paymentLink: "",
    priceId: "",
  },
];

const PricingCard = ({
  id,
  name,
  price,
  description,
  items,
  paymentLink,
}: PriceType) => {
  const borderColor = id === "pro" ? "border-rose-500" : "border-gray-300";
  const nameColor = id === "pro" ? "text-rose-600" : "text-gray-700";
  return (
    <Card
      className={`flex flex-col ${borderColor} bg-white rounded-2xl shadow-md border transition-transform hover:scale-105 hover:shadow-lg min-w-[280px] w-full max-w-xs sm:max-w-md px-8 lg:max-w-lg mx-auto lg:mx-0`}
    >
      <CardHeader className="mb-4 text-center p-0">
        <CardTitle
          className={`text-xl font-semibold uppercase tracking-wide mb-1 ${nameColor}`}
        >
          {name}
        </CardTitle>
        <CardDescription className="text-gray-500 text-sm mb-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="mb-6 text-center flex flex-col items-center p-0">
        <div className="flex items-center">
          <span className="text-5xl font-extrabold text-gray-900">
            ${price}
          </span>
          <div className="text-sm text-gray-500 font-medium flex flex-col">
            <span className="font-bold">USD</span>
            <span className="text-xs">/month</span>
          </div>
        </div>
      </CardContent>
      <CardContent className="mb-8 p-0">
        <ul className="space-y-3 text-gray-700">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check
                className={id === "pro" ? "text-rose-500" : "text-gray-400"}
                size={20}
              />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="mt-auto p-0">
        <Link
          href={paymentLink || "#"}
          className="flex items-center justify-center gap-2 w-full text-center py-2 px-4 rounded-lg bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700 text-white font-semibold shadow-md hover:from-rose-600 hover:to-rose-800 transition-colors duration-200"
        >
          Buy Now <ArrowRight size={18} />
        </Link>
      </CardFooter>
    </Card>
  );
};

function PricingSection() {
  return (
    <MotionDiv
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      id="pricing"
      className="relative bg-rose-50/60 py-16"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 relative">
          <h2 className="text-3xl font-extrabold bg-linear-to-r from-rose-500 to-rose-700 bg-clip-text text-transparent mb-2 tracking-tight inline-block relative">
            Pricing
            {/* Blinking badge in the "power" position */}
            <span
              className="absolute -top-4 -right-16 -rotate-30 animate-pulse"
              style={{ fontSize: "0.65rem" }}
            >
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-semibold shadow-sm border border-yellow-200">
                <svg
                  className="w-2 h-2 mr-1 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <circle cx="10" cy="10" r="10" />
                </svg>
                under dev
              </span>
            </span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Choose the plan that fits your needs
          </p>
        </div>
        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
          {plans.map((plan, idx) => (
            <MotionDiv
              key={plan.id}
              variants={itemVariants}
              className="w-full flex"
            >
              <PricingCard {...plan} />
            </MotionDiv>
          ))}
        </div>
      </div>
    </MotionDiv>
  );
}

export default PricingSection;
