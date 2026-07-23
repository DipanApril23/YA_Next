// Page-sections barrel → import { Hero, MainServices, OurProcess, ... } from "@/components/sections".
export { default as Hero } from "./Hero/Hero";
export { default as MainServices } from "./MainServices/MainServices";
export { default as OurProcess } from "./OurProcess/OurProcess";
export { default as CaseStudies } from "./CaseStudies/CaseStudies";
export { default as Testimonials } from "./Testimonials/Testimonials";
export { default as ConsultationCTA } from "./ConsultationCTA/ConsultationCTA";
// OurPartners is embedded inside ConsultationCTA (imported there directly), not a page section.
export { default as WhyChoose } from "./WhyChoose/WhyChoose";
