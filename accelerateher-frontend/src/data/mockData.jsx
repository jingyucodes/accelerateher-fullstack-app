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
        readingContent: {
            estimatedReadingTime: 35, // 预计阅读时间（分钟）
            sections: [
                {
                    title: "Introduction to AWS Core Services",
                    content: `
                        <h3>What is AWS?</h3>
                        <p>Amazon Web Services (AWS) is the world's most comprehensive and broadly adopted cloud platform, offering over 200 fully featured services from data centers globally. AWS provides a mix of infrastructure as a service (IaaS), platform as a service (PaaS), and packaged software as a service (SaaS) offerings.</p>
                        
                        <h3>Why Learn AWS Core Services?</h3>
                        <ul>
                            <li><strong>Market Leader:</strong> AWS holds the largest market share in cloud computing</li>
                            <li><strong>Career Opportunities:</strong> High demand for AWS-certified professionals</li>
                            <li><strong>Scalability:</strong> Build applications that can scale from 1 to millions of users</li>
                            <li><strong>Cost-Effective:</strong> Pay only for what you use with no upfront costs</li>
                            <li><strong>Global Infrastructure:</strong> Deploy applications closer to your users worldwide</li>
                        </ul>
                        
                        <h3>AWS Global Infrastructure</h3>
                        <p>AWS operates in multiple geographic regions, each containing multiple Availability Zones. This design provides:</p>
                        <ul>
                            <li><strong>High Availability:</strong> Applications can be deployed across multiple AZs</li>
                            <li><strong>Fault Tolerance:</strong> If one AZ fails, others continue operating</li>
                            <li><strong>Low Latency:</strong> Deploy closer to your users for better performance</li>
                            <li><strong>Compliance:</strong> Meet data residency and compliance requirements</li>
                        </ul>
                        
                        <div class="practice-exercise">
                            <h4>💡 Key Concept: AWS Shared Responsibility Model</h4>
                            <p>AWS operates under a shared responsibility model where AWS is responsible for the security <strong>of</strong> the cloud, while customers are responsible for security <strong>in</strong> the cloud.</p>
                            <ul>
                                <li><strong>AWS Responsibility:</strong> Hardware, software, networking, and facilities</li>
                                <li><strong>Customer Responsibility:</strong> Application security, data encryption, network configuration</li>
                            </ul>
                        </div>
                    `
                },
                {
                    title: "EC2 (Elastic Compute Cloud)",
                    content: `
                        <h3>What is EC2?</h3>
                        <p>Amazon Elastic Compute Cloud (EC2) is a web service that provides secure, resizable compute capacity in the cloud. It's designed to make web-scale cloud computing easier for developers.</p>
                        
                        <h3>EC2 Key Concepts</h3>
                        <h4>1. Instances</h4>
                        <p>An EC2 instance is a virtual server in the AWS cloud. Think of it as a computer that you can rent and configure according to your needs.</p>
                        
                        <h4>2. Instance Types</h4>
                        <p>EC2 offers various instance types optimized for different use cases:</p>
                        <ul>
                            <li><strong>General Purpose (M-series):</strong> Balanced compute, memory, and networking</li>
                            <li><strong>Compute Optimized (C-series):</strong> High-performance processors</li>
                            <li><strong>Memory Optimized (R-series):</strong> High memory-to-CPU ratio</li>
                            <li><strong>Storage Optimized (I-series):</strong> High storage performance</li>
                        </ul>
                        
                        <h4>3. Amazon Machine Images (AMIs)</h4>
                        <p>An AMI is a template that contains the software configuration (operating system, application server, and applications) required to launch your instance.</p>
                        
                        <h3>EC2 Pricing Models</h3>
                        <ul>
                            <li><strong>On-Demand:</strong> Pay for compute capacity by the hour or second with no long-term commitments</li>
                            <li><strong>Reserved Instances:</strong> Significant discount compared to On-Demand pricing for 1 or 3-year terms</li>
                            <li><strong>Spot Instances:</strong> Request unused EC2 capacity at steep discounts (up to 90% off)</li>
                            <li><strong>Dedicated Hosts:</strong> Physical EC2 server dedicated for your use</li>
                        </ul>
                        
                        <div class="practice-exercise">
                            <h4>🔧 Hands-On Exercise: Launching an EC2 Instance</h4>
                            <p>Follow these steps to launch your first EC2 instance:</p>
                            <ol>
                                <li>Sign in to the AWS Management Console</li>
                                <li>Navigate to EC2 service</li>
                                <li>Click "Launch Instance"</li>
                                <li>Choose an Amazon Machine Image (AMI)</li>
                                <li>Select an instance type</li>
                                <li>Configure instance details</li>
                                <li>Add storage</li>
                                <li>Add tags</li>
                                <li>Configure security group</li>
                                <li>Review and launch</li>
                            </ol>
                        </div>
                        
                        <h3>EC2 Best Practices</h3>
                        <ul>
                            <li><strong>Use the right instance type</strong> for your workload</li>
                            <li><strong>Implement auto-scaling</strong> to handle traffic fluctuations</li>
                            <li><strong>Use Elastic IP addresses</strong> for static public IPs</li>
                            <li><strong>Monitor your instances</strong> using CloudWatch</li>
                            <li><strong>Terminate unused instances</strong> to avoid unnecessary charges</li>
                        </ul>
                    `
                },
                {
                    title: "S3 (Simple Storage Service)",
                    content: `
                        <h3>What is S3?</h3>
                        <p>Amazon Simple Storage Service (S3) is an object storage service that offers industry-leading scalability, data availability, security, and performance. It's designed to store and retrieve any amount of data from anywhere on the web.</p>
                        
                        <h3>S3 Key Concepts</h3>
                        <h4>1. Buckets</h4>
                        <p>A bucket is a container for objects stored in Amazon S3. Every object is contained in a bucket. Bucket names must be globally unique across all AWS accounts.</p>
                        
                        <h4>2. Objects</h4>
                        <p>Objects are the fundamental entities stored in Amazon S3. Objects consist of object data and metadata. The metadata is a set of name-value pairs that describe the object.</p>
                        
                        <h4>3. Keys</h4>
                        <p>Within a bucket, an object is uniquely identified by a key (name) and a version ID (if versioning is enabled).</p>
                        
                        <h3>S3 Storage Classes</h3>
                        <p>Amazon S3 offers different storage classes designed for different use cases:</p>
                        
                        <h4>1. S3 Standard</h4>
                        <ul>
                            <li>99.99% availability</li>
                            <li>99.999999999% durability</li>
                            <li>Designed for frequently accessed data</li>
                            <li>Use cases: websites, content distribution, mobile applications</li>
                        </ul>
                        
                        <h4>2. S3 Intelligent-Tiering</h4>
                        <ul>
                            <li>Automatically moves objects between tiers</li>
                            <li>Optimizes costs without performance impact</li>
                            <li>Ideal for data with unknown or changing access patterns</li>
                        </ul>
                        
                        <h4>3. S3 Standard-IA (Infrequent Access)</h4>
                        <ul>
                            <li>Lower cost than S3 Standard</li>
                            <li>99.9% availability</li>
                            <li>Use cases: backups, disaster recovery, long-term storage</li>
                        </ul>
                        
                        <h4>4. S3 Glacier</h4>
                        <ul>
                            <li>Lowest cost storage class</li>
                            <li>Retrieval times from minutes to hours</li>
                            <li>Use cases: long-term archival, compliance storage</li>
                        </ul>
                        
                        <h3>S3 Security Features</h3>
                        <ul>
                            <li><strong>Server-Side Encryption:</strong> Automatically encrypts data at rest</li>
                            <li><strong>Access Control Lists (ACLs):</strong> Grant basic read/write permissions</li>
                            <li><strong>Bucket Policies:</strong> Define permissions at the bucket level</li>
                            <li><strong>IAM Policies:</strong> Control access using AWS Identity and Access Management</li>
                            <li><strong>Cross-Origin Resource Sharing (CORS):</strong> Control access from web browsers</li>
                        </ul>
                        
                        <div class="practice-exercise">
                            <h4>🔧 Hands-On Exercise: Creating an S3 Bucket</h4>
                            <p>Follow these steps to create your first S3 bucket:</p>
                            <ol>
                                <li>Sign in to the AWS Management Console</li>
                                <li>Navigate to S3 service</li>
                                <li>Click "Create bucket"</li>
                                <li>Enter a unique bucket name</li>
                                <li>Select a region</li>
                                <li>Configure options (versioning, tags, etc.)</li>
                                <li>Set permissions (block public access)</li>
                                <li>Review and create</li>
                            </ol>
                        </div>
                        
                        <h3>S3 Best Practices</h3>
                        <ul>
                            <li><strong>Use appropriate storage classes</strong> for your data access patterns</li>
                            <li><strong>Enable versioning</strong> for important data</li>
                            <li><strong>Set up lifecycle policies</strong> to automate storage class transitions</li>
                            <li><strong>Use bucket policies</strong> to control access</li>
                            <li><strong>Monitor costs</strong> using AWS Cost Explorer</li>
                        </ul>
                    `
                },
                {
                    title: "VPC (Virtual Private Cloud)",
                    content: `
                        <h3>What is VPC?</h3>
                        <p>Amazon Virtual Private Cloud (VPC) enables you to launch AWS resources into a virtual network that you've defined. This virtual network closely resembles a traditional network that you'd operate in your own data center, with the benefits of using AWS's scalable infrastructure.</p>
                        
                        <h3>VPC Key Components</h3>
                        <h4>1. Subnets</h4>
                        <p>A subnet is a range of IP addresses in your VPC. You can launch AWS resources into a specified subnet. Use a public subnet for resources that must be connected to the internet, and a private subnet for resources that won't be connected to the internet.</p>
                        
                        <h4>2. Route Tables</h4>
                        <p>A route table contains a set of rules, called routes, that are used to determine where network traffic from your subnet or gateway is directed.</p>
                        
                        <h4>3. Internet Gateway</h4>
                        <p>An internet gateway is a horizontally scaled, redundant, and highly available VPC component that allows communication between instances in your VPC and the internet.</p>
                        
                        <h4>4. NAT Gateway</h4>
                        <p>A NAT gateway enables instances in a private subnet to connect to the internet or other AWS services, but prevents the internet from initiating a connection with those instances.</p>
                        
                        <h3>VPC Architecture Best Practices</h3>
                        <h4>Multi-Tier Architecture</h4>
                        <p>A typical VPC architecture includes:</p>
                        <ul>
                            <li><strong>Public Subnets:</strong> For load balancers and bastion hosts</li>
                            <li><strong>Private Subnets:</strong> For application servers and databases</li>
                            <li><strong>Database Subnets:</strong> For RDS instances and other databases</li>
                        </ul>
                        
                        <h4>Security Groups and Network ACLs</h4>
                        <p><strong>Security Groups:</strong> Act as a virtual firewall for your instance to control inbound and outbound traffic.</p>
                        <p><strong>Network ACLs:</strong> Act as a firewall for controlling traffic in and out of one or more subnets.</p>
                        
                        <h3>VPC Peering</h3>
                        <p>VPC peering allows you to route traffic between two VPCs using private IP addresses as if they were in the same network. This enables you to create a network of VPCs that can communicate with each other.</p>
                        
                        <div class="practice-exercise">
                            <h4>🔧 Hands-On Exercise: Creating a VPC</h4>
                            <p>Follow these steps to create a VPC with public and private subnets:</p>
                            <ol>
                                <li>Sign in to the AWS Management Console</li>
                                <li>Navigate to VPC service</li>
                                <li>Click "Create VPC"</li>
                                <li>Choose "VPC and more" for automatic setup</li>
                                <li>Configure VPC settings (name, CIDR block)</li>
                                <li>Configure subnets (public and private)</li>
                                <li>Configure route tables</li>
                                <li>Review and create</li>
                            </ol>
                        </div>
                        
                        <h3>VPC Best Practices</h3>
                        <ul>
                            <li><strong>Use multiple Availability Zones</strong> for high availability</li>
                            <li><strong>Implement least privilege access</strong> with security groups</li>
                            <li><strong>Use private subnets</strong> for sensitive resources</li>
                            <li><strong>Monitor network traffic</strong> with VPC Flow Logs</li>
                            <li><strong>Plan your IP addressing</strong> carefully to avoid conflicts</li>
                        </ul>
                    `
                },
                {
                    title: "IAM (Identity and Access Management)",
                    content: `
                        <h3>What is IAM?</h3>
                        <p>AWS Identity and Access Management (IAM) is a web service that helps you securely control access to AWS resources. You use IAM to control who is authenticated (signed in) and authorized (has permissions) to use resources.</p>
                        
                        <h3>IAM Key Concepts</h3>
                        <h4>1. Users</h4>
                        <p>An IAM user is an entity that you create in AWS to represent the person or application that uses it to interact with AWS. A user in AWS consists of a name and credentials.</p>
                        
                        <h4>2. Groups</h4>
                        <p>An IAM group is a collection of IAM users. You can use groups to specify permissions for multiple users, which can make it easier to manage the permissions for those users.</p>
                        
                        <h4>3. Roles</h4>
                        <p>An IAM role is an IAM identity that you can create in your account that has specific permissions. An IAM role is similar to an IAM user, in that it is an AWS identity with permission policies that determine what the identity can and cannot do in AWS.</p>
                        
                        <h4>4. Policies</h4>
                        <p>An IAM policy is a document that explicitly lists permissions. Policies can be attached to users, groups, and roles to control what actions they can perform on which AWS resources.</p>
                        
                        <h3>IAM Policy Types</h3>
                        <h4>1. Managed Policies</h4>
                        <p>Standalone identity-based policies that you can attach to multiple users, groups, and roles in your AWS account. AWS provides several managed policies for common use cases.</p>
                        
                        <h4>2. Inline Policies</h4>
                        <p>Policies that you create and manage and embed directly into a single user, group, or role.</p>
                        
                        <h4>3. Resource-Based Policies</h4>
                        <p>Policies that you attach to a resource such as an S3 bucket or an SQS queue.</p>
                        
                        <h3>IAM Best Practices</h3>
                        <h4>1. Use the Principle of Least Privilege</h4>
                        <p>Grant only the permissions required to perform a task. Start with a minimum set of permissions and grant additional permissions as necessary.</p>
                        
                        <h4>2. Use IAM Roles for EC2 Instances</h4>
                        <p>Instead of storing AWS credentials on your EC2 instances, use IAM roles to provide temporary credentials to your applications.</p>
                        
                        <h4>3. Enable MFA for Root and IAM Users</h4>
                        <p>Multi-factor authentication (MFA) adds an extra layer of protection on top of your user name and password.</p>
                        
                        <h4>4. Use Access Keys for Programmatic Access</h4>
                        <p>Use access keys for programmatic access to AWS services. Never embed access keys in your code or share them publicly.</p>
                        
                        <div class="practice-exercise">
                            <h4>🔧 Hands-On Exercise: Creating an IAM User</h4>
                            <p>Follow these steps to create an IAM user with appropriate permissions:</p>
                            <ol>
                                <li>Sign in to the AWS Management Console</li>
                                <li>Navigate to IAM service</li>
                                <li>Click "Users" and then "Add user"</li>
                                <li>Enter user details (name, access type)</li>
                                <li>Set permissions (attach policies or create custom)</li>
                                <li>Add tags (optional)</li>
                                <li>Review and create</li>
                                <li>Download or save the access credentials</li>
                            </ol>
                        </div>
                        
                        <h3>IAM Security Features</h3>
                        <ul>
                            <li><strong>Password Policy:</strong> Enforce strong passwords and regular rotation</li>
                            <li><strong>Access Key Rotation:</strong> Regularly rotate access keys</li>
                            <li><strong>Credential Report:</strong> Download a report of all users and their credential status</li>
                            <li><strong>IAM Access Analyzer:</strong> Identify unused permissions and resources</li>
                            <li><strong>Service Control Policies (SCPs):</strong> Control permissions across multiple accounts</li>
                        </ul>
                        
                        <h3>Common IAM Use Cases</h3>
                        <ul>
                            <li><strong>Application Access:</strong> Grant applications access to AWS services</li>
                            <li><strong>Cross-Account Access:</strong> Allow users from one account to access resources in another</li>
                            <li><strong>Federated Access:</strong> Use existing identity providers (Active Directory, SAML)</li>
                            <li><strong>Emergency Access:</strong> Create break-glass procedures for emergency situations</li>
                        </ul>
                    `
                },
                {
                    title: "AWS Core Services Integration",
                    content: `
                        <h3>How Core Services Work Together</h3>
                        <p>Understanding how AWS core services integrate is crucial for building scalable and secure applications. Let's explore how EC2, S3, VPC, and IAM work together in a typical web application architecture.</p>
                        
                        <h3>Typical Web Application Architecture</h3>
                        <h4>1. User Authentication Flow</h4>
                        <p>When a user accesses your application:</p>
                        <ol>
                            <li>User credentials are validated against IAM policies</li>
                            <li>If authenticated, user receives temporary credentials</li>
                            <li>User can access authorized AWS resources</li>
                        </ol>
                        
                        <h4>2. Application Deployment</h4>
                        <p>A typical deployment involves:</p>
                        <ul>
                            <li><strong>VPC:</strong> Provides network isolation and security</li>
                            <li><strong>EC2:</strong> Hosts the application servers</li>
                            <li><strong>S3:</strong> Stores static assets (images, CSS, JavaScript)</li>
                            <li><strong>IAM:</strong> Manages access to all resources</li>
                        </ul>
                        
                        <h3>Security Best Practices</h3>
                        <h4>1. Network Security</h4>
                        <ul>
                            <li>Use private subnets for application servers</li>
                            <li>Implement security groups with minimal required access</li>
                            <li>Use NAT gateways for outbound internet access</li>
                            <li>Enable VPC Flow Logs for network monitoring</li>
                        </ul>
                        
                        <h4>2. Data Security</h4>
                        <ul>
                            <li>Encrypt data at rest using S3 server-side encryption</li>
                            <li>Use IAM roles for EC2 instances instead of access keys</li>
                            <li>Implement least privilege access policies</li>
                            <li>Regularly rotate access keys and credentials</li>
                        </ul>
                        
                        <h4>3. Monitoring and Logging</h4>
                        <ul>
                            <li>Enable CloudTrail for API call logging</li>
                            <li>Use CloudWatch for resource monitoring</li>
                            <li>Set up alerts for unusual activity</li>
                            <li>Regularly review IAM access reports</li>
                        </ul>
                        
                        <div class="practice-exercise">
                            <h4>🎯 Real-World Scenario: E-commerce Application</h4>
                            <p>Consider an e-commerce application with the following requirements:</p>
                            <ul>
                                <li>User authentication and authorization</li>
                                <li>Product catalog with images</li>
                                <li>Secure payment processing</li>
                                <li>Order management</li>
                                <li>High availability and scalability</li>
                            </ul>
                            
                            <p><strong>Architecture Design:</strong></p>
                            <ol>
                                <li><strong>VPC:</strong> Create public and private subnets across multiple AZs</li>
                                <li><strong>EC2:</strong> Deploy web servers in private subnets with auto-scaling</li>
                                <li><strong>S3:</strong> Store product images and static website content</li>
                                <li><strong>IAM:</strong> Create roles for EC2 instances and user access</li>
                                <li><strong>Load Balancer:</strong> Distribute traffic across multiple instances</li>
                            </ol>
                        </div>
                        
                        <h3>Cost Optimization Strategies</h3>
                        <ul>
                            <li><strong>Right-size EC2 instances</strong> based on actual usage</li>
                            <li><strong>Use S3 lifecycle policies</strong> to move data to cheaper storage classes</li>
                            <li><strong>Implement auto-scaling</strong> to handle traffic fluctuations</li>
                            <li><strong>Use reserved instances</strong> for predictable workloads</li>
                            <li><strong>Monitor costs</strong> using AWS Cost Explorer and set up billing alerts</li>
                        </ul>
                        
                        <h3>Next Steps in Your AWS Journey</h3>
                        <p>After mastering these core services, consider exploring:</p>
                        <ul>
                            <li><strong>Database Services:</strong> RDS, DynamoDB, ElastiCache</li>
                            <li><strong>Application Services:</strong> Lambda, API Gateway, SQS</li>
                            <li><strong>Security Services:</strong> CloudTrail, Config, GuardDuty</li>
                            <li><strong>Management Tools:</strong> CloudFormation, Systems Manager</li>
                            <li><strong>Monitoring:</strong> CloudWatch, X-Ray, CloudTrail</li>
                        </ul>
                        
                        <div class="practice-exercise">
                            <h4>🚀 Certification Path</h4>
                            <p>Consider pursuing AWS certifications to validate your knowledge:</p>
                            <ol>
                                <li><strong>AWS Certified Cloud Practitioner</strong> - Entry-level certification</li>
                                <li><strong>AWS Certified Solutions Architect - Associate</strong> - Design and deploy systems</li>
                                <li><strong>AWS Certified Developer - Associate</strong> - Develop and maintain applications</li>
                                <li><strong>AWS Certified SysOps Administrator - Associate</strong> - Deploy, manage, and operate systems</li>
                            </ol>
                        </div>
                    `
                }
            ]
        },
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
        videoId: "NKEFWyqJ5XA", // 使用freeCodeCamp官方课程视频ID
        references: [{ text: "Azure Fundamentals Learning Path", url: "https://docs.microsoft.com/en-us/learn/paths/azure-fundamentals/" }],
        topics: ["Azure Core Architectural Components", "Azure Core Services", "Azure Security, Privacy, Compliance, and Trust"],
        readingContent: {
            estimatedReadingTime: 35, // 预计阅读时间（分钟）
            sections: [
                {
                    title: "Introduction to Microsoft Azure",
                    content: `
                        <h3>What is Microsoft Azure?</h3>
                        <p>Microsoft Azure is a leading cloud computing platform that provides a wide range of services including computing, storage, networking, databases, analytics, and artificial intelligence. Azure enables organizations to build, deploy, and manage applications through Microsoft-managed data centers worldwide.</p>
                        <h3>Why Learn Azure?</h3>
                        <ul>
                            <li><strong>Global Reach:</strong> Azure has data centers in more than 60 regions worldwide.</li>
                            <li><strong>Enterprise Adoption:</strong> Used by 95% of Fortune 500 companies.</li>
                            <li><strong>Hybrid Capability:</strong> Seamless integration with on-premises environments.</li>
                            <li><strong>Security & Compliance:</strong> Over 90 compliance certifications.</li>
                            <li><strong>Career Growth:</strong> High demand for Azure-certified professionals.</li>
                        </ul>
                    `
                },
                {
                    title: "Azure Global Infrastructure",
                    content: `
                        <h3>Azure Regions and Availability Zones</h3>
                        <p>Azure is available in more global regions than any other cloud provider. Each region is a set of data centers deployed within a specific geographic area, providing redundancy and availability.</p>
                        <ul>
                            <li><strong>Region:</strong> A geographical area containing one or more data centers.</li>
                            <li><strong>Availability Zone:</strong> Physically separate locations within a region, each with independent power, cooling, and networking.</li>
                        </ul>
                        <h3>Benefits of Azure's Global Infrastructure</h3>
                        <ul>
                            <li>High availability and disaster recovery</li>
                            <li>Low latency for global users</li>
                            <li>Data residency and compliance</li>
                        </ul>
                        <div class="practice-exercise">
                            <h4>💡 Exercise: Explore Azure Regions</h4>
                            <p>Visit <a href="https://azure.microsoft.com/en-us/explore/global-infrastructure/regions/" target="_blank">Azure Global Infrastructure</a> to see all available regions and their services.</p>
                        </div>
                    `
                },
                {
                    title: "Core Azure Services Overview",
                    content: `
                        <h3>1. Compute Services</h3>
                        <ul>
                            <li><strong>Azure Virtual Machines (VMs):</strong> Scalable, on-demand computing resources.</li>
                            <li><strong>App Services:</strong> Managed platform for web apps, REST APIs, and mobile backends.</li>
                            <li><strong>Azure Functions:</strong> Serverless compute for event-driven workloads.</li>
                        </ul>
                        <h3>2. Storage Services</h3>
                        <ul>
                            <li><strong>Blob Storage:</strong> Object storage for unstructured data.</li>
                            <li><strong>File Storage:</strong> Managed file shares in the cloud.</li>
                            <li><strong>Disk Storage:</strong> Persistent, high-performance disks for VMs.</li>
                        </ul>
                        <h3>3. Networking Services</h3>
                        <ul>
                            <li><strong>Virtual Network (VNet):</strong> Private network for Azure resources.</li>
                            <li><strong>Load Balancer:</strong> Distributes incoming traffic for high availability.</li>
                            <li><strong>VPN Gateway:</strong> Secure site-to-site connectivity.</li>
                        </ul>
                        <h3>4. Security & Identity</h3>
                        <ul>
                            <li><strong>Azure Active Directory (AD):</strong> Identity and access management.</li>
                            <li><strong>Key Vault:</strong> Securely store and manage keys, secrets, and certificates.</li>
                            <li><strong>Security Center:</strong> Unified security management and threat protection.</li>
                        </ul>
                    `
                },
                {
                    title: "Azure Resource Management & Pricing",
                    content: `
                        <h3>Resource Groups</h3>
                        <p>A resource group is a container that holds related resources for an Azure solution. It enables easier management, monitoring, and access control.</p>
                        <h3>Azure Portal, CLI, and PowerShell</h3>
                        <ul>
                            <li><strong>Azure Portal:</strong> Web-based UI for managing Azure resources.</li>
                            <li><strong>Azure CLI:</strong> Command-line tool for managing Azure resources.</li>
                            <li><strong>Azure PowerShell:</strong> PowerShell module for Azure management.</li>
                        </ul>
                        <h3>Pricing and Cost Management</h3>
                        <ul>
                            <li><strong>Pay-as-you-go:</strong> Only pay for what you use.</li>
                            <li><strong>Azure Pricing Calculator:</strong> Estimate costs for your solutions.</li>
                            <li><strong>Cost Management + Billing:</strong> Monitor, allocate, and optimize cloud spend.</li>
                        </ul>
                        <div class="practice-exercise">
                            <h4>🔧 Exercise: Estimate Azure Costs</h4>
                            <p>Try the <a href="https://azure.microsoft.com/en-us/pricing/calculator/" target="_blank">Azure Pricing Calculator</a> to estimate the cost of running a virtual machine and storage.</p>
                        </div>
                    `
                },
                {
                    title: "Security, Privacy, Compliance, and Trust",
                    content: `
                        <h3>Azure Security Features</h3>
                        <ul>
                            <li><strong>Defense in Depth:</strong> Multiple layers of security controls.</li>
                            <li><strong>Network Security Groups (NSG):</strong> Control inbound/outbound traffic.</li>
                            <li><strong>Azure Firewall:</strong> Managed, cloud-based network security service.</li>
                            <li><strong>Azure DDoS Protection:</strong> Protects against distributed denial-of-service attacks.</li>
                        </ul>
                        <h3>Compliance and Privacy</h3>
                        <ul>
                            <li>Over 90 compliance certifications (ISO, GDPR, HIPAA, etc.)</li>
                            <li>Data residency options for regulatory requirements</li>
                            <li>Transparent privacy policies and data handling</li>
                        </ul>
                        <div class="practice-exercise">
                            <h4>🔒 Exercise: Review Azure Security Center</h4>
                            <p>Log in to the Azure Portal and explore the Security Center dashboard to review security recommendations for your resources.</p>
                        </div>
                    `
                },
                {
                    title: "Hands-On Practice & Best Practices",
                    content: `
                        <h3>Hands-On Practice</h3>
                        <ol>
                            <li>Create a free Azure account and explore the portal.</li>
                            <li>Deploy a virtual machine and connect via RDP/SSH.</li>
                            <li>Set up a storage account and upload/download files.</li>
                            <li>Create a resource group and organize resources.</li>
                            <li>Configure a virtual network and subnet.</li>
                        </ol>
                        <h3>Best Practices</h3>
                        <ul>
                            <li>Use resource groups to organize and manage resources.</li>
                            <li>Apply tags for cost tracking and automation.</li>
                            <li>Enable multi-factor authentication (MFA) for all users.</li>
                            <li>Monitor usage and set up cost alerts.</li>
                            <li>Regularly review security recommendations in Security Center.</li>
                        </ul>
                        <h3>Next Steps</h3>
                        <ul>
                            <li>Explore more on <a href="https://docs.microsoft.com/en-us/learn/azure/" target="_blank">Microsoft Learn</a></li>
                            <li>Consider preparing for the AZ-900 certification exam</li>
                        </ul>
                    `
                }
            ]
        },
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
        videoId: "R-HLU9Fl5ug", // 使用Corey Schafer频道视频ID
        references: [{ text: "Python Data Structures - GeeksforGeeks", url: "https://www.geeksforgeeks.org/python-data-structures/" }],
        topics: ["Advanced Lists", "Tuples In-depth", "Sets", "Dictionaries Advanced"],
        readingContent: {
            estimatedReadingTime: 30, // 预计阅读时间（分钟）
            sections: [
                {
                    title: "Advanced Lists",
                    content: `
                        <h3>What is a List?</h3>
                        <p>Lists are ordered, mutable collections of items. They can store elements of different types and support a wide range of operations.</p>
                        <pre><code>
fruits = ["apple", "banana", "cherry"]
fruits.append("orange")
fruits[1] = "blueberry"
print(fruits)  # ['apple', 'blueberry', 'cherry', 'orange']
                        </code></pre>
                        <h4>List Comprehensions</h4>
                        <pre><code>
squares = [x**2 for x in range(5)]  # [0, 1, 4, 9, 16]
                        </code></pre>
                        <h4>Common List Methods</h4>
                        <ul>
                            <li><code>append()</code> - Add an item to the end</li>
                            <li><code>insert()</code> - Insert at a specific index</li>
                            <li><code>remove()</code> - Remove first occurrence of a value</li>
                            <li><code>pop()</code> - Remove and return item at index</li>
                            <li><code>sort()</code> - Sort the list in place</li>
                        </ul>
                        <div class="practice-exercise">
                            <h4>💡 Practice: List Operations</h4>
                            <p>Write a function that removes duplicates from a list and returns a sorted version.</p>
                        </div>
                    `
                },
                {
                    title: "Tuples In-depth",
                    content: `
                        <h3>What is a Tuple?</h3>
                        <p>Tuples are ordered, immutable collections. Once created, their contents cannot be changed.</p>
                        <pre><code>
point = (3, 4)
colors = ("red", "green", "blue")
                        </code></pre>
                        <h4>Tuple Unpacking</h4>
                        <pre><code>
x, y = point
print(x, y)  # 3 4
                        </code></pre>
                        <h4>When to Use Tuples?</h4>
                        <ul>
                            <li>Data that should not change</li>
                            <li>As dictionary keys</li>
                            <li>Returning multiple values from a function</li>
                        </ul>
                        <div class="practice-exercise">
                            <h4>💡 Practice: Tuple Packing & Unpacking</h4>
                            <p>Write a function that returns both the min and max of a list as a tuple.</p>
                        </div>
                    `
                },
                {
                    title: "Sets",
                    content: `
                        <h3>What is a Set?</h3>
                        <p>Sets are unordered collections of unique elements. They are useful for membership tests and removing duplicates.</p>
                        <pre><code>
nums = {1, 2, 3, 2, 1}
print(nums)  # {1, 2, 3}
                        </code></pre>
                        <h4>Set Operations</h4>
                        <pre><code>
a = {1, 2, 3}
b = {3, 4, 5}
print(a | b)  # Union: {1, 2, 3, 4, 5}
print(a & b)  # Intersection: {3}
print(a - b)  # Difference: {1, 2}
                        </code></pre>
                        <h4>Common Use Cases</h4>
                        <ul>
                            <li>Removing duplicates from a list</li>
                            <li>Fast membership testing</li>
                            <li>Mathematical set operations</li>
                        </ul>
                        <div class="practice-exercise">
                            <h4>💡 Practice: Set Operations</h4>
                            <p>Given two lists, return their intersection as a set.</p>
                        </div>
                    `
                },
                {
                    title: "Dictionaries Advanced",
                    content: `
                        <h3>What is a Dictionary?</h3>
                        <p>Dictionaries are unordered collections of key-value pairs. Keys must be unique and immutable.</p>
                        <pre><code>
student = {"name": "Alice", "age": 20, "major": "CS"}
student["age"] = 21
print(student["name"])
                        </code></pre>
                        <h4>Dictionary Methods</h4>
                        <ul>
                            <li><code>get()</code> - Safe value retrieval</li>
                            <li><code>keys()</code>, <code>values()</code>, <code>items()</code> - Iteration</li>
                            <li><code>update()</code> - Merge another dict</li>
                            <li><code>pop()</code> - Remove by key</li>
                        </ul>
                        <h4>Dictionary Comprehensions</h4>
                        <pre><code>
squares = {x: x**2 for x in range(5)}  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}
                        </code></pre>
                        <div class="practice-exercise">
                            <h4>💡 Practice: Dictionary Comprehension</h4>
                            <p>Write a dictionary comprehension that maps each word in a list to its length.</p>
                        </div>
                    `
                },
                {
                    title: "Practice & Best Practices",
                    content: `
                        <h3>Hands-On Practice</h3>
                        <ol>
                            <li>Write a function to count the frequency of each element in a list using a dictionary.</li>
                            <li>Given a list of tuples, convert it to a dictionary.</li>
                            <li>Write a function to find the union and intersection of two sets.</li>
                        </ol>
                        <h3>Best Practices</h3>
                        <ul>
                            <li>Choose the right data structure for your use case</li>
                            <li>Use comprehensions for concise code</li>
                            <li>Remember mutability: lists/sets/dicts are mutable, tuples are immutable</li>
                            <li>Use sets for fast membership tests</li>
                            <li>Use dict.get() to avoid KeyError</li>
                        </ul>
                        <h3>Further Reading</h3>
                        <ul>
                            <li><a href="https://docs.python.org/3/tutorial/datastructures.html" target="_blank">Python Official Data Structures Tutorial</a></li>
                            <li><a href="https://realpython.com/python-data-structures/" target="_blank">Real Python: Data Structures</a></li>
                        </ul>
                    `
                }
            ]
        },
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
        readingContent: {
            estimatedReadingTime: 35, // 预计阅读时间（分钟）
            sections: [
                {
                    title: "Introduction to Object-Oriented Programming",
                    content: `
                        <h3>What is OOP?</h3>
                        <p>Object-Oriented Programming (OOP) is a programming paradigm based on the concept of "objects", which can contain data and code to manipulate that data. OOP helps organize complex programs, promotes code reuse, and models real-world entities.</p>
                        <ul>
                            <li><strong>Encapsulation:</strong> Bundling data and methods together</li>
                            <li><strong>Inheritance:</strong> Creating new classes from existing ones</li>
                            <li><strong>Polymorphism:</strong> Using a unified interface for different data types</li>
                            <li><strong>Abstraction:</strong> Hiding complex details and showing only essentials</li>
                        </ul>
                    `
                },
                {
                    title: "Classes and Objects",
                    content: `
                        <h3>Defining a Class</h3>
                        <pre><code>
class Dog:
    def __init__(self, name):
        self.name = name
    def bark(self):
        print(f"{self.name} says woof!")
                        </code></pre>
                        <h3>Creating Objects</h3>
                        <pre><code>
my_dog = Dog("Buddy")
my_dog.bark()  # Buddy says woof!
                        </code></pre>
                        <h4>Understanding self</h4>
                        <p><code>self</code> refers to the instance of the class and is used to access attributes and methods.</p>
                        <div class="practice-exercise">
                            <h4>💡 Practice: Create a Class</h4>
                            <p>Define a <code>Car</code> class with attributes <code>brand</code> and <code>year</code>, and a method <code>drive()</code> that prints a message.</p>
                        </div>
                    `
                },
                {
                    title: "Attributes and Methods",
                    content: `
                        <h3>Instance Attributes</h3>
                        <pre><code>
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age
                        </code></pre>
                        <h3>Class Attributes</h3>
                        <pre><code>
class Circle:
    pi = 3.14  # class attribute
    def __init__(self, radius):
        self.radius = radius
                        </code></pre>
                        <h3>Instance Methods</h3>
                        <pre><code>
    def area(self):
        return Circle.pi * self.radius ** 2
                        </code></pre>
                        <h3>Static and Class Methods</h3>
                        <pre><code>
class Math:
    @staticmethod
    def add(a, b):
        return a + b
    @classmethod
    def description(cls):
        return "Math operations"
                        </code></pre>
                        <div class="practice-exercise">
                            <h4>💡 Practice: Attributes & Methods</h4>
                            <p>Write a <code>Book</code> class with a class attribute <code>category</code> and an instance method <code>info()</code> that prints the book's details.</p>
                        </div>
                    `
                },
                {
                    title: "Inheritance and Polymorphism",
                    content: `
                        <h3>Inheritance</h3>
                        <pre><code>
class Animal:
    def speak(self):
        print("Animal speaks")
class Cat(Animal):
    def speak(self):
        print("Meow")
                        </code></pre>
                        <h3>Polymorphism</h3>
                        <pre><code>
animals = [Dog("Buddy"), Cat()]
for animal in animals:
    animal.speak()  # Each calls its own speak()
                        </code></pre>
                        <h4>super()</h4>
                        <pre><code>
class Bird(Animal):
    def __init__(self, name):
        super().__init__()
        self.name = name
                        </code></pre>
                        <div class="practice-exercise">
                            <h4>💡 Practice: Inheritance</h4>
                            <p>Define a <code>Shape</code> base class and a <code>Rectangle</code> subclass that calculates area.</p>
                        </div>
                    `
                },
                {
                    title: "Encapsulation and Private Members",
                    content: `
                        <h3>Encapsulation</h3>
                        <p>Encapsulation restricts direct access to some of an object's components, which is a means of preventing accidental interference and misuse.</p>
                        <h3>Private Attributes</h3>
                        <pre><code>
class BankAccount:
    def __init__(self, balance):
        self.__balance = balance  # private attribute
    def deposit(self, amount):
        self.__balance += amount
    def get_balance(self):
        return self.__balance
                        </code></pre>
                        <h4>Name Mangling</h4>
                        <p>Attributes with double underscores (e.g., <code>__balance</code>) are name-mangled to prevent direct access.</p>
                        <div class="practice-exercise">
                            <h4>💡 Practice: Encapsulation</h4>
                            <p>Write a class <code>Person</code> with a private attribute <code>__ssn</code> and a method to safely access it.</p>
                        </div>
                    `
                },
                {
                    title: "Practice & Best Practices",
                    content: `
                        <h3>Hands-On Practice</h3>
                        <ol>
                            <li>Write a class <code>Employee</code> with attributes <code>name</code> and <code>salary</code>, and a method to give a raise.</li>
                            <li>Implement a class hierarchy for vehicles (e.g., <code>Vehicle</code>, <code>Car</code>, <code>Truck</code>).</li>
                            <li>Write a class with both static and class methods.</li>
                        </ol>
                        <h3>Best Practices</h3>
                        <ul>
                            <li>Use meaningful class and method names</li>
                            <li>Keep methods short and focused</li>
                            <li>Use encapsulation to protect data</li>
                            <li>Favor composition over inheritance when possible</li>
                            <li>Document your classes and methods</li>
                        </ul>
                        <h3>Further Reading</h3>
                        <ul>
                            <li><a href="https://docs.python.org/3/tutorial/classes.html" target="_blank">Python Official Classes Tutorial</a></li>
                            <li><a href="https://realpython.com/python3-object-oriented-programming/" target="_blank">Real Python: OOP in Python</a></li>
                        </ul>
                    `
                }
            ]
        },
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