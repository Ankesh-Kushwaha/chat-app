import React, { useState } from "react";
import  Header from "../components/Header";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import Footer from "../components/Footer";
import { RegisterModal } from "../components/RegisterModal";

export default function HomePage() {
const [isModalOpen, setModalOpen] = useState(false);

return ( <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
<Header onRegisterClick={() => setModalOpen(true)} />
<Hero onGetStarted={() => setModalOpen(false)} /> <Features /> <Footer />
<RegisterModal open={isModalOpen} onClose={() => setModalOpen(false)} /> </div>
);
}
