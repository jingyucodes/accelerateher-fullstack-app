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
        { id: 'd1', title: "Pandas DataFrame merge issue", author: "DataGal", replies: 2, lastPost: "1 hour ago", content: "I'm trying to merge two DataFrames on a common column but getting unexpected results..." }
    ],
    'web-dev': [],
    cloud: [
        { id: 'c1', title: "Which cloud certification to start with?", author: "CloudDreamer", replies: 6, lastPost: "yesterday", content: "I want to get into cloud, should I start with AWS, Azure, or GCP certs?" }
    ],
    career: [
        { id: 'ca1', title: "Resume review thread", author: "HRHelper", replies: 18, lastPost: "4 hours ago", content: "Post your anonymized resume here for peer review!" }
    ],
    feedback: [
        { id: 'f1', title: "Suggestions for new course topics", author: "CuriousLearner", replies: 4, lastPost: "1 day ago", content: "I'd love to see a course on advanced Git or Docker." }
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
        topics: ["Variables and Data Types", "Operators", "Control Flow", "Functions", "Basic Data Structures"],
        readingContent: {
            estimatedReadingTime: 25, // 预计阅读时间（分钟）
            sections: [
                {
                    title: "Introduction to Python",
                    content: `
                        <h3>What is Python?</h3>
                        <p>Python is a high-level, interpreted programming language known for its simplicity and readability. Created by Guido van Rossum and first released in 1991, Python emphasizes code readability with its notable use of significant whitespace.</p>
                        
                        <h3>Why Learn Python?</h3>
                        <ul>
                            <li><strong>Easy to Learn:</strong> Python's syntax is clear and intuitive, making it perfect for beginners</li>
                            <li><strong>Versatile:</strong> Used in web development, data science, artificial intelligence, automation, and more</li>
                            <li><strong>Large Community:</strong> Extensive libraries and frameworks available</li>
                            <li><strong>High Demand:</strong> One of the most sought-after programming languages in the job market</li>
                        </ul>
                        
                        <h3>Python Philosophy - The Zen of Python</h3>
                        <blockquote>
                            <p>"Beautiful is better than ugly. Explicit is better than implicit. Simple is better than complex."</p>
                            <cite>- The Zen of Python by Tim Peters</cite>
                        </blockquote>
                    `
                },
                {
                    title: "Variables and Data Types",
                    content: `
                        <h3>Understanding Variables</h3>
                        <p>Variables in Python are containers for storing data values. Unlike other programming languages, Python has no command for declaring a variable. A variable is created the moment you first assign a value to it.</p>
                        
                        <h4>Basic Variable Assignment</h4>
                        <pre><code>
# Creating variables
name = "Alice"
age = 25
height = 5.6
is_student = True
                        </code></pre>
                        
                        <h3>Python Data Types</h3>
                        <h4>1. Numeric Types</h4>
                        <ul>
                            <li><strong>int:</strong> Integers (whole numbers) - <code>x = 5</code></li>
                            <li><strong>float:</strong> Floating point numbers - <code>y = 3.14</code></li>
                            <li><strong>complex:</strong> Complex numbers - <code>z = 2+3j</code></li>
                        </ul>
                        
                        <h4>2. Text Type</h4>
                        <ul>
                            <li><strong>str:</strong> Strings (text) - <code>message = "Hello World"</code></li>
                        </ul>
                        
                        <h4>3. Boolean Type</h4>
                        <ul>
                            <li><strong>bool:</strong> True or False - <code>is_valid = True</code></li>
                        </ul>
                        
                        <h4>4. Sequence Types</h4>
                        <ul>
                            <li><strong>list:</strong> Ordered, changeable collection - <code>fruits = ["apple", "banana", "cherry"]</code></li>
                            <li><strong>tuple:</strong> Ordered, unchangeable collection - <code>coordinates = (10, 20)</code></li>
                        </ul>
                        
                        <h4>5. Mapping Type</h4>
                        <ul>
                            <li><strong>dict:</strong> Key-value pairs - <code>person = {"name": "John", "age": 30}</code></li>
                        </ul>
                        
                        <div class="practice-exercise">
                            <h4>💡 Practice Exercise</h4>
                            <p>Try creating variables of different types and use the <code>type()</code> function to check their data types:</p>
                            <pre><code>
my_string = "Hello"
my_number = 42
my_list = [1, 2, 3]

print(type(my_string))  # <class 'str'>
print(type(my_number))  # <class 'int'>
print(type(my_list))    # <class 'list'>
                            </code></pre>
                        </div>
                    `
                },
                {
                    title: "Control Flow and Functions",
                    content: `
                        <h3>Control Flow Statements</h3>
                        <p>Control flow statements allow you to control the order in which your code executes based on certain conditions.</p>
                        
                        <h4>If Statements</h4>
                        <pre><code>
age = 18

if age >= 18:
    print("You are an adult")
elif age >= 13:
    print("You are a teenager")
else:
    print("You are a child")
                        </code></pre>
                        
                        <h4>Loops</h4>
                        <h5>For Loops</h5>
                        <pre><code>
# Iterating over a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(f"I like {fruit}")

# Using range
for i in range(5):
    print(f"Number: {i}")
                        </code></pre>
                        
                        <h5>While Loops</h5>
                        <pre><code>
count = 0
while count < 5:
    print(f"Count: {count}")
    count += 1
                        </code></pre>
                        
                        <h3>Functions</h3>
                        <p>Functions are reusable blocks of code that perform specific tasks. They help organize your code and avoid repetition.</p>
                        
                        <h4>Defining Functions</h4>
                        <pre><code>
def greet(name):
    """This function greets someone"""
    return f"Hello, {name}!"

# Calling the function
message = greet("Alice")
print(message)  # Output: Hello, Alice!
                        </code></pre>
                        
                        <h4>Function Parameters</h4>
                        <pre><code>
def calculate_area(length, width, shape="rectangle"):
    """Calculate area with default parameter"""
    if shape == "rectangle":
        return length * width
    elif shape == "triangle":
        return 0.5 * length * width

# Different ways to call the function
area1 = calculate_area(5, 3)  # Uses default shape
area2 = calculate_area(5, 3, "triangle")  # Specifies shape
area3 = calculate_area(width=4, length=6)  # Named arguments
                        </code></pre>
                        
                        <div class="key-takeaway">
                            <h4>🔑 Key Takeaways</h4>
                            <ul>
                                <li>Use if/elif/else for conditional logic</li>
                                <li>for loops are great for iterating over sequences</li>
                                <li>while loops continue until a condition is false</li>
                                <li>Functions make code reusable and organized</li>
                                <li>Use descriptive function names and docstrings</li>
                            </ul>
                        </div>
                    `
                }
            ]
        }
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
        references: [{ text: "Matplotlib Documentation", url: "https://matplotlib.org/stable/contents.html" }],
        topics: ["Intro to Matplotlib", "Plotting basics", "Customizing plots"]
    },
    "cloud_intro": {
        title: "Intro to Cloud Concepts",
        videoId: "MivqfbH6h0M", // Example: AWS Cloud Practitioner Essentials
        references: [{ text: "AWS Cloud Practitioner Essentials", url: "https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/" }],
        topics: ["What is Cloud Computing?", "Cloud Service Models (IaaS, PaaS, SaaS)", "Cloud Deployment Models"]
    },
    "aws_basics": {
        title: "AWS Core Services",
        videoId: "r4YIdn2eTm4", // Example: AWS EC2, S3, VPC
        references: [{ text: "AWS Core Services Overview", url: "https://aws.amazon.com/products/" }],
        topics: ["EC2 (Elastic Compute Cloud)", "S3 (Simple Storage Service)", "VPC (Virtual Private Cloud)", "IAM (Identity and Access Management)"]
    },
    "azure_basics": {
        title: "Azure Fundamentals",
        videoId: "NKEPWdQ7W_Y", // Example: AZ-900
        references: [{ text: "Azure Fundamentals Learning Path", url: "https://docs.microsoft.com/en-us/learn/paths/azure-fundamentals/" }],
        topics: ["Azure Core Architectural Components", "Azure Core Services", "Azure Security, Privacy, Compliance, and Trust"]
    },
    "python_data_structures": {
        title: "Data Structures in Python",
        videoId: "R_ip9Sw2G2A", // Example
        references: [{ text: "Python Data Structures - GeeksforGeeks", url: "https://www.geeksforgeeks.org/python-data-structures/" }],
        topics: ["Advanced Lists", "Tuples In-depth", "Sets", "Dictionaries Advanced"]
    },
    "python_oop": {
        title: "Object-Oriented Python",
        videoId: "Ej_02ICOIgs", // Example
        references: [{ text: "Python OOP Tutorial - Real Python", url: "https://realpython.com/python3-object-oriented-programming/" }],
        topics: ["Classes and Objects", "Inheritance", "Polymorphism", "Encapsulation"]
    },
    "html_css_js": {
        title: "HTML, CSS, JavaScript",
        videoId: "G3e-cpL7ofc", // Example: Traversy Media Crash Course
        references: [{ text: "MDN Web Docs", url: "https://developer.mozilla.org/" }],
        topics: ["HTML Structure", "CSS Selectors & Box Model", "JavaScript DOM Manipulation", "Events"]
    },
    "react_basics": {
        title: "React Fundamentals",
        videoId: "bMknfKXIFA8", // Example: React Official Tutorial
        references: {
            estimatedReadingTime: 10,
            sections: [
                {
                    title: "React Official Documentation",
                    content: `
                        <h3>React Official Docs</h3>
                        <p>The official React documentation is the best place to start learning about React concepts, API, and best practices. It covers everything from basic to advanced topics.</p>
                        <ul>
                            <li><strong>Getting Started:</strong> <a href='https://react.dev/learn' target='_blank'>React Learn</a></li>
                            <li><strong>API Reference:</strong> <a href='https://react.dev/reference/react' target='_blank'>React API</a></li>
                            <li><strong>Component Patterns:</strong> <a href='https://react.dev/learn/thinking-in-react' target='_blank'>Thinking in React</a></li>
                        </ul>
                        <blockquote>
                            <p>"React makes it painless to create interactive UIs."</p>
                        </blockquote>
                    `
                },
                {
                    title: "JSX in Depth",
                    content: `
                        <h3>JSX Overview</h3>
                        <p>JSX is a syntax extension for JavaScript. It looks like HTML, but with the full power of JavaScript.</p>
                        <pre><code>const element = &lt;h1&gt;Hello, world!&lt;/h1&gt;;</code></pre>
                        <p>JSX gets compiled to <code>React.createElement()</code> calls which return plain JavaScript objects called "React elements".</p>
                    `
                }
            ]
        },
        topics: ["JSX", "Components & Props", "State & Lifecycle", "Handling Events"]
    },
    "nodejs_express": {
        title: "Backend with Node.js",
        videoId: "fBNz5xF-Kx4", // Example
        references: [{ text: "Express.js Docs", url: "https://expressjs.com/" }],
        topics: ["Node.js Basics", "Express.js Setup", "Routing", "Middleware"]
    }
    // Add more modules as needed
};