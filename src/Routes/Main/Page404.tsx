import Image404 from "@/components/404image";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const SpaceScene = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 md:px-[100px] sm:px-[50px]">
            {/* <div className="sm:hidden md:flex bg-green-500">
                Testing visibility
            </div> */}

            <div className="grid md:grid-cols-2 sm:grid-cols-1">
                <div className="hidden md:block">
                    {/* hello */}
                    <Image404 />
                </div>

                <div className="flex justify-center items-center">
                    <div className="p-5">
                        <h1 className="text-8xl font-bold">404</h1>
                        <h2 className="text-3xl font-bold my-6">UH OH! You're lost.</h2>
                        <p className="my-6 text-accent-foreground">The page you are looking for does not exist.
                            How you got here is a mystery. But you can click the Button below
                            to go back to the homepage.
                        </p>
                        <Link to={'/'} >
                            <Button className="my-5">HOME</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpaceScene;
