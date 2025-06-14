export const forumDataStore = {
    general: [
        { id: 'g1', title: "Welcome to AccelerateHer TechPath Community!", author: "Admin", replies: 5, lastPost: "2 hours ago", content: "Hello everyone, and welcome! This is the place to connect, ask questions, and share your journey. We're excited to have you here!" },
        { id: 'g2', title: "Introduce Yourself Here!", author: "CommunityBot", replies: 23, lastPost: "15 minutes ago", content: "Tell us a bit about yourself and what you're hoping to learn!" },
    ],
    python: [
        { id: 'p1', title: "Stuck on Python Loops - Help!", author: "Learner123", replies: 3, lastPost: "30 minutes ago", content: "I'm having trouble understanding nested for loops. Can someone explain with an example?" },
        { id: 'p2', title: "Best Python IDE for Beginners?", author: "NewbieCoder", replies: 7, lastPost: "5 hours ago", content: "I'm just starting with Python. What IDE do you recommend? VS Code, PyCharm, or something else?" }
    ],
    'data-analysis': [
        { id: 'd1', title: "Pandas DataFrame merge issue", author: "DataGal", replies: 2, lastPost: "1 hour ago", content: "I'm trying to merge two DataFrames on a common column but getting unexpected results..."}
    ],
    'web-dev': [],
    cloud: [
         { id: 'c1', title: "Which cloud certification to start with?", author: "CloudDreamer", replies: 6, lastPost: "yesterday", content: "I want to get into cloud, should I start with AWS, Azure, or GCP certs?"}
    ],
    career: [
         { id: 'ca1', title: "Resume review thread", author: "HRHelper", replies: 18, lastPost: "4 hours ago", content: "Post your anonymized resume here for peer review!"}
    ],
    feedback: [
        { id: 'f1', title: "Suggestions for new course topics", author: "CuriousLearner", replies: 4, lastPost: "1 day ago", content: "I'd love to see a course on advanced Git or Docker."}
    ]
};

export const modulesData = {
    "python_fundamentals": {
        title: "Python Fundamentals",
        videoId: "kqtD5dpn9C8", 
        references: [
            { text: "The Official Python Tutorial - Python.org", url: "https://docs.python.org/3/tutorial/" },
            { text: "Automate the Boring Stuff with Python by Al Sweigart", url: "https://automatetheboringstuff.com/" },
            { text: "Think Python 2e by Allen B. Downey", url: "https://greenteapress.com/wp/think-python-2e/" }
        ],
        topics: ["Variables and Data Types", "Operators", "Control Flow", "Functions", "Basic Data Structures"]
    },
    "numpy_essentials": {
        title: "NumPy Essentials",
        videoId: "QUT1VHiLmmI", 
        references: [
            { text: "NumPy Official Documentation", url: "https://numpy.org/doc/stable/" },
            { text: "Python Data Science Handbook: NumPy - Jake VanderPlas", url: "https://jakevdp.github.io/PythonDataScienceHandbook/02.00-introduction-to-numpy.html" }
        ],
        topics: ["Introduction to NumPy Arrays", "Array Indexing and Slicing", "Universal Functions (ufuncs)", "Array Manipulation"]
    },
    "pandas_core": {
        title: "Pandas Core",
        videoId: "vmEHCJofslg", 
        references: [
            { text: "Pandas Official Documentation", url: "https://pandas.pydata.org/pandas-docs/stable/" },
            { text: "10 Minutes to pandas", url: "https://pandas.pydata.org/pandas-docs/stable/user_guide/10min.html" }
        ],
        topics: ["Introduction to Series and DataFrame", "Data Loading and Saving", "Indexing and Selecting Data", "Grouping and Aggregation"]
    },
    "data_visualization": { // Added for completeness from original dashboard
        title: "Data Visualization",
        videoId: "0XTq7bX2x3o", // Example: Matplotlib tutorial
        references: [{text: "Matplotlib Documentation", url: "https://matplotlib.org/stable/contents.html"}],
        topics: ["Intro to Matplotlib", "Plotting basics", "Customizing plots"]
    },
     "cloud_intro": {
        title: "Intro to Cloud Concepts",
        videoId: "MivqfbH6h0M", // Example: AWS Cloud Practitioner Essentials
        references: [{ text: "AWS Cloud Practitioner Essentials", url: "https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/"}],
        topics: ["What is Cloud Computing?", "Cloud Service Models (IaaS, PaaS, SaaS)", "Cloud Deployment Models"]
    },
    "aws_basics": {
        title: "AWS Core Services",
        videoId: "r4YIdn2eTm4", // Example: AWS EC2, S3, VPC
        references: [{ text: "AWS Core Services Overview", url: "https://aws.amazon.com/products/"}],
        topics: ["EC2 (Elastic Compute Cloud)", "S3 (Simple Storage Service)", "VPC (Virtual Private Cloud)", "IAM (Identity and Access Management)"]
    },
    "azure_basics": {
        title: "Azure Fundamentals",
        videoId: "NKEPWdQ7W_Y", // Example: AZ-900
        references: [{ text: "Azure Fundamentals Learning Path", url: "https://docs.microsoft.com/en-us/learn/paths/azure-fundamentals/"}],
        topics: ["Azure Core Architectural Components", "Azure Core Services", "Azure Security, Privacy, Compliance, and Trust"]
    },
    "python_data_structures": {
        title: "Data Structures in Python",
        videoId: "R_ip9Sw2G2A", // Example
        references: [{ text: "Python Data Structures - GeeksforGeeks", url: "https://www.geeksforgeeks.org/python-data-structures/"}],
        topics: ["Advanced Lists", "Tuples In-depth", "Sets", "Dictionaries Advanced"]
    },
    "python_oop": {
        title: "Object-Oriented Python",
        videoId: "Ej_02ICOIgs", // Example
        references: [{ text: "Python OOP Tutorial - Real Python", url: "https://realpython.com/python3-object-oriented-programming/"}],
        topics: ["Classes and Objects", "Inheritance", "Polymorphism", "Encapsulation"]
    },
    "html_css_js": {
        title: "HTML, CSS, JavaScript",
        videoId: "G3e-cpL7ofc", // Example: Traversy Media Crash Course
        references: [{ text: "MDN Web Docs", url: "https://developer.mozilla.org/"}],
        topics: ["HTML Structure", "CSS Selectors & Box Model", "JavaScript DOM Manipulation", "Events"]
    },
    "react_basics": {
        title: "React Fundamentals",
        videoId: "bMknfKXIFA8", // Example: React Official Tutorial
        references: [{ text: "React Official Docs", url: "https://reactjs.org/"}],
        topics: ["JSX", "Components & Props", "State & Lifecycle", "Handling Events"]
    },
    "nodejs_express": {
        title: "Backend with Node.js",
        videoId: "fBNz5xF-Kx4", // Example
        references: [{ text: "Express.js Docs", url: "https://expressjs.com/"}],
        topics: ["Node.js Basics", "Express.js Setup", "Routing", "Middleware"]
    }
    // Add more modules as needed
};