import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRightIcon, GithubIcon, LinkedinIcon, TwitterIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function Aboutus() {
    const tabs = [
        {
            img: '/assets/img/our-story.jpg',
            value: "our-story",
            label: "Our Story",
            content_heading: "How Interview Pilot Started",
            content_description: "Many job seekers struggle with interview preparation, not knowing where to test their skills before facing real interviews. Interview Pilot was created to provide a platform where users can practice, receive AI-driven feedback, and improve their confidence. \n\nWe believe that practice makes perfect, and our platform allows candidates to experience real interview scenarios, learn from their mistakes, and feel more prepared when it matters the most."
        },
        {
            img: "/assets/img/our-mission.jpg",
            value: "our-mission",
            label: "Our Mission",
            content_heading: "Helping Candidates Succeed",
            content_description: "Our mission is to make interview preparation accessible to everyone. We aim to provide real-world mock interviews, instant feedback, and valuable insights to help users perform better in their job interviews. \n\nBy using AI-based suggestions and expert guidance, we ensure that candidates gain the confidence and knowledge they need to succeed in any interview process. Our goal is to support users at every step, from skill assessment to final interview rounds."
        },
        {
            img: "/assets/img/our-vision.jpg",
            value: "our-vision",
            label: "Our Vision",
            content_heading: "Shaping the Future of Interview Preparation",
            content_description: "We envision a world where every candidate enters an interview fully prepared. By leveraging AI and expert guidance, we strive to create an interactive, efficient, and stress-free preparation experience. \n\nWe want to build a community where job seekers can learn from their experiences, track their progress, and improve continuously. With Interview Pilot, users can practice anytime, anywhere, and gain the confidence to secure their dream job."
        }
    ];

    return (
        <div className="pb-10">
            <Container>
                {/* About Us Section */}
                <section className="z-50">
                    <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
                        <h1 className="mb-4 text-3xl font-bold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                            About Interview Pilot
                        </h1>
                        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
                            Interview Pilot helps job seekers <span className="font-bold"> prepare for interviews, build resumes, and attend real online video interviews. </span>
                            Our platform offers <span className="font-bold">AI mock interviews, instant feedback, and skill assessments</span> to boost confidence and improve interview performance.
                        </p>
                    </div>

                    {/* Card Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 my-10">
                        {/* AI Mock Interview Card */}
                        <Card className="shadow-lg rounded-xl">
                            <CardHeader className="p-3 rounded-xl">
                                <div className="px-4">
                                    <img src="/assets/img/mock-interview.jpg" alt="Mock Interview" className="w-full h-auto rounded-xl object-cover" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <h3 className="font-semibold text-2xl pb-3">AI Mock Interviews</h3>
                                <p className="text-muted-foreground">
                                    Practice with <span className="font-bold">AI-generated interview questions</span> and get <span className="font-bold">real-time feedback</span>.
                                    Improve your answers and gain confidence before your actual interview.
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Link to={"/resume"}><Button> Try Now  <ArrowRightIcon /></Button></Link>
                            </CardFooter>
                        </Card>

                        {/* Card with Image & Text */}
                        <Card className="col-span-1 md:col-span-2 flex flex-col md:flex-row shadow-lg rounded-xl">
                            {/* Image Container */}
                            <div className="w-full h-full md:w-1/2 p-3 md:ps-5">
                                <img src="/assets/img/resume-builder.webp" alt="Resume Builder" className="w-full h-full rounded-xl" />
                            </div>

                            {/* Text Content */}
                            <div className="w-full md:w-1/2">
                                <CardContent className="w-full p-5 flex flex-col justify-center">
                                    <h3 className="font-semibold text-3xl pb-3">Build Your Resume & Get Hired</h3>
                                    <p className="text-muted-foreground">
                                        Create a  <span className="font-bold">professional resume</span> with our easy resume builder.
                                        Apply for  <span className="font-bold">real online video interviews</span> with recruiters and start your career journey.
                                    </p>

                                    {/* 4 Boxes Section */}
                                    <div className="grid grid-cols-2 gap-4 mt-5">
                                        {[
                                            { text: "10+", description: "Resumes Created" },
                                            { text: "5+", description: "Live Interviews Done" },
                                            { text: "95%", description: "Success Rate" },
                                            { text: "10+", description: "Companies Hiring" }
                                        ].map((item, index) => (
                                            <div key={index} className="p-4 border rounded-lg shadow-md">
                                                <h2 className="text-3xl font-bold text-blue-600 py-2">{item.text}</h2>
                                                <p className="text-gray-600">{item.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter className="mt-auto">
                                    <Link to={'/resume'} ><Button>Get Started <ArrowRightIcon /> </Button></Link>
                                </CardFooter>
                            </div>
                        </Card>
                    </div>
                </section>

                <section className="py-30">
                    {/* Title Centered */}
                    {/* Tabs Centered */}
                    <div className="flex flex-col items-center">
                        <div className="mb-6">
                            <p className="text-4xl font-bold">Our Mission: Helping You Succeed</p>
                        </div>

                        <Tabs defaultValue="our-mission" className="w-full">
                            {/* Tabs List */}
                            <div className="flex justify-center mb-5 py-4">
                                <div className="flex items-center p-2 border border-black rounded-xl">
                                    <TabsList className="space-x-6 bg-white">
                                        {tabs.map((tab) => (
                                            <TabsTrigger
                                                key={tab.value}
                                                value={tab.value}
                                                className="px-4 py-2 text-sm font-medium text-black capitalize transition-colors duration-300 md:py-3 focus:outline-none hover:bg-black hover:text-white rounded-xl md:px-12 data-[state=active]:bg-black data-[state=active]:text-white">
                                                {tab.label}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </div>
                            </div>

                            {/* Tabs Content */}
                            {tabs.map((tab) => (
                                <TabsContent key={tab.value} value={tab.value}>
                                    <Container>
                                        <div className="grid grid-cols-1 md:grid-cols-3">
                                            <div>
                                                <img src={tab.img} alt="" className="h-full w-full object-cover rounded-2xl shadow-lg" />
                                            </div>
                                            <div className="py-6 px-10 md:col-span-2">
                                                <h3 className="font-semibold text-3xl pb-3">{tab.content_heading}</h3>
                                                <p className="text-muted-foreground">
                                                    {tab.content_description}
                                                </p>
                                                <Button className="mt-10 md:mt-15">Get Started <ArrowRightIcon /></Button>
                                            </div>
                                        </div>
                                    </Container>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>
                </section>
                <section className="pb-20">
                    <div className="container flex flex-col items-center justify-center p-4 mx-auto sm:p-10">
                        <p className="p-2 text-sm font-medium tracking-wider text-center uppercase">Development team</p>
                        <h1 className="text-4xl font-bold leading-none text-center sm:text-5xl">The talented people behind the scenes</h1>
                        <div className="flex flex-row flex-wrap-reverse justify-center mt-25">
                            {[
                                {
                                    img_src: "/assets/img/mock-interview.jpg",
                                    username: "Deepak Gangwar",
                                    userdesc: "Frontend Developer",
                                    usertwitter: "https://www.x.com",
                                    userlinkedin: "https://www.linkedin.com/home?originalSubdomain=in",
                                    usergithub: "https://github.com/",
                                },
                                {
                                    img_src: "/assets/img/mock-interview.jpg",
                                    username: "Himani",
                                    userdesc: "Visual Designer & Testing",
                                    usertwitter: "https://www.x.com",
                                    userlinkedin: "https://www.linkedin.com/home?originalSubdomain=in",
                                    usergithub: "https://github.com/",
                                },
                                {
                                    img_src: "/assets/img/mock-interview.jpg",
                                    username: "Nikhil Kumar",
                                    userdesc: "Backend Developer",
                                    usertwitter: "https://www.x.com",
                                    userlinkedin: "https://www.linkedin.com/home?originalSubdomain=in",
                                    usergithub: "https://github.com/",
                                }
                            ].map((item, index) => (
                                <div className="flex flex-col justify-center w-full px-8 mx-6 my-12 text-center rounded-md md:w-96 lg:w-80 xl:w-64 bg-gray-900 shadow-lg border border-gray-700" key={index}>
                                    {/* Profile Image */}
                                    <img alt="User Avatar" className="self-center flex-shrink-0 w-24 h-24 -mt-12 bg-center bg-cover rounded-full border-4 border-white shadow-md" src={item.img_src} />

                                    {/* Name & Role */}
                                    <div className="flex-1 my-4">
                                        <p className="text-xl font-semibold leading-snug text-white">{item.username}</p>
                                        <p className="text-gray-400">{item.userdesc}</p>
                                    </div>

                                    {/* Social Icons */}
                                    <div className="flex items-center justify-center p-3 space-x-4 border-t border-gray-700">
                                        <a rel="noopener noreferrer" href={item.usertwitter} title="Twitter" className="transition hover:scale-110">
                                            <TwitterIcon className="text-gray-400 hover:text-white transition-colors duration-300" />
                                        </a>
                                        <a rel="noopener noreferrer" href={item.userlinkedin} title="LinkedIn" className="transition hover:scale-110">
                                            <LinkedinIcon className="text-gray-400 hover:text-white transition-colors duration-300" />
                                        </a>
                                        <a rel="noopener noreferrer" href={item.usergithub} title="GitHub" className="transition hover:scale-110">
                                            <GithubIcon className="text-gray-400 hover:text-white transition-colors duration-300" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </Container>
        </div>
    );
}
