from models import Application

def skill_set():
    skill_set = {
    # Programming Languages
    "python", "java", "c++", "c#", "javascript", "typescript", "ruby", "go", "rust",
    "swift", "kotlin", "php", "r", "scala", "perl", "matlab", "bash", "shell", "haskell",
    "objective-c", "dart", "lua", "groovy", "elixir", "clojure",

    # Web Development Frameworks
    "django", "flask", "spring", "rails", "express", "react", "angular", "vue.js",
    "next.js", "nuxt.js", "ember.js", "svelte", "laravel", "symfony", "asp.net", "blazor",

    # Databases
    "sql", "mysql", "postgresql", "sqlite", "oracle", "mongodb", "redis", "cassandra",
    "couchdb", "neo4j", "dynamodb", "firebase", "elasticsearch", "influxdb", "couchbase",

    # DevOps & CI/CD Tools
    "docker", "kubernetes", "jenkins", "travis ci", "circleci", "gitlab ci", "teamcity",
    "ansible", "puppet", "chef", "terraform", "vagrant", "nomad", "prometheus", "grafana",
    "splunk", "new relic", "datadog",

    # Cloud Platforms
    "aws", "azure", "google cloud", "gcp", "ibm cloud", "heroku", "digitalocean", 
    "netlify", "vercel", "cloudflare", "firebase",

    # Version Control & Collaboration
    "git", "github", "gitlab", "bitbucket", "svn", "mercurial", "jira", "trello",
    "confluence", "slack", "microsoft teams", "asana",

    # Testing & QA
    "unit testing", "integration testing", "functional testing", "end-to-end testing",
    "selenium", "cypress", "pytest", "junit", "mocha", "chai", "jest", "enzyme", 
    "cucumber", "testng", "postman",

    # Machine Learning & Data Science
    "machine learning", "deep learning", "data analysis", "data visualization",
    "tensorflow", "keras", "pytorch", "scikit-learn", "numpy", "pandas", "matplotlib",
    "seaborn", "nltk", "opencv", "xgboost", "lightgbm", "catboost", "data mining",
    "big data", "hadoop", "spark", "dask", "hive", "pig",

    # Security
    "cybersecurity", "penetration testing", "ethical hacking", "encryption", "ssl/tls",
    "oauth", "saml", "jwt", "firewalls", "ids/ips", "siem", "key management", "zero trust",
    "vulnerability assessment", "security auditing", "sast", "dast", "owasp",

    # Mobile Development
    "android", "ios", "react native", "flutter", "xamarin", "ionic", "swiftui",
    "objective-c", "kotlin", "java (android)", "dart", "cordova",

    # System & Network Administration
    "linux", "unix", "windows server", "networking", "tcp/ip", "dns", "dhcp", "vpn",
    "firewall management", "nginx", "apache", "load balancing", "proxy servers", 
    "bash scripting", "powershell", "zabbix", "nagios", "system monitoring",

    # Software Development Methodologies
    "agile", "scrum", "kanban", "lean", "xp", "tdd", "bdd", "waterfall", "devops",
    "ci/cd", "continuous integration", "continuous deployment",

    # Soft Skills & Miscellaneous
    "communication", "teamwork", "problem solving", "critical thinking", "project management",
    "time management", "mentorship", "leadership", "documentation", "api development", 
    "rest", "graphql", "microservices", "soa", "design patterns", "software architecture",
    "performance optimization", "scalability", "usability", "accessibility", 
    "ux/ui design", "data structures", "algorithms"
}
    return skill_set

def default_apps(google_id):
    return ([
    Application(status="Not Applied", name="Akuna Capital", open="Software Engineer Intern - Python", close="Chicago, IL", link="", google_id=google_id),
    Application(status="Not Applied", name="Jane Street", open="Software Engineer Internship", close="New York, NY", link="", google_id=google_id),
    Application(status="Not Applied", name="Wells Fargo", open="Software Engineering Intern", close="Multiple locations", link="", google_id=google_id),
    Application(status="Not Applied", name="TikTok", open="Mobile Software Engineer Intern - User Relation", close="Los Angeles, CA", link="", google_id=google_id),
    Application(status="Not Applied", name="IXL Learning", open="Software Engineer, Intern", close="San Mateo, CA", link="", google_id=google_id),
    Application(status="Not Applied", name="ATPCO", open="Systems Engineer Intern", close="Remote in USA", link="", google_id=google_id),
    Application(status="Not Applied", name="ATPCO", open="Systems Engineer Intern", close="Dulles, VA", link="", google_id=google_id),
    Application(status="Not Applied", name="Sensata", open="Software Engineer Intern - Summer 2025", close="Attleboro, MA", link="", google_id=google_id),
    Application(status="Not Applied", name="Akuna Capital", open="Quantitative Research Intern - Summer 2025", close="Chicago, IL", link="", google_id=google_id),
    Application(status="Not Applied", name="Amazon", open="Program Manager Intern", close="Seattle, WA", link="", google_id=google_id),
    Application(status="Not Applied", name="Virtu Financial", open="Internship - Developer", close="NYC", link="", google_id=google_id),
    Application(status="Not Applied", name="ByteDance", open="Software Engineer Intern (AI Platform)", close="San Jose, CA", link="", google_id=google_id),
    Application(status="Not Applied", name="Notion", open="Software Engineer Intern, Mobile (Summer 2025)", close="New York, NY", link="", google_id=google_id),
    Application(status="Not Applied", name="Notion", open="Software Engineering Intern (Summer 2025)", close="San Francisco, CA", link="", google_id=google_id),
    Application(status="Not Applied", name="Motorola", open="Android Platform Software Engineering Intern - Summer 2025", close="Plantation, FL", link="", google_id=google_id),
    Application(status="Not Applied", name="Motorola", open="Android Platform Software Engineering Intern - Summer 2025", close="Hoffman Estates, IL", link="", google_id=google_id),
    Application(status="Not Applied", name="Codeium", open="Software Engineering Intern - Summer 2025", close="Mountain View, CA", link="", google_id=google_id),
    Application(status="Not Applied", name="HPR (Hyannis Port Research)", open="Software Engineering Intern - Summer 2025", close="Needham, MA", link="", google_id=google_id),
    Application(status="Not Applied", name="Sentry", open="Software Engineer Intern - Summer 2025", close="Toronto, ON, Canada", link="", google_id=google_id),
    Application(status="Not Applied", name="Ventas", open="Intern, Software Engineering (Summer 2025)", close="Chicago, IL", link="", google_id=google_id),
    Application(status="Not Applied", name="Five Rings", open="Software Developer Intern", close="New York", link="", google_id=google_id),
    Application(status="Not Applied", name="Confluent", open="Software Engineering Intern", close="Remote", link="", google_id=google_id),
    Application(status="Not Applied", name="Confluent", open="Software Engineering Intern", close="Austin, TX", link="", google_id=google_id),
    Application(status="Not Applied", name="Databricks", open="Software Engineering Intern - 2025", close="Bellevue, WA", link="", google_id=google_id),
    Application(status="Not Applied", name="Databricks", open="Software Engineering Intern - 2025", close="Mountain View, CA", link="", google_id=google_id),
    Application(status="Not Applied", name="Databricks", open="Software Engineering Intern - 2025", close="SF", link="", google_id=google_id),
    Application(status="Not Applied", name="Deloitte", open="Software Engineering Summer Scholar", close="New York, NY", link="", google_id=google_id),
    Application(status="Not Applied", name="Deloitte", open="Software Engineering Summer Scholar", close="Austin, TX", link="", google_id=google_id),
    Application(status="Not Applied", name="Deloitte", open="Software Engineering Summer Scholar", close="San Francisco, CA", link="", google_id=google_id),
    Application(status="Not Applied", name="TikTok", open="Software Engineer Intern (Data-TnS-Eng-Biz Arch)", close="Vancouver, Canada", link="", google_id=google_id),
    Application(status="Not Applied", name="Airwallex", open="Software Engineer Intern Program", close="SF", link="", google_id=google_id),
    Application(status="Not Applied", name="Databricks", open="Software Engineering Intern", close="Bellevue, WA", link="", google_id=google_id),
    Application(status="Not Applied", name="Databricks", open="Software Engineering Intern", close="Mountain View, CA", link="", google_id=google_id),
    Application(status="Not Applied", name="Databricks", open="Software Engineering Intern", close="San Francisco, CA", link="", google_id=google_id),
    Application(status="Not Applied", name="Strider Technologies", open="Intelligence Specialist Internship - China Focus", close="Vienna, VA", link="", google_id=google_id),
    Application(status="Not Applied", name="Strider Technologies", open="Intelligence Specialist Internship - China Focus", close="South Jordan, UT", link="", google_id=google_id),
    Application(status="Not Applied", name="Oshkosh", open="Data Engineer Intern - Advanced Analytics", close="Oshkosh, WI", link="", google_id=google_id),
    Application(status="Not Applied", name="Quantiq Partners", open="Software Developer Intern", close="Austin, TX", link="", google_id=google_id),
    Application(status="Not Applied", name="Belvedere Trading", open="Software Engineer Intern - Summer 2025", close="Boulder, CO", link="", google_id=google_id),
    Application(status="Not Applied", name="Belvedere Trading", open="Software Engineer Intern - Summer 2025", close="Chicago, IL", link="", google_id=google_id),
    Application(status="Not Applied", name="Jump Trading", open="Campus Web Dev / UI Software Engineer – Intern", close="Chicago, IL", link="", google_id=google_id),
    Application(status="Not Applied", name="Neuralink", open="Software Engineer Intern", close="Austin, TX", link="", google_id=google_id),
    Application(status="Not Applied", name="DV Trading", open="2025 Summer Internship - Algo Trader", close="Chicago, IL", link="", google_id=google_id),
    Application(status="Not Applied", name="Qualcomm", open="Software Engineering Intern", close="San Diego, California", link="", google_id=google_id),
    Application(status="Not Applied", name="Vestmark", open="Software Engineer Intern", close="Wakefield, MA", link="", google_id=google_id),
    Application(status="Not Applied", name="Epic", open="Software Developer Intern", close="Madison, WI", link="", google_id=google_id),
    Application(status="Not Applied", name="Apple", open="Machine Learning Intern", close="United States", link="", google_id=google_id)
])
