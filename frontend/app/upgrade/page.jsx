"use client";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
// import Header from "../dashboard/_components/Header";

const UpgradePlans = () => {
    const plans = [
        {
            title: "Basic Plan",
            price: "$3",
            questions: 10,
            description: "Get 10 questions per mock interview session.",
        },
        {
            title: "Pro Plan",
            price: "$5",
            questions: 20,
            description: "Get 20 questions per mock interview session.",
            
        },
    ]; 

    return (
        <div className="min-h-screen flex flex-col items-center justify-center  p-3">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Upgrade Your Plan</h2>
            <p className="text-gray-500 text-lg mb-8">
                Choose a plan that fits your interview practice needs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                {plans.map((plan, index) => (
                    <div
                        key={index}
                        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300 flex flex-col items-center"
                    >
                        <h3 className="text-xl font-semibold text-gray-800">{plan.title}</h3>
                        <p className="text-4xl font-bold text-blue-600 my-3">{plan.price}</p>
                        <p className="text-gray-600 mb-4">{plan.description}</p>
                        <div className="flex items-center text-green-500 mb-6">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            <span className="text-sm">Includes {plan.questions} questions</span>
                        </div>
                        <div className="flex items-center text-green-500 mb-6">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            <span className="text-sm">Includes perfect feedback with improvement suggestions</span>
                        </div>
                        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
                            Upgrade Now
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpgradePlans;
