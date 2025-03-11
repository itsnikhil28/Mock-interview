import Container from "@/components/Container";
import { AtomIcon, Edit, Video, FileText, Users, Share2, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Service() {
    return (
        <div>
            {/* Hero Section */}
            <section className="z-50">
                <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
                    <h1 className="mb-4 text-3xl font-bold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                        AI-Powered Mock Interviews
                    </h1>
                    <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
                        Get ready for your dream job with our AI-driven interview platform. Create stunning resumes and have live video calls with HR professionals.
                    </p>
                    <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                        <Link to="/sign-in" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary hover:bg-primary-dark">
                            Get Started
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-8 bg-white text-center">
                <div className="py-5 z-50 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
                    <Container>
                        <h2 className="font-bold text-3xl">How It Works?</h2>
                        <p className="text-md text-gray-500">Prepare for interviews in 3 simple steps</p>

                        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <div className="block rounded-xl border bg-white border-gray-200 p-8 shadow-xl">
                                <Video className='h-8 w-8 mx-auto' />
                                <h2 className="mt-4 text-xl font-bold text-black">Mock Interviews</h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Practice with AI-driven mock interviews to boost confidence and improve responses.
                                </p>
                            </div>
                            <div className="block rounded-xl border bg-white border-gray-200 p-8 shadow-xl">
                                <FileText className='h-8 w-8' />
                                <h2 className="mt-4 text-xl font-bold text-black">Build Your Resume</h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Create a professional resume with AI suggestions tailored to your field.
                                </p>
                            </div>
                            <div className="block rounded-xl border bg-white border-gray-200 p-8 shadow-xl">
                                <Users className='h-8 w-8' />
                                <h2 className="mt-4 text-xl font-bold text-black">Live Video Call with HR</h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Connect with real HR professionals to get interview feedback and insights.
                                </p>
                            </div>
                        </div>
                    </Container>
                </div>
            </section>

            {/* Key Features */}
            <section className="py-8 bg-gray-100 text-center">
                <div className="py-5 z-50 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
                    <Container>
                        <h2 className="text-3xl font-bold">Why Choose Us?</h2>
                        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {[
                                { icon: Edit, title: "AI-Powered Resume Tips", desc: "Get AI suggestions to enhance your resume." },
                                { icon: AtomIcon, title: "Real-Time AI Feedback", desc: "Receive instant feedback on interview responses." },
                                { icon: Share2, title: "Share Your Resume", desc: "Easily share your resume with recruiters." }
                            ].map((feature, index) => (
                                <div key={index} className="block rounded-xl border bg-white border-gray-200 p-8 shadow-xl">
                                    <feature.icon className='h-8 w-8 mx-auto' />
                                    <h2 className="mt-4 text-xl font-bold text-black">{feature.title}</h2>
                                    <p className="mt-1 text-sm text-gray-600">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </Container>
                </div>
            </section>

            {/* Testimonials
            <section className="py-16 text-center">
                <h2 className="text-3xl font-bold">What Our Users Say</h2>
                <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {[
                        { name: "Rohit Kumar", review: "This platform helped me ace my dream job interview!" },
                        { name: "Ananya Patel", review: "The AI resume builder gave me amazing suggestions!" },
                        { name: "Vikas Mehra", review: "Live HR calls were extremely helpful in understanding interview strategies." }
                    ].map((testi, index) => (
                        <div key={index} className="block rounded-xl border bg-white border-gray-200 p-8 shadow-xl">
                            <CheckCircle className='h-8 w-8 mx-auto text-green-500' />
                            <h3 className="mt-4 text-lg font-semibold text-black">{testi.name}</h3>
                            <p className="mt-2 text-sm text-gray-600">"{testi.review}"</p>
                        </div>
                    ))}
                </div>
            </section> */}

            {/* FAQ Section */}
            <section className="py-8 text-center">
                <div className="py-3 z-50 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
                    <Container>
                        <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
                        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {[
                                { question: "Is this platform free?", answer: "Yes, we offer free mock interviews and resume building." },
                                { question: "How do I schedule an HR interview?", answer: "You can book a slot from your dashboard." },
                                { question: "Can I download my resume?", answer: "Yes, you can download your resume as a PDF." }
                            ].map((faq, index) => (
                                <div key={index} className="block rounded-xl border bg-white border-gray-200 p-8 shadow-xl">
                                    <HelpCircle className='h-8 w-8 mx-auto text-blue-500' />
                                    <h3 className="mt-4 text-lg font-semibold text-black">{faq.question}</h3>
                                    <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </Container>
                </div>
            </section>
        </div>
    );
}