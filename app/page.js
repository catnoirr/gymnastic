import Hero from "@/components/hero";
import Features from "@/components/features";
import HowItWillHelp from "@/components/HowsItWork";
import About from "@/components/about";


export default function App() {
  return (
    <div className="bg-[#F5F5F5]">
    
      <Hero />
      <Features />
      <HowItWillHelp />
      <About/>
    </div>
  );
}
