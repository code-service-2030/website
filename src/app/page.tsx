import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import Reviews from "@/components/Reviews";
import Gallery from "@/components/Gallery";
import GoogleMaps from "@/components/GoogleMaps";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import FloatingActions from "@/components/FloatingActions";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import FeaturedServices from "@/components/FeaturedServices";
import ServiceWizard from "@/components/ServiceWizard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Sticky Navigation Header */}
      <Header />

      {/* Main Single Page Sections */}
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />

        {/* Featured / Most Requested Services */}
        <FeaturedServices />

        {/* Services Showcase Section */}
        <Services />

        {/* Help Me Choose Wizard */}
        <ServiceWizard />

        {/* About Office Section */}
        <About />

        {/* Counter Stats Section */}
        <WhyChooseUs />

        {/* Customer Testimonials Section */}
        <Reviews />

        {/* Business Office Photo Gallery */}
        <Gallery />

        {/* Location & Navigation Section */}
        <GoogleMaps />

        {/* FAQ Accordion Section */}
        <FAQ />

        {/* Contact Form & Info Details Section */}
        <Contact />
      </main>

      {/* Global Floating Actions (WhatsApp, Dial, Scroll-to-Top) */}
      <FloatingActions />

      {/* Office Footer Details */}
      <Footer />
    </div>
  );
}
