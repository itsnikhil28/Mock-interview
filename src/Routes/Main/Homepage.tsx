import Container from "@/components/Container";
import Marqueimg from "@/components/Marque-img";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpenCheck, Sparkles } from "lucide-react";
import Marquee from "react-fast-marquee";
import { Link } from "react-router-dom";
import accordiondata from "./accordion-question.json"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-react";
import { useUser } from "@/provider/User-Provider";

export default function Homepage() {
    const [activeFeed, setactiveFeed] = useState(0)
    const { userId } = useAuth()
    const { role } = useUser()
    return (
        <div className="flex-col w-full">
            <Container>
                <div className="my-8">
                    <h2 className="text-3xl text-center md:text-left md:text-6xl">
                        <span className="text-outline font-semibold md:text-8xl">
                            INTERVIEW PILOT
                        </span>
                        <span className="text-gray-500 font-extrabold">
                            - A better way to
                        </span>
                        <br />
                        improve your interview chances and skills
                    </h2>

                    <p className="mt-4 text-muted-foreground text-sm">
                        Boost your interview skills and increase your success rate with AI-driven insights. Discover a smarter way to prepare, practice, and stand out.
                    </p>
                </div>

                <div className="flex w-full items-center justify-evenly md:px-12 md:py-16 md:items-center md:justify-end gap-12">
                    <p className="text-3xl font-semibold text-gray-900 text-center">
                        25+
                        <span className="block text-xl text-muted-foreground font-normal">
                            Offers Recieved
                        </span>
                    </p>
                    <p className="text-3xl font-semibold text-gray-900 text-center">
                        50+
                        <span className="block text-xl text-muted-foreground font-normal">
                            Interview Aced
                        </span>
                    </p>
                </div>

                {/* image section */}
                <div className="w-full mt-4 rounded-xl bg-gray-100 h-[420px] drop-shadow-md overflow-hidden relative">
                    <img
                        src="/assets/img/hero.jpg"
                        alt=""
                        className="w-full h-full object-cover"
                    />

                    <div className="hidden md:block absolute w-80 bottom-4 right-4 px-4 py-2 rounded-md bg-white/60 backdrop-blur-md">
                        <h2 className="text-neutral-800 font-semibold">Developer</h2>
                        <p className="text-sm text-neutral-500">
                            Elevate your career with AI-powered interview preparation.
                            Get real-time insights and boost your confidence to land your dream job.
                        </p>

                        <Link to={userId ? "/generate" : "/sign-in"} className="w-full">
                            <Button className="mt-3">
                                Generate <Sparkles />
                            </Button>
                        </Link>
                    </div>
                </div>
            </Container>

            {/* marquee section */}
            <div className="w-full my-12">
                <Marquee pauseOnHover>
                    <Marqueimg img="/assets/img/logo/firebase.png" />
                    <Marqueimg img="/assets/img/logo/meet.png" />
                    <Marqueimg img="/assets/img/logo/zoom.png" />
                    <Marqueimg img="/assets/img/logo/firebase.png" />
                    <Marqueimg img="/assets/img/logo/microsoft.png" />
                    <Marqueimg img="/assets/img/logo/meet.png" />
                    <Marqueimg img="/assets/img/logo/tailwindcss.png" />
                    <Marqueimg img="/assets/img/logo/microsoft.png" />
                </Marquee>
            </div>

            <Container className="py-8 space-y-8">
                <h2 className="tracking-wide text-xl text-gray-800 font-semibold">
                    Unleash your potential with personalized AI insights and targeted
                    interview practice.
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <div className="col-span-1 md:col-span-3">
                        <img
                            src="/assets/img/office.jpg"
                            alt=""
                            className="w-full max-h-96 rounded-md object-cover"
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2 w-full flex flex-col items-center justify-center text-center h-96 md:h-60 lg:h-96 gap-8">
                        <p className="text-center text-muted-foreground">
                            Transform the way you prepare, gain confidence, and boost your
                            chances of landing your dream job. Let AI be your edge in
                            today&apos;s competitive job market.
                        </p>

                        <Link to={userId ? "/generate" : "/sign-in"} className="w-full">
                            <Button className="w-3/4">
                                Generate <Sparkles className="ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="w-full max-w-[800px] mx-auto">
                    <h2 className="text-2xl md:text-3xl py-3 mt-30">
                        FAQs
                    </h2>
                    <Accordion type="single" collapsible className="space-y-6">
                        {accordiondata.map((item, i) => (
                            <AccordionItem value={item.question} key={i} className="border rounded-lg shadow-md">
                                <AccordionTrigger onClick={() => setactiveFeed(item.id)}
                                    className={cn("px-5 py-4 flex items-center justify-between text-base rounded-t-lg transition-colors hover:no-underline cursor-pointer",
                                        activeFeed === item.id ? "bg-gradient-to-r from-purple-50 to-blue-50" : "hover:bg-gray-50")}>
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="px-5 py-6 bg-white rounded-b-lg space-y-5 shadow-inner flex">
                                    <BookOpenCheck className="inline mr-2 text-yellow-400 size-13 mb-0" />
                                    <div className="font-semibold text-gray-700">
                                        {item.answer}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </Container>

            <div>
                <section className="z-50 bg-gray-50">
                    <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
                        <h1 className="mb-4 text-3xl font-bold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                            AI-Powered Mock Interviews
                        </h1>
                        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
                            Get ready for your dream job with our AI-driven interview platform. Create stunning resumes and have live video calls with HR professionals.
                        </p>
                        <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                            <Link to={userId ? "/generate" : "/sign-in"} className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary hover:bg-primary-dark">
                                {userId ? "Start Now" : "Start Your Journey Today"} <ArrowRight className="ms-3" />
                            </Link>
                        </div>
                    </div>
                </section>
            </div>

            {/* Request to become an interviewer (Only for candidates) */}
            {userId && role === "candidate" && (
                <section className="z-50">
                    <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
                        <h1 className="mb-4 text-xl font-bold tracking-tight leading-none text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
                            Are You an Interviewer at a Company?
                        </h1>
                        <p className="mb-8 text-lg font-normal text-gray-500 sm:px-16 xl:px-48 dark:text-gray-400">
                            If you conduct interviews in your organization and want to leverage your expertise, apply to become a professional interviewer on our platform.
                        </p>
                        <Link to={'/apply-as-interviewer'}>
                            <Button className="inline-flex justify-center items-center py-5 px-5 text-base font-medium text-center text-white rounded-lg bg-primary hover:bg-primary-dark">Apply as an Interviewer</Button>
                        </Link>
                    </div>
                </section>
            )}
        </div>
    )
}
