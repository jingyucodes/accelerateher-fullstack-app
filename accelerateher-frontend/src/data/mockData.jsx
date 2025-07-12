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
        quiz: {
            title: "Python Fundamentals Quiz",
            description: "Test your understanding of Python basics",
            passingScore: 70, // 70% to pass
            timeLimit: 15, // 15 minutes
            questions: [
                {
                    id: 1,
                    type: "multiple_choice",
                    question: "What is the correct way to create a variable in Python?",
                    options: [
                        "var name = 'John'",
                        "name = 'John'",
                        "let name = 'John'",
                        "const name = 'John'"
                    ],
                    correctAnswer: 1,
                    explanation: "In Python, you simply use the assignment operator (=) to create variables. No declaration keywords like 'var', 'let', or 'const' are needed."
                },
                {
                    id: 2,
                    type: "multiple_choice",
                    question: "Which of the following is NOT a Python data type?",
                    options: [
                        "int",
                        "float",
                        "string",
                        "array"
                    ],
                    correctAnswer: 3,
                    explanation: "Python doesn't have a built-in 'array' type. Instead, it uses 'list' for similar functionality."
                },
                {
                    id: 3,
                    type: "multiple_choice",
                    question: "What will be the output of: print(type(3.14))?",
                    options: [
                        "<class 'int'>",
                        "<class 'float'>",
                        "<class 'number'>",
                        "<class 'decimal'>"
                    ],
                    correctAnswer: 1,
                    explanation: "3.14 is a floating-point number, so type(3.14) returns <class 'float'>."
                },
                {
                    id: 4,
                    type: "multiple_choice",
                    question: "How do you start an if statement in Python?",
                    options: [
                        "if (x > y)",
                        "if x > y:",
                        "if x > y then",
                        "if x > y {"
                    ],
                    correctAnswer: 1,
                    explanation: "Python uses 'if' followed by a condition and a colon (:). No parentheses are required around the condition, and no 'then' keyword is used."
                },
                {
                    id: 5,
                    type: "multiple_choice",
                    question: "Which of the following will output 'Hello, World!' in Python?",
                    options: [
                        "echo 'Hello, World!'",
                        "print('Hello, World!')",
                        "console.log('Hello, World!')",
                        "printf('Hello, World!')"
                    ],
                    correctAnswer: 1,
                    explanation: "The print() function is used in Python to output text to the console."
                }
            ]
        },
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
        topics: ["Introduction to NumPy Arrays", "Array Indexing and Slicing", "Universal Functions (ufuncs)", "Array Manipulation"],
        quiz: {
            title: "NumPy Essentials Quiz",
            description: "Test your NumPy knowledge",
            passingScore: 70,
            timeLimit: 15,
            questions: [
                {
                    id: 1,
                    type: "multiple_choice",
                    question: "How do you import NumPy?",
                    options: [
                        "import numpy",
                        "import numpy as np",
                        "from numpy import *",
                        "All of the above"
                    ],
                    correctAnswer: 1,
                    explanation: "The most common and recommended way is 'import numpy as np', which gives you the alias 'np' for easier typing."
                },
                {
                    id: 2,
                    type: "multiple_choice",
                    question: "What does np.array([1, 2, 3]) create?",
                    options: [
                        "A Python list",
                        "A NumPy array",
                        "A tuple",
                        "A dictionary"
                    ],
                    correctAnswer: 1,
                    explanation: "np.array() creates a NumPy array, which is different from a Python list and offers better performance for numerical operations."
                },
                {
                    id: 3,
                    type: "multiple_choice",
                    question: "Which function returns the shape of a NumPy array?",
                    options: [
                        "array.shape()",
                        "shape(array)",
                        "array.shape",
                        "get_shape(array)"
                    ],
                    correctAnswer: 2,
                    explanation: "The .shape attribute (not a function) returns the shape of a NumPy array."
                },
                {
                    id: 4,
                    type: "multiple_choice",
                    question: "What is the result of np.zeros((2,3))?",
                    options: [
                        "A 2x3 array of zeros",
                        "A 3x2 array of zeros",
                        "A 2x3 array of ones",
                        "A 3x2 array of ones"
                    ],
                    correctAnswer: 0,
                    explanation: "np.zeros((2,3)) creates a 2-row, 3-column array filled with zeros."
                },
                {
                    id: 5,
                    type: "multiple_choice",
                    question: "Which method is used to get a flattened (1D) version of a NumPy array?",
                    options: [
                        "flatten()",
                        "ravel()",
                        "reshape(-1)",
                        "All of the above"
                    ],
                    correctAnswer: 3,
                    explanation: "All listed methods can be used to flatten a NumPy array, but flatten() returns a copy, ravel() returns a view, and reshape(-1) also works."
                }
            ]
        }
    },
    "pandas_core": {
        title: "Pandas Core",
        videoId: "vmEHCJofslg",
        references: [
            { text: "Pandas Official Documentation", url: "https://pandas.pydata.org/pandas-docs/stable/" },
            { text: "10 Minutes to pandas", url: "https://pandas.pydata.org/pandas-docs/stable/user_guide/10min.html" }
        ],
        topics: ["Introduction to Series and DataFrame", "Data Loading and Saving", "Indexing and Selecting Data", "Grouping and Aggregation"],
        quiz: {
            title: "Pandas Core Quiz",
            description: "Test your Pandas knowledge",
            passingScore: 70,
            timeLimit: 15,
            questions: [
                {
                    id: 1,
                    type: "multiple_choice",
                    question: "What is a DataFrame in Pandas?",
                    options: [
                        "A 1-dimensional array",
                        "A 2-dimensional table",
                        "A 3-dimensional cube",
                        "A string object"
                    ],
                    correctAnswer: 1,
                    explanation: "A DataFrame is a 2-dimensional labeled data structure with columns that can be of different types, similar to a spreadsheet or SQL table."
                },
                {
                    id: 2,
                    type: "multiple_choice",
                    question: "Which method is used to read a CSV file into a DataFrame?",
                    options: [
                        "pd.read_csv()",
                        "pd.read_excel()",
                        "pd.to_csv()",
                        "pd.DataFrame()"
                    ],
                    correctAnswer: 0,
                    explanation: "pd.read_csv() is the standard method to load CSV data into a DataFrame."
                },
                {
                    id: 3,
                    type: "multiple_choice",
                    question: "How do you select a column named 'age' from a DataFrame df?",
                    options: [
                        "df.age",
                        "df['age']",
                        "df.loc[:, 'age']",
                        "All of the above"
                    ],
                    correctAnswer: 3,
                    explanation: "All listed methods can be used to select a column in Pandas."
                },
                {
                    id: 4,
                    type: "multiple_choice",
                    question: "Which function is used to check for missing values in a DataFrame?",
                    options: [
                        "df.isnull()",
                        "df.dropna()",
                        "df.fillna()",
                        "df.notnull()"
                    ],
                    correctAnswer: 0,
                    explanation: "df.isnull() returns a boolean DataFrame indicating where values are missing."
                },
                {
                    id: 5,
                    type: "multiple_choice",
                    question: "How do you group a DataFrame by a column and calculate the mean?",
                    options: [
                        "df.groupby('col').mean()",
                        "df.mean('col')",
                        "df['col'].groupby().mean()",
                        "df.aggregate('mean')"
                    ],
                    correctAnswer: 0,
                    explanation: "df.groupby('col').mean() groups by 'col' and computes the mean for each group."
                }
            ]
        }
    },
    "data_visualization": {
        title: "Data Visualization",
        videoId: "0XTq7bX2x3o",
        references: [{ text: "Matplotlib Documentation", url: "https://matplotlib.org/stable/contents.html" }],
        topics: ["Intro to Matplotlib", "Plotting basics", "Customizing plots"],
        quiz: {
            title: "Data Visualization Quiz",
            description: "Test your visualization knowledge",
            passingScore: 70,
            timeLimit: 15,
            questions: [
                {
                    id: 1,
                    type: "multiple_choice",
                    question: "Which library is most commonly used for data visualization in Python?",
                    options: [
                        "NumPy",
                        "Pandas",
                        "Matplotlib",
                        "Scikit-learn"
                    ],
                    correctAnswer: 2,
                    explanation: "Matplotlib is the most widely used plotting library in Python, providing a MATLAB-like plotting interface."
                },
                {
                    id: 2,
                    type: "multiple_choice",
                    question: "Which function creates a line plot in matplotlib?",
                    options: [
                        "plt.bar()",
                        "plt.scatter()",
                        "plt.plot()",
                        "plt.pie()"
                    ],
                    correctAnswer: 2,
                    explanation: "plt.plot() is used for line plots."
                },
                {
                    id: 3,
                    type: "multiple_choice",
                    question: "How do you display a plot on the screen?",
                    options: [
                        "plt.show()",
                        "plt.display()",
                        "plt.open()",
                        "plt.render()"
                    ],
                    correctAnswer: 0,
                    explanation: "plt.show() displays the current figure."
                },
                {
                    id: 4,
                    type: "multiple_choice",
                    question: "Which method saves a matplotlib figure to a file?",
                    options: [
                        "plt.save()",
                        "plt.savefig()",
                        "plt.write()",
                        "plt.export()"
                    ],
                    correctAnswer: 1,
                    explanation: "plt.savefig() saves the current figure to a file."
                },
                {
                    id: 5,
                    type: "multiple_choice",
                    question: "How do you create multiple subplots in a single figure?",
                    options: [
                        "plt.subplot()",
                        "plt.subplots()",
                        "plt.multi()",
                        "plt.grid()"
                    ],
                    correctAnswer: 1,
                    explanation: "plt.subplots() creates a figure and a grid of subplots."
                }
            ]
        }
    },
    "cloud_intro": {
        title: "Intro to Cloud Concepts",
        videoId: "2LaAJq1lB1Q", // 新的可嵌入云计算基础视频（IBM Technology）
        readingContent: {
            estimatedReadingTime: 18,
            sections: [
                {
                    title: "What is Cloud Computing?",
                    content: `
                        <h3>Cloud Computing Overview</h3>
                        <p>Cloud computing is the delivery of computing services—servers, storage, databases, networking, software, analytics, and more—over the Internet ("the cloud"). It enables faster innovation, flexible resources, and economies of scale.</p>
                        <ul>
                            <li><strong>On-demand self-service</strong></li>
                            <li><strong>Broad network access</strong></li>
                            <li><strong>Resource pooling</strong></li>
                            <li><strong>Rapid elasticity</strong></li>
                            <li><strong>Measured service</strong></li>
                        </ul>
                    `
                },
                {
                    title: "Cloud Service Models",
                    content: `
                        <h3>Service Models</h3>
                        <ul>
                            <li><strong>IaaS (Infrastructure as a Service):</strong> Provides virtualized computing resources over the internet. <br/>Examples: AWS EC2, Azure VMs</li>
                            <li><strong>PaaS (Platform as a Service):</strong> Provides a platform allowing customers to develop, run, and manage applications. <br/>Examples: Google App Engine, Azure App Service</li>
                            <li><strong>SaaS (Software as a Service):</strong> Delivers software applications over the internet, on demand. <br/>Examples: Gmail, Office 365</li>
                        </ul>
                    `
                },
                {
                    title: "Cloud Deployment Models",
                    content: `
                        <h3>Deployment Models</h3>
                        <ul>
                            <li><strong>Public Cloud:</strong> Services offered over the public internet and available to anyone (e.g., AWS, Azure, GCP)</li>
                            <li><strong>Private Cloud:</strong> Cloud infrastructure operated solely for a single organization</li>
                            <li><strong>Hybrid Cloud:</strong> Combines public and private clouds, allowing data and applications to be shared between them</li>
                        </ul>
                    `
                },
                {
                    title: "Benefits of Cloud Computing",
                    content: `
                        <ul>
                            <li>Cost savings</li>
                            <li>Scalability</li>
                            <li>Performance</li>
                            <li>Security</li>
                            <li>Global reach</li>
                        </ul>
                    `
                }
            ]
        },
        references: [{ text: "AWS Cloud Practitioner Essentials", url: "https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/" }],
        topics: ["What is Cloud Computing?", "Cloud Service Models (IaaS, PaaS, SaaS)", "Cloud Deployment Models"],
        quiz: {
            title: "Cloud Concepts Quiz",
            description: "Test your cloud computing knowledge",
            passingScore: 70,
            timeLimit: 15,
            questions: [
                {
                    id: 1,
                    type: "multiple_choice",
                    question: "What does IaaS stand for?",
                    options: [
                        "Infrastructure as a Service",
                        "Internet as a Service",
                        "Integration as a Service",
                        "Intelligence as a Service"
                    ],
                    correctAnswer: 0,
                    explanation: "IaaS (Infrastructure as a Service) provides virtualized computing resources over the internet."
                },
                {
                    id: 2,
                    type: "multiple_choice",
                    question: "Which cloud deployment model is used by most organizations?",
                    options: [
                        "Public cloud only",
                        "Private cloud only",
                        "Hybrid cloud",
                        "Multi-cloud"
                    ],
                    correctAnswer: 2,
                    explanation: "Hybrid cloud combines public and private cloud resources, offering flexibility and cost optimization."
                },
                {
                    id: 3,
                    type: "multiple_choice",
                    question: "Which of the following is NOT a benefit of cloud computing?",
                    options: [
                        "On-demand self-service",
                        "Resource pooling",
                        "Manual scaling only",
                        "Broad network access"
                    ],
                    correctAnswer: 2,
                    explanation: "Cloud computing allows for automatic scaling, not just manual scaling."
                },
                {
                    id: 4,
                    type: "multiple_choice",
                    question: "Which of the following is a Platform as a Service (PaaS) example?",
                    options: [
                        "Amazon EC2",
                        "Google App Engine",
                        "Dropbox",
                        "Microsoft Office 365"
                    ],
                    correctAnswer: 1,
                    explanation: "Google App Engine is a PaaS offering. EC2 is IaaS, Dropbox and Office 365 are SaaS."
                },
                {
                    id: 5,
                    type: "multiple_choice",
                    question: "Which company is NOT a major cloud service provider?",
                    options: [
                        "Amazon Web Services",
                        "Microsoft Azure",
                        "Google Cloud Platform",
                        "Mozilla Firefox Cloud"
                    ],
                    correctAnswer: 3,
                    explanation: "Mozilla Firefox Cloud is not a real cloud provider. AWS, Azure, and GCP are the three major ones."
                }
            ]
        }
    },
    "aws_basics": {
        title: "AWS Core Services",
        videoId: "r4YIdn2eTm4",
        references: [{ text: "AWS Core Services Overview", url: "https://aws.amazon.com/products/" }],
        topics: ["EC2 (Elastic Compute Cloud)", "S3 (Simple Storage Service)", "VPC (Virtual Private Cloud)", "IAM (Identity and Access Management)"],
        quiz: {
            title: "AWS Core Services Quiz",
            description: "Test your AWS knowledge",
            passingScore: 70,
            timeLimit: 15,
            questions: [
                {
                    id: 1,
                    type: "multiple_choice",
                    question: "What is EC2?",
                    options: [
                        "Elastic Compute Cloud",
                        "Elastic Container Cloud",
                        "Elastic Cloud Compute",
                        "Enterprise Cloud Computing"
                    ],
                    correctAnswer: 0,
                    explanation: "EC2 (Elastic Compute Cloud) provides scalable computing capacity in the AWS cloud."
                },
                {
                    id: 2,
                    type: "multiple_choice",
                    question: "Which AWS service is used for object storage?",
                    options: [
                        "EC2",
                        "S3",
                        "VPC",
                        "IAM"
                    ],
                    correctAnswer: 1,
                    explanation: "S3 (Simple Storage Service) is AWS's object storage service."
                },
                {
                    id: 3,
                    type: "multiple_choice",
                    question: "What does VPC stand for in AWS?",
                    options: [
                        "Virtual Private Cloud",
                        "Virtual Public Cloud",
                        "Verified Private Cloud",
                        "Virtual Protected Cluster"
                    ],
                    correctAnswer: 0,
                    explanation: "VPC stands for Virtual Private Cloud, which allows you to launch AWS resources in a logically isolated network."
                },
                {
                    id: 4,
                    type: "multiple_choice",
                    question: "Which AWS service manages user access and permissions?",
                    options: [
                        "EC2",
                        "S3",
                        "IAM",
                        "Lambda"
                    ],
                    correctAnswer: 2,
                    explanation: "IAM (Identity and Access Management) is used to manage users and their permissions."
                },
                {
                    id: 5,
                    type: "multiple_choice",
                    question: "Which of the following is a benefit of AWS's pay-as-you-go pricing?",
                    options: [
                        "You pay only for what you use",
                        "You must sign a long-term contract",
                        "You pay a fixed monthly fee regardless of usage",
                        "You pay for unused resources"
                    ],
                    correctAnswer: 0,
                    explanation: "AWS's pay-as-you-go model means you only pay for the resources you actually use."
                }
            ]
        }
    },
    "azure_basics": {
        title: "Azure Fundamentals",
        videoId: "NKEPWdQ7W_Y",
        references: [{ text: "Azure Fundamentals Learning Path", url: "https://docs.microsoft.com/en-us/learn/paths/azure-fundamentals/" }],
        topics: ["Azure Core Architectural Components", "Azure Core Services", "Azure Security, Privacy, Compliance, and Trust"],
        quiz: {
            title: "Azure Fundamentals Quiz",
            description: "Test your Azure knowledge",
            passingScore: 70,
            timeLimit: 15,
            questions: [
                {
                    id: 1,
                    type: "multiple_choice",
                    question: "What is Azure?",
                    options: [
                        "Microsoft's cloud computing platform",
                        "A programming language",
                        "A database system",
                        "An operating system"
                    ],
                    correctAnswer: 0,
                    explanation: "Azure is Microsoft's cloud computing platform that provides a wide range of cloud services."
                },
                {
                    id: 2,
                    type: "multiple_choice",
                    question: "Which of the following is NOT an Azure service type?",
                    options: [
                        "IaaS",
                        "PaaS",
                        "SaaS",
                        "CaaS (Coffee as a Service)"
                    ],
                    correctAnswer: 3,
                    explanation: "CaaS (Coffee as a Service) is not a real Azure service type."
                },
                {
                    id: 3,
                    type: "multiple_choice",
                    question: "What is an Azure Resource Group?",
                    options: [
                        "A group of users",
                        "A logical container for resources",
                        "A type of virtual machine",
                        "A billing account"
                    ],
                    correctAnswer: 1,
                    explanation: "A resource group is a logical container for Azure resources."
                },
                {
                    id: 4,
                    type: "multiple_choice",
                    question: "Which Azure feature helps estimate and manage costs?",
                    options: [
                        "Azure Cost Management",
                        "Azure Monitor",
                        "Azure DevOps",
                        "Azure Functions"
                    ],
                    correctAnswer: 0,
                    explanation: "Azure Cost Management helps you estimate, monitor, and control cloud spending."
                },
                {
                    id: 5,
                    type: "multiple_choice",
                    question: "Azure has data centers in how many global regions (as of 2024)?",
                    options: [
                        "More than 10",
                        "More than 30",
                        "More than 60",
                        "More than 100"
                    ],
                    correctAnswer: 2,
                    explanation: "Azure has data centers in more than 60 global regions, making it one of the largest cloud infrastructures."
                }
            ]
        }
    },
    "python_data_structures": {
        title: "Data Structures in Python",
        videoId: "R_ip9Sw2G2A",
        references: [{ text: "Python Data Structures - GeeksforGeeks", url: "https://www.geeksforgeeks.org/python-data-structures/" }],
        topics: ["Advanced Lists", "Tuples In-depth", "Sets", "Dictionaries Advanced"],
        quiz: {
            title: "Python Data Structures Quiz",
            description: "Test your data structures knowledge",
            passingScore: 70,
            timeLimit: 15,
            questions: [
                {
                    id: 1,
                    type: "multiple_choice",
                    question: "Which data structure is immutable?",
                    options: [
                        "List",
                        "Tuple",
                        "Dictionary",
                        "Set"
                    ],
                    correctAnswer: 1,
                    explanation: "Tuples are immutable in Python, meaning they cannot be changed after creation."
                },
                {
                    id: 2,
                    type: "multiple_choice",
                    question: "Which method adds an item to the end of a list?",
                    options: [
                        "append()",
                        "add()",
                        "insert()",
                        "extend()"
                    ],
                    correctAnswer: 0,
                    explanation: "append() adds an item to the end of a list."
                },
                {
                    id: 3,
                    type: "multiple_choice",
                    question: "How do you access the value associated with key 'name' in a dictionary d?",
                    options: [
                        "d['name']",
                        "d.name",
                        "d.get('name')",
                        "Both 1 and 3"
                    ],
                    correctAnswer: 3,
                    explanation: "You can use d['name'] or d.get('name') to access a value by key."
                },
                {
                    id: 4,
                    type: "multiple_choice",
                    question: "Which operation removes duplicates from a list?",
                    options: [
                        "list()",
                        "set()",
                        "dict()",
                        "tuple()"
                    ],
                    correctAnswer: 1,
                    explanation: "Converting a list to a set removes duplicates."
                },
                {
                    id: 5,
                    type: "multiple_choice",
                    question: "What is the result of len({'a': 1, 'b': 2, 'c': 3})?",
                    options: [
                        "1",
                        "2",
                        "3",
                        "6"
                    ],
                    correctAnswer: 2,
                    explanation: "len() returns the number of keys in a dictionary, which is 3 in this case."
                }
            ]
        }
    },
    "python_oop": {
        title: "Object-Oriented Python",
        videoId: "Ej_02ICOIgs",
        references: [{ text: "Python OOP Tutorial - Real Python", url: "https://realpython.com/python3-object-oriented-programming/" }],
        topics: ["Classes and Objects", "Inheritance", "Polymorphism", "Encapsulation"],
        quiz: {
            title: "Object-Oriented Python Quiz",
            description: "Test your OOP knowledge",
            passingScore: 70,
            timeLimit: 15,
            questions: [
                {
                    id: 1,
                    type: "multiple_choice",
                    question: "What is a class in Python?",
                    options: [
                        "A blueprint for creating objects",
                        "A function",
                        "A variable",
                        "A module"
                    ],
                    correctAnswer: 0,
                    explanation: "A class is a blueprint or template for creating objects. It defines the properties and methods that objects of that class will have."
                },
                {
                    id: 2,
                    type: "multiple_choice",
                    question: "How do you define a method inside a class?",
                    options: [
                        "def method(self):",
                        "def method():",
                        "function method(self):",
                        "method(self):"
                    ],
                    correctAnswer: 0,
                    explanation: "Methods in a class must have 'self' as their first parameter."
                },
                {
                    id: 3,
                    type: "multiple_choice",
                    question: "What is inheritance in Python?",
                    options: [
                        "A way to create a new class from an existing class",
                        "A way to copy variables",
                        "A way to delete objects",
                        "A way to hide data"
                    ],
                    correctAnswer: 0,
                    explanation: "Inheritance allows a class to inherit attributes and methods from another class."
                },
                {
                    id: 4,
                    type: "multiple_choice",
                    question: "Which keyword is used to create a subclass?",
                    options: [
                        "subclass",
                        "inherits",
                        "extends",
                        "class"
                    ],
                    correctAnswer: 3,
                    explanation: "The 'class' keyword is used, and you specify the parent class in parentheses."
                },
                {
                    id: 5,
                    type: "multiple_choice",
                    question: "What is encapsulation?",
                    options: [
                        "Restricting access to methods and variables",
                        "Creating multiple objects",
                        "Inheriting from multiple classes",
                        "Defining static methods"
                    ],
                    correctAnswer: 0,
                    explanation: "Encapsulation is the concept of restricting access to certain details of an object and only exposing what is necessary."
                }
            ]
        }
    },
    "html_css_js": {
        title: "HTML, CSS, JavaScript",
        videoId: "UB1O30fR-EE", // 替换为可嵌入的优质入门视频（freeCodeCamp.org）
        references: [{ text: "MDN Web Docs", url: "https://developer.mozilla.org/" }],
        topics: ["HTML Structure", "CSS Selectors & Box Model", "JavaScript DOM Manipulation", "Events"],
        readingContent: {
            estimatedReadingTime: 30, // 预计阅读时间（分钟）
            sections: [
                {
                    title: "Introduction to Web Development",
                    content: `
                        <h3>What is Web Development?</h3>
                        <p>Web development is the process of building websites and web applications for the internet. It involves using technologies like HTML, CSS, and JavaScript to create interactive and visually appealing user experiences.</p>
                        <ul>
                            <li><strong>HTML:</strong> The structure of web pages</li>
                            <li><strong>CSS:</strong> The style and layout of web pages</li>
                            <li><strong>JavaScript:</strong> The interactivity and logic of web pages</li>
                        </ul>
                    `
                },
                {
                    title: "HTML Basics",
                    content: `
                        <h3>HTML (HyperText Markup Language)</h3>
                        <p>HTML is the standard markup language for creating web pages. It uses tags to define elements like headings, paragraphs, links, images, and more.</p>
                        <pre><code>
<!DOCTYPE html>
<html>
  <head>
    <title>My First Web Page</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>This is a paragraph.</p>
    <a href="https://developer.mozilla.org/">Learn more at MDN</a>
  </body>
</html>
                        </code></pre>
                        <h4>Common HTML Tags</h4>
                        <ul>
                            <li><code>&lt;h1&gt;...&lt;/h1&gt;</code> - Headings</li>
                            <li><code>&lt;p&gt;...&lt;/p&gt;</code> - Paragraphs</li>
                            <li><code>&lt;a&gt;...&lt;/a&gt;</code> - Links</li>
                            <li><code>&lt;img&gt;</code> - Images</li>
                            <li><code>&lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;</code> - Lists</li>
                        </ul>
                    `
                },
                {
                    title: "CSS Basics",
                    content: `
                        <h3>CSS (Cascading Style Sheets)</h3>
                        <p>CSS is used to style and layout web pages. It controls colors, fonts, spacing, positioning, and more.</p>
                        <pre><code>
body {
  background-color: #f0f0f0;
  color: #333;
  font-family: Arial, sans-serif;
}
h1 {
  color: #1976D2;
  text-align: center;
}
                        </code></pre>
                        <h4>Selectors and Properties</h4>
                        <ul>
                            <li><strong>Selectors:</strong> Target HTML elements (e.g., <code>h1</code>, <code>.class</code>, <code>#id</code>)</li>
                            <li><strong>Properties:</strong> Define what to style (e.g., <code>color</code>, <code>background-color</code>, <code>margin</code>)</li>
                        </ul>
                    `
                },
                {
                    title: "JavaScript Basics",
                    content: `
                        <h3>JavaScript</h3>
                        <p>JavaScript is a programming language that adds interactivity and logic to web pages. It can respond to user actions, manipulate the DOM, and communicate with servers.</p>
                        <pre><code>
// Display an alert
alert('Hello, World!');

// Change the text of an element
const heading = document.querySelector('h1');
heading.textContent = 'Welcome to JavaScript!';
                        </code></pre>
                        <h4>Common JavaScript Concepts</h4>
                        <ul>
                            <li><strong>Variables:</strong> <code>let</code>, <code>const</code>, <code>var</code></li>
                            <li><strong>Functions:</strong> <code>function greet() { ... }</code></li>
                            <li><strong>Events:</strong> <code>element.addEventListener('click', ...)</code></li>
                            <li><strong>DOM Manipulation:</strong> <code>document.getElementById()</code>, <code>document.querySelector()</code></li>
                        </ul>
                    `
                }
            ]
        },
        quiz: {
            title: "Web Development Quiz",
            description: "Test your web development knowledge",
            passingScore: 70,
            timeLimit: 15,
            questions: [
                {
                    id: 1,
                    type: "multiple_choice",
                    question: "What does HTML stand for?",
                    options: [
                        "HyperText Markup Language",
                        "High Tech Modern Language",
                        "Home Tool Markup Language",
                        "Hyperlink and Text Markup Language"
                    ],
                    correctAnswer: 0,
                    explanation: "HTML stands for HyperText Markup Language, which is the standard markup language for creating web pages."
                },
                {
                    id: 2,
                    type: "multiple_choice",
                    question: "Which CSS property changes the text color?",
                    options: [
                        "font-style",
                        "color",
                        "background-color",
                        "text-align"
                    ],
                    correctAnswer: 1,
                    explanation: "The 'color' property sets the text color in CSS."
                },
                {
                    id: 3,
                    type: "multiple_choice",
                    question: "Which tag is used to include JavaScript in an HTML file?",
                    options: [
                        "<js>",
                        "<javascript>",
                        "<script>",
                        "<code>"
                    ],
                    correctAnswer: 2,
                    explanation: "The <script> tag is used to include JavaScript code in HTML."
                },
                {
                    id: 4,
                    type: "multiple_choice",
                    question: "How do you select an element with id 'main' in CSS?",
                    options: [
                        "#main",
                        ".main",
                        "main",
                        "*main"
                    ],
                    correctAnswer: 0,
                    explanation: "The '#' selector is used for id in CSS."
                },
                {
                    id: 5,
                    type: "multiple_choice",
                    question: "Which JavaScript method is used to add a click event to a button?",
                    options: [
                        "addEventListener()",
                        "onclick()",
                        "onClickEvent()",
                        "addClick()"
                    ],
                    correctAnswer: 0,
                    explanation: "addEventListener('click', ...) is the standard way to add a click event listener."
                }
            ]
        }
    },
    "react_basics": {
        title: "React Fundamentals",
        videoId: "bMknfKXIFA8",
        readingContent: {
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
        references: [
            { text: "React Official Documentation", url: "https://react.dev/" }
        ],
        topics: ["JSX", "Components & Props", "State & Lifecycle", "Handling Events"],
        quiz: {
            title: "React Fundamentals Quiz",
            description: "Test your React knowledge",
            passingScore: 70,
            timeLimit: 15,
            questions: [
                {
                    id: 1,
                    type: "multiple_choice",
                    question: "What is JSX?",
                    options: [
                        "A JavaScript library",
                        "A syntax extension for JavaScript",
                        "A CSS framework",
                        "A database"
                    ],
                    correctAnswer: 1,
                    explanation: "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in JavaScript files."
                },
                {
                    id: 2,
                    type: "multiple_choice",
                    question: "Which method is used to create a component in React?",
                    options: [
                        "function MyComponent() {}",
                        "const MyComponent = () => {}",
                        "class MyComponent extends React.Component {}",
                        "All of the above"
                    ],
                    correctAnswer: 3,
                    explanation: "All listed methods can be used to create React components."
                },
                {
                    id: 3,
                    type: "multiple_choice",
                    question: "How do you pass data from a parent to a child component?",
                    options: [
                        "Using props",
                        "Using state",
                        "Using context",
                        "Using refs"
                    ],
                    correctAnswer: 0,
                    explanation: "Props are used to pass data from parent to child components."
                },
                {
                    id: 4,
                    type: "multiple_choice",
                    question: "Which hook is used to manage state in a functional component?",
                    options: [
                        "useState()",
                        "useEffect()",
                        "useContext()",
                        "useReducer()"
                    ],
                    correctAnswer: 0,
                    explanation: "useState() is the primary hook for managing state in functional components."
                },
                {
                    id: 5,
                    type: "multiple_choice",
                    question: "How do you handle a button click event in React?",
                    options: [
                        "onClick={handleClick}",
                        "onclick=\"handleClick()\"",
                        "onClick: handleClick()",
                        "addEventListener('click', handleClick)"
                    ],
                    correctAnswer: 0,
                    explanation: "The correct syntax is onClick={handleClick} in JSX."
                }
            ]
        }
    },
    "nodejs_express": {
        title: "Backend with Node.js",
        videoId: "fBNz5xF-Kx4",
        readingContent: {
            estimatedReadingTime: 20,
            sections: [
                {
                    title: "Introduction to Node.js",
                    content: `
                        <h3>What is Node.js?</h3>
                        <p>Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows you to run JavaScript code outside the browser, making it possible to build scalable backend applications.</p>
                        <ul>
                            <li><strong>Non-blocking I/O:</strong> Handles many connections efficiently</li>
                            <li><strong>Single-threaded event loop:</strong> Lightweight and fast</li>
                            <li><strong>npm ecosystem:</strong> Access to thousands of open-source packages</li>
                        </ul>
                    `
                },
                {
                    title: "Node.js Basics",
                    content: `
                        <h3>Basic Node.js Example</h3>
                        <pre><code>// hello.js
console.log('Hello from Node.js!');
                        </code></pre>
                        <h4>Running a Node.js Script</h4>
                        <pre><code>node hello.js</code></pre>
                        <h4>Common Modules</h4>
                        <ul>
                            <li><code>fs</code> - File system operations</li>
                            <li><code>http</code> - Create web servers</li>
                            <li><code>path</code> - Handle file paths</li>
                        </ul>
                    `
                },
                {
                    title: "Introduction to Express.js",
                    content: `
                        <h3>What is Express?</h3>
                        <p>Express is a minimal and flexible Node.js web application framework that provides a robust set of features for building web and mobile applications.</p>
                        <h4>Basic Express Server Example</h4>
                        <pre><code>// app.js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
                        </code></pre>
                        <h4>Key Concepts</h4>
                        <ul>
                            <li><strong>Routing:</strong> Define URL paths and handlers</li>
                            <li><strong>Middleware:</strong> Functions that process requests</li>
                            <li><strong>Request/Response:</strong> Handle HTTP data</li>
                        </ul>
                    `
                },
                {
                    title: "Useful Resources",
                    content: `
                        <ul>
                            <li><a href='https://nodejs.org/en/docs/' target='_blank'>Node.js Official Documentation</a></li>
                            <li><a href='https://expressjs.com/' target='_blank'>Express.js Official Documentation</a></li>
                        </ul>
                    `
                }
            ]
        },
        references: [{ text: "Express.js Docs", url: "https://expressjs.com/" }],
        topics: ["Node.js Basics", "Express.js Setup", "Routing", "Middleware"],
        quiz: {
            title: "Node.js & Express Quiz",
            description: "Test your backend knowledge",
            passingScore: 70,
            timeLimit: 15,
            questions: [
                {
                    id: 1,
                    type: "multiple_choice",
                    question: "What is Node.js?",
                    options: [
                        "A JavaScript runtime",
                        "A database",
                        "A frontend framework",
                        "An operating system"
                    ],
                    correctAnswer: 0,
                    explanation: "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine that allows you to run JavaScript on the server side."
                },
                {
                    id: 2,
                    type: "multiple_choice",
                    question: "Which command initializes a new Node.js project?",
                    options: [
                        "npm start",
                        "npm install",
                        "npm init",
                        "node init"
                    ],
                    correctAnswer: 2,
                    explanation: "npm init creates a new package.json for your Node.js project."
                },
                {
                    id: 3,
                    type: "multiple_choice",
                    question: "Which method is used to define a GET route in Express?",
                    options: [
                        "app.get()",
                        "app.route()",
                        "app.fetch()",
                        "app.listen()"
                    ],
                    correctAnswer: 0,
                    explanation: "app.get() defines a GET route handler in Express."
                },
                {
                    id: 4,
                    type: "multiple_choice",
                    question: "What is middleware in Express?",
                    options: [
                        "A function that handles requests and responses",
                        "A database connection",
                        "A static file",
                        "A template engine"
                    ],
                    correctAnswer: 0,
                    explanation: "Middleware functions have access to the request and response objects and can modify them or end the request-response cycle."
                },
                {
                    id: 5,
                    type: "multiple_choice",
                    question: "Which of the following is used for asynchronous operations in Node.js?",
                    options: [
                        "Promises",
                        "Callbacks",
                        "Async/Await",
                        "All of the above"
                    ],
                    correctAnswer: 3,
                    explanation: "All listed options are used for async operations in Node.js."
                }
            ]
        }
    }
};