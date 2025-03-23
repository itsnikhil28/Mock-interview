import React from 'react'
import Container from './Container';
import { MainRoutes } from '@/lib/helper';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

interface SocialLinkProps {
    href: string;
    icon: React.ReactNode;
    hoverColor: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, hoverColor }) => {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`hover:${hoverColor}`}
        >
            {icon}
        </a>
    );
};

interface FooterLinkProps {
    to: string;
    children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ to, children }) => {
    return (
        <li>
            <Link
                to={to}
                className="hover:underline text-gray-300 hover:text-gray-100"
            >
                {children}
            </Link>
        </li>
    );
};


export default function Footer() {
    return (
        <div className="w-full bg-black text-gray-300 hover:text-gray-100 py-8" id='footer'>
            <Container>
                <div className="text-center md:text-left grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* First Column: Links */}
                    <div className='text-center'>
                        <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {MainRoutes.map((item, i) => (
                                <FooterLink key={i} to={item.href}>
                                    {item.label}
                                </FooterLink>
                            ))}
                        </ul>
                    </div>

                    {/* Second Column: About Us */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">About Us</h3>
                        <p>
                            We are committed to helping you unlock your full potential with
                            AI-powered tools. Our platform offers a wide range of resources to
                            improve your interview skills and chances of success.
                        </p>
                    </div>

                    {/* Third Column: Services */}
                    {/* <div>
                        <h3 className="font-bold text-lg mb-4">Services</h3>
                        <ul>
                            <FooterLink to="/services/interview-prep">
                                Interview Preparation
                            </FooterLink>
                            <FooterLink to="/services/career-coaching">
                                Career Coaching
                            </FooterLink>
                            <FooterLink to="/services/resume-building">
                                Resume Building
                            </FooterLink>
                        </ul>
                    </div> */}

                    {/* Fourth Column: Address and Social Media */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Contact Us</h3>
                        <p className="mb-4">123 AI Street, Tech City, 12345</p>
                        <div className="flex gap-4 justify-evenly md:justify-start">
                            <SocialLink
                                href="https://facebook.com"
                                icon={<Facebook size={24} />}
                                hoverColor="text-blue-500"
                            />
                            <SocialLink
                                href="https://twitter.com"
                                icon={<Twitter size={24} />}
                                hoverColor="text-blue-400"
                            />
                            <SocialLink
                                href="https://instagram.com"
                                icon={<Instagram size={24} />}
                                hoverColor="text-pink-500"
                            />
                            <SocialLink
                                href="https://linkedin.com"
                                icon={<Linkedin size={24} />}
                                hoverColor="text-blue-700"
                            />
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
