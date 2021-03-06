import delay from './delay';

const projects = [{
        "id": 1,
        "title": "2015 - 2017 Capital One Home Loans",
        "body": "Responsible for developing and maintaining web user interfaces for Capital One's Home Loans.",
        "teaser": "Responsible for developing and maintaining web page user interfaces for Capital One's Home Loan portal website and pre-qualification application with HTML, CSS/Sass, JavaScript/AngularJS 1.x.",
        "className": "cardImageCapitalOne",
        "projects": {
            "project1": {
                "title": "Home Loans websites",
                "intro": "In 2015, Capital One revamped their home mortgage, refinance, and equity websites which used AngularJS as its main JavaScript application framework. I helped build its websites within a couple of months which include interactive mortgage and refinance calculators.",
                "images": [{
                        "src": "{capitaloneDP1}"
                    },
                    {
                        "src": "{capitaloneDP2}"
                    },
                    {
                        "src": "{capitaloneDP3}"
                    }
                ]
            },
            "project2": {
                "title": "Home Mortgage Pre-Qualification application",
                "intro": "After the release of the new Capital One's Home Loans websites, I was assigned to clean up and create new features for their home mortgage pre-qualification application.",
                "images": [{
                        "src": "{capitalonePQ1}"
                    },
                    {
                        "src": "{capitalonePQ2}"
                    },
                    {
                        "src": "{capitalonePQ3}"
                    },
                    {
                        "src": "{capitalonePQ4}"
                    }
                ]
            }
        }
    },
    {
        "id": 2,
        "title": "2012 - 2015 Client projects for iCrossing",
        "body": "Building websites for the agency's clients such as BlueCross BlueShield of Tennessee and Mitsubishi Motors.",
        "teaser": "Building websites for the agency's clients such as BlueCross BlueShield of Tennessee, MitsubishiCars.com, PNC Bank, Hilton Hotels, and Toyota.com.",
        "className": "cardImageIcrossing",
        "projects": {
            "project1": {
                "title": "BlueCross BlueShield of Tennessee website",
                "intro": "I worked with one of Tennessee's major health insurance companies, BlueCross BlueShield of Tennessee. In order to prepare for the Affordable Care Act, my team and I redesigned the company's site to incorporate the new healthcare laws. I was part of the team that was in charge of developing the desktop and mobile versions of the site, incorporating front-end web components to its corporate content management system, and helping to troubleshoot CSS or JavaScript bugs for the client.",
                "images": [{
                        "src": "{icrossingBCBST1}"
                    },
                    {
                        "src": "{icrossingBCBST2}"
                    }
                ]
            },
            "project2": {
                "title": "Hilton Hotels prototypes",
                "intro": "From HTML emails to Facebook app updates to one-page parallax scrolling web pages, I worked on a wide variety of projects for Hilton hotel brands.",
                "images": [{
                    "src": "{icrossingHilton1}"
                }]
            },
            "project3": {
                "title": "Mitsubishi Motors website",
                "intro": "I was on the team that was responsible for maintaining and fixing CSS and JavaScript bugs for the newly created Mitsubishi's responsive web design site. ",
                "images": [{
                    "src": "{icrossingMitsubishi11}"
                }]
            }
        }
    },
    {
        "id": 3,
        "title": "2008 - 2012 Client projects for Publicis Hawkeye",
        "body": "Developed web designs for clients such as ThyssenKrupp Elevator and Raising Cane's.",
        "teaser": "Creating websites and emails for clients such as ThyssenKrupp Elevator, Travelocity, Capital One, Cablevision, The North Face, Alltel, Agilent, The Dallas Morning News, Sony, and Raising Cane's.",
        "className": "cardImageHawkeye",
        "projects": {
            "project1": {
                "title": "ThyssenKrupp Elevator website",
                "intro": "I was one of the lead front-end developers for the major elevator company's redesign website. I helped lead the development of the static web pages.",
                "images": [{
                    "src": "{hawkeyeTK1}"
                }]
            },
            "project2": {
                "title": "hawkeye Agency website",
                "intro": "Back in early 2010s, the agency replaced their Adobe Flash-powered website with one that pulls postings from their employees' professional social media accounts. I was assigned to be the main developer to code its layout and customized the content management system's functionality.",
                "images": [{
                        "src": "{hawkeyeAgency1}"
                    },
                    {
                        "src": "{hawkeyeAgency2}"
                    }
                ]
            }
        }
    }
];

class mockAPI {
    static getAllProjects() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(Object.assign([], projects));
            }, delay);
        });
    }
}

export default mockAPI;